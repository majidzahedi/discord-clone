import React from 'react'
import { Input } from '@/components/ui/input'

function DropZoneUploader({ props }) {
  return <Input type="file" {...props} />
}

export default DropZoneUploader
