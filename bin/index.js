#!/usr/bin/env node

import inquirer from 'inquirer'
import chalk from 'chalk'
import ora from 'ora'
import { execSync } from 'child_process'
import fs from 'fs'

async function main() {
  console.log(chalk.green('Welcome to Unigov-Sim Setup!'))

  const questions = [
    {
      type: 'input',
      name: 'directoryName',
      message: 'Name of the directory:',
      default: 'unigov-sim-directory',
    },
    {
      type: 'input',
      name: 'contractAddress',
      message: 'Enter the governance contract address:',
      default: '0x408ed6354d4973f66138c91495f2f2fcbd8724c3',
    },
    {
      type: 'input',
      name: 'contractName',
      default: 'Uniswap Governor Bravo',
      message: 'Enter the governance contract name:',
    },
    {
      type: 'input',
      name: 'etherscanAPIKey',
      message: 'Enter your ETHERSCAN_API_KEY:',
      validate: (value) => value.trim() !== '' || 'This field cannot be blank!',
    },
    {
      type: 'input',
      name: 'tenderlyAccessToken',
      message: 'Enter your TENDERLY_ACCESS_TOKEN:',
      validate: (value) => value.trim() !== '' || 'This field cannot be blank!',
    },
    {
      type: 'input',
      name: 'tenderlyUser',
      message: 'Enter your TENDERLY_USER:',
      validate: (value) => value.trim() !== '' || 'This field cannot be blank!',
    },
    {
      type: 'input',
      name: 'tenderlyProjectSlug',
      message: 'Enter your TENDERLY_PROJECT_SLUG:',
      validate: (value) => value.trim() !== '' || 'This field cannot be blank!',
    },
  ]

  const answers = await inquirer.prompt(questions)

  const spinner = ora(chalk.yellow('Fetching necessary files...')).start()
  try {
    execSync(`git clone https://github.com/zpqrtbnk/test-repo.git ${answers.directoryName}`)
    spinner.succeed(chalk.green('Files fetched successfully!'))
  } catch (error) {
    spinner.fail(chalk.red('Failed to fetch files. Please check your internet connection.'))
    process.exit(1) // Exit the script with an error code
  }

  const installSpinner = ora(chalk.yellow('Installing dependencies...')).start()
  try {
    execSync(`cd ${answers.directoryName} && npm install`)
    installSpinner.succeed(chalk.green('Dependencies installed successfully!'))
  } catch (error) {
    installSpinner.fail(chalk.red('Failed to install dependencies. Please check your internet connection.'))
    process.exit(1) // Exit the script with an error code
  }

  // Create .env after fetching files
  const envContent = `
ETHERSCAN_API_KEY=${answers.etherscanAPIKey}
RPC_URL=https://eth.llamarpc.com
TENDERLY_ACCESS_TOKEN=${answers.tenderlyAccessToken}
TENDERLY_USER=${answers.tenderlyUser}
TENDERLY_PROJECT_SLUG=${answers.tenderlyProjectSlug}
`
  fs.writeFileSync(`${answers.directoryName}/.env`, envContent.trim())

  // End with a nicely formatted success message
  console.log(chalk.blue(`Setup complete in directory: ${answers.directoryName}`))
  console.log(`
    ${chalk.greenBright('Success!')}
    You can now spin up your own instance of unigov-sim by navigating to the directory and running:
    ${chalk.yellow('cd ' + answers.directoryName)}
    ${chalk.yellow('npm run dev')}
  `)
}

main()
