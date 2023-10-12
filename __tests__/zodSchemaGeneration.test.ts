// __tests__/zodSchemaGeneration.test.ts
import { generateZodSchemaForFunction } from '../lib/generateSchema' // Adjust the path accordingly

describe('Zod Schema Generation for a Single Function', () => {
  it('generates schema for balanceOf function', () => {
    const functionAbi = 'function balanceOf(address owner) view returns (uint256)'
    const schema = generateZodSchemaForFunction(functionAbi)

    const validationResult = schema['owner'].safeParse('0x1234567890123456789012345678901234567890')
    expect(validationResult.success).toBeTruthy()
    expect(validationResult.success ? validationResult.data : validationResult.error).toBe('0x1234567890123456789012345678901234567890')
  })

  // ... other tests

  it('handles bytes type correctly', () => {
    const functionAbi = 'function storeData(bytes32 data)'
    const schema = generateZodSchemaForFunction(functionAbi)

    const validationResult = schema['data'].safeParse('1234567890123456789012345678901234567890123456789012345678901234')
    expect(validationResult.success).toBeTruthy()
  })

  it('fails for incorrect bytes length', () => {
    const functionAbi = 'function storeData(bytes32 data)'
    const schema = generateZodSchemaForFunction(functionAbi)

    const validationResult = schema['data'].safeParse('0x12345678')
    expect(validationResult.success).toBeFalsy()
  })
})
