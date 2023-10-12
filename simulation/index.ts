import { Interface } from '@ethersproject/abi'
import { BigNumberish } from '@ethersproject/bignumber'

import { tags } from '@/lib/types/types'

import { SimulationConfigNew } from './types'

interface SimulationConfigProps {
  tags: tags
  governanceContract: string
  proposalText: string
  proposalTitle: string
}

export function generateSimulationConfig({ tags, governanceContract, proposalText, proposalTitle }: SimulationConfigProps): SimulationConfigNew {
  const targets: string[] = []
  const values: BigNumberish[] = []
  const signatures: string[] = []
  const calldatas: string[] = []

  tags.forEach((tag) => {
    const contractABI = tag.contractAbi
    const contractInterface = new Interface(contractABI)
    const calldata = contractInterface.encodeFunctionData(
      tag.function,
      tag.params.map((p) => p.value)
    )

    targets.push(tag.address)
    values.push(0)
    signatures.push('')
    calldatas.push(calldata)
  })

  return {
    type: 'new',
    daoName: 'Uniswap',
    governorType: 'bravo',
    governorAddress: governanceContract, // placeholder; replace with actual address
    targets,
    values,
    signatures,
    calldatas,
    description: proposalTitle + proposalText,
  }
}
