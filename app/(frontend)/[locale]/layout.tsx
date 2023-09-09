import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import { cn } from '@/lib/utils'

import '@/styles/globals.css'
import { Rubik, Noto_Sans_Arabic } from 'next/font/google'
import { getTranslator } from 'next-intl/server'
import Provider from '@/components/providers/session-provider'

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
  const t = await getTranslator(locale, 'Pages.main.meta')

  return {
    title: t('siteName'),
  }
}

export default async function RootLayout({
  children,
  params,
}: LocaleLayoutProps) {
  let messages
  const { locale } = params
  try {
    messages = (await import(`@/messages/${locale}.json`)).default
  } catch (error) {
    notFound()
  }

  return (
    <html lang={locale} dir={locale === 'fa' ? 'rtl' : 'ltr'}>
      <body className={cn(locale === 'fa' ? noto.className : rubic.className)}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Provider>{children}</Provider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
