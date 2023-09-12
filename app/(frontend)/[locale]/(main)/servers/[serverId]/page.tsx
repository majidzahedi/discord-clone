import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

interface ServerPageProps {
  params: {
    serverId: string
  }
}

const page = async ({ params }: ServerPageProps) => {
  const server = await db.server.findFirst({
    where: {
      id: params.serverId,
    },
  })

  if (!server) {
    return redirect('/login')
  }

  return <div>{params.serverId}</div>
}

export default page
