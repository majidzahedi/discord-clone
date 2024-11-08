'use client'
import React from 'react'
import ActionTooltip from '@/components/action-tooltip'
import { cn } from '@/lib/utils'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface NavigationItemProps {
  id: string
  name: string
  imageUrl: string
}

export function NavigationItem({ id, name, imageUrl }: NavigationItemProps) {
  const params = useParams()
  const router = useRouter()

  const onClick = () => {
    router.push(`/servers/${id}`)
  }

  return (
    <ActionTooltip side="right" align="center" label={name}>
      <button onClick={onClick} className="group relative flex items-center">
        <div
          className={cn(
            'absolute left-0 w-[4px] rounded-r-full bg-primary transition-all',
            params?.serverId !== id && 'group-hover:h-[20px]',
            params?.serverId === id ? 'h-[36px]' : 'h-[8px]'
          )}
        />
        <div
          className={cn(
            'group relative mx-3 flex h-[48px] w-[48px] overflow-hidden rounded-[24px] transition-all group-hover:rounded-[16px]',
            params?.serverId === id &&
              'rounded-[16px] bg-primary/10 text-primary'
          )}
        >
          <Image
            fill
            className="aspect-square object-cover"
            src={`https://${imageUrl}`}
            alt="channel"
          />
        </div>
      </button>
    </ActionTooltip>
  )
}
