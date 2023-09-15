import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

import * as z from 'zod'

const requestBody = z.object({
  name: z.string({ required_error: 'name is required' }).optional(),
  imageUrl: z.string({ required_error: 'imageUrl is required' }).optional(),
})

interface editServerParams {
  params: {
    serverId: string
  }
}

const editServer = async (req: NextRequest, { params }: editServerParams) => {
  try {
    const profile = await currentProfile()

    const { name, imageUrl } = requestBody.parse(await req.json())

    if (!profile) {
      return new NextRequest('Unauthorized')
    }

    if (!params.serverId) {
      return new NextRequest('ServerId is missing')
    }

    const updatedServer = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        name,
        imageUrl,
      },
    })

    return NextResponse.json(updatedServer)
  } catch (error) {
    console.log(`[EditServer]: ${error}`)

    return new NextResponse('Internal Server Error !')
  }
}

const deleteServer = async (_: any, { params }: editServerParams) => {
  try {
    const profile = await currentProfile()

    if (!profile) {
      return new NextRequest('Unauthorized')
    }

    if (!params.serverId) {
      return new NextRequest('ServerId is missing')
    }
    await db.server.delete({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
    })

    return new NextResponse('Done')
  } catch (error) {
    console.log('[DeleteServer]: ', error)
    return new NextResponse('Internal Server Error !')
  }
}

export { editServer as PATCH, deleteServer as DELETE }
