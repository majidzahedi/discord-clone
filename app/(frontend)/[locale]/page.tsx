import { useTranslations } from 'next-intl'

export default function Index() {
  const t = useTranslations('Pages.main')
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-y-5 ">
      <h1 className="text-3xl font-bold">{t('title')}</h1>
      <p className="max-w-2xl">{t('description')}</p>
    </div>
  )
}
