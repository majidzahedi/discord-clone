'use client'

import React from 'react'
import UserNav from './user-avatar'

function Sidebar() {
  return (
    <div className="flex w-[62px] flex-col items-center justify-end space-y-4 bg-accent py-4 ">
      <UserNav />
    </div>
  )
}

export default Sidebar
