import { bffApi } from "@/lib/api.bff";
import { cookies } from "next/headers";

export async function POST() {
  const { headers } = await bffApi.post(
    '/auth/refresh',
    {},
    {
      headers: {
        cookie: (await cookies()).toString()
      }
    }
  )

  const response = new Response(null, {status: 204})

  const setCookie = headers['set-cookie']
  if(setCookie) {
    response.headers.set('set-cookie', setCookie[0])
  }

  return response
}