import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { ChannelType } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import * as z from 'zod'

const requestBody = z.object({
  name: z
    .string()
    .min(1, {
      message: 'msgNameError',
    })
    .refine((name) => name !== 'general', {
      message: "channel name cannot be 'general'",
    }),
  type: z.nativeEnum(ChannelType),
})

interface EditChannelProps {
  params: {
    channelId: string
  }
}

const editChannel = async (req: NextRequest, { params }: EditChannelProps) => {
  try {
    const profile = await currentProfile()
    const { searchParams } = new URL(req.url)
    const serverId = searchParams.get('serverId')
    const { name, type } = requestBody.parse(await req.json())

    if (!profile) {
      return new NextResponse('UnAuthoized', { status: 400 })
    }

    if (!serverId || !params?.channelId) {
      return new NextResponse('serverId or channelId is missing', {
        status: 401,
      })
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              not: 'GUEST',
            },
          },
        },
      },
      data: {
        channels: {
          update: {
            data: {
              name,
              type,
            },
            where: {
              id: params.channelId,
              name: {
                not: 'general',
              },
            },
          },
        },
      },
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log('[EditChannel]: ', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

const deleteChannel = async (
  req: NextRequest,
  { params }: EditChannelProps
) => {
  try {
    const profile = await currentProfile()
    const { searchParams } = new URL(req.url)
    const serverId = searchParams.get('serverId')

    if (!profile) {
      return new NextRequest('Unauthorized')
    }

    if (!params.channelId || !serverId) {
      return new NextRequest('ServerId or channelId is missing')
    }
    await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
        members: {
          some: {
            role: {
              not: 'GUEST',
            },
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: params.channelId,
            name: {
              not: 'general',
            },
          },
        },
      },
    })

    return new NextResponse('Done')
  } catch (error) {
    console.log('[DeleteServer]: ', error)
    return new NextResponse('Internal Server Error !')
  }
}

export { editChannel as PATCH, deleteChannel as DELETE }
