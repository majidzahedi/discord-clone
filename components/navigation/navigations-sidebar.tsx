import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import React from 'react'
import NavigationItem from './navigation-item'
import UserNav from '../user-avatar'

const NavigationSideBar = async () => {
  const profile = await currentProfile()

  if (!profile) {
    return redirect('login')
  }

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  })

  return (
    <div className="flex h-full w-full flex-col items-center space-y-4 bg-[#E3E5E8] py-3 text-primary dark:bg-[#1E1F22]">
      <div className="w-full flex-1">
        {servers.map((server) => (
          <div key={server.id} className="mb-4">
            <NavigationItem
              id={server.id}
              name={server.name}
              imageUrl={server.imageUrl}
            />
          </div>
        ))}
      </div>
      <UserNav />
    </div>
  )
}

export default NavigationSideBar
