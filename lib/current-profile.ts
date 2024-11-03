import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

// TODO: complete currentProfile behavior.
export const currentProfile = async () => {
  const session = await getServerSession()

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
