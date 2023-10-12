// zodMappings.ts
import { z } from 'zod'

const ethereumAddress = z.string().refine((address) => address.startsWith('0x') && address.length === 42, {
  message: 'Invalid Ethereum address',
})

const bytesType = (M: number) =>
  z.string().refine(
    (str) => {
      if (!str.startsWith('0x')) {
        return false
      }
      const hexStr = str.slice(2)
      return hexStr.length === M * 2
    },
    `bytes${M} should be ${M * 2} characters long with 0x prefix`
  )

const uintType = (M: number) =>
  z
    .any()
    .transform((value) => {
      try {
        return BigInt(value)
      } catch (error) {
        return value
      }
    })
    .pipe(z.bigint())
    .transform((value) => value.toString())

const intType = (M: number) =>
  z
    .any()
    .transform((value) => {
      try {
        return BigInt(value)
      } catch (error) {
        return value
      }
    })
    .pipe(
      z
        .bigint()
        .min(BigInt(-1) * BigInt(2 ** (M - 1)), `int${M} should be greater than or equal to ${-1 * 2 ** (M - 1)}`)
        .max(BigInt(2 ** (M - 1)) - BigInt(1), `int${M} should be less than or equal to ${2 ** (M - 1) - 1}`)
    )
    .transform((value) => value.toString())

const fixedType = (M: number, N: number) => z.coerce.number()
const ufixedType = (M: number, N: number) => z.coerce.number().min(0)

export const elementaryTypeToZod = (type: string) => {
  if (type === 'address') return ethereumAddress
  if (type === 'bool') return z.boolean()
  if (type === 'function') return z.string().length(24, 'Function type should be 24 characters long')

  let match

  match = type.match(/^bytes(\d+)$/)
  if (match) {
    console.log(`Matched ${match[0]}`)
    return bytesType(Number(match[1]))
  }

  match = type.match(/^uint(\d+)$/)
  if (match) {
    console.log(`Matched ${match[0]}`)
    return uintType(Number(match[1]))
  }

  match = type.match(/^int(\d+)$/)
  if (match) {
    console.log(`Matched ${match[0]}`)
    return intType(Number(match[1]))
  }

  match = type.match(/^fixed(\d+)x(\d+)$/)
  if (match) {
    console.log(`Matched ${match[0]}`)
    return fixedType(Number(match[1]), Number(match[2]))
  }

  match = type.match(/^ufixed(\d+)x(\d+)$/)
  if (match) {
    console.log(`Matched ${match[0]}`)
    return ufixedType(Number(match[1]), Number(match[2]))
  }

  console.log(`No match found for ${type}`)
  return z.unknown()
}
