import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { ChannelType } from '@prisma/client'
import { redirect } from 'next/navigation'
import { Separator } from '../ui/seperator'
import { ServerHeader } from './server-header'

interface ServerSidebarProps {
  serverId: string
}

const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await currentProfile()

  if (!profile) {
    return redirect('/login')
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: 'asc',
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: 'asc',
        },
      },
    },
  })

  const textChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  )
  const audioChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  )
  const videoChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  )
  const members = server?.members.filter(
    (member) => member.profileId !== profile.id
  )

  if (!server) {
    return redirect('/')
  }

  const role = server.members.find((member) => member.profileId === profile.id)
    ?.role

  return (
    <div className="flex h-full w-full flex-col border-gray-600 bg-accent text-primary ltr:border-l rtl:border-r">
      <ServerHeader server={server} role={role} />
    </div>
  )
}

export default ServerSidebar
