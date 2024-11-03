import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirect } from 'next-intl/server'
import { NextRequest, NextResponse } from 'next/server'
import * as z from 'zod'

interface ChangeRoleParams {
  params: {
    memberId: string
  }
}

const requestBody = z.object({
  role: z.enum(['GUEST', 'MODERATOR', 'ADMIN']),
})

const changeRole = async (req: NextRequest, { params }: ChangeRoleParams) => {
  try {
    const profile = await currentProfile()
    const { searchParams } = new URL(req.url)
    const { role } = requestBody.parse(await req.json())

    const serverId = searchParams.get('serverId')

    if (!profile) {
      return redirect('/login')
    }

    if (!params.memberId || !serverId) {
      return new NextRequest('memberId or serverId is missing')
    }

    const updatedServer = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: params.memberId,
              profileId: {
                not: profile.id,
              },
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: 'asc',
          },
        },
      },
    })

    return NextResponse.json(updatedServer)
  } catch (error) {
    console.log(`[CHANGEROLE]: ${error}`)
    return new NextResponse('Internal Server Error')
  }
}

const kickMember = async (req: NextRequest, { params }: ChangeRoleParams) => {
  try {
    const profile = await currentProfile()
    const { searchParams } = new URL(req.url)

    const serverId = searchParams.get('serverId')

    if (!profile) {
      return redirect('/login')
    }

    if (!params.memberId || !serverId) {
      return new NextRequest('memberId or serverId is missing')
    }

    const updatedServer = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          delete: {
            id: params.memberId,
            profileId: {
              not: profile.id,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: 'asc',
          },
        },
      },
    })

    return NextResponse.json(updatedServer)
  } catch (error) {
    console.log(`[CHANGEROLE]: ${error}`)
    return new NextResponse('Internal Server Error')
  }
}
export { changeRole as PATCH, kickMember as DELETE }
