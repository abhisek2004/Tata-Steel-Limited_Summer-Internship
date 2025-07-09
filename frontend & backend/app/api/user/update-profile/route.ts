import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'

// Schema for validation
const updateProfileSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  department: z.string().optional(),
  phone: z.string().optional(),
  userId: z.string().optional(), // For client-side API calls
})

// PUT /api/user/update-profile - Update user profile
export async function PUT(request: NextRequest) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    
    // Validate input
    const result = updateProfileSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      )
    }
    
    const { name, department, phone, userId } = result.data
    
    // Update user
    const updatedUser = await prisma.user.update({
      where: {
        id: userId || session.user.id,
      },
      data: {
        name,
        department: department || undefined,
        phone: phone || undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        department: true,
        role: true,
        phone: true,
        updatedAt: true,
      },
    })
    
    return NextResponse.json(
      { 
        message: 'Profile updated successfully',
        user: updatedUser
      }, 
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

// POST /api/user/update-profile - Update user profile (client-side API call)
export async function POST(request: NextRequest) {
  return PUT(request);
}