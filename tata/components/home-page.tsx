"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Award,
  BookOpen,
  Clock,
  Star,
  MapPin,
  User,
  Mail,
  CalendarDays,
  Target,
  Globe,
  ChevronUp,
  ChevronDown,
} from "lucide-react"
import { achievements, courses, facilities, testimonials, upcomingPrograms, techNews } from "@/lib/data"
import { useState, useEffect } from "react" // Keep useRef for potential future use, but not for this specific scroll
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ChatWidget from "@/components/chat-widget"

// Map icon names to Lucide React components
const LucideIconMap: { [key: string]: any } = {
  Award: Award,
  Target: Target,
  Globe: Globe,
}

// Data for partner companies with specific logo paths
const partnerCompanies = [
  { name: "Jaguar Land Rover", logoUrl: "/images/jaguar-land-rover-logo.png" },
  { name: "Starbucks", logoUrl: "/images/starbucks-logo.png" },
  { name: "Zara", logoUrl: "/images/zara-logo.png" },
  { name: "Westside", logoUrl: "/images/westside-logo.png" },
  { name: "Croma", logoUrl: "/images/croma-logo.png" },
  { name: "Tetley", logoUrl: "/images/tetley-logo.png" },
  { name: "Tata Salt", logoUrl: "/images/tata-salt-logo.png" },
  { name: "Titan Company", logoUrl: "/images/titan-company-logo.png" },
  { name: "TCS", logoUrl: "/images/tcs-logo.png" },
  { name: "Tata Motors", logoUrl: "/images/tata-motors-logo.png" }, // Added Tata Motors logo
  { name: "IHCL", logoUrl: "/images/ihcl-logo.png" },
  { name: "Voltas", logoUrl: "/images/voltas-logo.png" },
  { name: "Hitachi", logoUrl: "/images/hitachi-logo.png" },
  { name: "Air India", logoUrl: "/images/air-india-logo.png" },
  { name: "Nelco", logoUrl: "/images/nelco-logo.png" },
  { name: "Tata Power", logoUrl: "/images/tata-power-logo.png" },
  { name: "Tata IPL", logoUrl: "/images/tata-ipl-logo.png" },
]

