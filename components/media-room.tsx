'use client'

import { useEffect, useState } from 'react'
import { LiveKitRoom, VideoConference } from '@livekit/components-react'

import '@livekit/components-styles'
import { Channel } from '@prisma/client'
import { currentProfile } from '@/lib/current-profile'
import { Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { VideoConfiguration } from 'livekit-server-sdk/dist/proto/livekit_models'

interface MediaRoomProps {
  chatId: string
  video: boolean
  audio: boolean
}

export const MediaRoom = ({ chatId, video, audio }: MediaRoomProps) => {
  const session = useSession()
  const [token, setToken] = useState('')

  useEffect(() => {
    if (!session.data?.user?.name) return

    const name = session.data.user.name

    ;(async () => {
      try {
        const res = await fetch(`/api/livekit?room=${chatId}&username=${name}`)

        const data = await res.json()

        setToken(data.token)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [session.data?.user?.name])

  if (token === '') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <Loader2 className="my-4 h-7 w-7 animate-spin text-zinc-500" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading ...</p>
      </div>
    )
  }

  return (
    <LiveKitRoom
      data-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      video={video}
      audio={audio}
    >
      <VideoConference />
    </LiveKitRoom>
  )
}
