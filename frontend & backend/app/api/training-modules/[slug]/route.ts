import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/training-modules/[slug] - Get a specific training module by slug
export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const moduleSlug = params.slug

    const module = await prisma.trainingModule.findUnique({
      where: {
        slug: moduleSlug,
      },
      include: {
        resources: true,
      },
    })

    if (!module) {
      return NextResponse.json(
        { error: 'Training module not found' },
        { status: 404 }
      )
    }

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

    return NextResponse.json(transformedModule)
  } catch (error) {
    console.error('Error fetching training module:', error)
    return NextResponse.json(
      { error: 'Failed to fetch training module' },
      { status: 500 }
    )
  }
}

// PUT /api/training-modules/[slug] - Update a training module
export async function PUT(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const moduleSlug = params.slug
    const body = await request.json()
    const { title, description, category, level, duration, content, resources } = body

    // Check if module exists
    const existingModule = await prisma.trainingModule.findUnique({
      where: {
        slug: moduleSlug,
      },
      include: {
        resources: true,
      },
    })

    if (!existingModule) {
      return NextResponse.json(
        { error: 'Training module not found' },
        { status: 404 }
      )
    }

    // Generate new slug if title is changed
    let slug = moduleSlug
    if (title && title !== existingModule.title) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

      // Check if new slug already exists for another module
      const moduleWithNewSlug = await prisma.trainingModule.findFirst({
        where: {
          slug,
          id: { not: existingModule.id },
        },
      })

      if (moduleWithNewSlug) {
        return NextResponse.json(
          { error: 'A module with this title already exists' },
          { status: 400 }
        )
      }
    }

    // Update module
    const updatedModule = await prisma.$transaction(async (tx) => {
      // Delete existing resources if new ones are provided
      if (resources) {
        await tx.resource.deleteMany({
          where: {
            trainingModuleId: existingModule.id,
          },
        })
      }

      // Update module with new data
      return tx.trainingModule.update({
        where: {
          id: existingModule.id,
        },
        data: {
          title: title || existingModule.title,
          slug,
          description: description || existingModule.description,
          category: category || existingModule.category,
          level: level || existingModule.level,
          duration: duration || existingModule.duration,
          content: content !== undefined ? content : existingModule.content,
          resources: resources ? {
            create: resources.map((resource: any) => ({
              title: resource.title,
              type: resource.type,
              url: resource.url,
            })),
          } : undefined,
        },
        include: {
          resources: true,
        },
      })
    })

    // Transform the data to match the expected format in the frontend
    const transformedModule = {
      id: updatedModule.id,
      title: updatedModule.title,
      slug: updatedModule.slug,
      description: updatedModule.description,
      category: updatedModule.category,
      level: updatedModule.level,
      duration: updatedModule.duration,
      content: updatedModule.content,
      resources: updatedModule.resources.map(resource => ({
        id: resource.id,
        title: resource.title,
        type: resource.type,
        url: resource.url,
      })),
    }

    return NextResponse.json(transformedModule)
  } catch (error) {
    console.error('Error updating training module:', error)
    return NextResponse.json(
      { error: 'Failed to update training module' },
      { status: 500 }
    )
  }
}

// DELETE /api/training-modules/[slug] - Delete a training module
export async function DELETE(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const moduleSlug = params.slug

    // Check if module exists
    const existingModule = await prisma.trainingModule.findUnique({
      where: {
        slug: moduleSlug,
      },
    })

    if (!existingModule) {
      return NextResponse.json(
        { error: 'Training module not found' },
        { status: 404 }
      )
    }

    // Delete module and its resources
    await prisma.$transaction([
      // Delete resources
      prisma.resource.deleteMany({
        where: {
          trainingModuleId: existingModule.id,
        },
      }),
      // Delete module
      prisma.trainingModule.delete({
        where: {
          id: existingModule.id,
        },
      }),
    ])

    return NextResponse.json({ message: 'Training module deleted successfully' })
  } catch (error) {
    console.error('Error deleting training module:', error)
    return NextResponse.json(
      { error: 'Failed to delete training module' },
      { status: 500 }
    )
  }
}