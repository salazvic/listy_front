import { bffApi } from "@/lib/api.bff";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies()

  try {
    const { data } = await bffApi.get('/auth/me', {
      headers: {
        cookie: cookieStore.toString()
      }
    })

    return Response.json(data)
  } catch (error) {
    return new Response(null, {status: 401})
  }
}