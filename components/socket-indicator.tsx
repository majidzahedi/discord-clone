'use client'

import { useSocket } from '@/components/providers/socket-provider'
import { Badge } from './ui/badge'

function SocketIndicator() {
  const { isConnected } = useSocket()

  if (!isConnected) {
    return (
      <Badge className="border-none bg-yellow-500 text-white">
        Fallback: Pooling every 1 second
      </Badge>
    )
  }

  return (
    <Badge className="border-none bg-emerald-500 text-white">
      Live: Real-time updates
    </Badge>
  )
}

export default SocketIndicator
