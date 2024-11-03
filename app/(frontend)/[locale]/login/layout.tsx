import { getServerSession } from 'next-auth'
import { getTranslator } from 'next-intl/server'
import { redirect } from 'next/navigation'

interface MetadataRootLayout {
  params: {
    locale: string
  }
}

export async function generateMetadata({
  params: { locale },
}: MetadataRootLayout) {
  const t = await getTranslator(locale, 'Pages.login.meta')

  return {
    title: t('siteName'),
  }
}

interface LoginLayout {
  children: React.ReactNode
}

export default async function LoginLayout({ children }: LoginLayout) {
  const session = await getServerSession()

  if (session) {
    redirect('/')
  }

  return <>{children}</>
}
