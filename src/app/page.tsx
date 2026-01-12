import { redirect } from "next/navigation";

export default async function Home() {
 const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    credentials: "include",
    cache: "no-store",
  });

  if (res.ok) {
    redirect('/lists');
  }

  redirect('/login');
}
