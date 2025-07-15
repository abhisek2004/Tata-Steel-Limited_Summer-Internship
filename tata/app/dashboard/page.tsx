import UserDashboard from "@/components/user-dashboard"
import { courses } from "@/lib/data" // Assuming courses data is available here
import { ClientOnly } from "@/components/client-only" // Import the new ClientOnly component

export default function DashboardPage() {
  // Find the "Office 365" course or a default one to display on the dashboard
  const office365Course = courses.find((course) => course.title === "Office 365")

  if (!office365Course) {
    // Handle case where course is not found, e.g., redirect or show an error message
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-600">
          Course not found. Please select a course from the{" "}
          <a href="/courses" className="text-blue-600 hover:underline">
            Courses page
          </a>
          .
        </p>
      </div>
    )
  }

  return (
    <ClientOnly>
      <UserDashboard course={office365Course} />
    </ClientOnly>
  )
}
