"use client"

import type React from "react"

import { useState, useEffect } from "react" // Import useEffect
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar, MapPin, Users, Clock } from "lucide-react" // Added Clock
import { upcomingPrograms } from "@/lib/data"
import { useSearchParams } from "next/navigation" // Import useSearchParams
import { useRouter } from "next/navigation" // Import useRouter

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<(typeof upcomingPrograms)[0] | null>(null) // Use specific type
  const [showRegistrationForm, setShowRegistrationForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    employeeId: "",
    reason: "",
  })

  const searchParams = useSearchParams()
  const router = useRouter() // Initialize useRouter

  useEffect(() => {
    const eventId = searchParams.get("event")
    if (eventId) {
      const event = upcomingPrograms.find((p) => p.id === eventId)
      if (event) {
        setSelectedEvent(event)
      }
    }
  }, [searchParams])

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentMonth)
    newDate.setMonth(currentMonth.getMonth() + direction)
    setCurrentMonth(newDate)
  }

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  const getProgramsForDate = (dateStr: string) => {
    return upcomingPrograms.filter((program) => {
      const programDate = new Date(program.date)
      return programDate.toISOString().slice(0, 10) === dateStr
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Registration data:", formData)
    // Redirect to the new event dashboard page
    if (selectedEvent) {
      router.push(`/events/${selectedEvent.id}/dashboard?name=${encodeURIComponent(formData.name)}`)
    }
  }

  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDay = getFirstDayOfMonth(currentMonth)
  const days = []

  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto">
        <div className="flex items-center mb-8">
          <Button variant="ghost" asChild className="mr-4">
            <Link href="/">
              <ArrowLeft size={20} />
            </Link>
          </Button>
          <h1 className="text-4xl font-bold text-blue-800">Training Calendar</h1>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <Button variant="outline" onClick={() => navigateMonth(-1)}>
              <ChevronLeft size={20} />
            </Button>
            <h2 className="text-2xl font-semibold text-blue-700">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h2>
            <Button variant="outline" onClick={() => navigateMonth(1)}>
              <ChevronRight size={20} />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="p-2 text-center font-semibold text-gray-600 bg-gray-100 rounded">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days.map((day, idx) => {
              if (!day) return <div key={idx} className="p-2"></div>

              const dateStr = formatDate(currentMonth.getFullYear(), currentMonth.getMonth(), day)
              const programs = getProgramsForDate(dateStr)

              return (
                <div key={idx} className="p-2 min-h-[80px] border rounded hover:bg-gray-50">
                  <div className="font-semibold text-gray-800 mb-1">{day}</div>
                  {programs.map((program, pIdx) => (
                    <div
                      key={pIdx}
                      className="text-xs bg-blue-100 text-blue-800 rounded px-1 py-0.5 mb-1 truncate cursor-pointer hover:bg-blue-200"
                      onClick={() => setSelectedEvent(program)}
                    >
                      {program.title}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-semibold text-blue-700 mb-6">Upcoming Programs</h3>
          <div className="space-y-4">
            {upcomingPrograms.map((program, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-gray-800">{program.title}</h4>
                  <div className="flex space-x-4 text-sm text-gray-600">
                    <span>
                      📅{" "}
                      {new Date(program.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <span>🏷️ {program.category}</span>
                    <span>🏢 {program.location}</span>
                  </div>
                </div>
                <div className="space-x-2">
                  <Button variant="outline" size="sm">
                    Notify Me
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedEvent(program)
                      setShowRegistrationForm(false)
                    }}
                  >
                    Register
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Event Detail Dialog */}
        {selectedEvent && (
          <Dialog
            open={!!selectedEvent}
            onOpenChange={(open) => {
              if (!open) {
                setSelectedEvent(null)
                setShowRegistrationForm(false)
              }
            }}
          >
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              {!showRegistrationForm ? (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-2xl">{selectedEvent.title}</DialogTitle>
                  </DialogHeader>

                  <div className="mt-4">
                    <p className="text-gray-700 mb-6">{selectedEvent.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <div className="flex items-center mb-4">
                          <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                          <div>
                            <h4 className="font-medium">Date</h4>
                            <p className="text-sm text-gray-600">
                              {new Date(selectedEvent.date).toLocaleDateString("en-US", {
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
                            <p className="text-sm text-gray-600">{selectedEvent.time}</p>
                          </div>
                        </div>

                        <div className="flex items-center mb-4">
                          <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                          <div>
                            <h4 className="font-medium">Location</h4>
                            <p className="text-sm text-gray-600">{selectedEvent.location}</p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <Users className="h-5 w-5 text-blue-600 mr-2" />
                          <div>
                            <h4 className="font-medium">Capacity</h4>
                            <p className="text-sm text-gray-600">
                              {selectedEvent.registered} / {selectedEvent.capacity} registered
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-2">Prerequisites</h4>
                        <p className="text-sm">{selectedEvent.prerequisites}</p>

                        <h4 className="font-medium text-blue-800 mt-4 mb-2">Materials Provided</h4>
                        <ul className="text-sm list-disc pl-5 space-y-1">
                          {selectedEvent.materials.map((material, idx) => (
                            <li key={idx}>{material}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-medium text-lg mb-3">Agenda</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <ul className="space-y-2">
                          {selectedEvent.agenda.map((item, idx) => (
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
                        {selectedEvent.speakers.map((speaker: any, idx: number) => (
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

                    <div className="flex justify-end mt-6">
                      <Button onClick={() => setShowRegistrationForm(true)}>Register for Event</Button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <DialogHeader>
                    <DialogTitle>Register for {selectedEvent.title}</DialogTitle>
                  </DialogHeader>

                  <form onSubmit={handleRegister} className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          placeholder="Enter your email"
                        />
                      </div>

                      <div>
                        <label htmlFor="employeeId" className="block text-sm font-medium mb-1">
                          Employee ID *
                        </label>
                        <input
                          type="text"
                          id="employeeId"
                          name="employeeId"
                          required
                          value={formData.employeeId}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          placeholder="Enter your employee ID"
                        />
                      </div>

                      <div>
                        <label htmlFor="department" className="block text-sm font-medium mb-1">
                          Department *
                        </label>
                        <select
                          id="department"
                          name="department"
                          required
                          value={formData.department}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Select department</option>
                          <option value="production">Production</option>
                          <option value="maintenance">Maintenance</option>
                          <option value="hr">Human Resources</option>
                          <option value="finance">Finance</option>
                          <option value="it">Information Technology</option>
                          <option value="quality">Quality Control</option>
                          <option value="safety">Safety</option>
                          <option value="logistics">Logistics</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="reason" className="block text-sm font-medium mb-1">
                        Reason for Attending *
                      </label>
                      <textarea
                        id="reason"
                        name="reason"
                        required
                        value={formData.reason}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        rows={3}
                        placeholder="Briefly explain why you want to attend this event"
                      />
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setShowRegistrationForm(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Complete Registration</Button>
                    </div>
                  </form>
                </>
              )}
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
