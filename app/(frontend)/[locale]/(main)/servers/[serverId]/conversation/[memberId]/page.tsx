import ChatHeader from '@/components/chat/chat-header'
import ChatInput from '@/components/chat/chat-input'
import ChatMessages from '@/components/chat/chat-messages'
import { MediaRoom } from '@/components/media-room'
import ServerSearch from '@/components/servers/server-search'
import { getOrCreateConversation } from '@/lib/conversation'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import React from 'react'

interface MemberIdPageProps {
  params: {
    memberId: string
    serverId: string
  }
  searchParams: {
    video?: boolean
  }
}

async function MemberIdPage({ params, searchParams }: MemberIdPageProps) {
  const profile = await currentProfile()
  if (!profile) {
    return redirect('/login')
  }

  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  })

  if (!currentMember) {
    return redirect('/')
  }

  const conversation = await getOrCreateConversation(
    currentMember.id,
    params.memberId
  )

  if (!conversation) {
    return redirect(`/servers/${params.serverId}`)
  }

  const { memberOne, memberTwo } = conversation

  const otherMember =
    memberOne.profile.id === profile.id ? memberTwo : memberOne

  return (
    <div className="flex h-full flex-col bg-background">
      <ChatHeader
        serverId={params.serverId}
        type="conversation"
        name={otherMember.profile.name}
        imageUrl={otherMember.profile.imageUrl}
      />
      {searchParams.video && (
        <MediaRoom chatId={conversation.id} video={true} audio={true} />
      )}
      {!searchParams?.video && (
        <>
          <ChatMessages
            name={otherMember.profile.name}
            type="conversation"
            chatId={conversation.id}
            member={currentMember}
            apiUrl="/api/direct-messages"
            paramKey="conversationId"
            paramValue={conversation.id}
            socketUrl="/api/socket/direct-messages"
            socketQuery={{
              conversationId: conversation.id,
            }}
          />
          <ChatInput
            name={otherMember.profile.name}
            type="conversatoin"
            apiUrl="/api/socket/direct-messages"
            query={{
              conversationId: conversation.id,
            }}
          />
        </>
      )}
    </div>
  )
}

export default MemberIdPage
