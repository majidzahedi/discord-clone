import ChatHeader from '@/components/chat/chat-header'
import ChatInput from '@/components/chat/chat-input'
import ChatMessages from '@/components/chat/chat-messages'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import React from 'react'

interface ChannelParams {
  params: {
    channelId: string
    serverId: string
  }
}

async function Channel({ params }: ChannelParams) {
  const profile = await currentProfile()

  if (!profile) {
    return redirect('/login')
  }

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    },
  })

  const member = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
  })

  if (!channel || !member) {
    return redirect('/')
  }

  return (
    <div className="flex h-full flex-col bg-background">
      <ChatHeader
        name={channel.name}
        serverId={params.serverId}
        type="channel"
      />
      <ChatMessages
        chatId={channel.id}
        name={channel.name}
        type="channel"
        member={member}
        apiUrl="/api/messages"
        socketUrl="/api/socket/messages"
        socketQuery={{
          channlId: channel.id,
          serverId: channel.serverId,
        }}
        paramKey="channelId"
        paramValue={channel.id}
      />
      <ChatInput
        name={channel.name}
        query={{ channelId: channel.id, serverId: channel.serverId }}
        apiUrl="/api/socket/messages"
        type="channel"
      />
    </div>
  )
}

export default Channel
