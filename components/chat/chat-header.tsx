import { Hash } from 'lucide-react'
import MobileToggle from '../mobile-toggle'
import UserAvatar from '../user-avatar'
import SocketIndicator from '../socket-indicator'

interface ChatHeaderProps {
  serverId: string
  name: string
  type: 'channel' | 'conversation'
  imageUrl?: string
}

function ChatHeader({ serverId, name, type, imageUrl }: ChatHeaderProps) {
  return (
    <div className="text-md flex h-12 items-center border-b-2 border-neutral-200 px-3 font-semibold dark:border-neutral-800">
      <MobileToggle serverId={serverId} />
      {type === 'channel' && <Hash className="h-5 w-5 " />}
      {type === 'conversation' && (
        <UserAvatar src={imageUrl} className="mr-2 h-8 w-8 md:h-8 md:w-8" />
      )}
      <p className="text-md font-semibold">{name}</p>
      <div className="ml-auto flex items-center">
        <SocketIndicator />
      </div>
    </div>
  )
}

export default ChatHeader
