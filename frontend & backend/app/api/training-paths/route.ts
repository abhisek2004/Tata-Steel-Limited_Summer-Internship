import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/training-paths - Get all training paths
export async function GET(request: NextRequest) {
  try {
    const trainingPaths = await prisma.trainingPath.findMany({
      include: {
        resources: true,
        pathCourses: {
          include: {
            course: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    })

    // Transform the data to match the expected format in the frontend
    const transformedPaths = trainingPaths.map(path => ({
      name: path.name,
      slug: path.slug,
      modules: path.modules,
      duration: path.duration,
      description: path.description,
      objectives: JSON.parse(path.objectives),
      courses: path.pathCourses.map(pc => ({
        name: pc.course.title,
        icon: '📚', // Default icon
        courseId: pc.course.id,
      })),
      resources: path.resources.map(resource => ({
        name: resource.name,
        type: resource.type,
      })),
    }))

    return NextResponse.json(transformedPaths)
  } catch (error) {
    console.error('Error fetching training paths:', error)
    return NextResponse.json(
      { error: 'Failed to fetch training paths' },
      { status: 500 }
    )
  }
}

// POST /api/training-paths - Create a new training path
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      name,
      slug,
      description,
      modules,
      duration,
      objectives,
      courses,
      resources,
    } = body

    // Create the training path
    const trainingPath = await prisma.trainingPath.create({
      data: {
        name,
        slug,
        description,
        modules,
        duration,
        objectives: JSON.stringify(objectives),
        resources: {
          create: resources?.map((resource: { name: string; type: string }) => ({
            name: resource.name,
            type: resource.type,
          })) || [],
        },
      },
    })

    // Add courses to the path if provided
    if (courses && courses.length > 0) {
      for (let i = 0; i < courses.length; i++) {
        const course = courses[i]
        await prisma.pathCourse.create({
          data: {
            pathId: trainingPath.id,
            courseId: course.courseId,
            order: i + 1,
          },
        })
      }
    }

    // Fetch the created path with all related data
    const createdPath = await prisma.trainingPath.findUnique({
      where: { id: trainingPath.id },
      include: {
        resources: true,
        pathCourses: {
          include: {
            course: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    })

    // Transform the data to match the expected format in the frontend
    const transformedPath = {
      name: createdPath!.name,
      slug: createdPath!.slug,
      modules: createdPath!.modules,
      duration: createdPath!.duration,
      description: createdPath!.description,
      objectives: JSON.parse(createdPath!.objectives),
      courses: createdPath!.pathCourses.map(pc => ({
        name: pc.course.title,
        icon: '📚', // Default icon
        courseId: pc.course.id,
      })),
      resources: createdPath!.resources.map(resource => ({
        name: resource.name,
        type: resource.type,
      })),
    }

    return NextResponse.json(transformedPath, { status: 201 })
  } catch (error) {
    console.error('Error creating training path:', error)
    return NextResponse.json(
      { error: 'Failed to create training path' },
      { status: 500 }
    )
  }
}