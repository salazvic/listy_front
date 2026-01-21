import { bffApi } from "@/lib/api.bff";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json()

  const { data } = await bffApi.post('/auth/login', body)

  const res = NextResponse.json({ ok: true })

console.log("resp login:", res)
  res.cookies.set('access_token', data.access.accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
  })

  res.cookies.set('refresh_token', data.access.refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
  })

  return res
}