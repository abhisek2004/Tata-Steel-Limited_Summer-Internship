import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/progress/course - Get course progress for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const courseId = searchParams.get('courseId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    let query: any = {
      where: {
        userId,
      },
      include: {
        course: true,
      },
    }

    // If courseId is provided, filter by courseId
    if (courseId) {
      query.where.courseId = courseId
    }

    const progress = await prisma.courseProgress.findMany(query)

    // Transform the data to match the expected format in the frontend
    const transformedProgress = progress.map(p => ({
      courseId: p.courseId,
      courseTitle: p.course.title,
      progress: p.progress,
      status: p.status,
      startedAt: p.startedAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }))

    return NextResponse.json(transformedProgress)
  } catch (error) {
    console.error('Error fetching course progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch course progress' },
      { status: 500 }
    )
  }
}

// POST /api/progress/course - Update course progress for a user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, courseId, progress, status } = body

    // Validate input
    if (!userId || !courseId || progress === undefined) {
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

    // Check if progress record exists
    const existingProgress = await prisma.courseProgress.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    })

    let updatedProgress

    if (existingProgress) {
      // Update existing progress
      updatedProgress = await prisma.courseProgress.update({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
        data: {
          progress,
          status: status || existingProgress.status,
        },
        include: {
          course: true,
        },
      })
    } else {
      // Create new progress record
      updatedProgress = await prisma.courseProgress.create({
        data: {
          userId,
          courseId,
          progress,
          status: status || 'In Progress',
        },
        include: {
          course: true,
        },
      })
    }

    // If progress is 100%, update status to Completed
    if (progress === 100 && updatedProgress.status !== 'Completed') {
      updatedProgress = await prisma.courseProgress.update({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
        data: {
          status: 'Completed',
        },
        include: {
          course: true,
        },
      })
    }

    // Transform the data to match the expected format in the frontend
    const transformedProgress = {
      courseId: updatedProgress.courseId,
      courseTitle: updatedProgress.course.title,
      progress: updatedProgress.progress,
      status: updatedProgress.status,
      startedAt: updatedProgress.startedAt.toISOString(),
      updatedAt: updatedProgress.updatedAt.toISOString(),
    }

    return NextResponse.json(transformedProgress)
  } catch (error) {
    console.error('Error updating course progress:', error)
    return NextResponse.json(
      { error: 'Failed to update course progress' },
      { status: 500 }
    )
  }
}