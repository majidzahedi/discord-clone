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
    const { conversationId } = req.query

    if (!profile) {
      return res.status(400).json({
        message: 'unauthorized',
      })
    }

    if (!conversationId || !content) {
      return res.status(400).json({
        message: 'something is missing',
      })
    }

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              profileId: profile.id,
            },
          },
          {
            memberTwo: {
              profileId: profile.id,
            },
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    })

    if (!conversation) {
      return res.status(401).json({
        message: 'Conversation Not Found',
      })
    }

    const member =
      conversation.memberOne.profile.id === profile.id
        ? conversation.memberOne
        : conversation.memberTwo

    if (!member) {
      return res.status(404).json({
        message: 'member not found',
      })
    }

    const message = await db.directMessage.create({
      data: {
        content,
        fileUrl,
        conversationId: conversationId as string,
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

    const channelKey = `chat:${conversationId}:messages`

    res.socket.server.io.emit(channelKey, message)

    return res.status(200).send(message)
  } catch (error) {
    console.log('[ConversationId_Post]: ', error)
    return res.status(500).json({
      message: 'Internal Server Error',
    })
  }
}
