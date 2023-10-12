'use client'

// External and package imports
import { useLayoutEffect, useRef } from 'react'

import { useMediaQuery } from 'react-responsive'
import { Rnd } from 'react-rnd'

import { IsWalletConnected } from '@/components/blockchain/is-wallet-connected'
import { IsWalletDisconnected } from '@/components/blockchain/is-wallet-disconnected'
import AlertDestructive from '@/components/formsteps/FormUnavailable'

import Dashboard from './dashboard/page'
import { BottomRightHandle } from '../components/ui/BottomRightHandle'

const containerStyles = {
  width: '100vw',
  height: '100vh',
}

export default function Home() {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 600px)' })

  const refContainer = useRef<HTMLDivElement>(null)
  const refChild = useRef<HTMLDivElement>(null)
  const rndRef = useRef<Rnd>(null)

  const defaultSize = isTabletOrMobile ? { width: '95%', height: '95%' } : { width: '85%', height: '85%' }

  useLayoutEffect(() => {
    rndRef.current?.updatePosition({ x: 0, y: 0 })
  }, [])

  return (
    <div ref={refContainer} className="bg-polka pb-20 md:pb-40 flex items-center justify-center" style={containerStyles}>
      <Rnd
        ref={rndRef}
        disableDragging
        bounds={'parent'}
        enableUserSelectHack={true}
        resizeHandleComponent={{ bottomRight: <BottomRightHandle /> }}
        default={{
          y: 0,
          x: 0,
          ...defaultSize,
        }}
        style={{
          position: 'relative',
          // top: '0%',
          // left: '0%',
        }}>
        <div
          ref={refChild}
          className={`relative m-1 flex h-full max-w-full justify-between rounded-lg border border-neutral-300 bg-white p-4`} // Changed colors
        >
          <IsWalletConnected>
            <Dashboard />
          </IsWalletConnected>
          <IsWalletDisconnected>
            <AlertDestructive />
          </IsWalletDisconnected>
        </div>
      </Rnd>
    </div>
  )
}
