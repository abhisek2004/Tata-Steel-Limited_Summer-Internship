import { PrismaClient } from '@prisma/client'
import { courses, trainingModules, trainingPaths } from '../lib/data'
import { slugify } from '../lib/slug-utils'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seeding...')

  // Clear existing data
  await prisma.eventAgenda.deleteMany({})
  await prisma.eventSpeaker.deleteMany({})
  await prisma.eventMaterial.deleteMany({})
  await prisma.eventRegistration.deleteMany({})
  await prisma.event.deleteMany({})
  await prisma.certificate.deleteMany({})
  await prisma.resource.deleteMany({})
  await prisma.pathCourse.deleteMany({})
  await prisma.pathProgress.deleteMany({})
  await prisma.courseProgress.deleteMany({})
  await prisma.course.deleteMany({})
  await prisma.trainingPath.deleteMany({})
  await prisma.trainingModule.deleteMany({})
  await prisma.user.deleteMany({})

  console.log('Cleared existing data')

  // Create demo user
  const demoUser = await prisma.user.create({
    data: {
      name: 'Demo User',
      email: 'demo@tatasteel.com',
      department: 'Training',
      role: 'Employee',
    },
  })

  console.log('Created demo user')

  // Seed courses
  for (const course of courses) {
    await prisma.course.create({
      data: {
        id: course.id.toString(),
        title: course.title,
        description: course.desc,
        category: course.category,
        level: course.level,
        duration: course.duration,
        modules: course.modules,
        objectives: JSON.stringify(course.objectives),
        curriculum: JSON.stringify(course.curriculum),
        prerequisites: course.prerequisites,
        certification: course.certification,
        resources: {
          create: course.resources?.map(resource => ({
            name: resource.name,
            type: resource.type,
          })) || [],
        },
      },
    })
  }

  console.log('Seeded courses')

  // Seed training modules
  for (const module of trainingModules) {
    await prisma.trainingModule.create({
      data: {
        name: module.name,
        slug: module.slug,
        description: `Comprehensive training on ${module.name}`,
        modules: module.modules,
        icon: module.icon,
      },
    })
  }

  console.log('Seeded training modules')

  // Seed training paths
  for (const path of trainingPaths) {
    const createdPath = await prisma.trainingPath.create({
      data: {
        name: path.name,
        slug: path.slug || slugify(path.name),
        description: `Complete training path for ${path.name}`,
        modules: path.modules,
        duration: path.duration,
        objectives: JSON.stringify(['Master core concepts', 'Apply skills in real-world scenarios', 'Achieve certification']),
        resources: {
          create: [
            { name: 'Path Handbook', type: 'pdf' },
            { name: 'Case Studies', type: 'pdf' },
          ],
        },
      },
    })

    // Connect courses to paths if available
    if (path.courses && path.courses.length > 0) {
      for (let i = 0; i < path.courses.length; i++) {
        const course = path.courses[i]
        if (course.courseId) {
          await prisma.pathCourse.create({
            data: {
              pathId: createdPath.id,
              courseId: course.courseId.toString(),
              order: i + 1,
            },
          })
        }
      }
    }
  }

  console.log('Seeded training paths')

  // Create some demo events
  const events = [
    {
      title: 'Annual Safety Workshop',
      date: new Date(2023, 11, 15), // December 15, 2023
      time: '09:00 AM - 04:00 PM',
      location: 'Training Center, Building A',
      description: 'Comprehensive workshop covering the latest safety protocols and procedures.',
      category: 'Safety',
      capacity: 50,
      materials: ['Safety Manual', 'Workshop Slides'],
      speakers: [
        { name: 'John Smith', role: 'Safety Director', bio: '15 years of experience in industrial safety.' },
        { name: 'Maria Garcia', role: 'Operations Manager', bio: 'Expert in implementing safety protocols in steel production.' },
      ],
      agenda: [
        'Introduction to Safety Standards',
        'Hands-on Safety Equipment Training',
        'Emergency Response Procedures',
        'Q&A Session',
      ],
    },
    {
      title: 'Leadership Development Seminar',
      date: new Date(2023, 11, 20), // December 20, 2023
      time: '10:00 AM - 03:00 PM',
      location: 'Conference Hall, Main Office',
      description: 'Develop essential leadership skills for modern industrial management.',
      category: 'Leadership',
      capacity: 30,
      materials: ['Leadership Handbook', 'Case Studies'],
      speakers: [
        { name: 'Robert Johnson', role: 'HR Director', bio: 'Specializes in leadership development and team building.' },
      ],
      agenda: [
        'Effective Communication Strategies',
        'Team Building Exercises',
        'Conflict Resolution',
        'Strategic Decision Making',
      ],
    },
  ]

  for (const eventData of events) {
    const event = await prisma.event.create({
      data: {
        title: eventData.title,
        date: eventData.date,
        time: eventData.time,
        location: eventData.location,
        description: eventData.description,
        category: eventData.category,
        capacity: eventData.capacity,
      },
    })

    // Create materials
    for (const material of eventData.materials) {
      await prisma.eventMaterial.create({
        data: {
          name: material,
          eventId: event.id,
        },
      })
    }

    // Create speakers
    for (const speaker of eventData.speakers) {
      await prisma.eventSpeaker.create({
        data: {
          name: speaker.name,
          role: speaker.role,
          bio: speaker.bio,
          eventId: event.id,
        },
      })
    }

    // Create agenda items
    for (let i = 0; i < eventData.agenda.length; i++) {
      await prisma.eventAgenda.create({
        data: {
          item: eventData.agenda[i],
          order: i + 1,
          eventId: event.id,
        },
      })
    }

    // Register demo user for the event
    await prisma.eventRegistration.create({
      data: {
        eventId: event.id,
        userId: demoUser.id,
      },
    })
  }

  console.log('Seeded events')

  console.log('Database seeding completed')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })