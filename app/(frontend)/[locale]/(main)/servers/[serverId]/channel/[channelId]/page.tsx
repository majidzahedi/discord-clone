import ChatHeader from '@/components/chat/chat-header'
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
    </div>
  )
}

export default Channel
