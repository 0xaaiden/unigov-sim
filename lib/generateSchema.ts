import { z } from 'zod'

import { elementaryTypeToZod } from './mapping/zod-mapping'

const getDescriptionAndPlaceholder = (type: string) => {
  switch (type) {
    case 'address':
      return {
        description: "An Ethereum address starting with '0x'.",
        placeholder: '0x1234...5678',
        required: true,
      }
    case 'uint':
    case 'int':
    case 'uint256':
    case 'int256':
      return {
        description: 'An integer value.',
        placeholder: '123456789..',
        required: true,
      }
    case 'bool':
      return {
        description: 'A boolean value (true or false).',
        placeholder: 'True or False',
        required: true,
      }
    case 'bytes32':
      return {
        description: 'A bytes32 hex value.',
        placeholder: '0x1234...5678',
        required: true,
      }
    // Add other types as needed
    default:
      return {
        description: `A value of type ${type}.`,
        placeholder: '',
        required: true,
      }
  }
}

export const generateZodSchemaForFunction = (functionAbi: string) => {
  if (!functionAbi.startsWith('function')) {
    throw new Error("Invalid ABI: Expected a 'function' ABI string" + functionAbi)
  }

  const paramsSection = functionAbi.match(/\(([^)]*)\)/)?.[1]
  if (paramsSection === '') {
    return {
      zodSchema: z.object({}),
      fieldConfig: {},
    }
  }
  if (!paramsSection) {
    throw new Error("Invalid ABI: Couldn't extract function parameters")
  }

  const params = paramsSection.split(',').map((param) => param.trim())
  const zodSchemaShape: Record<string, z.ZodTypeAny> = {}
  const fieldConfig: Record<string, any> = {}

  params.forEach((param) => {
    const [type, name] = param.split(' ').map((p) => p.trim())
    zodSchemaShape[name] = elementaryTypeToZod(type)
    const { description, placeholder, required = true } = getDescriptionAndPlaceholder(type)
    fieldConfig[name] = {
      description,
      inputProps: {
        placeholder,
        required,
      },
    }
  })
  return { zodSchema: z.object(zodSchemaShape), fieldConfig }
}
