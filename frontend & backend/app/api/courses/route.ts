import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/courses - Get all courses
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const level = searchParams.get('level')
    
    // Build filter object based on query parameters
    const filter: any = {}
    if (category) filter.category = category
    if (level) filter.level = level
    
    const courses = await prisma.course.findMany({
      where: filter,
      include: {
        resources: true,
      },
    })

    // Transform the data to match the expected format in the frontend
    const transformedCourses = courses.map(course => ({
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
    }))

    return NextResponse.json(transformedCourses)
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}

// POST /api/courses - Create a new course
export async function POST(request: NextRequest) {
  try {
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

    const course = await prisma.course.create({
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
        resources: {
          create: resources?.map((resource: { name: string; type: string }) => ({
            name: resource.name,
            type: resource.type,
          })) || [],
        },
      },
      include: {
        resources: true,
      },
    })

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

    return NextResponse.json(transformedCourse, { status: 201 })
  } catch (error) {
    console.error('Error creating course:', error)
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    )
  }
}