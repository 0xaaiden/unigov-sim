// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Site
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

import { FormItems } from '@/lib/types/types'

export type GovernanceContract = {
  value: string
  token: `0x${string}`
  label: string
}
export const GOVERNANCE_CONTRACTS: GovernanceContract[] = [
  {
    value: '0x408ed6354d4973f66138c91495f2f2fcbd8724c3',
    token: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    label: 'Uniswap Governor Bravo (0x408ED...)',
  },
]

export const initialValues: FormItems = {
  walletAddress: '',
  proposalText: '**Proposal Description**',
  proposalTitle: 'Proposal Title',
  governanceContract: {
    value: '',
    token: '',
    label: '',
  },
  votesChecked: false,
  ethereumChecked: false,
  loggedInChecked: false,
}
