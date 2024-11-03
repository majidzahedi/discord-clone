import { useEffect, useRef, useState } from 'react'

import { Uploader } from '@/lib/upload'

export interface FileData {
  file: File
}

export interface ProgressData {
  percentage: any
  total: any
  sent: any
}

const useUploader = (
  props = {
    onStart: console.log,
    onComplete: console.log,
    onError: console.log,
  }
) => {
  const defaultProgress = {
    percentage: 0,
    total: 0,
    sent: 0,
  }
  const [file, setFile] = useState<File | undefined>()
  const [uploader, setUploader] = useState<any>()
  const [progress, setProgress] = useState<any>(defaultProgress)
  const ref = useRef(undefined)

  let percentage: any = undefined

  useEffect(() => {
    if (file) {
      const videoUploaderOptions = {
        file: file,
      }

      // @ts-ignore
      const uploader = new Uploader(videoUploaderOptions)

      setUploader(uploader)

      uploader
        .onInitialize((data) => props.onStart(data))
        .onProgress(
          ({
            percentage: newPercentage,
            total,
            sent,
          }: {
            percentage: any
            total: any
            sent: any
          }) => {
            if (newPercentage !== progress.percentage) {
              ref.current = newPercentage
              setProgress({
                percentage: ref.current,
                total: total,
                sent: sent,
              })
            }
          }
        )
        .onError((error: any) => {
          setFile(undefined)
          props.onError(error)
        })
        .onCompleted((data: any) => {
          setFile(undefined)
          props.onComplete(data)
        })

      uploader.start()
    }
  }, [file])

  return { setFile, progress }
}

export default useUploader
