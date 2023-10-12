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
    value:
      process.env.NEXT_PUBLIC_GOVERNANCE_CONTRACT && process.env.NEXT_PUBLIC_GOVERNANCE_CONTRACT !== ''
        ? process.env.NEXT_PUBLIC_GOVERNANCE_CONTRACT
        : undefined,
    token:
      process.env.NEXT_PUBLIC_GOVERNANCE_TOKEN && process.env.NEXT_PUBLIC_GOVERNANCE_TOKEN !== ''
        ? process.env.NEXT_PUBLIC_GOVERNANCE_TOKEN
        : undefined,
    label:
      process.env.NEXT_PUBLIC_GOVERNANCE_LABEL && process.env.NEXT_PUBLIC_GOVERNANCE_LABEL !== ''
        ? process.env.NEXT_PUBLIC_GOVERNANCE_LABEL
        : undefined,
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
