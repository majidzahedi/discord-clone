import ChatHeader from '@/components/chat/chat-header'
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
}

async function MemberIdPage({ params }: MemberIdPageProps) {
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
    </div>
  )
}

export default MemberIdPage
