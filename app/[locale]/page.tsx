import { LanguageSwitcher } from '@/components/language-switcher'
import { useTranslations } from 'next-intl'
import UserAvatar from '@/components/user-avatar'

export default function Index() {
  const t = useTranslations('Index')
  return (
    <div className="flex h-full flex-col items-center justify-center gap-y-5 bg-gradient-to-tr from-blue-200 to-purple-200 text-gray-900">
      <div className="fixed left-5 top-5">
        <UserAvatar />
      </div>
      <h1 className="text-3xl font-bold">{t('title')}</h1>
      <p className="max-w-2xl">{t('description')}</p>
      <div className="fixed right-5 top-5">
        <LanguageSwitcher />
      </div>
    </div>
  )
}
