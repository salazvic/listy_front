import { bffApi } from "@/lib/api.bff"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET() {
  const cookieStore = await cookies()
  const res = await bffApi.get('/lists', {
    headers: {
      Cookie: cookieStore.toString()
    }
  })
  return NextResponse.json(res.data)
}

export async function POST(req: Request) {
  const body = await req.json()

  const res = await  bffApi.post('/lists', body)  

  return NextResponse.json(res.data, {status: 201})
}