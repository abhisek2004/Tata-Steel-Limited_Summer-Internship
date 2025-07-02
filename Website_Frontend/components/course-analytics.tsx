"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import {
  Bar,
  BarChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  Line,
  LineChart,
  Area,
  AreaChart,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts"
import type { Course } from "@/lib/types"

interface CourseAnalyticsProps {
  course: Course
  // In a real application, this data would come from a backend
  // For now, we'll use dummy data
}

const moduleCompletionData = [
  { name: "Mod 1", completed: 100 },
  { name: "Mod 2", completed: 80 },
  { name: "Mod 3", completed: 60 },
  { name: "Mod 4", completed: 40 },
  { name: "Mod 5", completed: 20 },
  { name: "Mod 6", completed: 0 },
]

const timeSpentData = [
  { name: "Lectures", value: 45, color: "hsl(var(--chart-1))" },
  { name: "Exercises", value: 30, color: "hsl(var(--chart-2))" },
  { name: "Reading", value: 15, color: "hsl(var(--chart-3))" },
  { name: "Quizzes", value: 10, color: "hsl(var(--chart-4))" },
]

const performanceData = [
  { name: "Week 1", score: 70 },
  { name: "Week 2", score: 75 },
  { name: "Week 3", score: 80 },
  { name: "Week 4", score: 85 },
  { name: "Week 5", score: 90 },
  { name: "Week 6", score: 92 },
]

const learningGrowthData = [
  { name: "Module 1", progress: 20, cumulative: 20 },
  { name: "Module 2", progress: 30, cumulative: 50 },
  { name: "Module 3", progress: 25, cumulative: 75 },
  { name: "Module 4", progress: 15, cumulative: 90 },
  { name: "Module 5", progress: 10, cumulative: 100 },
]

const satisfactionData = [
  { category: "UI/UX", excellent: 40, good: 30, average: 20, poor: 10 },
  { category: "Content", excellent: 50, good: 25, average: 15, poor: 10 },
  { category: "Instructor", excellent: 60, good: 20, average: 10, poor: 10 },
]

const skillCoverageData = [
  { skill: "Problem Solving", A: 85, fullMark: 100 },
  { skill: "Critical Thinking", A: 90, fullMark: 100 },
  { skill: "Communication", A: 75, fullMark: 100 },
  { skill: "Technical Aptitude", A: 95, fullMark: 100 },
  { skill: "Teamwork", A: 80, fullMark: 100 },
  { skill: "Adaptability", A: 88, fullMark: 100 },
]

const PIE_COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"]

export default function CourseAnalytics({ course }: CourseAnalyticsProps) {
  const totalModules = course.modules || 0
  const completedModules = Math.floor(Math.random() * (totalModules + 1)) // Dummy completed modules
  const completionPercentage = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0
  const averageScore = Math.floor(Math.random() * (100 - 70 + 1)) + 70 // Dummy average score between 70-100
  const timeSpentHours =
    Math.floor(
      Math.random() * (course.duration.match(/\d+/) ? Number.parseInt(course.duration.match(/\d+/)![0]) : 50),
    ) + 10 // Dummy time spent

  return (
    <div className="space-y-8">
      {/* Course Objectives and Aims */}
      <Card>
        <CardHeader>
          <CardTitle>Course Objectives & Aims</CardTitle>
          <CardDescription>What you aimed to achieve by the end of this course.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Main Objectives:</h3>
            {course.objectives && course.objectives.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {course.objectives.map((obj, index) => (
                  <li key={index}>{obj}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No specific objectives listed for this course.</p>
            )}
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Key Topics Covered (Aims):</h3>
            {course.curriculum && course.curriculum.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {course.curriculum.map((topic, index) => (
                  <li key={index}>{topic}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No detailed curriculum available for this course.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Progress and Completion Charts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Overall Course Progress</CardTitle>
            <CardDescription>Your overall completion for {course.title}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
              <svg className="h-full w-full" viewBox="0 0 100 100">
                <circle
                  className="text-gray-200"
                  strokeWidth="10"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-primary"
                  strokeWidth="10"
                  strokeDasharray={`${completionPercentage}, 100`}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
              </svg>
              <div className="absolute text-2xl font-bold text-primary">{completionPercentage}%</div>
            </div>
            <div className="mt-4 text-center text-sm text-gray-600">
              {completedModules} of {totalModules} modules completed
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Module Completion Status</CardTitle>
            <CardDescription>Progress across individual modules</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                completed: {
                  label: "Completed (%)",
                  color: "hsl(var(--primary))",
                },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={moduleCompletionData} margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => String(value).split(" ")[1] || String(value)}
                  />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="completed" fill="var(--color-completed)" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Time Spent Distribution</CardTitle>
            <CardDescription>Breakdown of your engagement</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-6">
            <ChartContainer
              config={{
                Lectures: { label: "Lectures", color: "hsl(var(--chart-1))" },
                Exercises: { label: "Exercises", color: "hsl(var(--chart-2))" },
                Reading: { label: "Reading", color: "hsl(var(--chart-3))" },
                Quizzes: { label: "Quizzes", color: "hsl(var(--chart-4))" },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={timeSpentData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {timeSpentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance and Metrics Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance Over Time</CardTitle>
            <CardDescription>Your quiz scores and progress across weeks</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                score: {
                  label: "Score (%)",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[250px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line type="monotone" dataKey="score" stroke="var(--color-score)" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cumulative Learning Growth</CardTitle>
            <CardDescription>Overall knowledge retention and growth</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                cumulative: {
                  label: "Cumulative Progress (%)",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[250px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={learningGrowthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="cumulative"
                    stroke="var(--color-cumulative)"
                    fill="var(--color-cumulative)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Survey / Feedback Data Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Satisfaction Breakdown</CardTitle>
            <CardDescription>Feedback on different aspects of the course</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                excellent: { label: "Excellent", color: "hsl(var(--chart-1))" },
                good: { label: "Good", color: "hsl(var(--chart-2))" },
                average: { label: "Average", color: "hsl(var(--chart-3))" },
                poor: { label: "Poor", color: "hsl(var(--chart-4))" },
              }}
              className="h-[250px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={satisfactionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="excellent" stackId="a" fill="var(--color-excellent)" />
                  <Bar dataKey="good" stackId="a" fill="var(--color-good)" />
                  <Bar dataKey="average" stackId="a" fill="var(--color-average)" />
                  <Bar dataKey="poor" stackId="a" fill="var(--color-poor)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skill Coverage Assessment</CardTitle>
            <CardDescription>How well different skills are covered in the course</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                A: { label: "Score", color: "hsl(var(--chart-1))" },
              }}
              className="h-[250px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillCoverageData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="skill" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Skill Score"
                    dataKey="A"
                    stroke="var(--color-A)"
                    fill="var(--color-A)"
                    fillOpacity={0.6}
                  />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Key Performance Metrics</CardTitle>
          <CardDescription>Important statistics for your course</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 p-6">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Average Quiz Score:</span>
            <span className="text-lg font-bold text-primary">{averageScore}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Total Time Spent:</span>
            <span className="text-lg font-bold text-primary">{timeSpentHours} hours</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Current Streak:</span>
            <span className="text-lg font-bold text-primary">7 days</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
