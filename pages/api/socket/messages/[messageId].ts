import { authOptions } from '@/lib/auth'
import { currentProfile } from '@/lib/current-profile-page'
import { db } from '@/lib/db'
import { NextApiResponseServerIo } from '@/types'
import { MemberRole } from '@prisma/client'
import { NextApiRequest } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== 'DELETE' && req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const profile = await currentProfile(req, res, authOptions)
    const { messageId, serverId, channelId } = req.query
    const { content } = req.body

    if (!profile) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    if (!serverId && !channelId) {
      return res
        .status(401)
        .json({ message: 'serverId or channelId is missing' })
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
      return res.status(404).json({ message: 'Server Not Found!' })
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    })

    if (!channel) {
      return res.status(404).json({ message: 'Channel Not Found!' })
    }

    const member = server.members.find(
      (member) => member.profileId === profile.id
    )

    if (!member) {
      return res.status(404).json({ message: 'Member Not Found!' })
    }

    let message = await db.message.findFirst({
      where: {
        id: messageId as string,
        channelId: channelId as string,
      },
      include: {
        member: {
          include: { profile: true },
        },
      },
    })

    if (!message || message.deleted) {
      return res.status(404).json({ message: 'Member Not Found!' })
    }

    const isMessageOwner = message.memberId === member.id

    const isAdmin = member.role === MemberRole.ADMIN
    const isModerator = member.role === MemberRole.MODERATOR
    const canModify = isMessageOwner || isAdmin || isModerator

    if (!canModify) {
      return res.status(404).json({ message: 'Access denied!' })
    }

    if (req.method === 'DELETE') {
      if (!isMessageOwner) {
        return res.status(404).json({ message: 'Access denied!' })
      }
      message = await db.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          fileUrl: null,
          content: 'This Message has been deleted',
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      })
    }

    if (req.method === 'PATCH') {
      if (!isMessageOwner) {
        return res.status(404).json({ message: 'Access denied!' })
      }
      message = await db.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      })
    }

    const updateKey = `chat:${channelId}:messages:update`

    res.socket.server.io.emit(updateKey, message)

    return res.status(200).json(message)
  } catch (error) {
    console.log('[MessageId_pATCH]', error)

    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
