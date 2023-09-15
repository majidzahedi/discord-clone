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

const createChannel = async (req: NextRequest) => {
  try {
    const profile = await currentProfile()
    const { searchParams } = new URL(req.url)
    const serverId = searchParams.get('serverId')
    const { name, type } = requestBody.parse(await req.json())

    if (!profile) {
      return new NextResponse('UnAuthoized', { status: 400 })
    }

    if (!serverId) {
      return new NextResponse('Server Id is Required', { status: 401 })
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
          create: {
            name,
            type,
            profileId: profile.id,
          },
        },
      },
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log('[CreateChannel]: ', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export { createChannel as POST }
