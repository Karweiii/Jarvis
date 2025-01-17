import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// Paths that don't require authentication
const publicPaths = ['/', '/login', '/register','/courses']
const dynamicPublicPaths = ['/courses/[id]']
const staticAssetPaths = [
  '/_next/static', 
  '/_next/image', 
  '/favicon.ico', 
  '/public/',
  '/Foambg.svg'  // Explicitly allow Foambg.svg
]

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // More comprehensive static asset and public path handling
  if (
    publicPaths.includes(path) || 
    staticAssetPaths.some(asset => path.startsWith(asset)) ||
    path.endsWith('.svg')  // Allow all SVG files
  ) {
    return NextResponse.next()
  }

  if (dynamicPublicPaths.some(publicPath => 
    path.startsWith(publicPath.replace('[id]', ''))
  )) {
    return NextResponse.next()
  }

  const token = request.cookies.get('token')?.value

  // If on login page without a token, allow access
  if (path === '/login' && !token) {
    return NextResponse.next()
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET))
    return NextResponse.next()
  } catch (error) {
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('token')
    return response
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}