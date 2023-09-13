import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import cuid from 'cuid'
import { NextResponse } from 'next/server'

interface changeInviteCodeParam {
  params: {
    serverId: string
  }
}

const changeInviteCode = async (
  req: Request,
  { params }: changeInviteCodeParam
) => {
  try {
    const profile = await currentProfile()

    if (!profile) {
      return new NextResponse('Unauthenticated!')
    }

    if (!params.serverId) {
      return new NextResponse('Missing serverId')
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        inviteCode: cuid(),
      },
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log('[changeInviteCode]: ', error)
    return new NextResponse('Server Error', { status: 500 })
  }
}

export { changeInviteCode as PATCH }
