import { Fira_Code } from 'next/font/google'
import { Inter as FontSans } from 'next/font/google'
import '../styles/globals.css'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code',
})

import { NetworkStatus } from '@/components/blockchain/network-status'
import { WalletConnect } from '@/components/blockchain/wallet-connect'
import { Metadata } from 'next'

import '@rainbow-me/rainbowkit/styles.css'
import { Menu } from '@/components/menu/Menu'
import { Providers } from '@/components/providers/root-provider'

export const metadata: Metadata = {
  title: 'UniGov Playground',
  description: 'UniGov Playground',
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${fontSans.variable} ${firaCode.variable}`} lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <div className="">
          <Menu />
        </div>
        <Providers>
          {' '}
          <NetworkStatus />
          {children}
          <div className="fixed bottom-6 right-6">
            <WalletConnect />
          </div>
        </Providers>
      </body>
    </html>
  )
}
