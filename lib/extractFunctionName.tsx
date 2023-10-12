// const abi = Abi.parse(erc20Abi);
export function extractFunctionName(value: string): string {
  const match = value.match(/function\s+(\w+)\s*\(/)
  return match ? match[1] : ''
}
