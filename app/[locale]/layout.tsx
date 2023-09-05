import { useLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { cn } from '@/lib/utils'

import '../globals.css'
import { Rubik, Noto_Sans_Arabic } from 'next/font/google'
import { getTranslator } from 'next-intl/server'

interface MetadataRootLayout {
  params: {
    locale: string
  }
}

interface LocaleLayoutProps {
  children: React.ReactNode
  params: {
    locale: string
  }
}

const rubic = Rubik({ subsets: ['latin'] })
const noto = Noto_Sans_Arabic({ subsets: ['arabic'] })

export async function generateMetadata({
  params: { locale },
}: MetadataRootLayout) {
  const t = await getTranslator(locale, 'RootLayout')

  return {
    title: t('sitename'),
  }
}

export default function RootLayout({ children, params }: LocaleLayoutProps) {
  const locale = useLocale()

  if (params.locale !== locale) {
    notFound()
  }

  return (
    <html lang={locale} dir={locale === 'fa' ? 'rtl' : 'ltr'}>
      <body className={cn(locale === 'fa' ? noto.className : rubic.className)}>
        {children}
      </body>
    </html>
  )
}
