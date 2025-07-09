import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/courses/completed - Get all completed courses for a user
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

    // Get all completed courses for the user
    const completedCourses = await prisma.courseProgress.findMany({
      where: {
        userId,
        status: 'Completed',
      },
      include: {
        course: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    // Get certificates for these courses
    const certificates = await prisma.certificate.findMany({
      where: {
        userId,
        course: {
          in: completedCourses.map(cp => cp.courseId),
        },
      },
    });

    // Map certificates to their respective courses
    const coursesWithCertificates = completedCourses.map(cp => {
      const certificate = certificates.find(cert => cert.course === cp.courseId)
      
      return {
        id: cp.course.id,
        title: cp.course.title,
        description: cp.course.description,
        category: cp.course.category,
        level: cp.course.level,
        completedAt: cp.updatedAt.toISOString(),
        certificate: certificate ? {
          id: certificate.id,
          certificateId: certificate.certificateId,
          issuedAt: certificate.issuedAt.toISOString(),
        } : null,
      }
    })

    return NextResponse.json(coursesWithCertificates)
  } catch (error) {
    console.error('Error fetching completed courses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch completed courses' },
      { status: 500 }
    )
  }
}