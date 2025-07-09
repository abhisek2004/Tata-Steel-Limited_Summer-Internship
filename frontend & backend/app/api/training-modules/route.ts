import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/training-modules - Get all training modules
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const level = searchParams.get('level')

    let whereClause: any = {}

    if (category) {
      whereClause.category = category
    }

    if (level) {
      whereClause.level = level
    }

    const modules = await prisma.trainingModule.findMany({
      where: whereClause,
      include: {
        resources: true,
      },
      orderBy: {
        title: 'asc',
      },
    })

    // Transform the data to match the expected format in the frontend
    const transformedModules = modules.map(module => ({
      id: module.id,
      title: module.title,
      slug: module.slug,
      description: module.description,
      category: module.category,
      level: module.level,
      duration: module.duration,
      content: module.content,
      resources: module.resources.map(resource => ({
        id: resource.id,
        title: resource.title,
        type: resource.type,
        url: resource.url,
      })),
    }))

    return NextResponse.json(transformedModules)
  } catch (error) {
    console.error('Error fetching training modules:', error)
    return NextResponse.json(
      { error: 'Failed to fetch training modules' },
      { status: 500 }
    )
  }
}

// POST /api/training-modules - Create a new training module
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, category, level, duration, content, resources } = body

    // Validate input
    if (!title || !description || !category || !level || !duration) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    // Check if module with slug already exists
    const existingModule = await prisma.trainingModule.findUnique({
      where: {
        slug,
      },
    })

    if (existingModule) {
      return NextResponse.json(
        { error: 'A module with this title already exists' },
        { status: 400 }
      )
    }

    // Create module with resources
    const module = await prisma.trainingModule.create({
      data: {
        title,
        slug,
        description,
        category,
        level,
        duration,
        content: content || '',
        resources: {
          create: resources?.map((resource: any) => ({
            title: resource.title,
            type: resource.type,
            url: resource.url,
          })) || [],
        },
      },
      include: {
        resources: true,
      },
    })

    // Transform the data to match the expected format in the frontend
    const transformedModule = {
      id: module.id,
      title: module.title,
      slug: module.slug,
      description: module.description,
      category: module.category,
      level: module.level,
      duration: module.duration,
      content: module.content,
      resources: module.resources.map(resource => ({
        id: resource.id,
        title: resource.title,
        type: resource.type,
        url: resource.url,
      })),
    }

    return NextResponse.json(transformedModule, { status: 201 })
  } catch (error) {
    console.error('Error creating training module:', error)
    return NextResponse.json(
      { error: 'Failed to create training module' },
      { status: 500 }
    )
  }
}