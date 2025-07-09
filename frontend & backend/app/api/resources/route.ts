import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/resources - Get all resources or filter by type
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const courseId = searchParams.get('courseId')
    const pathId = searchParams.get('pathId')
    const moduleId = searchParams.get('moduleId')

    let whereClause: any = {}

    if (type) {
      whereClause.type = type
    }

    if (courseId) {
      whereClause.courseId = courseId
    }

    if (pathId) {
      whereClause.trainingPathId = pathId
    }

    if (moduleId) {
      whereClause.trainingModuleId = moduleId
    }

    const resources = await prisma.resource.findMany({
      where: whereClause,
      orderBy: {
        title: 'asc',
      },
    })

    return NextResponse.json(resources)
  } catch (error) {
    console.error('Error fetching resources:', error)
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    )
  }
}

// POST /api/resources - Create a new resource
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, type, url, courseId, pathId, moduleId } = body

    // Validate input
    if (!title || !type || !url) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check that at least one parent ID is provided
    if (!courseId && !pathId && !moduleId) {
      return NextResponse.json(
        { error: 'Resource must be associated with a course, path, or module' },
        { status: 400 }
      )
    }

    // Create resource
    const resource = await prisma.resource.create({
      data: {
        title,
        type,
        url,
        courseId: courseId || null,
        trainingPathId: pathId || null,
        trainingModuleId: moduleId || null,
      },
    })

    return NextResponse.json(resource, { status: 201 })
  } catch (error) {
    console.error('Error creating resource:', error)
    return NextResponse.json(
      { error: 'Failed to create resource' },
      { status: 500 }
    )
  }
}