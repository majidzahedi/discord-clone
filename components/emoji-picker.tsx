'use client'
import { Smile } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import { useTheme } from 'next-themes'
import { useLocale } from 'next-intl'

interface EmojiPickerProps {
  onChange: (value: string) => void
}

function EmojiPicker({ onChange }: EmojiPickerProps) {
  const { resolvedTheme } = useTheme()
  const locale = useLocale()
  return (
    <Popover>
      <PopoverTrigger>
        <Smile className="" />
      </PopoverTrigger>
      <PopoverContent
        side="right"
        sideOffset={40}
        className="mb-16 border-none bg-transparent shadow-none drop-shadow-none"
      >
        <Picker
          locale={locale}
          theme={resolvedTheme}
          data={data}
          onEmojiSelect={(emoji: any) => onChange(emoji.native)}
        />
      </PopoverContent>
    </Popover>
  )
}

export default EmojiPicker
