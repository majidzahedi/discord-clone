import { NextRequest, NextResponse } from 'next/server'
import * as z from 'zod'
import { db } from '@/lib/db'
import cuid from 'cuid'
import { getServerSession } from 'next-auth'
import { currentProfile } from '@/lib/current-profile'
import { MemberRole } from '@prisma/client'

const requestBody = z.object({
  name: z.string({ required_error: 'name is required' }),
  imageUrl: z.string({ required_error: 'imageUrl is required' }),
})

// TODO: Refactor to have a better errors, check the hole function again
const createServer = async (req: NextRequest) => {
  try {
    const { name, imageUrl } = requestBody.parse(await req.json())
    const profile = await currentProfile()

    if (!profile?.userId) {
      console.log('[api/servsers]: Unauthorized')
      return new NextResponse('Unauthorized', { status: 400 })
    }

    const newServer = await db.server.create({
      data: {
        profileId: profile.id,
        name,
        imageUrl,
        inviteCode: cuid(),
        channels: {
          create: [{ name: 'general', profileId: profile.id }],
        },
        members: {
          create: [{ profileId: profile.id, role: MemberRole.ADMIN }],
        },
      },
    })

    return NextResponse.json(newServer)
  } catch (error) {
    console.log('[api/servsers]: catch error')
    return new NextResponse(`CREATE_SERVER: ${error} `, { status: 500 })
  }
}

export { createServer as POST }
