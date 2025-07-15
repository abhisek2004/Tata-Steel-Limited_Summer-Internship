import { Suspense } from "react"
import CalendarPage from "@/components/calendar-page"

export default function Calendar() {
  return (
    <Suspense fallback={<div>Loading calendar...</div>}>
      <CalendarPage />
    </Suspense>
  )
}
