'use client'
import React from 'react'
import ActionTooltip from '@/components/action-tooltip'
import { cn } from '@/lib/utils'
import { useParams } from 'next/navigation'
import Image from 'next/image'

interface NavigationItemProps{
  id: string
  name: string
  imageUrl: string
}

function NavigationItem({ id, name, imageUrl }:NavigationItemProps) {
  const params = useParams()

  return (
    <ActionTooltip side="right" align="center" label={name}>
      <button className="group relative flex items-center">
        <div
          className={cn(
            'absolute left-0 w-[4px] rounded-r-full bg-primary transition-all',
            params?.serverId !== id && 'group-hover:h-[20px]',
            params?.serverId === id ? 'h-[36px]' : 'h-[8-px]'
          )}
        >
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
              src={`${imageUrl}`}
              alt="channel"
            />
          </div>
        </div>
      </button>
    </ActionTooltip>
  )
}

export default NavigationItem
