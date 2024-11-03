'use client'

import { cn } from '@/lib/utils'
import { Channel, ChannelType, MemberRole, Server } from '@prisma/client'
import { Edit, Hash, Lock, Mic, Trash, Video } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import ActionTooltip from '../action-tooltip'
import { useModal, ModalType } from '@/hooks/use-modal-store'
import Link from 'next/link'

interface ServerChannelProps {
  server: Server
  channel: Channel
  role?: MemberRole
}

const iconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
}

function ServerChannel({ server, channel, role }: ServerChannelProps) {
  const params = useParams()
  const router = useRouter()
  const { onOpen } = useModal()

  const Icon = iconMap[channel.type]

  const onAction = (action: ModalType) => (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onOpen(action, { channel })
  }

  return (
    <Link
      href={`/servers/${server.id}/channel/${channel.id}`}
      className={cn(
        'items-cen group flex w-full gap-x-2 rounded-md p-2',
        params?.channelId === channel.id && 'bg-zinc-700/20 dark:bg-zinc-700'
      )}
    >
      <Icon className="dark:text-znic-400 h-5 w-5 flex-shrink-0 text-zinc-500" />
      <span
        className={cn(
          'line-clamp-1 text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-600 dark:group-hover:text-zinc-300',
          params?.channelId === channel.id &&
            'dark:group-hover:white text-primary dark:text-zinc-200'
        )}
      >
        {channel.name}
      </span>
      {channel.name !== 'general' && role !== MemberRole.GUEST && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label="Edit">
            <button onClick={onAction('editChannel')}>
              <Edit className="hidden h-4 w-4 text-zinc-500 transition hover:text-zinc-600 group-hover:block  dark:text-zinc-400 dark:hover:text-zinc-300" />
            </button>
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <button onClick={onAction('deleteChannel')}>
              <Trash className="hidden h-4 w-4 text-zinc-500 transition hover:text-zinc-600 group-hover:block  dark:text-zinc-400 dark:hover:text-zinc-300" />
            </button>
          </ActionTooltip>
        </div>
      )}
      {channel.name === 'general' && (
        <Lock className="ml-auto h-4 w-4 text-zinc-500 dark:text-zinc-400" />
      )}
    </Link>
  )
}

export default ServerChannel
