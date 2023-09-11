import { useEffect, useState } from 'react'
import axios, { AxiosResponse } from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3100',
})

interface AWSMultipartFileDataInput {
  ext: string
  path: string
  mime: string
  size: number
  metadata: any // Adjust the type as needed
  parts: number
}

interface AWSUrlsResponse {
  fileId: string
  fileKey: string
  parts: Array<{ PartNumber: number; signedUrl: string }>
}

export interface ProgressInfo {
  sent: number
  total: number
  percentage: number
}

interface UploadPart {
  PartNumber: number
  ETag: string
}

interface UploaderOptions {
  file: File
  metadata: any // Adjust the type as needed
  onProgress: (progress: ProgressInfo) => void
  onError: (error: Error) => void
  onCompleted: (response: AxiosResponse) => void
  onInitialize: (file: any) => void
}

const useUploader = (
  file: File,
  metadata: any,
  onProgress: (progress: ProgressInfo) => void,
  onError: (error: Error) => void,
  onCompleted: (response: AxiosResponse) => void,
  onInitialize: (file: any) => void
) => {
  const [fileId, setFileId] = useState<string | null>(null)
  const [fileKey, setFileKey] = useState<string | null>(null)
  const [parts, setParts] = useState<
    Array<{ PartNumber: number; signedUrl: string }>
  >([])
  const [uploadedParts, setUploadedParts] = useState<UploadPart[]>([])
  const [progressCache, setProgressCache] = useState<Record<number, number>>({})
  const [activeConnections, setActiveConnections] = useState<
    Record<number, XMLHttpRequest>
  >({})
  const [aborted, setAborted] = useState(false)

  const chunkSize = 1024 * 1024 * 5
  const threadsQuantity = 5

  useEffect(() => {
    const initialize = async () => {
      try {
        const numberOfParts = Math.ceil(file.size / chunkSize)

        const AWSMultipartFileDataInput: AWSMultipartFileDataInput = {
          ext: file.name.split('.').pop() || '',
          path: '',
          mime: file.type,
          size: file.size,
          metadata: metadata,
          parts: numberOfParts,
        }

        const urlsResponse = await api.request<AWSUrlsResponse>({
          url: '/upload/start',
          method: 'POST',
          data: AWSMultipartFileDataInput,
        })

        onInitialize(urlsResponse.data)

        setFileId(urlsResponse.data.fileId)
        setFileKey(urlsResponse.data.fileKey)
        setParts(urlsResponse.data.parts)

        sendNext()
      } catch (error) {
        complete(error)
      }
    }

    const sendNext = () => {
      const activeConnectionsCount = Object.keys(activeConnections).length

      if (activeConnectionsCount >= threadsQuantity) {
        return
      }

      if (parts.length === 0) {
        if (activeConnectionsCount === 0) {
          complete()
        }

        return
      }

      const part = parts.pop()
      if (file && part) {
        const sentSize = (part.PartNumber - 1) * chunkSize
        const chunk = file.slice(sentSize, sentSize + chunkSize)

        const sendChunkStarted = () => {
          sendNext()
        }

        sendChunk(chunk, part, sendChunkStarted)
          .then(() => {
            sendNext()
          })
          .catch((error) => {
            parts.push(part)
            complete(error)
          })
      }
    }

    const complete = (error?: Error) => {
      if (error && !aborted) {
        onError(error)
        return
      }

      if (error) {
        onError(error)
        return
      }

      sendCompleteRequest()
        .then((res) => {
          onCompleted(res)
        })
        .catch((error) => {
          onError(error)
        })
    }

    const sendCompleteRequest = async () => {
      try {
        if (fileId && fileKey) {
          const finalizeMultipartInput = {
            fileId: fileId,
            fileKey: fileKey,
            parts: uploadedParts,
          }

          const response = await api.request<AxiosResponse>({
            url: '/upload/finish',
            method: 'POST',
            data: finalizeMultipartInput,
          })

          return response
        }
      } catch (error) {
        complete(error)
      }
    }

    const sendChunk = (
      chunk: Blob,
      part: { PartNumber: number; signedUrl: string },
      sendChunkStarted: () => void
    ) => {
      return new Promise<void>((resolve, reject) => {
        upload(chunk, part, sendChunkStarted)
          .then((status) => {
            if (status !== 200) {
              reject(new Error('Failed chunk upload'))
              return
            }
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    }

    const handleProgress = (part: number, event: ProgressEvent) => {
      if (file) {
        if (
          event.type === 'progress' ||
          event.type === 'error' ||
          event.type === 'abort'
        ) {
          setProgressCache((prevProgressCache) => ({
            ...prevProgressCache,
            [part]: event.loaded || 0,
          }))
        }

        if (event.type === 'uploaded') {
          const inProgress = Object.values(progressCache).reduce(
            (memo, value) => memo + value,
            0
          )
          const sent = Math.min(uploadedSize + inProgress, file.size)
          const total = file.size
          const percentage = Math.round((sent / total) * 100)

          onProgress({
            sent: sent,
            total: total,
            percentage: percentage,
          })
        }
      }
    }

    const upload = (
      file: Blob,
      part: { PartNumber: number; signedUrl: string },
      sendChunkStarted: () => void
    ) => {
      return new Promise<number>((resolve, reject) => {
        if (fileId && fileKey) {
          const xhr = new XMLHttpRequest()

          sendChunkStarted()

          const progressListener = (event: ProgressEvent) => {
            handleProgress(part.PartNumber - 1, event)
          }

          xhr.upload.addEventListener('progress', progressListener)

          xhr.addEventListener('error', progressListener)
          xhr.addEventListener('abort', progressListener)
          xhr.addEventListener('loadend', progressListener)

          xhr.open('PUT', part.signedUrl)

          xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
              const ETag = xhr.getResponseHeader('ETag')

              if (ETag) {
                const uploadedPart: UploadPart = {
                  PartNumber: part.PartNumber,
                  ETag: ETag.replaceAll('"', ''),
                }

                setUploadedParts((prevUploadedParts) => [
                  ...prevUploadedParts,
                  uploadedPart,
                ])

                resolve(xhr.status)
              }
            }
          }

          xhr.onerror = (error) => {
            reject(error)
          }

          xhr.onabort = () => {
            reject(new Error('Upload canceled by user'))
          }

          xhr.send(file)
        }
      })
    }

    const abort = () => {
      Object.keys(activeConnections)
        .map(Number)
        .forEach((id) => {
          activeConnections[id].abort()
        })

      setAborted(true)
    }

    initialize()

    // Clean up function
    return () => {
      abort()
    }
  }, [file, metadata, onProgress, onError, onCompleted, onInitialize])

  const abort = () => {
    Object.keys(activeConnections)
      .map(Number)
      .forEach((id) => {
        activeConnections[id].abort()
      })

    setAborted(true)
  }

  return { abort }
}

export default useUploader
