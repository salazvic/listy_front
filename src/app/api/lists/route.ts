import { bffApi } from "@/lib/api.bff"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET() {
  const cookie = await cookies()
  const cookieStore = cookie
    .getAll()
    .map(c => `${c.name}=${c.value}`)
    .join('; ')

  const res = await bffApi.get('/lists', {
    headers: {
      Cookie: cookieStore.toString()
    }
  })
  return NextResponse.json(res.data)
}

export async function POST(req: Request) {
  const body = await req.json()
  const cookie = await cookies()
  const cookieStore = cookie
    .getAll()
    .map(c => `${c.name}=${c.value}`)
    .join('; ')

  const res = await  bffApi.post('/lists', body, {
    headers: {
      Cookie: cookieStore
    }
  })  

  return NextResponse.json(res.data, {status: 201})
}