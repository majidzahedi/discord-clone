'use client'

import qs from 'query-string'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { Video, VideoOff } from 'lucide-react'
import ActionTooltip from '../action-tooltip'
import { Button } from '../ui/button'

export const ChatVideoButton = () => {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isVideo = searchParams?.get('video')

  const Icon = isVideo ? VideoOff : Video

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname || '',
        query: {
          video: isVideo ? undefined : true,
        },
      },
      { skipNull: true }
    )

    router.push(url)
  }

  const tooltipLabel = isVideo ? 'End Video call' : 'Start video call'

  return (
    <ActionTooltip side="bottom" label={tooltipLabel}>
      <Button onClick={onClick} className="mr-4 transition hover:opacity-75">
        <Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
      </Button>
    </ActionTooltip>
  )
}
