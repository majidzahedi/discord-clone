import React from 'react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <React.Fragment>{children}</React.Fragment>
}
