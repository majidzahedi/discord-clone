import { Hash } from 'lucide-react'
import React from 'react'
interface ChatWelcomeProps {
  name: string
  type: 'channel' | 'conversation'
}

function ChatWelcome({ name, type }: ChatWelcomeProps) {
  return (
    <div className="mb-4 space-y-4 px-4">
      {type === 'channel' && (
        <div className="flex h-[75px] w-[75px] items-center justify-center rounded-full">
          <Hash className="h-12 w-12 text-white" />
        </div>
      )}
      <p>
        {type === 'channel' ? 'welcome to #' : ''}
        {name}
      </p>
      <p>
        {type === 'channel'
          ? `This is the start of #${name} channel`
          : `This is the start of your conversation with ${name}`}
      </p>
    </div>
  )
}

export default ChatWelcome
