import { NextRequest } from 'next/server'
import { withAuth } from 'next-auth/middleware'
import createIntlMiddleware from 'next-intl/middleware'

const locales = ['fa', 'en']
// BUG: route '/' is not protected ???
const publicPages = [
  '/login',
  // (/secret requires auth)
]

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: 'fa',
})

const authMiddleware = withAuth(
  // Note that this callback is only invoked if
  // the `authorized` callback has returned `true`
  // and not for pages listed in `pages`.
  (req) => intlMiddleware(req),
  {
    callbacks: {
      authorized: ({ token }) => token != null,
    },
    pages: {
      signIn: '/login',
    },
  }
)

export default function middleware(req: NextRequest) {
  const publicPathnameRegex = RegExp(
    `^(/(${locales.join('|')}))?(${publicPages.join('|')})?/?$`,
    'i'
  )
  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname)

  if (isPublicPage) {
    // @ts-ignore
    return intlMiddleware(req)
  } else {
    return (authMiddleware as any)(req)
  }
}

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
