'use client'
import { NextIntlProvider } from 'next-intl'
import { notFound } from 'next/navigation'

interface Props {
  children: React.ReactNode
  locale: string
}

const IntlProvider = async ({ children, locale }: Props) => {
  let messages
  try {
    messages = (await import(`../../messages/${locale}.json`)).default
  } catch (error) {
    notFound()
  }

  return (
    <NextIntlProvider locale={locale} messages={messages}>
      {children}
    </NextIntlProvider>
  )
}

export default IntlProvider
