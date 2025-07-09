import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

// POST /api/events/register - Register for an event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventId, userId } = body

    // Validate input
    if (!eventId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        registrations: true,
      },
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user is already registered
    const existingRegistration = await prisma.eventRegistration.findFirst({
      where: {
        eventId,
        userId,
      },
    })

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'User is already registered for this event' },
        { status: 400 }
      )
    }

    // Check if event is at capacity
    if (event.registrations.length >= event.capacity) {
      return NextResponse.json(
        { error: 'Event is at capacity' },
        { status: 400 }
      )
    }

    // Register user for event
    const registration = await prisma.eventRegistration.create({
      data: {
        eventId,
        userId,
      },
      include: {
        event: true,
        user: true,
      },
    })

    return NextResponse.json({
      message: 'Registration successful',
      registration: {
        id: registration.id,
        eventId: registration.eventId,
        userId: registration.userId,
        eventTitle: registration.event.title,
        userName: registration.user.name,
      },
    }, { status: 201 })
  } catch (error) {
    console.error('Error registering for event:', error)
    return NextResponse.json(
      { error: 'Failed to register for event' },
      { status: 500 }
    )
  }
}

// DELETE /api/events/register - Cancel registration for an event
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('eventId')
    const userId = searchParams.get('userId')

    // Validate input
    if (!eventId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if registration exists
    const registration = await prisma.eventRegistration.findFirst({
      where: {
        eventId,
        userId,
      },
    })

    if (!registration) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      )
    }

    // Delete registration
    await prisma.eventRegistration.delete({
      where: {
        id: registration.id,
      },
    })

    return NextResponse.json({ message: 'Registration cancelled successfully' })
  } catch (error) {
    console.error('Error cancelling registration:', error)
    return NextResponse.json(
      { error: 'Failed to cancel registration' },
      { status: 500 }
    )
  }
}