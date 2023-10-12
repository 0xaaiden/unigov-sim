import { useEffect } from 'react'

import { useAccount, useContractRead, useNetwork } from 'wagmi'

import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { GOVERNANCE_CONTRACTS, GovernanceContract } from '@/config/site'
import { UNI_ABI } from '@/lib/abis/UNI'
import { FormItems } from '@/lib/types/types'

import FormWrapper from '../FormWrapper'

const GovernanceContractSelect = ({
  errors,
  setGovContract,
}: {
  errors: Record<string, string>
  setGovContract: (govContact: GovernanceContract) => void
  contract: GovernanceContract
}) => (
  <div className="flex flex-col gap-2">
    <Label htmlFor="governanceContract">Governance Contract</Label>
    <Select
      required
      onValueChange={(value) => {
        const selectedContract = GOVERNANCE_CONTRACTS.find((contract) => contract.value === value)
        if (selectedContract) setGovContract(selectedContract)
      }}>
      <SelectTrigger className="">
        <SelectValue placeholder="Select a contract" />
      </SelectTrigger>
      <SelectContent>
        {GOVERNANCE_CONTRACTS.map((contract) => (
          <SelectItem
            key={contract.value}
            value={contract.value}
            // onChange={() => setGovContract(contract)}
          >
            {contract.label}
          </SelectItem>
        ))}
      </SelectContent>
      <p className="text-[0.8rem] text-muted-foreground">Please select a governance contract from the list.</p>
    </Select>
    {errors.governanceContract && <p className="text-sm text-red-500">{errors.governanceContract}</p>}
  </div>
)

const WalletDetails = ({ walletAddress }: { walletAddress: string }) => (
  <div className="flex flex-col gap-2">
    <Label htmlFor="walletAddress">Connected Wallet Address</Label>
    <Input disabled id="walletAddress" name="walletAddress" type="text" value={walletAddress}></Input>
    <p className="text-[0.8rem] text-muted-foreground">Please connect your wallet to interact with the governance contract.</p>
  </div>
)

const EligibilitySection = ({
  govContract,
  walletAddress,
  errors,
  hasWalletConnected,
  isOnEthereum,
}: {
  govContract: GovernanceContract
  walletAddress: string
  errors: Record<string, string>
  hasWalletConnected: boolean
  isOnEthereum: boolean
}) => {
  const {
    data: govData,
    isError,
    isLoading,
  } = useContractRead({
    abi: UNI_ABI,
    address: govContract ? govContract.token : '',
    functionName: 'getCurrentVotes',
    args: [walletAddress],
  })

  // tokens has 18 decimals, compare using BigInt
  const hasVotingPower = govData && BigInt(govData as bigint) >= BigInt('2500000000000000000000000')
  return (
    <div className="mt-4 flex flex-col gap-4">
      <CheckboxWithCondition
        condition={hasWalletConnected}
        description="You must connect your wallet."
        id="walletConnected"
        label="Wallet Connected"
      />
      <CheckboxWithCondition
        condition={isOnEthereum}
        description="Your wallet must be connected to Ethereum."
        id="onEthereum"
        label="Connected to Ethereum"
      />
      {errors.loggedInChecked && <p className="text-sm text-red-500">{errors.loggedInChecked}</p>}
      {hasVotingPower !== undefined ? (
        <CheckboxWithCondition
          condition={hasVotingPower ? true : false}
          description="You don't have enough voting power. You haven't reached the proposal threshold of 2.5M. In most cases, you must get others to delegate to you before creating a proposal."
          id="votingPower"
          label="Voting Power"
        />
      ) : (
        <div className="max-w-lg animate-pulse space-y-2.5" role="status">
          <div className="mb-3 h-2.5 w-48 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="mb-2.5 h-2 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="mb-2.5 h-2 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        </div>
      )}
    </div>
  )
}

const CheckboxWithCondition = ({ id, condition, label, description }: { id: string; condition: boolean; label: string; description: string }) => (
  <div className="items-top flex space-x-2">
    <Checkbox disabled checked={condition} id={id} />
    <div className="grid gap-1.5 leading-none">
      <label
        htmlFor={id}
        className={`text-sm font-medium leading-none ${
          condition ? '' : 'text-orange-600 opacity-70'
        } peer-disabled:cursor-not-allowed peer-disabled:opacity-70`}>
        {label}
      </label>
      <p className={`text-sm ${condition ? '' : 'text-orange-600 opacity-70'} text-muted-foreground`}>{description}</p>
    </div>
  </div>
)
type GovernanceFormProps = {
  formData: FormItems
  errors: Record<string, string>
  updateForm: (fieldToUpdate: Partial<FormItems>) => void
}

const ContractSelectionForm = ({ formData, errors, updateForm }: GovernanceFormProps) => {
  const { address, isConnected } = useAccount()
  const network = useNetwork().chain
  const hasWalletConnected = !!address && isConnected
  console.log('🚀 ~ file: ContractSelectionForm.tsx:182 ~ hasWalletConnected:', hasWalletConnected)
  const isOnEthereum = network?.id === 1
  console.log('🚀 ~ file: ContractSelectionForm.tsx:183 ~ isOnEthereum:', isOnEthereum)

  useEffect(() => {
    updateForm({
      walletAddress: address,
      loggedInChecked: hasWalletConnected,
      ethereumChecked: isOnEthereum,
    })
    console.log('effect', formData)
  }, [address, hasWalletConnected, isOnEthereum])

  const handleSetGovContract = (contract: GovernanceContract) => {
    updateForm({
      governanceContract: contract,
      loggedInChecked: hasWalletConnected,
      ethereumChecked: isOnEthereum,

      // You can add any other fields from the contract that need to be set in formData here
    })
  }

  return (
    <FormWrapper description="Please select the Governance Contract you wish to interact with." title="Governance Contract Selection">
      <div className="flex w-full flex-col gap-2">
        <GovernanceContractSelect contract={formData.governanceContract} errors={errors} setGovContract={handleSetGovContract} />
        <WalletDetails walletAddress={formData.walletAddress || ''} />

        {address && (
          <EligibilitySection
            errors={errors}
            govContract={formData.governanceContract}
            hasWalletConnected={hasWalletConnected}
            isOnEthereum={isOnEthereum}
            walletAddress={address}
          />
        )}
      </div>
    </FormWrapper>
  )
}

export default ContractSelectionForm
