import { redirect } from "next/navigation";

export default async function Home() {
 const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    credentials: "include",
    cache: "no-store",
  });

  console.log("RES homePage:", res)
  if (res.ok) {
    redirect('/lists');
  }

  redirect('/login');
}
