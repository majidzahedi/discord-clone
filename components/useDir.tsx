'use client'

import { Direction } from '@radix-ui/react-dropdown-menu'
import { useLocale } from 'next-intl'

function useDir(): Direction {
  const locale = useLocale()
  const dir = locale === 'fa' ? 'rtl' : 'ltr'

  return dir
}

export default useDir
