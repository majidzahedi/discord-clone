import { LanguageSwitcher } from '@/components/language-switcher'
import { useTranslations } from 'next-intl'

export default function Index() {
  const t = useTranslations('Index')
  return (
    <div className="flex h-full flex-col items-center justify-center gap-y-5 bg-gradient-to-tr from-blue-200 to-purple-200 text-gray-900">
      <h1 className="text-3xl font-bold">{t('title')}</h1>
      <p className="max-w-2xl text-justify">{t('description')}</p>
      <LanguageSwitcher />
    </div>
  )
}
