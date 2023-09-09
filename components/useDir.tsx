'use client'

import { useLocale } from 'next-intl'

function useDir() {
  const locale = useLocale()
  return locale === 'fa' ? 'rtl' : 'ltr' || 'ltr'
}

export default useDir
