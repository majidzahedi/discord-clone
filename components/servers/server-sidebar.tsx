import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { ChannelType, MemberRole } from '@prisma/client'
import { redirect } from 'next/navigation'
import { ServerHeader } from './server-header'
import { ScrollArea } from '../ui/scroll-area'
import ServerSearch from './server-search'
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react'
import { Separator } from '../ui/seperator'
import ServerSection from './server-section'
import ServerChannel from './server-channel'
import ServerMember from './server-member'

interface ServerSidebarProps {
  serverId: string
}

const channelIconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
}

const memberIconMap = {
  [MemberRole.ADMIN]: <ShieldCheck className="mr-2 h-4 w-4" />,
  [MemberRole.MODERATOR]: <ShieldAlert className="mr-2 h-4 w-4" />,
  [MemberRole.GUEST]: null,
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
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: 'Text Channels',
                type: 'channel',
                data: textChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIconMap[channel.type],
                })),
              },
              {
                label: 'Voice Channels',
                type: 'channel',
                data: audioChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIconMap[channel.type],
                })),
              },
              {
                label: 'Video Channels',
                type: 'channel',
                data: videoChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIconMap[channel.type],
                })),
              },
              {
                label: 'Members',
                type: 'channel',
                data: members?.map((members) => ({
                  id: members.id,
                  name: members.profile.name,
                  icon: memberIconMap[members.role],
                })),
              },
            ]}
          />
        </div>
        <Separator className="my-1 rounded-md bg-zinc-200 dark:bg-zinc-300" />
        {!!textChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              label="Text Channels"
              role={role}
              channelType="TEXT"
              server={server}
            />
            <div className="space-y-[2px]">
              {textChannels?.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  server={server}
                  role={role}
                  channel={channel}
                />
              ))}
            </div>
          </div>
        )}

        {!!audioChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              label="Audio Channels"
              role={role}
              channelType="AUDIO"
              server={server}
            />
            <div className="space-y-[2px]">
              {audioChannels?.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  server={server}
                  role={role}
                  channel={channel}
                />
              ))}
            </div>
          </div>
        )}

        {!!videoChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              label="Video Channels"
              role={role}
              channelType="VIDEO"
              server={server}
            />
            <div className="space-y-[2px]">
              {videoChannels?.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  server={server}
                  role={role}
                  channel={channel}
                />
              ))}
            </div>
          </div>
        )}

        {!!members?.length && (
          <ServerSection
            sectionType="members"
            label="Members"
            role={role}
            server={server}
          />
        )}
        {members?.map((member) => (
          <ServerMember key={member.id} server={server} member={member} />
        ))}
      </ScrollArea>
    </div>
  )
}

export default ServerSidebar
