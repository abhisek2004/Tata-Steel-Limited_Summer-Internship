import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/dashboard - Get dashboard data for a user
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

    // Get user
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        department: true,
        role: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get course progress
    const courseProgress = await prisma.courseProgress.findMany({
      where: {
        userId,
      },
      include: {
        course: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: 5,
    })

    // Get path progress
    const pathProgress = await prisma.pathProgress.findMany({
      where: {
        userId,
      },
      include: {
        path: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: 5,
    })

    // Get certificates
    const certificates = await prisma.certificate.findMany({
      where: {
        userId,
      },
      include: {
        course: true,
      },
      orderBy: {
        issuedAt: 'desc',
      },
      take: 5,
    })

    // Get upcoming events
    const now = new Date()
    const upcomingEvents = await prisma.event.findMany({
      where: {
        date: {
          gte: now,
        },
      },
      include: {
        registrations: {
          where: {
            userId,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
      take: 5,
    })

    // Calculate statistics
    const totalCourses = await prisma.course.count()
    const completedCourses = await prisma.courseProgress.count({
      where: {
        userId,
        status: 'Completed',
      },
    })

    const totalPaths = await prisma.trainingPath.count()
    const completedPaths = await prisma.pathProgress.count({
      where: {
        userId,
        status: 'Completed',
      },
    })

    const totalCertificates = await prisma.certificate.count({
      where: {
        userId,
      },
    })

    const totalEvents = await prisma.eventRegistration.count({
      where: {
        userId,
      },
    })

    // Transform the data to match the expected format in the frontend
    const dashboardData = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        department: user.department,
        role: user.role,
      },
      recentCourses: courseProgress.map(cp => ({
        id: cp.course.id,
        title: cp.course.title,
        progress: cp.progress,
        status: cp.status,
        updatedAt: cp.updatedAt.toISOString(),
      })),
      recentPaths: pathProgress.map(pp => ({
        id: pp.path.id,
        name: pp.path.name,
        slug: pp.path.slug,
        progress: pp.progress,
        status: pp.status,
        updatedAt: pp.updatedAt.toISOString(),
      })),
      recentCertificates: certificates.map(cert => ({
        id: cert.id,
        courseTitle: cert.course.title,
        certificateId: cert.certificateId,
        issuedAt: cert.issuedAt.toISOString(),
      })),
      upcomingEvents: upcomingEvents.map(event => ({
        id: event.id,
        title: event.title,
        date: event.date.toISOString(),
        location: event.location,
        isRegistered: event.registrations.length > 0,
      })),
      stats: {
        coursesCompleted: completedCourses,
        totalCourses,
        courseCompletionRate: totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0,
        pathsCompleted: completedPaths,
        totalPaths,
        pathCompletionRate: totalPaths > 0 ? Math.round((completedPaths / totalPaths) * 100) : 0,
        certificatesEarned: totalCertificates,
        eventsAttended: totalEvents,
      },
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}