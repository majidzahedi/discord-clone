import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { useDropzone } from 'react-dropzone'
import { Upload } from 'lucide-react'
import useUploader from '@/hooks/use-upload'

interface UploaderProps {
  setValue:any
}

// WARN: refactor needed obviously
// TODO: make it a headless component
function DropZoneUploader({setValue}: UploaderProps) {
  const [uploading, setIsUploading] = useState(false)
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    disabled: uploading,
  })

  const { setFile } = useUploader({
    onStart: () => setIsUploading(true),
    onComplete: (data) => {
      const location = data?.data?.location
      setValue(location)
      console.log(location)
      setIsUploading(false)
    },
    onError: (e) => console.log('UPLOAD_ERROR', e),
  })

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
    }
  }, [acceptedFiles])

  return (
    <section className="border border-dashed">
      <div
        {...getRootProps()}
        className="disable:bg-white flex flex-col items-center space-y-5 px-6 py-8"
      >
        <Input {...getInputProps()} />
        <Upload className="h-10 w-10" />
        <p>Drag'n Drop something in here</p>
      </div>
    </section>
  )
}

export default DropZoneUploader