export default function HomePage() {
  const [selectedNews, setSelectedNews] = useState<(typeof techNews)[0] | null>(null)
  const [showNewsDialog, setShowNewsDialog] = useState(false)
  const [selectedDomain, setSelectedDomain] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const [showScrollToBottom, setShowScrollToBottom] = useState(true)

  // Removed logoScrollRef and its associated useEffect for auto-scrolling

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 200)
      setShowScrollToBottom(window.scrollY < document.documentElement.scrollHeight - window.innerHeight - 200)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    })
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "Advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTimeAgo = (date: Date): string => {
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return `${seconds} seconds ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes} minutes ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hours ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`
    const weeks = Math.floor(days / 7)
    if (weeks < 4) return `${weeks} week${weeks > 1 ? "s" : ""} ago`
    const months = Math.floor(days / 30)
    if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`
    const years = Math.floor(days / 365)
    return `${years} year${years > 1 ? "s" : ""} ago`
  }

  const today = new Date()
  const todaySessions = upcomingPrograms.filter((event) => {
    const eventDate = new Date(event.date)
    return (
      eventDate.getDate() === today.getDate() &&
      eventDate.getMonth() === today.getMonth() &&
      eventDate.getFullYear() === today.getFullYear()
    )
  })

  const handleNewsClick = (newsItem: (typeof techNews)[0]) => {
    setSelectedNews(newsItem)
    setShowNewsDialog(true)
  }

  const handleNewsletterSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Subscribing to newsletter:", { email, selectedDomain })
    alert(`Subscribed to ${selectedDomain || "all"} newsletter with ${email}!`)
    setEmail("")
    setSelectedDomain("")
  }

  const allTechNews = techNews.sort((a, b) => b.date.getTime() - a.date.getTime())

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary/90 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 relative">
              <Image
                src="/tata-steel-logo.png"
                alt="Tata Steel Logo"
                width={120}
                height={48}
                className="object-contain mx-auto"
              />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4">Tata Steel - Learning & Development</h1>
          <p className="text-xl mb-8">Empowering Employees Through Continuous Learning</p>
          <div className="flex justify-center space-x-4">
            <Button asChild className="bg-white text-primary hover:bg-gray-100 px-8 py-3 text-lg">
              <Link href="/courses">Explore Courses</Link>
            </Button>
            <Button asChild className="bg-white text-primary hover:bg-gray-100 px-8 py-3 text-lg">
              <Link href="/calendar">View Calendar</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Achievements Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-primary mb-12">Achievements at a Glance</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="text-center p-6 bg-gradient-to-br from-primary to-primary/90 text-white rounded-lg">
              <div className="text-4xl font-bold mb-2">{achievements.yearsInOperation}</div>
              <div className="text-lg">Years in Operation</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg">
              <div className="text-4xl font-bold mb-2">{achievements.totalEmployeesTrained.toLocaleString()}</div>
              <div className="text-lg">Total Employees Trained</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg">
              <div className="text-4xl font-bold mb-2">{achievements.yearlyTraining.toLocaleString()}</div>
              <div className="text-lg">Trained This Year</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg">
              <div className="text-4xl font-bold mb-2">{achievements.partnerships}</div>
              <div className="text-lg">Industry Partnerships</div>
            </div>
          </div>

          {/* Updated Industry Recognition Section */}
          <div className="bg-gray-50 p-8 rounded-lg">
            <h3 className="text-2xl font-semibold text-primary mb-8 text-center">Industry Recognition</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {achievements.recognitions.map((recognition, idx) => {
                const IconComponent = LucideIconMap[recognition.icon]
                return (
                  <div key={idx} className="flex flex-col items-center text-center p-4">
                    {IconComponent && (
                      <IconComponent
                        className="w-16 h-16 mb-4"
                        style={{
                          color:
                            idx === 0 ? "gold" : idx === 1 ? "cornflowerblue" : idx === 2 ? "mediumseagreen" : "gray",
                        }}
                      />
                    )}
                    <h4 className="text-lg font-bold text-primary mb-1">{recognition.title}</h4>
                    <p className="text-gray-600 text-sm">{recognition.subtitle}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Facilities Section */}
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-6">
              <h2 className="text-4xl font-bold text-center text-primary mb-12">Major Facilities at Kalinganagar</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {facilities.map((facility, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                    <div className="text-4xl mb-4">{facility.icon}</div>
                    <h3 className="text-xl font-semibold text-primary mb-2">{facility.name}</h3>
                    <p className="text-gray-600">{facility.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>

      {/* Today's Training Sessions, Tech Updates, and Technical Newsletter */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Today's Training Sessions */}
            <Card className="bg-white shadow-lg">
              <CardHeader className="flex flex-row items-center space-x-2 p-4 border-b">
                <CalendarDays className="w-6 h-6 text-primary" />
                <CardTitle className="text-xl font-bold text-primary">Today's Training Sessions</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {todaySessions.length > 0 ? (
                  todaySessions.slice(0, 3).map((event) => (
                    <div key={event.id} className="border-b pb-3 last:border-b-0 last:pb-0">
                      <h3 className="text-lg font-semibold text-primary">{event.title}</h3>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Clock size={14} className="mr-1" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <MapPin size={14} className="mr-1" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <User size={14} className="mr-1" />
                        <span>{event.speakers[0]?.name || "N/A"}</span>
                      </div>
                      <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-accent text-primary rounded-full">
                        {event.category}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No training sessions scheduled for today.</p>
                )}
                <Button asChild variant="outline" className="w-full mt-4">
                  <Link href="/calendar">View Full Calendar</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Tech Updates */}
            <Card className="bg-white shadow-lg">
              <CardHeader className="flex flex-row items-center space-x-2 p-4 border-b">
                <BookOpen className="w-6 h-6 text-green-600" />
                <CardTitle className="text-xl font-bold text-primary">Tech Updates</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {allTechNews.slice(0, 3).map((newsItem) => (
                  <div key={newsItem.id} className="border-b pb-3 last:border-b-0 last:pb-0">
                    <h3 className="text-lg font-semibold text-primary">{newsItem.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{getTimeAgo(newsItem.date)}</p>
                    <p className="text-gray-500 text-xs">Source: {newsItem.source}</p>
                    <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      {newsItem.category}
                    </span>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-primary text-sm ml-2"
                      onClick={() => handleNewsClick(newsItem)}
                    >
                      Read More
                    </Button>
                  </div>
                ))}
                <Button asChild variant="outline" className="w-full mt-4">
                  <Link href="/tech-news">View All Updates</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Technical Newsletter */}
            <Card className="bg-white shadow-lg">
              <CardHeader className="flex flex-row items-center space-x-2 p-4 border-b">
                <Mail className="w-6 h-6 text-purple-600" />
                <CardTitle className="text-xl font-bold text-primary">Technical Newsletter</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-gray-600 mb-4">
                  Subscribe to our domain-based technical newsletter for the latest industry insights and updates.
                </p>
                <form onSubmit={handleNewsletterSubscribe} className="space-y-4">
                  <div>
                    <Label htmlFor="domain-select" className="sr-only">
                      Select Technical Domain
                    </Label>
                    <Select onValueChange={setSelectedDomain} value={selectedDomain}>
                      <SelectTrigger id="domain-select" className="w-full">
                        <SelectValue placeholder="Select Technical Domain" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Technical Domains</SelectItem>
                        <SelectItem value="digital-tools">Digital Tools</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="emerging-tech">Emerging Tech</SelectItem>
                        <SelectItem value="safety">Safety</SelectItem>
                        <SelectItem value="soft-skills">Soft Skills</SelectItem>
                        <SelectItem value="leadership">Leadership</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="email-input" className="sr-only">
                      Enter your email address
                    </Label>
                    <Input
                      id="email-input"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                    Subscribe Now
                  </Button>
                </form>
                <p className="text-xs text-gray-500 mt-4 text-center">
                  Get weekly updates tailored to your technical domain. Unsubscribe anytime.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-primary">Featured Courses</h2>
            <Button asChild variant="outline">
              <Link href="/courses">View All Courses</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses.slice(0, 6).map((course) => (
              <Card key={course.id} className="hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-primary">{course.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${getLevelColor(course.level)}`}>
                      {course.level}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{course.desc}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <span className="flex items-center">
                      <Clock size={16} className="mr-1" />
                      {course.duration}
                    </span>
                    <span className="flex items-center">
                      <BookOpen size={16} className="mr-1" />
                      {course.modules} modules
                    </span>
                  </div>
                  <Button asChild className="w-full bg-primary hover:bg-primary/90">
                    <Link href={`/courses/${course.id}`}>Learn More</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Top Companies Partner Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-primary mb-12">Top companies partner with Tata Group</h2>
          {/* Apply horizontal scroll with snapping */}
          <div className="flex overflow-x-auto snap-x snap-mandatory pb-4 space-x-6 lg:space-x-8 no-scrollbar">
            {/* No need to duplicate content for snapping scroll */}
            {partnerCompanies.map((company, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-[180px] h-[100px] flex items-center justify-center mx-4 snap-start"
              >
                <Image
                  src={company.logoUrl || "/placeholder.svg"}
                  alt={`${company.name} Logo`}
                  width={150}
                  height={60}
                  className="object-contain max-w-full max-h-full"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-primary mb-12">What Our Employees Say</h2>
          {/* Horizontally scrollable container */}
          <div className="flex overflow-x-auto snap-x snap-mandatory pb-4 space-x-6 lg:space-x-8 no-scrollbar">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.33%-1.33rem)] bg-white p-6 rounded-lg shadow-lg snap-start"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current" size={20} />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <div className="font-semibold text-primary">{testimonial.name}</div>
                  <div className="text-gray-600 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech News Detail Dialog */}
      {selectedNews && (
        <Dialog open={showNewsDialog} onOpenChange={setShowNewsDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedNews.title}</DialogTitle>
              <p className="text-sm text-gray-500">Source: {selectedNews.source}</p>
            </DialogHeader>
            <div className="mt-4 text-gray-700">
              <p className="mb-4">{selectedNews.content}</p>
              <Button asChild className="w-full">
                <a href={selectedNews.url} target="_blank" rel="noopener noreferrer">
                  Read Full Article
                </a>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 p-3 rounded-full shadow-lg bg-primary text-white hover:bg-primary/90 transition-all duration-300 z-40"
          aria-label="Scroll to top"
        >
          <ChevronUp size={24} />
        </Button>
      )}

      {/* Scroll to Bottom Button */}
      {showScrollToBottom && (
        <Button
          onClick={scrollToBottom}
          className="fixed bottom-6 right-6 p-3 rounded-full shadow-lg bg-primary text-white hover:bg-primary/90 transition-all duration-300 z-40"
          aria-label="Scroll to bottom"
        >
          <ChevronDown size={24} />
        </Button>
      )}

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  )
}
