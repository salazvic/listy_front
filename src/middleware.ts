import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value
  const { pathname } = req.nextUrl
console.log("entrando a middleware")
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register')
  const isProtectedRoute = pathname.startsWith('/lists')

  // NO logueado → ruta protegida
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', req.url))
    console.log(" NO logueado → ruta protegida")
  }

  // Logueado → auth pages
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/lists', req.url))
    console.log("Logueado → auth pages")
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/lists/:path*', '/login', '/register'],
}
