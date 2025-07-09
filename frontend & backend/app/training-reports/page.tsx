"use client"

import type React from "react"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BarChart } from "@/components/charts/bar-chart"
import { LineChart } from "@/components/charts/line-chart"
import { PieChart } from "@/components/charts/pie-chart" // Using PieChart for Doughnut
import {
  learnerProgressData,
  teamReportData,
  moduleEngagementData,
  certificateTrackingData,
  courses,
  trainingPaths,
} from "@/lib/data"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"

export default function TrainingReportsPage() {
  const [selectedUser, setSelectedUser] = useState<string>("all")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")
  const [selectedCoursePath, setSelectedCoursePath] = useState<string>("all")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")

  // Add error boundary and data validation
  useEffect(() => {
    // Validate data integrity
    if (!learnerProgressData || !Array.isArray(learnerProgressData)) {
      console.error("learnerProgressData is not valid")
    }
    if (!teamReportData || !Array.isArray(teamReportData)) {
      console.error("teamReportData is not valid")
    }
    if (!moduleEngagementData || !Array.isArray(moduleEngagementData)) {
      console.error("moduleEngagementData is not valid")
    }
    if (!certificateTrackingData || !Array.isArray(certificateTrackingData)) {
      console.error("certificateTrackingData is not valid")
    }
  }, [])

  // --- Data Calculations for Summary Tiles ---
  const totalLearners = useMemo(() => {
    const uniqueLearners = new Set(learnerProgressData.map((l) => l.name))
    return uniqueLearners.size
  }, [])

  const coursesCompleted = useMemo(() => {
    const uniqueCompletedCourses = new Set(learnerProgressData.filter((l) => l.completed).map((l) => l.course))
    return uniqueCompletedCourses.size
  }, [])

  const certificatesIssued = useMemo(() => {
    return certificateTrackingData.length
  }, [])

  const activeModules = useMemo(() => {
    // Count unique modules from moduleEngagementData as a proxy for active modules
    return moduleEngagementData.length
  }, [])

  // --- Filtered Data for Reports and Charts ---
  const filteredLearnerProgress = useMemo(() => {
    return learnerProgressData.filter((learner) => {
      const matchesUser = selectedUser === "all" || learner.name === selectedUser
      const matchesCoursePath =
        selectedCoursePath === "all" ||
        trainingPaths.some(
          (path) => path.name === selectedCoursePath && path.courses.some((course) => course.title === learner.course),
        )

      // Date filtering for learner progress (assuming progress dates are not explicitly in data,
      // so this part will be a placeholder or require more data structure)
      // For now, we'll skip date filtering on learnerProgressData unless dates are added.
      // If dates were available, it would look like:
      // const learnerDate = new Date(learner.date);
      // const matchesDateRange = (!startDate || learnerDate >= new Date(startDate)) && (!endDate || learnerDate <= new Date(endDate));

      return matchesUser && matchesCoursePath // && matchesDateRange;
    })
  }, [selectedUser, selectedCoursePath, startDate, endDate])

  const filteredCertificateTracking = useMemo(() => {
    return certificateTrackingData.filter((cert) => {
      const matchesUser = selectedUser === "all" || cert.learner === selectedUser
      const matchesCoursePath = selectedCoursePath === "all" || cert.path === selectedCoursePath
      const certDate = new Date(cert.dateIssued)
      const matchesDateRange =
        (!startDate || certDate >= new Date(startDate)) && (!endDate || certDate <= new Date(endDate))

      return matchesUser && matchesCoursePath && matchesDateRange
    })
  }, [selectedUser, selectedCoursePath, startDate, endDate])

  const filteredModuleEngagement = useMemo(() => {
    return moduleEngagementData.filter((module) => {
      // No direct user/department/path filter for module engagement in current data structure
      // Return all modules for now, but this can be extended with filters later
      return true
    })
  }, [])

  const filteredTeamReport = useMemo(() => {
    return teamReportData.filter((team) => {
      const matchesDepartment = selectedDepartment === "all" || team.department === selectedDepartment
      return matchesDepartment
    })
  }, [selectedDepartment])

  // --- Chart Data Preparation ---

  // Bar Chart: Module-wise engagement (using enrollments as a proxy for completion/engagement)
  const moduleEngagementChartData = useMemo(() => {
    try {
      return filteredModuleEngagement.map((module) => ({
        label: String(module.module || "Unknown"),
        value: Number(module.enrollments) || 0,
      }))
    } catch (error) {
      console.error("Error preparing module engagement chart data:", error)
      return []
    }
  }, [filteredModuleEngagement])

  // Doughnut Chart: Overall learner progress (completed vs remaining)
  const overallProgressChartData = useMemo(() => {
    try {
      const completedCount = new Set(learnerProgressData.filter((l) => l.completed).map((l) => l.name)).size
      const inProgressCount = totalLearners - completedCount
      return [
        { label: "Completed", value: completedCount, fill: "hsl(var(--primary))" },
        { label: "In Progress / Not Started", value: inProgressCount, fill: "hsl(var(--secondary))" },
      ]
    } catch (error) {
      console.error("Error preparing overall progress chart data:", error)
      return []
    }
  }, [totalLearners])

  // Line Chart: Monthly learning trend (Certificates Issued over time)
  const monthlyCertificatesTrend = useMemo(() => {
    try {
      const monthlyData: { [key: string]: number } = {}
      filteredCertificateTracking.forEach((cert) => {
        try {
          const monthYear = format(new Date(cert.dateIssued), "MMM yyyy")
          monthlyData[monthYear] = (monthlyData[monthYear] || 0) + 1
        } catch (dateError) {
          console.error("Error processing certificate date:", cert.dateIssued, dateError)
        }
      })

      // Sort months chronologically for the line chart
      const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
        try {
          const dateA = new Date(a.replace(" ", " 1, ")) // Add day for valid date parsing
          const dateB = new Date(b.replace(" ", " 1, "))
          return dateA.getTime() - dateB.getTime()
        } catch (sortError) {
          console.error("Error sorting months:", sortError)
          return 0
        }
      })

      return sortedMonths.map((month) => ({
        month: String(month),
        count: Number(monthlyData[month]) || 0,
      }))
    } catch (error) {
      console.error("Error preparing monthly certificates trend data:", error)
      return []
    }
  }, [filteredCertificateTracking])

  const handleExport = () => {
    alert("Export functionality is a placeholder. Implement PDF/CSV generation here.")
    // In a real application, you would trigger a server action or API route here
    // to generate and download the report.
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-steel-blue-dark">Training Reports Dashboard</h1>
        <Button onClick={handleExport} className="bg-steel-blue-medium hover:bg-steel-blue-dark text-white">
          Export Report (PDF/CSV)
        </Button>
      </div>

      {/* Summary Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-card text-card-foreground shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Learners</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLearners}</div>
            <p className="text-xs text-muted-foreground">Unique individuals enrolled</p>
          </CardContent>
        </Card>
        <Card className="bg-card text-card-foreground shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses Completed</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coursesCompleted}</div>
            <p className="text-xs text-muted-foreground">Unique courses finished</p>
          </CardContent>
        </Card>
        <Card className="bg-card text-card-foreground shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates Issued</CardTitle>
            <AwardIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{certificatesIssued}</div>
            <p className="text-xs text-muted-foreground">Total certificates generated</p>
          </CardContent>
        </Card>
        <Card className="bg-card text-card-foreground shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Modules</CardTitle>
            <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeModules}</div>
            <p className="text-xs text-muted-foreground">Modules with active enrollments</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-8 p-6 shadow-sm">
        <CardTitle className="mb-4 text-lg">Filter Reports</CardTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="user-filter" className="mb-1 block text-sm font-medium">
              User Name
            </Label>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger id="user-filter">
                <SelectValue placeholder="Select User" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {Array.from(new Set(learnerProgressData.map((l) => l.name))).map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="department-filter" className="mb-1 block text-sm font-medium">
              Department
            </Label>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger id="department-filter">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {Array.from(new Set(teamReportData.map((t) => t.department))).map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="course-path-filter" className="mb-1 block text-sm font-medium">
              Course Path
            </Label>
            <Select value={selectedCoursePath} onValueChange={setSelectedCoursePath}>
              <SelectTrigger id="course-path-filter">
                <SelectValue placeholder="Select Course/Path" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses/Paths</SelectItem>
                {Array.from(new Set(courses.map((c) => c.title))).map((title) => (
                  <SelectItem key={title} value={title}>
                    {title}
                  </SelectItem>
                ))}
                {Array.from(new Set(trainingPaths.map((p) => p.name))).map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="start-date" className="text-sm font-medium">
              Date Range
            </Label>
            <div className="flex gap-2">
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="flex-1"
              />
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Module Engagement (Enrollments)</CardTitle>
          </CardHeader>
          <CardContent className="min-h-[300px]">
            {moduleEngagementChartData.length > 0 ? (
              <BarChart
                data={moduleEngagementChartData}
                categoryKey="label"
                valueKey="value"
                title="Module Enrollments"
                description="Number of enrollments per module"
              />
            ) : (
              <p className="text-center text-muted-foreground">
                No module engagement data available for selected filters.
              </p>
            )}
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Overall Learner Progress</CardTitle>
          </CardHeader>
          <CardContent className="min-h-[300px]">
            {overallProgressChartData.length > 0 && overallProgressChartData.some((d) => d.value > 0) ? (
              <PieChart
                data={overallProgressChartData}
                categoryKey="label"
                valueKey="value"
                title="Learner Status"
                description="Distribution of learners by completion status"
              />
            ) : (
              <p className="text-center text-muted-foreground">
                No learner progress data available for selected filters.
              </p>
            )}
          </CardContent>
        </Card>
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Certificates Issued Monthly Trend</CardTitle>
          </CardHeader>
          <CardContent className="min-h-[300px]">
            {monthlyCertificatesTrend.length > 0 ? (
              <LineChart
                data={monthlyCertificatesTrend}
                categoryKey="month"
                valueKey="count"
                title="Monthly Certificates"
                description="Number of certificates issued each month"
              />
            ) : (
              <p className="text-center text-muted-foreground">
                No certificate trend data available for selected filters.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Report Sections */}
      <div className="space-y-8">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Learner Progress Reports</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredLearnerProgress.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Learner</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Progress (%)</TableHead>
                    <TableHead>Time Spent (hrs)</TableHead>
                    <TableHead>Quiz Score (%)</TableHead>
                    <TableHead>Completed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLearnerProgress.map((learner, index) => (
                    <TableRow key={index}>
                      <TableCell>{learner.name}</TableCell>
                      <TableCell>{learner.course}</TableCell>
                      <TableCell>{learner.progress}</TableCell>
                      <TableCell>{learner.timeSpent}</TableCell>
                      <TableCell>{learner.quizScore}</TableCell>
                      <TableCell>{learner.completed ? "Yes" : "No"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-muted-foreground">
                No learner progress data available for selected filters.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Team/Department Reports</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTeamReport.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead>Avg. Completion Rate (%)</TableHead>
                    <TableHead>Most Completed Path</TableHead>
                    <TableHead>Members</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeamReport.map((team, index) => (
                    <TableRow key={index}>
                      <TableCell>{team.department}</TableCell>
                      <TableCell>{team.avgCompletionRate}</TableCell>
                      <TableCell>{team.mostCompletedPath}</TableCell>
                      <TableCell>{team.members}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-muted-foreground">
                No team/department data available for selected filters.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Module Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredModuleEngagement.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Module</TableHead>
                    <TableHead>Enrollments</TableHead>
                    <TableHead>Drop-off Rate (%)</TableHead>
                    <TableHead>Feedback Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredModuleEngagement.map((module, index) => (
                    <TableRow key={index}>
                      <TableCell>{module.module}</TableCell>
                      <TableCell>{module.enrollments}</TableCell>
                      <TableCell>{module.dropOffRate}</TableCell>
                      <TableCell>{module.feedbackScore}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-muted-foreground">
                No module engagement data available for selected filters.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Certificate Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredCertificateTracking.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Learner</TableHead>
                    <TableHead>Path</TableHead>
                    <TableHead>Date Issued</TableHead>
                    <TableHead>Validity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCertificateTracking.map((cert, index) => (
                    <TableRow key={index}>
                      <TableCell>{cert.learner}</TableCell>
                      <TableCell>{cert.path}</TableCell>
                      <TableCell>{format(new Date(cert.dateIssued), "PPP")}</TableCell>
                      <TableCell>{cert.validity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-muted-foreground">
                No certificate tracking data available for selected filters.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Placeholder Icons (assuming these are available from lucide-react)
function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

function AwardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15.477 12.89 1.515 2.41a1 1 0 0 0 1.815.063L22 10" />
      <path d="M2 12l3.65-1.825a1 1 0 0 1 1.2-.14L8.5 11l1.5-1.5L12 11l-1.5 1.5L12 14l-1.5 1.5L9 14l-1.85 1.85a1 1 0 0 1-1.2.14L2 12Z" />
      <path d="M12 15s1.5 2 2 2s2.333-1 3-2c.5-.833 1-1.5 1.5-1.5s1.333.5 2 1c.5.833 1 1.5 1.5 1.5s1.333-.5 2-1c.5-.833 1-1.5 1.5-1.5s1.333.5 2 1" />
      <path d="M12 15s1.5 2 2 2s2.333-1 3-2c.5-.833 1-1.5 1.5-1.5s1.333.5 2 1c.5.833 1 1.5 1.5 1.5s1.333-.5 2-1c.5-.833 1-1.5 1.5-1.5s1.333.5 2 1" />
      <circle cx="12" cy="8" r="2" />
    </svg>
  )
}

function BookOpenIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  )
}
