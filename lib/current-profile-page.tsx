import { getServerSession } from 'next-auth/next'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

// TODO: complete currentProfile behavior.
export const currentProfile = async (req: any, res: any, authOptions: any) => {
  const session = (await getServerSession(req, res, authOptions)) as any

  if (!session?.user?.email) {
    return redirect('/login')
  }

  const profile = await db.profile.findFirst({
    where: {
      email: session?.user?.email,
    },
  })

  return profile
}
