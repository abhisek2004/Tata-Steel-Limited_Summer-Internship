import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { verifyToken } from './lib/auth-utils'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Define public paths that don't require authentication
  const isPublicPath = [
    '/',
    '/about',
    '/login',
    '/register',
    '/api/auth',
    '/images',
    '/_next',
    '/favicon.ico',
  ].some(publicPath => 
    path === publicPath || 
    path.startsWith(`${publicPath}/`)
  )

  // Check if the path is for static files or images
  const isStaticFile = [
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.svg',
    '.ico',
    '.css',
    '.js',
  ].some(ext => path.endsWith(ext))

  // Check if the path is for API certificate verification (public)
  const isCertificateVerification = path.startsWith('/api/certificates/verify')

  // Allow public paths, static files, and certificate verification without authentication
  if (isPublicPath || isStaticFile || isCertificateVerification) {
    return NextResponse.next()
  }

  // First try to get NextAuth token (for browser sessions)
  const nextAuthToken = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // If NextAuth token exists, proceed with it
  if (nextAuthToken) {
    // Check for admin-only routes with NextAuth token
    if (isAdminRoute(path) && nextAuthToken.role !== 'admin') {
      return handleUnauthorizedAccess(path, request, 'Admin access required', 403)
    }
    
    return NextResponse.next()
  }
  
  // If no NextAuth token, check for JWT token in Authorization header (for API requests)
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1]
      const decodedToken = await verifyToken(token)
        
      // Check for admin-only routes with JWT token
      if (isAdminRoute(path) && decodedToken.role !== 'admin') {
        return handleUnauthorizedAccess(path, request, 'Admin access required', 403)
      }
      
      return NextResponse.next()
    } catch (error) {
      // Invalid JWT token
      return handleUnauthorizedAccess(path, request, 'Invalid authentication token', 401)
    }
  }
  
  // No valid token found
  return handleUnauthorizedAccess(path, request, 'Authentication required', 401)
}

/**
 * Check if the path is an admin-only route
 * @param path URL path to check
 * @returns Boolean indicating if the path is admin-only
 */
function isAdminRoute(path: string): boolean {
  const adminPaths = [
    '/admin',
    '/training-reports',
    '/api/analytics',
    '/api/reports',
  ]
  
  return adminPaths.some(adminPath => 
    path === adminPath || 
    path.startsWith(`${adminPath}/`)
  )
}

/**
 * Handle unauthorized access to protected routes
 * @param path URL path that was accessed
 * @param request Original request
 * @param message Error message
 * @param status HTTP status code
 * @returns NextResponse with appropriate redirect or error
 */
function handleUnauthorizedAccess(
  path: string, 
  request: NextRequest, 
  message: string = 'Authentication required',
  status: number = 401
): NextResponse {
  // For API routes, return error status
  if (path.startsWith('/api/')) {
    return new NextResponse(
      JSON.stringify({ error: message }),
      { 
        status,
        headers: { 'content-type': 'application/json' }
      }
    )
  }
  
  // For page routes with 401, redirect to login
  if (status === 401) {
    const url = new URL('/login', request.url)
    url.searchParams.set('callbackUrl', encodeURI(request.url))
    console.log('Redirecting unauthorized access to login with callback:', request.url)
    return NextResponse.redirect(url)
  }
  
  // For page routes with 403 (forbidden), redirect to dashboard
  return NextResponse.redirect(new URL('/dashboard', request.url))
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|images/).*)',
  ],
}