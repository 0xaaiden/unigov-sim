import { motion } from 'framer-motion'
import { Download, RefreshCcw, Send } from 'lucide-react'
import Image from 'next/image'
import { useContractWrite, useWaitForTransaction } from 'wagmi'

import { BlockExplorerLink } from '@/components/blockchain/block-explorer-link'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { GOVERNOR_BRAVO_ABI } from '@/lib/abis/governorBravo'
import { FormItems, SimulationConfig } from '@/lib/types/types'
import { downloadConfigAsJson } from '@/lib/utils'
import successIcon from '@/public/assets/success.png'
import { BaseError } from 'viem'

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
const SuccessMessage = ({ configSim, formData }: { configSim: SimulationConfig; formData: FormItems }) => {
  const refresh = () => window.location.reload()

  const { data, isLoading, isSuccess, error, isError, write } = useContractWrite({
    abi: GOVERNOR_BRAVO_ABI,
    address: formData.governanceContract.value as `0x${string}`,
    functionName: 'propose',
  })
  const { isLoading: isLoadingWait, isSuccess: isSuccessWait } = useWaitForTransaction({
    hash: data?.hash,
  })
  const sendTx = async () => {
    write({
      args: [configSim.targets, configSim.values, configSim.signatures, configSim.calldatas, configSim.description],
    })
  }

  return (
    <motion.section
      animate="visible"
      className="flex h-full w-full flex-col items-center justify-center gap-4 text-center md:gap-2"
      initial="hidden"
      variants={successVariants}>
      <Image alt="Success Icon" className="md:mb-4" height="150" src={successIcon} width="150" />
      <h4 className="text-2xl font-semibold text-slate-900 md:text-3xl">Simulation Completed!</h4>
      <p className="max-w-md text-sm text-neutral-700 md:text-base">
        Congratulations! Your proposal simulation has been executed successfully. You can now submit your proposal or perform more comprehensive
        simulations using <a href="https://github.com/Uniswap/governance-seatbelt/tree/main">governance-seatbelt</a>.
      </p>
      <div className="mt-6 flex items-center">
        <div className="after:shadow-input-shadow-light relative col-auto flex gap-3 after:pointer-events-none after:absolute after:inset-px after:rounded-[11px] after:shadow-slate-300/10 after:transition focus-within:after:shadow-neutral-600">
          <Button
            className="shadow-input-shadow-light relative rounded-xl border border-neutral-300 bg-neutral-200 text-neutral-900 shadow-neutral-300/10 hover:text-slate-800"
            variant={'secondary'}
            onClick={() => downloadConfigAsJson(configSim, 'config.json')}>
            <Download className="mr-2 h-4 w-4" /> Download Seatbelt Config
          </Button>
          <Button
            className="shadow-input-shadow-light relative rounded-xl border border-neutral-300 bg-neutral-200 text-neutral-900 shadow-neutral-300/10 "
            disabled={isError}
            variant={'secondary'}
            onClick={sendTx}>
            <Send className="mr-2 h-4 w-4" /> Submit Proposal
          </Button>
        </div>
      </div>
      <div className="mx-6 overflow-x-clip">
        {isError ? (
          <ScrollArea className="ml-4 mt-4 h-20 overflow-y-scroll font-mono text-sm text-red-800">{(error as BaseError)?.shortMessage}</ScrollArea>
        ) : (
          <></>
        )}
        {isSuccessWait ? (
          <ScrollArea className="h-20vh ml-4 mt-4 overflow-y-scroll font-mono text-sm text-black ">
            Transaction submitted!
            <BlockExplorerLink showExplorerName address={data?.hash} type="tx" />
            <span className="ml-2">
              <RefreshCcw className="h-4 w-4" onClick={refresh} />
              Refresh
            </span>
          </ScrollArea>
        ) : (
          <></>
        )}
        {isLoadingWait ? (
          <ScrollArea className="h-20vh ml-4 overflow-y-scroll font-mono text-sm text-black ">
            Waiting for transaction to be mined...
            <BlockExplorerLink showExplorerName address={data?.hash} type="tx" />
            <span className="ml-2">
              <RefreshCcw className="h-4 w-4" onClick={refresh} />
              Refresh
            </span>
          </ScrollArea>
        ) : (
          <></>
        )}
      </div>
    </motion.section>
  )
}

export default SuccessMessage
