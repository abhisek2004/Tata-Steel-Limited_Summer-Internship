import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/events/[id] - Get a specific event
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        materials: true,
        speakers: true,
        agenda: {
          orderBy: {
            order: 'asc',
          },
        },
        registrations: {
          include: {
            user: true,
          },
        },
      },
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Transform the data to match the expected format in the frontend
    const transformedEvent = {
      id: event.id,
      title: event.title,
      date: event.date.toISOString(),
      time: event.time,
      location: event.location,
      description: event.description,
      category: event.category,
      capacity: event.capacity,
      registered: event.registrations.length,
      speakers: event.speakers.map(speaker => ({
        name: speaker.name,
        role: speaker.role,
        bio: speaker.bio,
      })),
      materials: event.materials.map(material => material.name),
      prerequisites: '',
      agenda: event.agenda.map(item => item.item),
      // Add meeting details if available
      meetingDetails: event.location.includes('Online') ? {
        link: 'https://meet.example.com/event',
        id: '123456789',
        password: 'event123',
      } : undefined,
    }

    return NextResponse.json(transformedEvent)
  } catch (error) {
    console.error(`Error fetching event ${params.id}:`, error)
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    )
  }
}

// PUT /api/events/[id] - Update an event
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    const {
      title,
      date,
      time,
      location,
      description,
      category,
      capacity,
      speakers,
      materials,
      agenda,
    } = body

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id },
    })

    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Update event
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title,
        date: new Date(date),
        time,
        location,
        description,
        category,
        capacity,
      },
    })

    // Update speakers if provided
    if (speakers) {
      // Delete existing speakers
      await prisma.eventSpeaker.deleteMany({
        where: { eventId: id },
      })

      // Create new speakers
      for (const speaker of speakers) {
        await prisma.eventSpeaker.create({
          data: {
            name: speaker.name,
            role: speaker.role,
            bio: speaker.bio,
            eventId: id,
          },
        })
      }
    }

    // Update materials if provided
    if (materials) {
      // Delete existing materials
      await prisma.eventMaterial.deleteMany({
        where: { eventId: id },
      })

      // Create new materials
      for (const material of materials) {
        await prisma.eventMaterial.create({
          data: {
            name: material,
            eventId: id,
          },
        })
      }
    }

    // Update agenda items if provided
    if (agenda) {
      // Delete existing agenda items
      await prisma.eventAgenda.deleteMany({
        where: { eventId: id },
      })

      // Create new agenda items
      for (let i = 0; i < agenda.length; i++) {
        await prisma.eventAgenda.create({
          data: {
            item: agenda[i],
            order: i + 1,
            eventId: id,
          },
        })
      }
    }

    // Fetch updated event with all related data
    const eventWithRelations = await prisma.event.findUnique({
      where: { id },
      include: {
        materials: true,
        speakers: true,
        agenda: {
          orderBy: {
            order: 'asc',
          },
        },
        registrations: {
          include: {
            user: true,
          },
        },
      },
    })

    // Transform the data to match the expected format in the frontend
    const transformedEvent = {
      id: eventWithRelations!.id,
      title: eventWithRelations!.title,
      date: eventWithRelations!.date.toISOString(),
      time: eventWithRelations!.time,
      location: eventWithRelations!.location,
      description: eventWithRelations!.description,
      category: eventWithRelations!.category,
      capacity: eventWithRelations!.capacity,
      registered: eventWithRelations!.registrations.length,
      speakers: eventWithRelations!.speakers.map(speaker => ({
        name: speaker.name,
        role: speaker.role,
        bio: speaker.bio,
      })),
      materials: eventWithRelations!.materials.map(material => material.name),
      prerequisites: '',
      agenda: eventWithRelations!.agenda.map(item => item.item),
    }

    return NextResponse.json(transformedEvent)
  } catch (error) {
    console.error(`Error updating event ${params.id}:`, error)
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    )
  }
}

// DELETE /api/events/[id] - Delete an event
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id },
    })

    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Delete event (related records will be deleted automatically due to cascade delete)
    await prisma.event.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Event deleted successfully' })
  } catch (error) {
    console.error(`Error deleting event ${params.id}:`, error)
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    )
  }
}