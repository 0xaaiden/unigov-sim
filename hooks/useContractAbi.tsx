interface ContractABI {
  inputs: any[]
  name: string
  outputs: any[]
  stateMutability: string
  type: string
}

type ContractABIType = ContractABI[]
type ContractAddressType = string

export async function getContractABI(contractAddress: ContractAddressType): Promise<ContractABIType> {
  const response = await fetch(`https://abidata.net/${contractAddress}`)
  const json = await response.json()
  return json.abi as ContractABIType
}
