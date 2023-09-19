import { authOptions } from '@/lib/auth'
import { currentProfile } from '@/lib/current-profile-page'
import { db } from '@/lib/db'
import { NextApiResponseServerIo } from '@/types'
import { NextApiRequest } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
    })
  }

  try {
    const profile = await currentProfile(req, res, authOptions)
    const { content, fileUrl } = req.body
    const { serverId, channelId } = req.query

    if (!profile) {
      return res.status(400).json({
        message: 'unauthorized',
      })
    }

    if (!serverId || !channelId || !content) {
      return res.status(400).json({
        message: 'something is missing',
      })
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    })

    if (!server) {
      return res.status(404).json({
        message: 'server not found',
      })
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    })

    if (!channel) {
      return res.status(404).json({
        message: 'channel not found',
      })
    }

    const member = server.members.find(
      (member) => member.profileId === profile.id
    )

    if (!member) {
      return res.status(404).json({
        message: 'member not found',
      })
    }

    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        channelId: channelId as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    })

    const channelKey = `chat:${channelId}:messages`

    res.socket.server.io.emit(channelKey, message)

    return res.status(200).send(message)
  } catch (error) {
    console.log('[Messages_Post]: ', error)
    return res.status(500).json({
      message: 'Internal Server Error',
    })
  }
}
