'use client'

import { useLocale } from 'next-intl'
import { Languages } from 'lucide-react'
import { usePathname } from 'next-intl/client'
import Link from 'next-intl/link'

import { Button } from '@/components/ui/button'

export const LanguageSwitcher = () => {
  const pathname = usePathname()
  const locale = useLocale()

  return (
    <Link href={pathname} locale={locale === 'fa' ? 'en' : 'fa'}>
      <Button size="icon" variant="link">
        <Languages />
      </Button>
    </Link>
  )
}
