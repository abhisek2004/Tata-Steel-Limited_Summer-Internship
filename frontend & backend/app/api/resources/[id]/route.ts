import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/resources/[id] - Get a specific resource by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const resourceId = params.id

    const resource = await prisma.resource.findUnique({
      where: {
        id: resourceId,
      },
    })

    if (!resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(resource)
  } catch (error) {
    console.error('Error fetching resource:', error)
    return NextResponse.json(
      { error: 'Failed to fetch resource' },
      { status: 500 }
    )
  }
}

// PUT /api/resources/[id] - Update a resource
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const resourceId = params.id
    const body = await request.json()
    const { title, type, url, courseId, pathId, moduleId } = body

    // Check if resource exists
    const existingResource = await prisma.resource.findUnique({
      where: {
        id: resourceId,
      },
    })

    if (!existingResource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }

    // Update resource
    const updatedResource = await prisma.resource.update({
      where: {
        id: resourceId,
      },
      data: {
        title: title || existingResource.title,
        type: type || existingResource.type,
        url: url || existingResource.url,
        courseId: courseId !== undefined ? courseId : existingResource.courseId,
        trainingPathId: pathId !== undefined ? pathId : existingResource.trainingPathId,
        trainingModuleId: moduleId !== undefined ? moduleId : existingResource.trainingModuleId,
      },
    })

    return NextResponse.json(updatedResource)
  } catch (error) {
    console.error('Error updating resource:', error)
    return NextResponse.json(
      { error: 'Failed to update resource' },
      { status: 500 }
    )
  }
}

// DELETE /api/resources/[id] - Delete a resource
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const resourceId = params.id

    // Check if resource exists
    const existingResource = await prisma.resource.findUnique({
      where: {
        id: resourceId,
      },
    })

    if (!existingResource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }

    // Delete resource
    await prisma.resource.delete({
      where: {
        id: resourceId,
      },
    })

    return NextResponse.json({ message: 'Resource deleted successfully' })
  } catch (error) {
    console.error('Error deleting resource:', error)
    return NextResponse.json(
      { error: 'Failed to delete resource' },
      { status: 500 }
    )
  }
}