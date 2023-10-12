'use client'

import '@rainbow-me/rainbowkit/styles.css'

import { ReactNode } from 'react'

import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit'
import { WagmiConfig, configureChains, createConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'

import { chains as chains2, webSocketPublicClient } from '@/config/networks'
// import { useColorMode } from "@/lib/state/color-mode"
const { chains, publicClient } = configureChains(chains2, [publicProvider()])
const { connectors } = getDefaultWallets({
  appName: 'kk',
  projectId: '9ab74ccaf6e1f4491e65c329a26070d9',
  chains,
})

const projectId = '9ab74ccaf6e1f4491e65c329a26070d9'

const wagmiConfig = createConfig({
  autoConnect: true,

  connectors,
  publicClient,
  webSocketPublicClient,
})

export function RainbowKit({ children }: { children: ReactNode }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
    </WagmiConfig>
  )
}
