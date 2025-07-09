import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/progress/path - Get path progress for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const pathId = searchParams.get('pathId')

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
        path: true,
      },
    }

    // If pathId is provided, filter by pathId
    if (pathId) {
      query.where.pathId = pathId
    }

    const progress = await prisma.pathProgress.findMany(query)

    // Transform the data to match the expected format in the frontend
    const transformedProgress = progress.map(p => ({
      pathId: p.pathId,
      pathName: p.path.name,
      pathSlug: p.path.slug,
      progress: p.progress,
      status: p.status,
      startedAt: p.startedAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }))

    return NextResponse.json(transformedProgress)
  } catch (error) {
    console.error('Error fetching path progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch path progress' },
      { status: 500 }
    )
  }
}

// POST /api/progress/path - Update path progress for a user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, pathId, progress, status } = body

    // Validate input
    if (!userId || !pathId || progress === undefined) {
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

    // Check if path exists
    const path = await prisma.trainingPath.findUnique({
      where: { id: pathId },
    })

    if (!path) {
      return NextResponse.json(
        { error: 'Training path not found' },
        { status: 404 }
      )
    }

    // Check if progress record exists
    const existingProgress = await prisma.pathProgress.findUnique({
      where: {
        userId_pathId: {
          userId,
          pathId,
        },
      },
    })

    let updatedProgress

    if (existingProgress) {
      // Update existing progress
      updatedProgress = await prisma.pathProgress.update({
        where: {
          userId_pathId: {
            userId,
            pathId,
          },
        },
        data: {
          progress,
          status: status || existingProgress.status,
        },
        include: {
          path: true,
        },
      })
    } else {
      // Create new progress record
      updatedProgress = await prisma.pathProgress.create({
        data: {
          userId,
          pathId,
          progress,
          status: status || 'In Progress',
        },
        include: {
          path: true,
        },
      })
    }

    // If progress is 100%, update status to Completed
    if (progress === 100 && updatedProgress.status !== 'Completed') {
      updatedProgress = await prisma.pathProgress.update({
        where: {
          userId_pathId: {
            userId,
            pathId,
          },
        },
        data: {
          status: 'Completed',
        },
        include: {
          path: true,
        },
      })
    }

    // Transform the data to match the expected format in the frontend
    const transformedProgress = {
      pathId: updatedProgress.pathId,
      pathName: updatedProgress.path.name,
      pathSlug: updatedProgress.path.slug,
      progress: updatedProgress.progress,
      status: updatedProgress.status,
      startedAt: updatedProgress.startedAt.toISOString(),
      updatedAt: updatedProgress.updatedAt.toISOString(),
    }

    return NextResponse.json(transformedProgress)
  } catch (error) {
    console.error('Error updating path progress:', error)
    return NextResponse.json(
      { error: 'Failed to update path progress' },
      { status: 500 }
    )
  }
}