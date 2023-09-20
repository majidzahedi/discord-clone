'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Form, FormControl, FormField, FormItem } from '../ui/form'
import { Plus } from 'lucide-react'
import { Input } from '../ui/input'
import qs from 'query-string'
import axios from 'axios'
import { useModal } from '@/hooks/use-modal-store'
import EmojiPicker from '../emoji-picker'
import { useRouter } from 'next/navigation'

interface ChatInputProps {
  apiUrl: string
  query: Record<string, any>
  name: string
  type: 'conversatoin' | 'channel'
}

const formSchema = z.object({
  content: z.string().min(1),
})

function ChatInput({ apiUrl, query, name, type }: ChatInputProps) {
  const { onOpen } = useModal()
  const router = useRouter()
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
    },
  })

  const isLoading = form.formState.isLoading

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      })

      await axios.post(url, values)
      form.reset()
      router.refresh()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => {
            return (
              <FormItem>
                <FormControl>
                  <div className="relative p-4 pb-6">
                    <button
                      type="button"
                      onClick={() => {
                        onOpen('messageFile', { query, apiUrl })
                      }}
                      className="absolute left-8 top-7 flex h-[24px] w-[24px] items-center justify-center rounded-full p-1 transition"
                    >
                      <Plus className="text-white" />
                    </button>
                    <Input
                      autoComplete="off"
                      disabled={isLoading}
                      className="border-0 border-none bg-zinc-200/90 px-14 py-6 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-700/75 "
                      placeholder={`Message ${
                        type === 'channel' ? '#' + name : name
                      }`}
                      {...field}
                    />
                    <div className="absolute right-8 top-7">
                      <EmojiPicker
                        onChange={(emoji: string) =>
                          field.onChange(`${field.value} ${emoji}`)
                        }
                      />
                    </div>
                  </div>
                </FormControl>
              </FormItem>
            )
          }}
        />
      </form>
    </Form>
  )
}

export default ChatInput
