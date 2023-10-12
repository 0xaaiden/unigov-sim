import simulateNow from '@/simulation/test'

export async function GET(req: Request) {
  return new Response(JSON.stringify({ hello: 'world' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function POST(req: Request) {
  const body = await req.json()
  const res2 = await simulateNow(body)
  return new Response(JSON.stringify(res2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
