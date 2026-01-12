import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Home() {
  const cookiesStore = await cookies()

  const hasAcces = cookiesStore.has('access_token')
  console.log("cookie en layout principal:", hasAcces)

  if(hasAcces) {
    redirect('/lists')
  }
  redirect('/login')
}
