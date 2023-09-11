import { useState, useEffect, useCallback } from 'react'
import { ProgressInfo, Uploader } from '@/lib/upload' // Adjust the import path as needed

interface FileUploaderOptions {
  chunkSize?: number
  threadsQuantity?: number
  metadata: any // Adjust the type as needed
  onProgress: (progress: ProgressInfo) => void
  onError: (error: Error) => void
  onCompleted: (response: any) => void
  onInitialize: (file: any) => void
}

export function useFileUploader(options: FileUploaderOptions) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const startUpload = useCallback(
    async (file: File) => {
      setUploading(true)
      setError(null)

      const uploader = new Uploader({
        file,
        ...options,
      })

      try {
        uploader.start()
      } catch (err: any) {
        setError(err)
        setUploading(false)
      }

      uploader
        .onProgress(options.onProgress)
        .onError(options.onError)
        .onCompleted((response) => {
          options.onCompleted(response)
          setUploading(false)
        })
        .onInitialize(options.onInitialize)

      return () => {
        // Cancel the upload if it's still in progress
        if (uploading) {
          uploader.abort()
          setUploading(false)
        }
      }
    },
    [options, uploading]
  )

  return {
    uploading,
    error,
    startUpload,
  }
}
