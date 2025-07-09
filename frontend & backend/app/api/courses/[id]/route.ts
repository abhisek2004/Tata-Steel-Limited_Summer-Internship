import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/courses/[id] - Get a specific course
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        resources: true,
      },
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    // Transform the data to match the expected format in the frontend
    const transformedCourse = {
      id: course.id,
      title: course.title,
      desc: course.description,
      category: course.category,
      level: course.level,
      duration: course.duration,
      modules: course.modules,
      objectives: JSON.parse(course.objectives),
      curriculum: JSON.parse(course.curriculum),
      prerequisites: course.prerequisites,
      certification: course.certification,
      resources: course.resources.map(resource => ({
        name: resource.name,
        type: resource.type,
      })),
    }

    return NextResponse.json(transformedCourse)
  } catch (error) {
    console.error(`Error fetching course ${params.id}:`, error)
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    )
  }
}

// PUT /api/courses/[id] - Update a course
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    const {
      title,
      description,
      category,
      level,
      duration,
      modules,
      objectives,
      curriculum,
      prerequisites,
      certification,
      resources,
    } = body

    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: { id },
    })

    if (!existingCourse) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    // Update course
    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        title,
        description,
        category,
        level,
        duration,
        modules,
        objectives: JSON.stringify(objectives),
        curriculum: JSON.stringify(curriculum),
        prerequisites,
        certification,
      },
      include: {
        resources: true,
      },
    })

    // Update resources if provided
    if (resources) {
      // Delete existing resources
      await prisma.resource.deleteMany({
        where: { courseId: id },
      })

      // Create new resources
      for (const resource of resources) {
        await prisma.resource.create({
          data: {
            name: resource.name,
            type: resource.type,
            courseId: id,
          },
        })
      }
    }

    // Fetch updated course with resources
    const courseWithResources = await prisma.course.findUnique({
      where: { id },
      include: {
        resources: true,
      },
    })

    // Transform the data to match the expected format in the frontend
    const transformedCourse = {
      id: courseWithResources!.id,
      title: courseWithResources!.title,
      desc: courseWithResources!.description,
      category: courseWithResources!.category,
      level: courseWithResources!.level,
      duration: courseWithResources!.duration,
      modules: courseWithResources!.modules,
      objectives: JSON.parse(courseWithResources!.objectives),
      curriculum: JSON.parse(courseWithResources!.curriculum),
      prerequisites: courseWithResources!.prerequisites,
      certification: courseWithResources!.certification,
      resources: courseWithResources!.resources.map(resource => ({
        name: resource.name,
        type: resource.type,
      })),
    }

    return NextResponse.json(transformedCourse)
  } catch (error) {
    console.error(`Error updating course ${params.id}:`, error)
    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500 }
    )
  }
}

// DELETE /api/courses/[id] - Delete a course
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: { id },
    })

    if (!existingCourse) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    // Delete course (resources will be deleted automatically due to cascade delete)
    await prisma.course.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Course deleted successfully' })
  } catch (error) {
    console.error(`Error deleting course ${params.id}:`, error)
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    )
  }
}