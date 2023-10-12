import simulateNow from '@/simulation/test'

export async function POST(req: Request) {
  const body = await req.json()
  console.log('🚀 ~ file: route.tsx:80 ~ POST ~ body', body)
  const res2 = await simulateNow(body)
  return new Response(JSON.stringify(res2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
