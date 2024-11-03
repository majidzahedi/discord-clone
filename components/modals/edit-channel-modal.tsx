'use client'
import * as z from 'zod'
import axios from 'axios'
import qs from 'query-string'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

import { useTranslations } from 'next-intl'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Button } from '../ui/button'
import { useModal } from '@/hooks/use-modal-store'
import { ChannelType } from '@prisma/client'
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/components/ui/select'
import { useEffect } from 'react'

const formSchema = z.object({
  name: z
    .string()
    .min(1)
    .refine((name) => name !== 'general', {
      message: "channel name cannot be 'general'",
    }),
  type: z.nativeEnum(ChannelType).default('TEXT'),
})

// BUG: UI is not showing any message about upload process.
export const EditChannelModal = () => {
  const { isOpen, onClose, type, data } = useModal()
  const { channel } = data

  const isModalOpen = isOpen && type === 'editChannel'

  const handleClose = () => {
    form.reset()
    onClose()
  }

  const router = useRouter()
  const params = useParams()
  const t = useTranslations('Modals.CreateChannel')

  const form = useForm({
    resolver: zodResolver(formSchema),
    values: {
      name: channel?.name,
      type: channel?.type,
    },
  })

  useEffect(() => {
    form.setValue('name', channel?.name)
    form.setValue('type', channel?.type)
  }, [form, channel, isOpen])

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `/api/channel/${channel?.id}`,
        query: {
          serverId: params?.serverId,
        },
      })
      await axios.patch(url, values)

      router.refresh()
      handleClose()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="overflow-hidden p-0 ">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            {t('title')}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          {/*// @ts-ignore */}
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase">
                      {t('serverName')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder={t('namePlaceholder')}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Channel Type</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="select channel type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ChannelType).map((type) => (
                          <SelectItem
                            key={type}
                            className="capitalize"
                            value={type}
                          >
                            {type.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className=" px-6 py-4">
              <Button variant="default" disabled={isLoading}>
                {t('save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
