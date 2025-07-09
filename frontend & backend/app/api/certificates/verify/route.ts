import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/certificates/verify - Verify a certificate by its ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const certificateId = searchParams.get('certificateId')

    if (!certificateId) {
      return NextResponse.json(
        { error: 'Certificate ID is required' },
        { status: 400 }
      )
    }

    const certificate = await prisma.certificate.findFirst({
      where: {
        certificateId,
      },
      include: {
        course: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
          },
        },
      },
    })

    if (!certificate) {
      return NextResponse.json(
        { 
          valid: false,
          message: 'Certificate not found' 
        },
        { status: 404 }
      )
    }

    // Transform the data to match the expected format in the frontend
    const verificationResult = {
      valid: true,
      certificate: {
        id: certificate.id,
        certificateId: certificate.certificateId,
        courseTitle: certificate.course.title,
        userName: certificate.user.name,
        userDepartment: certificate.user.department,
        issuedAt: certificate.issuedAt.toISOString(),
      },
    }

    return NextResponse.json(verificationResult)
  } catch (error) {
    console.error('Error verifying certificate:', error)
    return NextResponse.json(
      { 
        valid: false,
        message: 'Failed to verify certificate' 
      },
      { status: 500 }
    )
  }
}