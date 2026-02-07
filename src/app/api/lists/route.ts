import { bffApi } from "@/lib/api.bff"
import { bffServerRequest } from "@/lib/bffServerRequest"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const data = await bffServerRequest(async cookie => {
      const res = await bffApi.get('/lists', {
        headers: {Cookie: cookie}
      })
      return res.data
    })
  return NextResponse.json(data)
  } catch (error) {
    return new NextResponse(null, { status: 401 })
  }
}

export async function POST(req: Request) {
  const body = await req.json()
  const data = await bffServerRequest(async cookie => {
    const res = await  bffApi.post('/lists', body, {
      headers: {
        Cookie: cookie
      }
    })  
    return res.data
  })

  return NextResponse.json(data, {status: 201})
}