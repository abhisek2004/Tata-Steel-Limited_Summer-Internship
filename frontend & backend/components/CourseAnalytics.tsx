"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart } from "@/components/charts/bar-chart"
import { PieChart } from "@/components/charts/pie-chart"
import { LineChart } from "@/components/charts/line-chart"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from "recharts"
import { Progress } from "@/components/ui/progress"
import { Clock, Award, TrendingUp, BarChart2, PieChart as PieChartIcon, Activity } from "lucide-react"

interface CourseAnalyticsProps {
  courseId?: string
  courseName?: string
  userName?: string
  previewMode?: boolean
}

export default function CourseAnalytics({ courseId = "1", courseName = "Steel Manufacturing Fundamentals", userName = "User", previewMode = false }: CourseAnalyticsProps) {
  const [activeView, setActiveView] = useState("overview")

  // Dummy data for module completion
  const moduleCompletionData = [
    { name: "Module 1", completed: 100 },
    { name: "Module 2", completed: 100 },
    { name: "Module 3", completed: 85 },
    { name: "Module 4", completed: 70 },
    { name: "Module 5", completed: 40 },
    { name: "Module 6", completed: 0 },
  ]

  // Dummy data for time spent
  const timeSpentData = [
    { name: "Video Lectures", value: 240 },
    { name: "Reading Materials", value: 180 },
    { name: "Quizzes", value: 90 },
    { name: "Assignments", value: 150 },
    { name: "Discussion", value: 60 },
  ]

  // Dummy data for performance over time
  const performanceData = [
    { week: "Week 1", score: 75 },
    { week: "Week 2", score: 82 },
    { week: "Week 3", score: 78 },
    { week: "Week 4", score: 85 },
    { week: "Week 5", score: 90 },
    { week: "Week 6", score: 88 },
  ]

  // Dummy data for learning growth
  const learningGrowthData = [
    { day: "Day 1", knowledge: 10 },
    { day: "Day 5", knowledge: 25 },
    { day: "Day 10", knowledge: 35 },
    { day: "Day 15", knowledge: 48 },
    { day: "Day 20", knowledge: 60 },
    { day: "Day 25", knowledge: 75 },
    { day: "Day 30", knowledge: 85 },
  ]

  // Dummy data for user satisfaction
  const satisfactionData = [
    { category: "Content Quality", satisfied: 85, neutral: 10, unsatisfied: 5 },
    { category: "Instructor", satisfied: 90, neutral: 8, unsatisfied: 2 },
    { category: "Platform", satisfied: 75, neutral: 15, unsatisfied: 10 },
    { category: "Support", satisfied: 80, neutral: 12, unsatisfied: 8 },
  ]

  // Dummy data for skill coverage
  const skillCoverageData = [
    { subject: "Technical Knowledge", A: 80, fullMark: 100 },
    { subject: "Problem Solving", A: 75, fullMark: 100 },
    { subject: "Critical Thinking", A: 85, fullMark: 100 },
    { subject: "Practical Application", A: 70, fullMark: 100 },
    { subject: "Industry Awareness", A: 90, fullMark: 100 },
    { subject: "Safety Protocols", A: 95, fullMark: 100 },
  ]

  // Calculate average quiz score
  const averageQuizScore = 84
  
  // Calculate total time spent
  const totalTimeSpent = timeSpentData.reduce((acc, item) => acc + item.value, 0)
  
  // Current streak (dummy data)
  const currentStreak = 12

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveView}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="time">Time Spent</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="satisfaction">Satisfaction</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Key Performance Metrics */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Key Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Average Quiz Score</p>
                      <p className="text-2xl font-bold">{averageQuizScore}%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Total Time Spent</p>
                      <p className="text-2xl font-bold">{Math.floor(totalTimeSpent / 60)} hrs {totalTimeSpent % 60} min</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Current Streak</p>
                      <p className="text-2xl font-bold">{currentStreak} days</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Objectives */}
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Course Aims & Objectives</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Technical Proficiency</p>
                    <Progress value={85} className="h-2" />
                    <p className="text-xs text-muted-foreground">85% of technical skills acquired</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Industry Knowledge</p>
                    <Progress value={78} className="h-2" />
                    <p className="text-xs text-muted-foreground">78% of industry concepts mastered</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Practical Application</p>
                    <Progress value={65} className="h-2" />
                    <p className="text-xs text-muted-foreground">65% of practical skills demonstrated</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Module Completion */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Module Completion</CardTitle>
                <CardDescription>Your progress through course modules</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart 
                  data={moduleCompletionData} 
                  dataKey="completed" 
                  title="Module Completion" 
                  description="Percentage of each module completed"
                />
              </CardContent>
            </Card>

            {/* Time Spent Distribution */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Time Spent Distribution</CardTitle>
                <CardDescription>How you've spent your learning time</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart 
                  data={timeSpentData} 
                  categoryKey="name" 
                  valueKey="value" 
                  title="Time Spent (minutes)" 
                  description="Distribution of time across activities"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Modules Tab */}
        <TabsContent value="modules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Module Completion</CardTitle>
              <CardDescription>Your progress through each module</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <BarChart 
                data={moduleCompletionData} 
                dataKey="completed" 
                title="Module Completion" 
                description="Percentage of each module completed"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Time Spent Tab */}
        <TabsContent value="time" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Time Spent Distribution</CardTitle>
              <CardDescription>How you've spent your learning time</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <PieChart 
                data={timeSpentData} 
                categoryKey="name" 
                valueKey="value" 
                title="Time Spent (minutes)" 
                description="Distribution of time across activities"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Over Time</CardTitle>
              <CardDescription>Your quiz scores over the course duration</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <LineChart 
                data={performanceData} 
                dataKey="score" 
                title="Weekly Performance" 
                description="Quiz scores over time"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cumulative Learning Growth</CardTitle>
              <CardDescription>Your knowledge acquisition over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={learningGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="knowledge" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Satisfaction Tab */}
        <TabsContent value="satisfaction" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Satisfaction Breakdown</CardTitle>
              <CardDescription>Your feedback on different aspects of the course</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={satisfactionData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="satisfied" name="Satisfied" fill="#22c55e" />
                  <Bar dataKey="neutral" name="Neutral" fill="#f59e0b" />
                  <Bar dataKey="unsatisfied" name="Unsatisfied" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Skill Coverage Assessment</CardTitle>
              <CardDescription>Your proficiency across different skill areas</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={150} data={skillCoverageData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Skills" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}