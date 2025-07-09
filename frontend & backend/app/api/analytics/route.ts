import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/analytics - Get analytics data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const department = searchParams.get('department')
    const period = searchParams.get('period') || 'month' // 'week', 'month', 'year'

    let whereClause: any = {}
    let dateFilter: any = {}

    // Filter by department if provided
    if (department) {
      whereClause.department = department
    }

    // Set date filter based on period
    const now = new Date()
    if (period === 'week') {
      const oneWeekAgo = new Date(now)
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      dateFilter.gte = oneWeekAgo
    } else if (period === 'month') {
      const oneMonthAgo = new Date(now)
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
      dateFilter.gte = oneMonthAgo
    } else if (period === 'year') {
      const oneYearAgo = new Date(now)
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
      dateFilter.gte = oneYearAgo
    }

    // Get users
    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        department: true,
      },
    })

    // Get course progress
    const courseProgress = await prisma.courseProgress.findMany({
      where: {
        user: whereClause,
        updatedAt: dateFilter,
      },
      include: {
        course: true,
        user: {
          select: {
            department: true,
          },
        },
      },
    })

    // Get path progress
    const pathProgress = await prisma.pathProgress.findMany({
      where: {
        user: whereClause,
        updatedAt: dateFilter,
      },
      include: {
        path: true,
        user: {
          select: {
            department: true,
          },
        },
      },
    })

    // Get certificates
    const certificates = await prisma.certificate.findMany({
      where: {
        user: whereClause,
        issuedAt: dateFilter,
      },
      include: {
        course: true,
        user: {
          select: {
            department: true,
          },
        },
      },
    })

    // Get event registrations
    const eventRegistrations = await prisma.eventRegistration.findMany({
      where: {
        user: whereClause,
        createdAt: dateFilter,
      },
      include: {
        event: true,
        user: {
          select: {
            department: true,
          },
        },
      },
    })

    // Calculate department-wise statistics
    const departmentStats: Record<string, any> = {}
    const usersByDepartment: Record<string, number> = {}

    // Count users by department
    users.forEach(user => {
      const dept = user.department || 'Unknown'
      usersByDepartment[dept] = (usersByDepartment[dept] || 0) + 1
    })

    // Initialize department stats
    Object.keys(usersByDepartment).forEach(dept => {
      departmentStats[dept] = {
        users: usersByDepartment[dept],
        coursesCompleted: 0,
        coursesInProgress: 0,
        pathsCompleted: 0,
        pathsInProgress: 0,
        certificatesIssued: 0,
        eventAttendance: 0,
      }
    })

    // Process course progress
    courseProgress.forEach(cp => {
      const dept = cp.user.department || 'Unknown'
      if (cp.status === 'Completed') {
        departmentStats[dept].coursesCompleted += 1
      } else if (cp.status === 'In Progress') {
        departmentStats[dept].coursesInProgress += 1
      }
    })

    // Process path progress
    pathProgress.forEach(pp => {
      const dept = pp.user.department || 'Unknown'
      if (pp.status === 'Completed') {
        departmentStats[dept].pathsCompleted += 1
      } else if (pp.status === 'In Progress') {
        departmentStats[dept].pathsInProgress += 1
      }
    })

    // Process certificates
    certificates.forEach(cert => {
      const dept = cert.user.department || 'Unknown'
      departmentStats[dept].certificatesIssued += 1
    })

    // Process event registrations
    eventRegistrations.forEach(reg => {
      const dept = reg.user.department || 'Unknown'
      departmentStats[dept].eventAttendance += 1
    })

    // Calculate course engagement by category
    const coursesByCategory: Record<string, any> = {}
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        category: true,
        _count: {
          select: {
            progress: true,
          },
        },
      },
    })

    courses.forEach(course => {
      const category = course.category || 'Uncategorized'
      if (!coursesByCategory[category]) {
        coursesByCategory[category] = {
          totalCourses: 0,
          totalEnrollments: 0,
        }
      }
      coursesByCategory[category].totalCourses += 1
      coursesByCategory[category].totalEnrollments += course._count.progress
    })

    // Prepare time-series data for course completions
    const timeSeriesData: Record<string, number> = {}
    const dateFormat = period === 'week' ? 'day' : period === 'month' ? 'day' : 'month'

    // Initialize time periods
    if (period === 'week') {
      for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const key = date.toISOString().split('T')[0]
        timeSeriesData[key] = 0
      }
    } else if (period === 'month') {
      for (let i = 29; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const key = date.toISOString().split('T')[0]
        timeSeriesData[key] = 0
      }
    } else if (period === 'year') {
      for (let i = 11; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        timeSeriesData[key] = 0
      }
    }

    // Count course completions by time period
    const completedCourseProgress = courseProgress.filter(cp => cp.status === 'Completed')
    completedCourseProgress.forEach(cp => {
      let key
      if (period === 'week' || period === 'month') {
        key = cp.updatedAt.toISOString().split('T')[0]
      } else {
        key = `${cp.updatedAt.getFullYear()}-${String(cp.updatedAt.getMonth() + 1).padStart(2, '0')}`
      }
      if (timeSeriesData[key] !== undefined) {
        timeSeriesData[key] += 1
      }
    })

    // Transform the data to match the expected format in the frontend
    const analyticsData = {
      departmentStats: Object.entries(departmentStats).map(([department, stats]) => ({
        department,
        ...stats,
      })),
      courseEngagement: Object.entries(coursesByCategory).map(([category, data]) => ({
        category,
        totalCourses: data.totalCourses,
        totalEnrollments: data.totalEnrollments,
        averageEnrollmentsPerCourse: data.totalCourses > 0 ? Math.round(data.totalEnrollments / data.totalCourses) : 0,
      })),
      timeSeriesData: Object.entries(timeSeriesData).map(([date, count]) => ({
        date,
        completions: count,
      })),
      summary: {
        totalUsers: users.length,
        totalCourseCompletions: completedCourseProgress.length,
        totalCertificatesIssued: certificates.length,
        totalEventRegistrations: eventRegistrations.length,
      },
    }

    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error('Error fetching analytics data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}