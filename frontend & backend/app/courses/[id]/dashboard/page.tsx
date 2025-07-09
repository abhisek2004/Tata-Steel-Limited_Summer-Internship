"use client"

import { useParams, useSearchParams } from "next/navigation"
import { courses } from "@/lib/data"
import CourseDashboardContent from "@/components/course-dashboard-content"

export default function CourseDashboardPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const courseId = params.id as string
  const userName = searchParams.get("userName") || "User"

  // Find the course by matching its ID with the param ID
  // Convert both to strings for comparison to ensure correct matching
  const course = courses.find((course) => String(course.id) === String(courseId))

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold mb-4">Course Not Found</h1>
        <p className="text-gray-600">The course you are looking for does not exist.</p>
      </div>
    )
  }

  // Pass the course to CourseDashboardContent
  return <CourseDashboardContent course={course} userName={userName} />
}