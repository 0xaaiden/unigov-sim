/**
 * @notice Entry point for executing a single proposal against a forked mainnet
 */
import fs from 'fs'

import dotenv from 'dotenv'
dotenv.config({
  path: `../.env`,
})
import { Contract } from 'ethers'

import ALL_CHECKS from './checks'
import {
  AllCheckResults,
  GovernorType,
  SimulationConfig,
  //   SimulationConfigBase,
  SimulationData,
} from './types'
import { provider } from './utils/clients/ethers'
import { simulate } from './utils/clients/tenderly'
// import ALL_CHECKS from "./checks";
// import { generateAndSaveReports } from "./presentation/report";
import { formatProposalId, getGovernor, getTimelock, inferGovernorType } from './utils/contracts/governor'

// import { generateAndSaveReports } from "./presentation/report";

/**
 * @notice Simulate governance proposals and run proposal checks against them
 */

export default async function simulateNow(config2: SimulationConfig) {
  // --- Run simulations ---
  // Prepare array to store all simulation outputs
  const simOutputs: SimulationData[] = []

  let governor: Contract
  let governorType: GovernorType

  const config: SimulationConfig = config2

  const { sim, proposal, latestBlock } = await simulate(config)
  simOutputs.push({ sim, proposal, latestBlock, config })

  governorType = await inferGovernorType(config.governorAddress)
  governor = await getGovernor(governorType, config.governorAddress)

  // --- Run proposal checks and save output ---
  // Generate the proposal data and dependencies needed by checks
  const proposalData = {
    governor,
    provider,
    timelock: await getTimelock(governorType, governor.address),
  }

  console.log('Starting proposal checks and report generation...')
  let checkResults: AllCheckResults = {}
  for (const simOutput of simOutputs) {
    // Run checks
    const { sim, proposal, latestBlock, config } = simOutput
    console.log(`  Running for proposal ID ${formatProposalId(governorType, proposal.id!)}...`)
    checkResults = Object.fromEntries(
      await Promise.all(
        Object.keys(ALL_CHECKS).map(async (checkId) => [
          checkId,
          {
            name: ALL_CHECKS[checkId].name,
            result: await ALL_CHECKS[checkId].checkProposal(proposal, sim, proposalData),
          },
        ])
      )
    )
    console.log('checkResults', checkResults)

    // Generate markdown report.
    const [startBlock, endBlock] = await Promise.all([
      proposal.startBlock.toNumber() <= latestBlock.number ? provider.getBlock(proposal.startBlock.toNumber()) : null,
      proposal.endBlock.toNumber() <= latestBlock.number ? provider.getBlock(proposal.endBlock.toNumber()) : null,
    ])

    // save checkResults to file
    const dir = `./simulation/reports/${config.daoName}/${config.governorAddress}`
    const filename = `./simulation/reports/${config.daoName}/${config.governorAddress}/checkResults.json`
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(filename, JSON.stringify(checkResults, null, 2))
  }
  console.log('Done!', checkResults)
  return checkResults
}
