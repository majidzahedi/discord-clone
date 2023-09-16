import React from 'react'

interface channelParams {
  channelId: string
  serverId: string
}

function Channel({ params }: channelParams) {
  return <div>{params.channelId}</div>
}

export default Channel
