import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/training-paths/[slug] - Get a specific training path by slug
export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params

    const trainingPath = await prisma.trainingPath.findUnique({
      where: { slug },
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

    if (!trainingPath) {
      return NextResponse.json(
        { error: 'Training path not found' },
        { status: 404 }
      )
    }

    // Transform the data to match the expected format in the frontend
    const transformedPath = {
      name: trainingPath.name,
      slug: trainingPath.slug,
      modules: trainingPath.modules,
      duration: trainingPath.duration,
      description: trainingPath.description,
      objectives: JSON.parse(trainingPath.objectives),
      courses: trainingPath.pathCourses.map(pc => ({
        name: pc.course.title,
        icon: '📚', // Default icon
        courseId: pc.course.id,
      })),
      resources: trainingPath.resources.map(resource => ({
        name: resource.name,
        type: resource.type,
      })),
    }

    return NextResponse.json(transformedPath)
  } catch (error) {
    console.error(`Error fetching training path ${params.slug}:`, error)
    return NextResponse.json(
      { error: 'Failed to fetch training path' },
      { status: 500 }
    )
  }
}

// PUT /api/training-paths/[slug] - Update a training path
export async function PUT(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params
    const body = await request.json()

    const {
      name,
      description,
      modules,
      duration,
      objectives,
      courses,
      resources,
    } = body

    // Check if training path exists
    const existingPath = await prisma.trainingPath.findUnique({
      where: { slug },
    })

    if (!existingPath) {
      return NextResponse.json(
        { error: 'Training path not found' },
        { status: 404 }
      )
    }

    // Update training path
    const updatedPath = await prisma.trainingPath.update({
      where: { slug },
      data: {
        name,
        description,
        modules,
        duration,
        objectives: JSON.stringify(objectives),
      },
    })

    // Update resources if provided
    if (resources) {
      // Delete existing resources
      await prisma.resource.deleteMany({
        where: { pathId: updatedPath.id },
      })

      // Create new resources
      for (const resource of resources) {
        await prisma.resource.create({
          data: {
            name: resource.name,
            type: resource.type,
            pathId: updatedPath.id,
          },
        })
      }
    }

    // Update courses if provided
    if (courses) {
      // Delete existing path courses
      await prisma.pathCourse.deleteMany({
        where: { pathId: updatedPath.id },
      })

      // Create new path courses
      for (let i = 0; i < courses.length; i++) {
        const course = courses[i]
        await prisma.pathCourse.create({
          data: {
            pathId: updatedPath.id,
            courseId: course.courseId,
            order: i + 1,
          },
        })
      }
    }

    // Fetch updated path with all related data
    const pathWithRelations = await prisma.trainingPath.findUnique({
      where: { id: updatedPath.id },
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
      name: pathWithRelations!.name,
      slug: pathWithRelations!.slug,
      modules: pathWithRelations!.modules,
      duration: pathWithRelations!.duration,
      description: pathWithRelations!.description,
      objectives: JSON.parse(pathWithRelations!.objectives),
      courses: pathWithRelations!.pathCourses.map(pc => ({
        name: pc.course.title,
        icon: '📚', // Default icon
        courseId: pc.course.id,
      })),
      resources: pathWithRelations!.resources.map(resource => ({
        name: resource.name,
        type: resource.type,
      })),
    }

    return NextResponse.json(transformedPath)
  } catch (error) {
    console.error(`Error updating training path ${params.slug}:`, error)
    return NextResponse.json(
      { error: 'Failed to update training path' },
      { status: 500 }
    )
  }
}

// DELETE /api/training-paths/[slug] - Delete a training path
export async function DELETE(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params

    // Check if training path exists
    const existingPath = await prisma.trainingPath.findUnique({
      where: { slug },
    })

    if (!existingPath) {
      return NextResponse.json(
        { error: 'Training path not found' },
        { status: 404 }
      )
    }

    // Delete training path (resources and path courses will be deleted automatically due to cascade delete)
    await prisma.trainingPath.delete({
      where: { slug },
    })

    return NextResponse.json({ message: 'Training path deleted successfully' })
  } catch (error) {
    console.error(`Error deleting training path ${params.slug}:`, error)
    return NextResponse.json(
      { error: 'Failed to delete training path' },
      { status: 500 }
    )
  }
}