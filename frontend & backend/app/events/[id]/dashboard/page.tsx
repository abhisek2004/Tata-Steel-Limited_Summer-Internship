"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calendar, Clock, MapPin, Users, Download, CheckCircle, FileText, User } from "lucide-react"
import { upcomingPrograms } from "@/lib/data"
import { downloadCertificate, downloadResource } from "@/lib/download-utils"

export default function EventDashboardPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const eventId = params.id as string
  const userName = searchParams.get("name") || "Employee"

  const event = upcomingPrograms.find((p) => p.id === eventId)

  const [isEventCompleted, setIsEventCompleted] = useState(false)
  const [certificateName, setCertificateName] = useState(userName)
  const [downloadingResource, setDownloadingResource] = useState<string | null>(null)

  useEffect(() => {
    // In a real application, you would fetch the completion status from a backend
    // For this demo, we'll use localStorage to persist completion status
    const storedCompletion = localStorage.getItem(`event-${eventId}-completed`)
    if (storedCompletion === "true") {
      setIsEventCompleted(true)
    }
  }, [eventId])

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

  const handleMarkComplete = () => {
    setIsEventCompleted(true)
    localStorage.setItem(`event-${eventId}-completed`, "true") // Persist completion status
    alert("Event marked as complete! You can now download your certificate.")
  }

  const handleGenerateCertificate = async () => {
    try {
      const result = await downloadCertificate(event.title, certificateName)
      alert(result.message)
    } catch (error: any) {
      console.error("Error generating certificate:", error)
      alert(`Failed to generate certificate. Please try again. Error: ${error.message}`)
    }
  }

  const handleResourceDownload = async (resourceName: string) => {
    try {
      setDownloadingResource(resourceName)
      const result = await downloadResource(event.title, "pdf", resourceName) // Assuming all materials are PDFs for simplicity
      alert(result.message)
    } catch (error: any) {
      console.error(`Error downloading ${resourceName}:`, error)
      alert(`Failed to download ${resourceName}. Please try again. Error: ${error.message}`)
    } finally {
      setDownloadingResource(null)
    }
  }

  // Ensure meetingDetails is always defined, even if with placeholder values
  const meetingDetails = event.meetingDetails || {
    link: "#", // Placeholder link
    id: "N/A",
    password: "N/A",
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto">
        <div className="flex items-center mb-8">
          <Button variant="ghost" asChild className="mr-4">
            <Link href="/calendar">
              <ArrowLeft size={20} />
            </Link>
          </Button>
          <h1 className="text-4xl font-bold text-blue-800">Event Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl text-blue-700">{event.title}</CardTitle>
                <p className="text-gray-600 mt-1">Welcome, {userName}!</p>
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

                <div className="mb-6">
                  <h4 className="font-medium text-lg mb-3">Speakers</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {event.speakers.map((speaker: any, idx: number) => (
                      <div key={idx} className="bg-gray-50 p-4 rounded-lg flex items-start">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold mr-3">
                          {typeof speaker === "string"
                            ? speaker
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                            : speaker.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                        </div>
                        <div>
                          <h5 className="font-medium">{typeof speaker === "string" ? speaker : speaker.name}</h5>
                          {typeof speaker !== "string" && (
                            <>
                              <p className="text-sm text-gray-600">{speaker.role}</p>
                              <p className="text-xs text-gray-500 mt-1">{speaker.bio}</p>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar / Actions Area */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Your Event Status</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {!isEventCompleted ? (
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Mark this event as complete once you have attended and finished all requirements.
                    </p>
                    <Button className="w-full" onClick={handleMarkComplete}>
                      Mark as Complete
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                    <h4 className="font-semibold text-green-800">Event Completed!</h4>
                    <p className="text-green-700 text-sm">Congratulations! You've completed this event.</p>
                    <p className="text-sm text-gray-600 mt-4">Please confirm your name for the certificate:</p>
                    <input
                      type="text"
                      value={certificateName}
                      onChange={(e) => setCertificateName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Enter your full name"
                    />
                    <Button className="w-full" onClick={handleGenerateCertificate}>
                      <Download className="mr-2 h-4 w-4" />
                      Download Certificate
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Important PDFs & Materials</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {event.materials.length > 0 ? (
                  event.materials.map((material, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-100 rounded-md">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="font-medium text-sm">{material}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={downloadingResource === material}
                        onClick={() => handleResourceDownload(material)}
                      >
                        {downloadingResource === material ? "..." : <Download className="h-4 w-4" />}
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-sm">No additional materials available for this event.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/calendar">
                    <Calendar className="mr-2 h-4 w-4" />
                    View Calendar
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <User className="mr-2 h-4 w-4" />
                  Contact Organizer
                </Button>
                {/* Always render Join Event Online section with fallback details */}
                <div className="border-t pt-4 mt-4 space-y-2">
                  <h4 className="font-semibold text-lg mb-2">Join Event Online</h4>
                  <Button className="w-full justify-start" asChild>
                    <a href={meetingDetails.link} target="_blank" rel="noopener noreferrer">
                      <Users className="mr-2 h-4 w-4" />
                      Click here to Join Event
                    </a>
                  </Button>
                  <div className="text-sm text-gray-700">
                    <p className="font-medium">
                      Meeting ID: <span className="font-normal">{meetingDetails.id}</span>
                    </p>
                    <p className="font-medium">
                      Password: <span className="font-normal">{meetingDetails.password}</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
