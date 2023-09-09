'use client'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { Github } from 'lucide-react'
import { LottieComp } from '@/components/lottie'
import { signIn } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function AuthenticationPage() {
  const t = useTranslations('Pages.login')

  return (
    <div className="container relative h-full flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white rtl:order-1 dark:border-r lg:flex">
        <div className="absolute inset-0 bg-green-800" />
        <div className="relative z-20 m-auto">
          <LottieComp.login />
        </div>
      </div>
      <div className="lg:p-8">
        <div className="flex flex-col items-center">
          <Button onClick={() => signIn('github')}>
            <Github className="ml-auto rtl:mr-auto" />
            <span className="ml-2 rtl:mr-2">{t('githubLogin')}</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
