import { checkDecodeCalldata } from './check-decode-calldata'
import { checkLogs } from './check-logs'
import { checkStateChanges } from './check-state-changes'
import { checkTargetsVerifiedEtherscan } from './check-targets-verified-etherscan'
import { ProposalCheck } from '../types'

const ALL_CHECKS: {
  [checkId: string]: ProposalCheck
} = {
  checkStateChanges,
  checkDecodeCalldata,
  checkLogs,
  checkTargetsVerifiedEtherscan,
}

export default ALL_CHECKS
