"use client"

import type React from "react"

import { useState, Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Calendar,
  MapPin,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Course, UpcomingProgram } from "@/lib/types"
import {
  upcomingPrograms,
  popularTrainingPaths,
} from "@/lib/data"
import { useUser } from "@/components/user-provider" // Import useUser hook
import UserProfile from "@/components/user-profile" // Import UserProfile component

interface UserDashboardProps {
  course: Course
}

export default function UserDashboard({ course }: UserDashboardProps) {
  const { userName } = useUser()
  const [activeMainTab, setActiveMainTab] = useState("upcoming")

  // No useEffect hooks needed for the simplified dashboard

  // Filter relevant programs based on category and show user's registered courses
  const relevantPrograms: UpcomingProgram[] = upcomingPrograms.filter(
    (program) => program.category === course.category || program.category === "Soft Skills",
  )
  
  // Get all courses for the user (this would typically come from a database)
  // For now, we'll just use the current course as the user's registered course
  const userCourses = [course]

  // No module generation functions needed for the simplified dashboard

  // No course-related functions needed for the simplified dashboard

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-800">{course.title}</h1>
          <p className="text-gray-600 mt-1">Welcome back, {userName || "Guest"}!</p>
        </div>
        <div className="flex items-center">
          <div className="w-12 h-12 relative mr-3">
            <Image src="/tata-steel-logo.png" alt="Tata Steel Logo" width={48} height={48} className="object-contain" />
          </div>
          <Link href="/courses" className="text-blue-600 hover:text-blue-800">
            Back to Courses
          </Link>
        </div>
      </div>

      <Tabs value={activeMainTab} onValueChange={setActiveMainTab} className="w-full" defaultValue="upcoming">
        <TabsList className="mb-4 grid w-full grid-cols-3 md:w-auto">
          <TabsTrigger value="upcoming">Upcoming Programs</TabsTrigger>
          <TabsTrigger value="my-courses">My Courses</TabsTrigger>
          <TabsTrigger value="profile">My Profile</TabsTrigger>
        </TabsList>
        {/* Upcoming Programs Tab Content */}
        <TabsContent value="upcoming" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Popular Training Paths Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Popular Training Paths</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {popularTrainingPaths.map((path) => (
                  <div key={path.slug} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
                      <span>{path.name}</span>
                    </div>
                    <Link href={`/training-paths/${path.slug}`} className="text-blue-600 hover:text-blue-800">
                      View
                    </Link>
                  </div>
                ))}
              </CardContent>
            </Card>
            {relevantPrograms.map((program) => (
              <Card key={program.id} className="overflow-hidden">
                <CardHeader className="p-4">
                  <CardTitle className="line-clamp-1 text-lg">{program.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {program.date} | {program.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="line-clamp-3 text-sm text-muted-foreground">{program.description}</div>
                  <div className="mt-2">
                    <span className="text-xs text-muted-foreground">Category: {program.category}</span>
                  </div>
                </CardContent>
                <div className="flex justify-end p-4 pt-0">
                  <Link href={`/events/${program.id}`} className="text-blue-600 hover:text-blue-800">
                    Learn More
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* My Courses Tab Content */}
        <TabsContent value="my-courses" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {userCourses.map((userCourse) => (
              <Card key={userCourse.id} className="overflow-hidden">
                <CardHeader className="p-4">
                  <CardTitle className="line-clamp-1 text-lg">{userCourse.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {userCourse.category} | {userCourse.level}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                   <div className="line-clamp-3 text-sm text-muted-foreground">{userCourse.desc}</div>
                 </CardContent>
                <div className="flex justify-end p-4 pt-0">
                  <Link href={`/courses/${userCourse.id}`} className="text-blue-600 hover:text-blue-800">
                    Continue Learning
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* User Profile Tab Content */}
        <TabsContent value="profile">
          <div className="w-full">
            {/* Import and use the UserProfile component */}
            <Suspense fallback={<div>Loading profile...</div>}>
              <UserProfile userName={userName} />
            </Suspense>
          </div>
        </TabsContent>
      </Tabs>


    </div>
  )
}
