import React, { useCallback, useRef, useState } from 'react'

import { useDropzone } from 'react-dropzone'
import { useFileUploader } from '@/hooks/use-file-uploader' // Adjust the import path as needed
import Image from 'next/image'
import { AvatarIcon } from '@radix-ui/react-icons'
import { X } from 'lucide-react'
import { Button } from './ui/button'

interface CustomFileUploaderProps {
  acceptedTypes: 'image' | 'video' | 'audio'
  completed: (response:string)=>void
}

// TODO: progress is not implemented in UI. 
const DropZone: React.FC<CustomFileUploaderProps> = ({ acceptedTypes, completed }) => {
  const [resultUrl, setResultUrl] = useState<string | undefined>()
  const { uploading, error, startUpload } = useFileUploader({
    // Configure your uploader options here
    chunkSize: 1024 * 1024 * 5, // 5MB chunks
    threadsQuantity: 5,
    metadata: {},
    onProgress: (progress) => {
      // Handle progress updates here
      console.log('Upload Progress:', progress)
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
    accept:
      acceptedTypes === 'image'
        ? { 'image/*': [] }
        : acceptedTypes === 'video'
        ? { 'video/*': [] }
        : { 'audio/*': [] },
    maxFiles: 1, // Allow only one file to be uploaded at a time
  })

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative h-32 w-32 rounded-full text-center">
        {resultUrl && (
          <Button
            className="absolute right-2 top-2 h-5 w-5 rounded-full"
            size="icon"
            variant="destructive"
          >
            <X className="" />
          </Button>
        )}
        {resultUrl ? (
          <Image
            src={resultUrl}
            alt=""
            width={128}
            height={128}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <AvatarIcon className="h-full w-full" />
        )}
      </div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-4 ${
          uploading ? 'bg-gray-100' : 'cursor-pointer hover:bg-gray-100'
        }`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <p>Uploading... </p>
        ) : (
          <p>
            Drag and drop a {acceptedTypes} file here, or click to select one
          </p>
        )}
      </div>
      {error && <p className="text-red-500">{error.message}</p>}
    </div>
  )
}

export default DropZone
