import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { motion } from 'framer-motion'

import { Button } from '@/components/ui/button'

const successVariants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ease: 'backIn',
      duration: 0.6,
    },
  },
}
export function AlertDestructive() {
  return (
    <motion.section
      animate="visible"
      className=" relative flex w-full flex-col items-center justify-center gap-4  rounded-lg border border-destructive/50 px-16 py-3 text-center text-destructive dark:border-destructive md:gap-8 [&>svg]:text-destructive [&>svg]:text-foreground"
      initial="hidden"
      variants={successVariants}>
      <div>
        <ExclamationTriangleIcon className="h-24 w-24 self-center !text-red-700" />
        <h3 className="self-center text-xl font-bold">Heads Up!</h3>
      </div>
      <p className="text-md self-center text-center">
        UniGov is a proposal simulation module for governance that requires a wallet connection to function. Please connect your wallet to start
        interacting with the governance contract
      </p>
      <ConnectButton.Custom>
        {({ account, chain, openAccountModal, openChainModal, openConnectModal, authenticationStatus, mounted }) => {
          // Note: If your app doesn't use authentication, you
          // can remove all 'authenticationStatus' checks
          const ready = mounted && authenticationStatus !== 'loading'
          const connected = ready && account && chain && (!authenticationStatus || authenticationStatus === 'authenticated')

          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                style: {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
              className="self-center">
              {(() => {
                if (!connected) {
                  return (
                    <Button
                      className="self-center border-red-500 text-red-500 dark:border-red-500 dark:text-red-500"
                      type="button"
                      variant={'outline'}
                      onClick={openConnectModal}>
                      Connect Wallet
                    </Button>
                  )
                }

                if (chain.unsupported) {
                  return (
                    <Button type="button" variant={'destructive'} onClick={openChainModal}>
                      Wrong network
                    </Button>
                  )
                }

                return (
                  <div style={{ display: 'flex', gap: 12 }}>
                    <Button
                      type="button"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      onClick={openChainModal}>
                      {chain.hasIcon && (
                        <div
                          style={{
                            background: chain.iconBackground,
                            width: 12,
                            height: 12,
                            borderRadius: 999,
                            overflow: 'hidden',
                            marginRight: 4,
                          }}>
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? 'Chain icon'}
                              src={chain.iconUrl}
                              style={{
                                width: 12,
                                height: 12,
                              }}
                            />
                          )}
                        </div>
                      )}
                      {chain.name}
                    </Button>

                    <button type="button" onClick={openAccountModal}>
                      {account.displayName}
                      {account.displayBalance ? ` (${account.displayBalance})` : ''}
                    </button>
                  </div>
                )
              })()}
            </div>
          )
        }}
      </ConnectButton.Custom>
      {/* </div> */}
    </motion.section>
    // <motion.section
    //     className="w-full h-full flex flex-col items-center justify-center gap-4 md:gap-2 text-center"
    //     variants={successVariants}
    //     initial="hidden"
    //     animate="visible"
    // >
    //     <ExclamationTriangleIcon
    //         width="64"
    //         height="64"
    //         className="md:mb-4 text-red-800"
    //     />
    //     <h4 className="!text-2xl font-semibold text-slate-900 md:text-3xl">
    //         Heads up!
    //     </h4>
    //     <p className="text-md max-w-md text-neutral-700 md:text-base">
    //         UniGov is a proposal simulation module for governance and needs
    //         to be connected to a wallet.
    //     </p>
    //     <div className="flex items-center mt-6">
    //         <div className="relative after:pointer-events-none after:absolute after:inset-px after:rounded-[11px] after:shadow-input-shadow-light after:shadow-slate-300/10 focus-within:after:shadow-neutral-600 after:transition">
    //             <ConnectButton.Custom>
    //                 {({
    //                     account,
    //                     chain,
    //                     openAccountModal,
    //                     openChainModal,
    //                     openConnectModal,
    //                     authenticationStatus,
    //                     mounted,
    //                 }) => {
    //                     // Note: If your app doesn't use authentication, you
    //                     // can remove all 'authenticationStatus' checks
    //                     const ready =
    //                         mounted && authenticationStatus !== 'loading'
    //                     const connected =
    //                         ready &&
    //                         account &&
    //                         chain &&
    //                         (!authenticationStatus ||
    //                             authenticationStatus === 'authenticated')

    //                     return (
    //                         <div
    //                             {...(!ready && {
    //                                 'aria-hidden': true,
    //                                 style: {
    //                                     opacity: 0,
    //                                     pointerEvents: 'none',
    //                                     userSelect: 'none',
    //                                 },
    //                             })}
    //                             className="self-center"
    //                         >
    //                             {(() => {
    //                                 if (!connected) {
    //                                     return (
    //                                         <Button
    //                                             variant={'outline'}
    //                                             className="self-center  shadow-background"
    //                                             onClick={openConnectModal}
    //                                             type="button"
    //                                         >
    //                                             Connect Wallet
    //                                         </Button>
    //                                     )
    //                                 }

    //                                 if (chain.unsupported) {
    //                                     return (
    //                                         <Button
    //                                             variant={'destructive'}
    //                                             onClick={openChainModal}
    //                                             type="button"
    //                                         >
    //                                             Wrong network
    //                                         </Button>
    //                                     )
    //                                 }

    //                                 return (
    //                                     <div
    //                                         style={{
    //                                             display: 'flex',
    //                                             gap: 12,
    //                                         }}
    //                                     >
    //                                         <Button
    //                                             onClick={openChainModal}
    //                                             style={{
    //                                                 display: 'flex',
    //                                                 alignItems: 'center',
    //                                             }}
    //                                             type="button"
    //                                         >
    //                                             {chain.hasIcon && (
    //                                                 <div
    //                                                     style={{
    //                                                         background:
    //                                                             chain.iconBackground,
    //                                                         width: 12,
    //                                                         height: 12,
    //                                                         borderRadius: 999,
    //                                                         overflow:
    //                                                             'hidden',
    //                                                         marginRight: 4,
    //                                                     }}
    //                                                 >
    //                                                     {chain.iconUrl && (
    //                                                         <img
    //                                                             alt={
    //                                                                 chain.name ??
    //                                                                 'Chain icon'
    //                                                             }
    //                                                             src={
    //                                                                 chain.iconUrl
    //                                                             }
    //                                                             style={{
    //                                                                 width: 12,
    //                                                                 height: 12,
    //                                                             }}
    //                                                         />
    //                                                     )}
    //                                                 </div>
    //                                             )}
    //                                             {chain.name}
    //                                         </Button>

    //                                         <button
    //                                             onClick={openAccountModal}
    //                                             type="button"
    //                                         >
    //                                             {account.displayName}
    //                                             {account.displayBalance
    //                                                 ? ` (${account.displayBalance})`
    //                                                 : ''}
    //                                         </button>
    //                                     </div>
    //                                 )
    //                             })()}
    //                         </div>
    //                     )
    //                 }}
    //             </ConnectButton.Custom>
    //         </div>
    //     </div>
    // </motion.section>
  )
}

export default AlertDestructive
