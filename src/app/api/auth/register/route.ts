import { bffApi } from "@/lib/api.bff"

export async function POST(req: Request) {
  const body = await req.json()

  const { data } = await bffApi.post('/auth/register', body)

  return Response.json(data)  
}