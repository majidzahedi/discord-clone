'use client'

import { Plus } from 'lucide-react'
import ActionTooltip from '../action-tooltip'

export function NavigationAction() {
  return (
    <div>
      <ActionTooltip side="right" align="center" label="Add Server">
        <button className="group flex items-center">
          <div className="m-3 flex h-[48px] w-[48px] items-center justify-center overflow-hidden rounded-[24px] bg-background transition-all duration-300 group-hover:rounded-[16px] group-hover:bg-emerald-500">
            <Plus
              className="text-emerald-500 transition group-hover:text-white"
              size={25}
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  )
}