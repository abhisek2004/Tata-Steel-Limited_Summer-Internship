import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/certificates - Get certificates for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const certificates = await prisma.certificate.findMany({
      where: {
        userId,
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
      orderBy: {
        issuedAt: 'desc',
      },
    })

    // Transform the data to match the expected format in the frontend
    const transformedCertificates = certificates.map(cert => ({
      id: cert.id,
      userId: cert.userId,
      courseId: cert.courseId,
      courseTitle: cert.course.title,
      userName: cert.user.name,
      userEmail: cert.user.email,
      userDepartment: cert.user.department,
      issuedAt: cert.issuedAt.toISOString(),
      certificateId: cert.certificateId,
    }))

    return NextResponse.json(transformedCertificates)
  } catch (error) {
    console.error('Error fetching certificates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch certificates' },
      { status: 500 }
    )
  }
}

// POST /api/certificates - Create a new certificate
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, courseId } = body

    // Validate input
    if (!userId || !courseId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    // Check if certificate already exists
    const existingCertificate = await prisma.certificate.findFirst({
      where: {
        userId,
        courseId,
      },
    })

    if (existingCertificate) {
      return NextResponse.json(
        { error: 'Certificate already exists for this user and course' },
        { status: 400 }
      )
    }

    // Check if course is completed
    const courseProgress = await prisma.courseProgress.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    })

    if (!courseProgress || courseProgress.progress < 100 || courseProgress.status !== 'Completed') {
      return NextResponse.json(
        { error: 'Course must be completed before issuing a certificate' },
        { status: 400 }
      )
    }

    // Generate a unique certificate ID
    const certificateId = `CERT-${Date.now()}-${Math.floor(Math.random() * 1000)}`

    // Create certificate
    const certificate = await prisma.certificate.create({
      data: {
        userId,
        courseId,
        certificateId,
        issuedAt: new Date(),
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

    // Transform the data to match the expected format in the frontend
    const transformedCertificate = {
      id: certificate.id,
      userId: certificate.userId,
      courseId: certificate.courseId,
      courseTitle: certificate.course.title,
      userName: certificate.user.name,
      userEmail: certificate.user.email,
      userDepartment: certificate.user.department,
      issuedAt: certificate.issuedAt.toISOString(),
      certificateId: certificate.certificateId,
    }

    return NextResponse.json(transformedCertificate, { status: 201 })
  } catch (error) {
    console.error('Error creating certificate:', error)
    return NextResponse.json(
      { error: 'Failed to create certificate' },
      { status: 500 }
    )
  }
}