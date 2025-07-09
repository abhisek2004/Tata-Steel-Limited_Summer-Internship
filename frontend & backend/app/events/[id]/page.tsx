"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft, Calendar, Clock, MapPin, Users } from "lucide-react"
import { upcomingPrograms } from "@/lib/data"

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.id as string

  // Find the event by ID
  const event = upcomingPrograms.find((p) => p.id === eventId)

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Event Not Found</h1>
        <p className="text-gray-700 mb-6">The event you are looking for does not exist or has been removed.</p>
        <Button asChild>
          <Link href="/calendar">Back to Calendar</Link>
        </Button>
      </div>
    )
  }

  const handleRegister = () => {
    // Redirect to the event dashboard
    router.push(`/events/${eventId}/dashboard`)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center mb-8">
          <Button variant="ghost" asChild className="mr-4">
            <Link href="/calendar">
              <ArrowLeft size={20} />
            </Link>
          </Button>
          <h1 className="text-4xl font-bold text-blue-800">{event.title}</h1>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-700">{event.title}</CardTitle>
            <CardDescription className="text-gray-600">
              {event.category} | {event.date}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-gray-700 mb-6">{event.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <div className="flex items-center mb-4">
                  <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <h4 className="font-medium">Date</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  <Clock className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <h4 className="font-medium">Time</h4>
                    <p className="text-sm text-gray-600">{event.time}</p>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <h4 className="font-medium">Location</h4>
                    <p className="text-sm text-gray-600">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Users className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <h4 className="font-medium">Capacity</h4>
                    <p className="text-sm text-gray-600">
                      {event.registered} / {event.capacity} registered
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Prerequisites</h4>
                <p className="text-sm">{event.prerequisites}</p>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-medium text-lg mb-3">Agenda</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="space-y-2">
                  {event.agenda.map((item, idx) => (
                    <li key={idx} className="text-sm">
                      <span className="font-medium">{item.split(":")[0]}:</span>
                      {item.split(":").slice(1).join(":")}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="text-center mt-8">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg"
                onClick={handleRegister}
              >
                Register for Event
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}