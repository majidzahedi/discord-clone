'use client'

import { Member, Profile, Server } from '@prisma/client'
import { roleIconMap } from '../modals/members-modal'
import { useParams, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import UserAvatar from '../user-avatar'

interface ServerMemberProps {
  member: Member & { profile: Profile }
  server: Server
}

function ServerMember({ member, server }: ServerMemberProps) {
  const params = useParams()
  const router = useRouter()

  const icon = roleIconMap[member.role]

  // FIX: styleing selected member

  return (
    <Link
      href={`/servers/${params.serverId}/conversation/${member.id}`}
      className={cn(
        'group mb-1 flex w-full items-center gap-x-2 rounded-md p-2 transition hover:bg-zinc-700/10 dark:bg-zinc-700/50',
        params.memberId === member.id && 'bg-zinc-700/20 dark:bg-zinc-700'
      )}
    >
      <UserAvatar
        className="h-8 w-8 md:h-8 md:w-8 "
        src={member.profile.imageUrl}
      />
      <span
        className={cn(
          'text-sm font-semibold text-secondary-foreground transition'
        )}
      >
        {member.profile.name}
      </span>
      {icon}
    </Link>
  )
}

export default ServerMember
