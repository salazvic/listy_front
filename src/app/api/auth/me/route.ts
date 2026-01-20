import { bffApi } from "@/lib/api.bff";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const { data } = await bffApi.get('/auth/me', {
      headers: {
        cookie: cookies.toString()
      }
    })

    return Response.json(data)
  } catch (error) {
    return new Response(null, {status: 401})
  }
}