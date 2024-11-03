'use client'

import { Member, MemberRole, Profile } from '@prisma/client'
import UserAvatar from '../user-avatar'
import ActionTooltip from '../action-tooltip'
import { roleIconMap } from '../modals/members-modal'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Edit, Trash } from 'lucide-react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import qs from 'query-string'
import axios from 'axios'
import { useModal } from '@/hooks/use-modal-store'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { cn } from '@/lib/utils'

interface ChatItemProps {
  id: string
  content: string
  member: Member & { profile: Profile }
  timestamp: string
  fileUrl: string | null
  deleted: boolean
  currentMember: Member
  isUpdated: boolean
  socketUrl: string
  socketQeury: Record<string, string>
}

const formSchema = z.object({
  content: z.string().min(1),
})

function ChatItem({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  deleted,
  currentMember,
  isUpdated,
  socketUrl,
  socketQeury,
}: ChatItemProps) {
  const { onOpen } = useModal()
  const [isEditing, setIsEditing] = useState(false)
  const params = useParams()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
    },
  })

  const isLoading = form.formState.isLoading
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQeury,
      })

      await axios.patch(url, values)
      form.reset()
      setIsEditing(false)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    form.reset({
      content: content,
    })
  }, [content])

  const fileType = fileUrl?.split('.').pop()

  const isAdmin = currentMember.role === MemberRole.ADMIN
  const isModerator = currentMember.role === MemberRole.MODERATOR
  const isOwner = currentMember.id === member.id
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner)
  const canEditMessage = !deleted && isOwner && !fileUrl
  const isPdf = fileType === 'pdf' && fileUrl
  const isImage = !isPdf && fileUrl

  // TODO: pdf upload supprot
  //
  useEffect(() => {
    const handleKeyDown = (e: any) => {
      if (e.key === 'Escape' || e.keyCode === 27) {
        setIsEditing(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="group relative flex w-full items-center p-4">
      <div className="group flex w-full items-start gap-x-2">
        <div className="cursor-pointer transition hover:drop-shadow-md">
          <UserAvatar src={member.profile.imageUrl} />
        </div>
        <div className="flex w-full flex-col">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              {member.id !== currentMember.id ? (
                <Link
                  href={`/servers/${params?.serverId}/conversation/${member.id}`}
                >
                  <p className="cursor-pointer text-sm font-semibold hover:underline">
                    {member.profile.name}
                  </p>
                </Link>
              ) : (
                <p className="cursor-pointer text-sm font-semibold hover:underline">
                  {member.profile.name}
                </p>
              )}
              <ActionTooltip label={member.role}>
                {roleIconMap[member.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs ">{timestamp}</span>
          </div>
          {isImage && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferre"
              className="relative mt-2 flex aspect-square h-48 w-48 items-center overflow-hidden rounded-md border bg-secondary"
            >
              <Image
                src={`https://${fileUrl}`}
                fill
                alt={content}
                className="object-cover"
              />
            </a>
          )}
          {!fileUrl && !isEditing && (
            <p
              className={cn(
                'text-sm',
                deleted &&
                  'mt-1 text-xs italic text-zinc-500 dark:text-zinc-400'
              )}
            >
              {content}

              {isUpdated && !deleted && (
                <span className="mx-2 text-[10px]">(edited)</span>
              )}
            </p>
          )}
          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex w-full items-center gap-x-2 pt-2"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            disabled={isLoading}
                            className="border-0 border-none bg-zinc-300 p-2 focus-visible:border-0 focus-visible:ring-0 dark:bg-zinc-700"
                            placeholder="Edited message"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button disabled={isLoading} size="sm">
                  Save
                </Button>
              </form>
              <span className="mt-1 text-[10px] text-zinc-400">
                Press ESC to cancek or Enter to save
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className="absolute -top-2 right-5 hidden items-center gap-x-2 rounded-sm border bg-white p-1 group-hover:flex dark:bg-zinc-800">
          {canEditMessage && (
            <ActionTooltip label="Edit">
              <Edit
                onClick={() => {
                  setIsEditing(true)
                }}
                className="ml-auto h-4 w-4 cursor-pointer "
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash
              onClick={() =>
                onOpen('deleteMessage', {
                  apiUrl: `${socketUrl}/${id}`,
                  query: socketQeury,
                })
              }
              className="ml-auto h-4 w-4 cursor-pointer text-rose-600 "
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  )
}

export default ChatItem
