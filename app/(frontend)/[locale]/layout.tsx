import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import { cn } from '@/lib/utils'

import '@/styles/globals.css'
import { Rubik, Noto_Sans_Arabic, Vazirmatn } from 'next/font/google'
import { getTranslator } from 'next-intl/server'
import Provider from '@/components/providers/session-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import ModalProvider from '@/components/providers/modal-provider'
import { SocketProvider } from '@/components/providers/socket-provider'
import { QueryProvider } from '@/components/providers/query-provider'

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
const noto = Vazirmatn({ subsets: ['arabic'] })

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
    <html
      lang={locale}
      dir={locale === 'fa' ? 'rtl' : 'ltr'}
      suppressHydrationWarning
    >
      <body className={cn(locale === 'fa' ? noto.className : rubic.className)}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Provider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <SocketProvider>
                <ModalProvider />
                <QueryProvider>{children}</QueryProvider>
              </SocketProvider>
            </ThemeProvider>
          </Provider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
