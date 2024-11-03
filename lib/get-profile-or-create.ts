import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { db } from './db'
import cuid from 'cuid'

export const getProfileOrCreate = async () => {
  const session = await getServerSession()

  if (!session?.user?.email) {
    return redirect('/login')
  }

  const profile = await db.profile.findFirst({
    where: {
      email: session?.user?.email,
    },
  })

  if (profile) {
    return profile
  }

  const newProfile = await db.profile.create({
    data: {
      email: session.user.email,
      imageUrl: session.user.image || '',
      name: session.user.name || '',
      userId: cuid(),
    },
  })

  return newProfile
}
