import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  //const token = req.cookies.get('access_token')?.value
  const authHeader = req.headers.get('authorization') || ''
  const token = authHeader.replace('Bearer ', '')
  
  const { pathname } = req.nextUrl
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register')
  const isProtectedRoute = pathname.startsWith('/lists')

  console.log("Entrado a middleware")
  console.log("token middleware:", token)

  // NO logueado → ruta protegida
  if (!token && isProtectedRoute) {
    console.log(" NO logueado → ruta protegida")
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Logueado → auth pages
  if (token && isAuthRoute) {
    console.log("Logueado → auth pages")
    return NextResponse.redirect(new URL('/lists', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/lists/:path*', '/login', '/register'],
}
