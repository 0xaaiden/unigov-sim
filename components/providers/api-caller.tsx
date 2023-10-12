import { callLongWaitingApi } from '@/lib/api'
import { SimulationConfigNew } from '@/simulation/types'

async function ApiCaller(input: SimulationConfigNew) {
  const result = callLongWaitingApi(input)
  return result
}

export default ApiCaller
