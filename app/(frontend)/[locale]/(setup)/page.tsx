import { InitialModal } from '@/components/modals/initial-modal'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { getProfileOrCreate } from '@/lib/get-profile-or-create'

// TODO: Refactoring and separation of concerns
export default async function Page() {
  const profile = await getProfileOrCreate()

  const profileServers = await db.server.findFirst({
    where: {
      profileId: profile.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  console.log(profileServers)
  if (profileServers) {
    return redirect(`/${profileServers.id}`)
  }

  return <InitialModal />
}
