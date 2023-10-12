import { SimulationConfigNew } from '@/simulation/types'

export const callLongWaitingApi = async (input: SimulationConfigNew) => {
  const response = await fetch('/api/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })
  const data = await response.json()
  return data
}
