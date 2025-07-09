import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

type JWTPayload = {
  id: string
  email: string
  role?: string
  department?: string
  iat: number
  exp: number
}

/**
 * Verify JWT token from request headers
 * @param request NextRequest object
 * @returns Decoded token payload or null if invalid
 */
export function verifyToken(request: NextRequest): JWTPayload | null {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    // Extract token
    const token = authHeader.split(' ')[1]
    if (!token) {
      return null
    }

    // Verify token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'fallback-secret-key'
    ) as JWTPayload

    return decoded
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

/**
 * Check if user has required role
 * @param decoded JWT payload
 * @param requiredRole Required role
 * @returns Boolean indicating if user has required role
 */
export function hasRole(decoded: JWTPayload | null, requiredRole: string): boolean {
  if (!decoded || !decoded.role) {
    return false
  }
  
  // Admin has access to everything
  if (decoded.role === 'admin') {
    return true
  }
  
  return decoded.role === requiredRole
}

/**
 * Create an unauthorized response
 * @param message Error message
 * @returns NextResponse with 401 status
 */
export function unauthorizedResponse(message = 'Unauthorized'): NextResponse {
  return NextResponse.json(
    { error: message },
    { status: 401 }
  )
}

/**
 * Create a forbidden response
 * @param message Error message
 * @returns NextResponse with 403 status
 */
export function forbiddenResponse(message = 'Forbidden'): NextResponse {
  return NextResponse.json(
    { error: message },
    { status: 403 }
  )
}