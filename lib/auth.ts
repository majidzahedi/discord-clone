import { AuthOptions } from 'next-auth'

import GithubProvider from 'next-auth/providers/github'

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? 'Client_id',
      clientSecret: process.env.GITHUB_SECRET ?? 'secretId',
    }),
  ],
}
