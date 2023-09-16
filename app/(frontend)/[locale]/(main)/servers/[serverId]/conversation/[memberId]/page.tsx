import React from 'react'

interface channelParams {
  params: {
    memberId: string
    serverId: string
  }
}

function Channel({ params }: channelParams) {
  return <div>{params.memberId}</div>
}

export default Channel
