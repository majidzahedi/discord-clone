'use client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import qs from 'query-string'

import { useTranslations } from 'next-intl'
import { useModal } from '@/hooks/use-modal-store'
import { Button } from '../ui/button'
import { useState } from 'react'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'

export const DeleteChannelModal = () => {
  const { isOpen, onClose, type, data } = useModal()
  const params = useParams()

  const isModalOpen = isOpen && type === 'deleteChannel'
  const { channel } = data

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const t = useTranslations('Modals.DeleteChannel')
  const onClick = async () => {
    try {
      setIsLoading(true)

      const url = qs.stringifyUrl({
        url: `/api/channel/${channel?.id}`,
        query: {
          serverId: params?.serverId,
        },
      })

      await axios.delete(url)

      router.refresh()
      router.push('/')
      onClose()
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden p-0 ">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            {t('title')}
          </DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to delete{' '}
            <span className="font-semibold">{channel?.name}</span> ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="px-6 py-4">
          <div className="flex w-full items-center justify-between">
            <Button disabled={isLoading} onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              onClick={onClick}
              variant="destructive"
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
