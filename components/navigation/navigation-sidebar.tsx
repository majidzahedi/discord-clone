import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import React from 'react'
import { NavigationAction } from '@/components/navigation/navitagion-action'
import { Separator } from '@/components/ui/seperator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { NavigationItem } from './navigation-item'
import UserNav from '../user-avatar'

const NavigationSideBar = async () => {
  const profile = await currentProfile()

  if (!profile) {
    return redirect('/')
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
    <div className="flex h-full w-full flex-col items-center space-y-4  bg-accent py-3 text-primary">
      <NavigationAction />
      <Separator className="mx-auto h-[2px] w-10 rounded-md bg-primary" />
      <ScrollArea
        className="
        w-full flex-1
        "
      >
        {servers.map((server) => (
          <div className="mb-4">
            <NavigationItem
              id={server.id}
              name={server.name}
              imageUrl={server.imageUrl}
            />
          </div>
        ))}
      </ScrollArea>
      <div className="mt-auto flex flex-col items-center gap-y-4 pb-3">
        <UserNav />
      </div>
    </div>
  )
}

export default NavigationSideBar
