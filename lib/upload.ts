// TODO:  make it a hook maybe??
import axios, { AxiosResponse } from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_UPLOAD_SERVER,
})

interface UploadFinishReturnType {
  location: string
}

interface UploadStartBodyType {
  ext: string
  path: string
  mime: string
  size: number
  metadata: any // Adjust the type as needed
  parts: number
}

interface UploadStartReturnType {
  fileId: string
  fileKey: string
  parts: Array<{ PartNumber: number; signedUrl: string }>
}

interface UploadPart {
  PartNumber: number
  ETag: string
}

export interface ProgressInfo {
  sent: number
  total: number
  percentage: number
}

interface UploaderOptions {
  chunkSize?: number
  threadsQuantity?: number
  file: File
  metadata?: any // Adjust the type as needed
  onProgress: (progress: ProgressInfo) => void
  onError: (error: Error) => void
  onCompleted: (response: AxiosResponse) => void
  onInitialize: (file: any) => void
}

export class Uploader {
  private chunkSize: number
  private threadsQuantity: number
  private file: File
  private metadata: any
  private aborted: boolean
  private uploadedSize: number
  private progressCache: Record<number, number>
  private activeConnections: Record<number, XMLHttpRequest>
  private parts: Array<{ PartNumber: number; signedUrl: string }>
  private uploadedParts: UploadPart[]
  private fileId: string | null
  private fileKey: string | null
  private mime: string
  private size: number
  private path: string = ''
  private ext: string
  private onProgressFn: (progress: ProgressInfo) => void
  private onErrorFn: (error: Error) => void
  private onCompletedFn: (response: AxiosResponse) => void
  private onInitializeFn: (file: any) => void

  constructor(options: UploaderOptions) {
    this.chunkSize = options.chunkSize || 1024 * 1024 * 5
    this.threadsQuantity = Math.min(options.threadsQuantity || 5, 15)
    this.file = options.file
    this.metadata = options.metadata
    this.aborted = false
    this.uploadedSize = 0
    this.progressCache = {}
    this.activeConnections = {}
    this.parts = []
    this.uploadedParts = []
    this.fileId = null
    this.fileKey = null
    this.mime = options.file.type
    this.size = options.file.size
    this.ext = options.file.name.split('.').pop() || ''
    this.onProgressFn = options.onProgress
    this.onErrorFn = options.onError
    this.onCompletedFn = options.onCompleted
    this.onInitializeFn = options.onInitialize
  }

  start(): void {
    this.initialize()
  }

  async initialize(): Promise<void> {
    try {
      const numberOfParts = Math.ceil(this.size / this.chunkSize)

      const AWSMultipartFileDataInput: UploadStartBodyType = {
        ext: this.ext,
        path: this.path,
        mime: this.mime,
        size: this.size,
        metadata: this.metadata,
        parts: numberOfParts,
      }

      const urlsResponse = await api.request<UploadStartReturnType>({
        url: '/upload/start',
        method: 'POST',
        data: AWSMultipartFileDataInput,
      })

      this.onInitializeFn(urlsResponse.data)

      this.fileId = urlsResponse.data.fileId
      this.fileKey = urlsResponse.data.fileKey

      const newParts = urlsResponse.data.parts

      this.parts.push(...newParts)

      this.sendNext()
    } catch (error: any) {
      await this.complete(error)
    }
  }

  sendNext(): void {
    const activeConnections = Object.keys(this.activeConnections).length

    if (activeConnections >= this.threadsQuantity) {
      return
    }

    if (!this.parts.length) {
      if (!activeConnections) {
        this.complete()
      }

      return
    }

    const part = this.parts.pop()
    if (this.file && part) {
      const sentSize = (part.PartNumber - 1) * this.chunkSize
      const chunk = this.file.slice(sentSize, sentSize + this.chunkSize)

      const sendChunkStarted = () => {
        this.sendNext()
      }

      this.sendChunk(chunk, part, sendChunkStarted)
        .then(() => {
          this.sendNext()
        })
        .catch((error) => {
          this.parts.push(part)
          this.complete(error)
        })
    }
  }

  async complete(error?: Error): Promise<void> {
    if (error && !this.aborted) {
      this.onErrorFn(error)
      return
    }

    if (error) {
      this.onErrorFn(error)
      return
    }

    try {
      const res: any = await this.sendCompleteRequest()
      this.onCompletedFn(res)
    } catch (error: any) {
      this.onErrorFn(error)
    }
  }

  async sendCompleteRequest(): Promise<string | undefined> {
    try {
      if (this.fileId && this.fileKey) {
        const finalizeMultipartInput = {
          fileId: this.fileId,
          fileKey: this.fileKey,
          parts: this.uploadedParts,
        }

        const response = await api.request({
          url: '/upload/finish',
          method: 'POST',
          data: finalizeMultipartInput,
        })

        const responseData: UploadFinishReturnType = response.data
        return responseData.location
      }
    } catch (error: any) {
      await this.complete(error)
    }
  }

  sendChunk(
    chunk: Blob,
    part: { PartNumber: number; signedUrl: string },
    sendChunkStarted: () => void
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.upload(chunk, part, sendChunkStarted)
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

  handleProgress(part: number, event: ProgressEvent): void {
    if (this.file) {
      if (
        event.type === 'progress' ||
        event.type === 'error' ||
        event.type === 'abort'
      ) {
        this.progressCache[part] = event.loaded || 0
      }

      if (event.type === 'uploaded') {
        this.uploadedSize += this.progressCache[part] || 0
        delete this.progressCache[part]
      }

      const inProgress = Object.keys(this.progressCache)
        .map(Number)
        .reduce((memo, id) => (memo += this.progressCache[id]), 0)

      const sent = Math.min(this.uploadedSize + inProgress, this.size)
      const total = this.size
      const percentage = Math.round((sent / total) * 100)

      this.onProgressFn({
        sent: sent,
        total: total,
        percentage: percentage,
      })
    }
  }

  upload(
    file: Blob,
    part: { PartNumber: number; signedUrl: string },
    sendChunkStarted: () => void
  ): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      if (this.fileId && this.fileKey) {
        const xhr = (this.activeConnections[part.PartNumber - 1] =
          new XMLHttpRequest())

        sendChunkStarted()

        const progressListener = this.handleProgress.bind(
          this,
          part.PartNumber - 1
        )

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

              this.uploadedParts.push(uploadedPart)

              resolve(xhr.status)
              delete this.activeConnections[part.PartNumber - 1]
            }
          }
        }

        xhr.onerror = (error) => {
          reject(error)
          delete this.activeConnections[part.PartNumber - 1]
        }

        xhr.onabort = () => {
          reject(new Error('Upload canceled by user'))
          delete this.activeConnections[part.PartNumber - 1]
        }

        xhr.send(file)
      }
    })
  }

  onProgress(onProgress: (progress: ProgressInfo) => void): Uploader {
    this.onProgressFn = onProgress
    return this
  }

  onError(onError: (error: Error) => void): Uploader {
    this.onErrorFn = onError
    return this
  }

  onCompleted(onCompleted: (response: AxiosResponse) => void): Uploader {
    this.onCompletedFn = onCompleted
    return this
  }

  onInitialize(onInitialize: (file: any) => void): Uploader {
    this.onInitializeFn = onInitialize
    return this
  }

  abort(): void {
    Object.keys(this.activeConnections)
      .map(Number)
      .forEach((id) => {
        this.activeConnections[id].abort()
      })

    this.aborted = true
  }
}
