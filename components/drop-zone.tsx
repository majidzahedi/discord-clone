import React, { useCallback, useState } from 'react'

import { useDropzone } from 'react-dropzone'
import { useFileUploader } from '@/hooks/use-file-uploader' // Adjust the import path as needed
import { UploadCloud, X } from 'lucide-react'
import { humanReadableSize } from '@/lib/human-readable-size'
import { Progress } from './ui/progress'

interface CustomFileUploaderProps {
  acceptedTypes: 'image' | 'video' | 'audio'
  completed: (response: string) => void
  maxSize?: number | undefined
}

// TODO: progress is not implemented in UI.
const DropZone: React.FC<CustomFileUploaderProps> = ({
  acceptedTypes,
  completed,
  maxSize = undefined,
}) => {
  const [resultUrl, setResultUrl] = useState<string | undefined>()
  const [percentage, setPercentage] = useState(0)
  const { uploading, error, startUpload } = useFileUploader({
    // Configure your uploader options here
    chunkSize: 1024 * 1024 * 5, // 5MB chunks
    threadsQuantity: 5,
    metadata: {},
    onProgress: (progress) => {
      // Handle progress updates here
      console.log('Upload Progress:', setPercentage(progress.percentage))
    },
    onError: (err) => {
      // Handle errors here
      console.error('Upload Error:', err)
    },
    onCompleted: (response) => {
      // Handle upload completion here
      completed(response)
      console.log('Upload Completed:', response)
    },
    onInitialize: (fileInfo) => {
      // Handle initialization here
      console.log('Upload Initialized:', fileInfo)
    },
  })

  const onDropAccepted = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        // Only allow one file to be uploaded at a time
        const fileToUpload = acceptedFiles[0]
        setResultUrl(URL.createObjectURL(fileToUpload))
        startUpload(fileToUpload)
      }
    },
    [startUpload]
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDropAccepted,
    maxSize: maxSize,
    accept:
      acceptedTypes === 'image'
        ? { 'image/*': [] }
        : acceptedTypes === 'video'
        ? { 'video/*': [] }
        : { 'audio/*': [] },
    maxFiles: 1, // Allow only one file to be uploaded at a time
    disabled: uploading,
  })

  return (
    <div className="flex flex-col items-center space-y-2">
      <div
        {...getRootProps({
          className:
            'bg-accent rounded border-black dark:border-white border border-dashed p-3 disabled:bg-accent-foreground ',
        })}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          <UploadCloud className="h-24 w-24 " />
          <p className="font-bold">Choose file or drag and drop</p>
          <div className="inline-flex">
            <span className="text-sm uppercase ">{acceptedTypes}</span>
            {maxSize && (
              <span className="text-sm uppercase ltr:mr-5 rtl:ml-5">
                {humanReadableSize(maxSize)}
              </span>
            )}
          </div>

          {uploading && (
            <Progress
              className="h-8 w-2/3 self-center  rounded-md"
              value={percentage}
            />
          )}
        </div>
      </div>
      {error && <p className="text-red-500">{error.message}</p>}
    </div>
  )
}

export default DropZone
