'use client'
import Link from 'next-intl/link'

import { useLocale } from 'next-intl'

import { usePathname } from 'next/navigation'

export const LanguageSwitcher = (props: {}) => {
  const pathname = usePathname()
  const locale = useLocale()

  return (
    <Link href={pathname} locale={locale === 'fa' ? 'en' : 'fa'}>
      LanguageSwitcher
    </Link>
  )
}
