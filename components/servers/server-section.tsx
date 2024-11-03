'use client'

import { ServerWithMembersWithProfiles } from '@/types'
import { ChannelType, MemberRole } from '@prisma/client'
import ActionTooltip from '../action-tooltip'
import { Plus, Settings } from 'lucide-react'
import { useModal } from '@/hooks/use-modal-store'

interface ServerSectionProps {
  label: string
  role?: MemberRole
  sectionType: 'channels' | 'members'
  channelType?: ChannelType
  server?: ServerWithMembersWithProfiles
}

function ServerSection({
  label,
  role,
  sectionType,
  channelType,
  server,
}: ServerSectionProps) {
  const { onOpen } = useModal()
  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs font-semibold uppercase text-zinc-700 dark:text-zinc-400">
        {label}
      </p>
      {role !== 'GUEST' && sectionType === 'channels' && (
        <ActionTooltip label="Create Channel" side="top">
          <button
            className="text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 hover:dark:text-zinc-300"
            onClick={() => onOpen('createChannel')}
          >
            <Plus className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}

      {role === 'ADMIN' && sectionType === 'members' && (
        <ActionTooltip label="Manage Member" side="top">
          <button
            className="text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 hover:dark:text-zinc-300"
            onClick={() => onOpen('members', { server })}
          >
            <Settings className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  )
}

export default ServerSection
