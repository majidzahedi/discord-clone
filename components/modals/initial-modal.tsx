'use client'
import * as z from 'zod'
import axios from 'axios'

import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

import { useTranslations } from 'next-intl'
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form'
import { Button } from '../ui/button'
import DropZoneUploader from '@/components/drop-zone'
import Image from 'next/image'
import { X } from 'lucide-react'

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'msgNameError',
  }),
  imageUrl: z.string().min(1, { message: 'msgImageUrlError' }),
})

// BUG: UI is not showing any message about upload process.
export const InitialModal = () => {
  const [isMounted, setIsMounted] = useState(false)

  const router = useRouter()
  const t = useTranslations('Modals.InitialModal')

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      imageUrl: '',
    },
  })

  const isLoading = form.formState.isSubmitting
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post('/api/servers', values)

      router.refresh()
      form.reset()
      window.location.reload()
    } catch (error) {
      console.log(error)
    }
  }

  if (!isMounted) {
    return null
  }

  return (
    <Dialog open>
      <DialogContent className="overflow-hidden p-0 ">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            {t('title')}
          </DialogTitle>
          <DialogDescription className="text-center ">
            {t('description')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        {field.value ? (
                          <div className="relative h-32 w-32 rounded-full ">
                            <button
                              onClick={() => field.onChange('')}
                              className="absolute right-0 top-0 z-50 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
                            >
                              <X className="h-full w-full" />
                            </button>
                            <Image
                              fill
                              className="h-32 w-32 rounded-full object-cover"
                              src={`https://${field.value}`}
                              alt="server"
                            />
                          </div>
                        ) : (
                          <DropZoneUploader
                            acceptedTypes="image"
                            completed={(value) => field.onChange(value)}
                          />
                        )}
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
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
            </div>
            <DialogFooter className=" px-6 py-4">
              <Button variant="default" disabled={isLoading}>
                {t('create')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
