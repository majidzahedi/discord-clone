'use client'

import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next-intl/client'
import { useTheme } from 'next-themes'
import { useSession, signOut, signIn } from 'next-auth/react'
import { cn } from '@/lib/utils'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import useDir from '@/components/useDir'
import { themes } from '@/components/constants/themes'
import { languages } from '@/components/constants/languages'

export default function UserNav() {
  const { data: session } = useSession()

  const t = useTranslations('Components.user-avatar')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  const { theme, setTheme } = useTheme()

  const switchLocale = (value: string) => {
    router.push(pathname, { locale: value })
  }
  const dir = useDir()

  if (!session) {
    return (
      <Button onClick={() => signIn()} variant="link">
        {t('login')}
      </Button>
    )
  }

  return (
    <DropdownMenu dir={dir}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn('relative ', 'h-[48px] w-[48px] rounded-full')}
        >
          <Avatar className="h-[48px] w-[48px]">
            <AvatarImage src={session?.user?.image ?? ''} alt="" />
            <AvatarFallback>
              <p className="font-bold capitalize">
                {session?.user?.name ? session.user.name[0] : 'SC'}
              </p>
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        align="end"
        forceMount
        side="left"
        sideOffset={24}
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session?.user?.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session?.user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            {t('profile')}
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              {t('themes.default')}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                  {themes.map((theme, index) => (
                    <DropdownMenuRadioItem key={index} value={theme.value}>
                      {t(theme.label)}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              {t('languages.default')}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={locale}
                  onValueChange={switchLocale}
                >
                  {languages.map((language, index) => (
                    <DropdownMenuRadioItem key={index} value={language.value}>
                      {t(language.label)}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut()}
          className="text-destructive"
        >
          {t('logOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
