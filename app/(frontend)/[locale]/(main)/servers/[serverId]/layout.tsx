import ServerSidebar from '@/components/servers/server-sidebar'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

interface ServerLayoutProps {
  children: React.ReactNode
  params: {
    serverId: string
  }
}

async function ServerLayout({
  children,
  params: { serverId },
}: ServerLayoutProps) {
  const profile = await currentProfile()

  if (!profile) {
    return redirect('/login')
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  })

  if (!server) {
    return redirect('/')
  }

  return (
    <div className="h-full">
      <div className="fixed inset-y-0 z-20 hidden h-full w-60 flex-col md:flex">
        <ServerSidebar serverId={serverId} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  )
}

export default ServerLayout
