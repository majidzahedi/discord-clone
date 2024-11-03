import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

interface ServerPageProps {
  params: {
    serverId: string
  }
}

const page = async ({ params }: ServerPageProps) => {
  const profile = currentProfile()

  if (!profile) {
    return redirect('/login')
  }

  const server = await db.server.findFirst({
    where: {
      id: params.serverId,
    },
    include: {
      channels: {
        where: {
          name: 'general',
        },
      },
    },
  })

  if (!server) {
    return redirect('/login')
  }

  const initialChannel = server?.channels[0]

  return redirect(`/servers/${server.id}/channel/${initialChannel.id}`)
}

export default page
