import { GovernanceContract } from '@/config/site'
import { generateSimulationConfig } from '@/simulation'

export type tags = {
  uuid: string
  value: string
  address: string
  contractAbi: any[]
  function: string
  params: {
    name: string
    value: string
  }[]
}[]

export type tag = {
  uuid: string
  value: string
  address: string
  contractAbi: any[]
  function: string
  params: {
    name: string
    value: string
  }[]
}
export type ABIStatus = 'idle' | 'loading' | 'success' | 'error'
export type FormItems = {
  walletAddress: string
  proposalText: string
  proposalTitle: string
  governanceContract: GovernanceContract
  votesChecked: boolean
  ethereumChecked: boolean
  loggedInChecked: boolean
}

export type SimulationConfig = ReturnType<typeof generateSimulationConfig>
