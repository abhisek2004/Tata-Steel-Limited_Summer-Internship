import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, hasRole, unauthorizedResponse, forbiddenResponse } from '@/lib/auth-utils'

// GET /api/reports - Get training reports and analytics
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const decoded = verifyToken(request)
    if (!decoded) {
      return unauthorizedResponse()
    }

    // Check if user has admin or manager role
    if (!hasRole(decoded, 'admin') && !hasRole(decoded, 'manager')) {
      return forbiddenResponse('You do not have permission to access reports')
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const department = searchParams.get('department')
    const period = searchParams.get('period') || 'month' // week, month, year

    // Build filter conditions
    const departmentFilter = department ? { department } : {}

    // Calculate date range based on period
    const now = new Date()
    let startDate = new Date()
    
    if (period === 'week') {
      startDate.setDate(now.getDate() - 7)
    } else if (period === 'month') {
      startDate.setMonth(now.getMonth() - 1)
    } else if (period === 'year') {
      startDate.setFullYear(now.getFullYear() - 1)
    }

    // Get users count by department
    const usersByDepartment = await prisma.user.groupBy({
      by: ['department'],
      _count: {
        id: true,
      },
      where: departmentFilter,
    })

    // Get course progress statistics
    const courseProgress = await prisma.courseProgress.findMany({
      where: {
        updatedAt: {
          gte: startDate,
        },
        user: departmentFilter,
      },
      include: {
        course: {
          select: {
            title: true,
            category: true,
          },
        },
        user: {
          select: {
            department: true,
          },
        },
      },
    })

    // Get path progress statistics
    const pathProgress = await prisma.pathProgress.findMany({
      where: {
        updatedAt: {
          gte: startDate,
        },
        user: departmentFilter,
      },
      include: {
        path: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            department: true,
          },
        },
      },
    })

    // Get certificates statistics
    const certificates = await prisma.certificate.findMany({
      where: {
        issueDate: {
          gte: startDate,
        },
        user: departmentFilter,
      },
      include: {
        user: {
          select: {
            department: true,
          },
        },
      },
    })

    // Get event registrations statistics
    const eventRegistrations = await prisma.eventRegistration.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
        user: departmentFilter,
      },
      include: {
        event: {
          select: {
            title: true,
            category: true,
          },
        },
        user: {
          select: {
            department: true,
          },
        },
      },
    })

    // Process data for department-wise statistics
    const departmentStats = usersByDepartment.map((dept) => {
      const deptName = dept.department || 'Unassigned'
      const deptCourseProgress = courseProgress.filter(
        (cp) => cp.user.department === deptName
      )
      const deptPathProgress = pathProgress.filter(
        (pp) => pp.user.department === deptName
      )
      const deptCertificates = certificates.filter(
        (cert) => cert.user.department === deptName
      )
      const deptEventRegistrations = eventRegistrations.filter(
        (reg) => reg.user.department === deptName
      )

      return {
        department: deptName,
        userCount: dept._count.id,
        courseCompletions: deptCourseProgress.filter((cp) => cp.status === 'Completed').length,
        pathCompletions: deptPathProgress.filter((pp) => pp.status === 'Completed').length,
        certificatesEarned: deptCertificates.length,
        eventsAttended: deptEventRegistrations.length,
      }
    })

    // Process data for course engagement by category
    const courseCategories = [...new Set(courseProgress.map((cp) => cp.course.category))]
    const courseEngagementByCategory = courseCategories.map((category) => {
      const categoryCourseProgress = courseProgress.filter(
        (cp) => cp.course.category === category
      )

      return {
        category,
        inProgress: categoryCourseProgress.filter((cp) => cp.status === 'In Progress').length,
        completed: categoryCourseProgress.filter((cp) => cp.status === 'Completed').length,
        total: categoryCourseProgress.length,
      }
    })

    // Process time-series data for course completions
    const timeSeriesData = []
    if (period === 'week') {
      // Daily data for the past week
      for (let i = 0; i < 7; i++) {
        const date = new Date()
        date.setDate(now.getDate() - i)
        date.setHours(0, 0, 0, 0)
        const nextDate = new Date(date)
        nextDate.setDate(date.getDate() + 1)

        const completionsOnDay = courseProgress.filter(
          (cp) => 
            cp.status === 'Completed' && 
            cp.updatedAt >= date && 
            cp.updatedAt < nextDate
        ).length

        timeSeriesData.unshift({
          date: date.toISOString().split('T')[0],
          completions: completionsOnDay,
        })
      }
    } else if (period === 'month') {
      // Weekly data for the past month
      for (let i = 0; i < 4; i++) {
        const startOfWeek = new Date()
        startOfWeek.setDate(now.getDate() - (i * 7) - 6)
        startOfWeek.setHours(0, 0, 0, 0)
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 7)

        const completionsInWeek = courseProgress.filter(
          (cp) => 
            cp.status === 'Completed' && 
            cp.updatedAt >= startOfWeek && 
            cp.updatedAt < endOfWeek
        ).length

        timeSeriesData.unshift({
          date: `Week ${4-i}`,
          completions: completionsInWeek,
        })
      }
    } else if (period === 'year') {
      // Monthly data for the past year
      for (let i = 0; i < 12; i++) {
        const startOfMonth = new Date()
        startOfMonth.setMonth(now.getMonth() - i)
        startOfMonth.setDate(1)
        startOfMonth.setHours(0, 0, 0, 0)
        const endOfMonth = new Date(startOfMonth)
        endOfMonth.setMonth(startOfMonth.getMonth() + 1)

        const completionsInMonth = courseProgress.filter(
          (cp) => 
            cp.status === 'Completed' && 
            cp.updatedAt >= startOfMonth && 
            cp.updatedAt < endOfMonth
        ).length

        const monthNames = [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ]

        timeSeriesData.unshift({
          date: monthNames[startOfMonth.getMonth()],
          completions: completionsInMonth,
        })
      }
    }

    // Calculate summary statistics
    const totalUsers = usersByDepartment.reduce((sum, dept) => sum + dept._count.id, 0)
    const totalCourseCompletions = courseProgress.filter((cp) => cp.status === 'Completed').length
    const totalPathCompletions = pathProgress.filter((pp) => pp.status === 'Completed').length
    const totalCertificates = certificates.length
    const totalEventRegistrations = eventRegistrations.length

    // Prepare response
    const reportData = {
      summary: {
        totalUsers,
        totalCourseCompletions,
        totalPathCompletions,
        totalCertificates,
        totalEventRegistrations,
        completionRate: totalUsers > 0 ? (totalCourseCompletions / totalUsers).toFixed(2) : '0',
      },
      departmentStats,
      courseEngagementByCategory,
      timeSeriesData,
      period,
    }

    return NextResponse.json(reportData)
  } catch (error) {
    console.error('Error generating reports:', error)
    return NextResponse.json(
      { error: 'Failed to generate reports' },
      { status: 500 }
    )
  }
}