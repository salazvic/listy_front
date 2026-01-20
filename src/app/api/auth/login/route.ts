import { bffApi } from "@/lib/api.bff";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const body = await req.json()

  const { data, headers } = await bffApi.post('/auth/login', body)

  const setCookie = headers['set-cookie']

  const response = Response.json(data)

  if(setCookie) {
    response.headers.set('set-cookie', setCookie[0])
  }

  return response
  
}