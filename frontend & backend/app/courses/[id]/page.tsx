"use client"

import { useParams } from "next/navigation"
import CourseDetailPage from "@/components/course-detail-page"
import { courses } from "@/lib/data" // Ensure courses are imported

export default function CourseDetail() {
  const params = useParams()
  const courseIdParam = params.id as string // Keep it as string from params

  // Find the course by matching its ID with the param ID
  // Convert both to strings for comparison to ensure correct matching
  const course = courses.find((course) => String(course.id) === String(courseIdParam))

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold mb-4">Course Not Found</h1>
        <p className="text-gray-600">The course you are looking for does not exist.</p>
      </div>
    )
  }

  // Pass the entire course object to CourseDetailPage
  return <CourseDetailPage course={course} />
}
