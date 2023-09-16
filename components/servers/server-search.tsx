'use client'

import { Search } from 'lucide-react'
import { Button } from '../ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
} from '../ui/command'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

interface ServerSearchProps {
  data: {
    label: string
    type: 'channel' | 'member'
    data:
      | {
          icon: React.ReactNode
          name: string
          id: string
        }[]
      | undefined
  }[]
}

const ServerSearch = ({ data }: ServerSearchProps) => {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const onClick = ({
    id,
    type,
  }: {
    id: string
    type: 'channel' | 'member'
  }) => {
    setOpen(false)

    if (type === 'member') {
      router.push(`/servers/${params?.serverId}/conversation/${id}`)
    }

    if (type === 'channel') {
      router.push(`/servers/${params?.serverId}/channel/${id}`)
    }
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="group flex w-full items-center justify-start gap-x-2 rounded-md px-2 py-2 text-accent-foreground transition hover:bg-zinc-700 dark:hover:bg-zinc-700/50"
        variant="ghost"
      >
        <Search className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
        <span className="text-sm font-semibold text-zinc-700 transition group-hover:text-zinc-400 dark:text-zinc-400 dark:group-hover:text-zinc-300">
          Search
        </span>
        <kbd className="pointer-events-none ml-auto inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          SUPER
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search all channels and members!" />
        <CommandList>
          <CommandEmpty>No Results Found!</CommandEmpty>
          {data.map(({ type, data, label }) => {
            if (!data?.length) return null

            return (
              <CommandGroup key={label} heading={label}>
                {data.map(({ id, icon, name }) => {
                  return (
                    <CommandItem
                      onSelect={() => onClick({ id, type })}
                      key={id}
                    >
                      {icon}
                      <span>{name}</span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            )
          })}
        </CommandList>
      </CommandDialog>
    </>
  )
}

export default ServerSearch
