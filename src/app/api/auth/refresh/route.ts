import { bffApi } from '@/lib/api.bff'
import { bffServerRequest } from '@/lib/bffServerRequest'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // IMPORTANTE: reenviar cookies
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
 