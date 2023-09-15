import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

interface editServerParams {
  params: {
    serverId: string
  }
}

const leaveServer = async (_: any, { params }: editServerParams) => {
  try {
    const profile = await currentProfile()

    if (!profile) {
      return new NextRequest('Unauthorized')
    }

    if (!params.serverId) {
      return new NextRequest('ServerId is missing')
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: {
          not: profile.id,
        },
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log('[DeleteServer]: ', error)
    return new NextResponse('Internal Server Error !')
  }
}

export { leaveServer as PATCH }
