import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/events - Get all events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    
    // Build filter object based on query parameters
    const filter: any = {}
    if (category) filter.category = category
    
    const events = await prisma.event.findMany({
      where: filter,
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
      orderBy: {
        date: 'asc',
      },
    })

    // Transform the data to match the expected format in the frontend
    const transformedEvents = events.map(event => ({
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
    }))

    return NextResponse.json(transformedEvents)
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

// POST /api/events - Create a new event
export async function POST(request: NextRequest) {
  try {
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

    // Create the event
    const event = await prisma.event.create({
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

    // Add speakers if provided
    if (speakers && speakers.length > 0) {
      for (const speaker of speakers) {
        await prisma.eventSpeaker.create({
          data: {
            name: speaker.name,
            role: speaker.role,
            bio: speaker.bio,
            eventId: event.id,
          },
        })
      }
    }

    // Add materials if provided
    if (materials && materials.length > 0) {
      for (const material of materials) {
        await prisma.eventMaterial.create({
          data: {
            name: material,
            eventId: event.id,
          },
        })
      }
    }

    // Add agenda items if provided
    if (agenda && agenda.length > 0) {
      for (let i = 0; i < agenda.length; i++) {
        await prisma.eventAgenda.create({
          data: {
            item: agenda[i],
            order: i + 1,
            eventId: event.id,
          },
        })
      }
    }

    // Fetch the created event with all related data
    const createdEvent = await prisma.event.findUnique({
      where: { id: event.id },
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
      id: createdEvent!.id,
      title: createdEvent!.title,
      date: createdEvent!.date.toISOString(),
      time: createdEvent!.time,
      location: createdEvent!.location,
      description: createdEvent!.description,
      category: createdEvent!.category,
      capacity: createdEvent!.capacity,
      registered: createdEvent!.registrations.length,
      speakers: createdEvent!.speakers.map(speaker => ({
        name: speaker.name,
        role: speaker.role,
        bio: speaker.bio,
      })),
      materials: createdEvent!.materials.map(material => material.name),
      prerequisites: '',
      agenda: createdEvent!.agenda.map(item => item.item),
    }

    return NextResponse.json(transformedEvent, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
}