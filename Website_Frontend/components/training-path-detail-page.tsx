"use client"

import { useState, type React } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import type { TrainingPath, ChartData } from "@/lib/types" // Import TrainingPath type
import { detailedTrainingPathContent } from "@/lib/data"
import RegistrationForm from "./registration-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { downloadResource } from "@/lib/download-utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface TrainingPathDetailPageProps {
  path: TrainingPath
}

export default function TrainingPathDetailPage({ path }: TrainingPathDetailPageProps) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isPathRegistered, setIsPathRegistered] = useState(false)
  const [showRegistrationModal, setShowRegistrationModal] = useState(false) // For explicit registration button
  const [downloadingResource, setDownloadingResource] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleRegistrationSuccess = (data: { userName: string }) => {
    // Store the user's name upon successful registration
    localStorage.setItem("registeredUserName", data.userName)
    setIsPathRegistered(true)
    setShowRegistrationModal(false)
    router.push(`/training-paths/${path.slug}/dashboard`)
  }

  // Updated to pass resource.name directly
  const handleDownloadResource = async (resourceName: string, resourceType: string) => {
    try {
      setDownloadingResource(resourceName) // Set loading state with just the resource name
      const result = await downloadResource(path.title, resourceType, resourceName) // Pass path.title as courseTitle
      alert(result.message)
    } catch (error) {
      console.error(`Error downloading resource:`, error)
      alert(`Failed to download resource. Please try again.`)
    } finally {
      setDownloadingResource(null)
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate registration
    console.log(`Registering for ${path.title} with email: ${email}`)
    // Store the user's email as the registered user name
    localStorage.setItem("registeredUserName", email)
    setIsPathRegistered(true)
    router.push(`/training-paths/${path.slug}/dashboard`)
  }

  // Render bar chart for content
  const renderBarChart = (chartData: ChartData) => {
    const maxValue = Math.max(...chartData.data.map((item: any) => item.value))

    return (
      <div className="mt-4 mb-6">
        <h4 className="text-sm font-medium mb-2 text-gray-700">{chartData.title}</h4>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="space-y-2">
            {chartData.data.map((item: any, index: number) => (
              <div key={index} className="flex items-center">
                <span className="text-xs w-24 text-gray-600">{item.label}</span>
                <div className="flex-1 flex items-center">
                  <div className="h-5 bg-blue-600 rounded" style={{ width: `${(item.value / maxValue) * 100}%` }}></div>
                  <span className="ml-2 text-xs font-medium">{item.value}%</span>

                  {/* Show comparison bar if available */}
                  {item.comparison !== undefined && (
                    <>
                      <div
                        className="h-5 bg-gray-300 rounded ml-2 opacity-60"
                        style={{ width: `${(item.comparison / maxValue) * 100}%` }}
                      ></div>
                      <span className="ml-2 text-xs text-gray-500">{item.comparison}%</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Legend if comparison data exists */}
          {chartData.data.some((item: any) => item.comparison !== undefined) && (
            <div className="flex items-center mt-3 text-xs text-gray-600">
              <div className="w-3 h-3 bg-blue-600 rounded mr-1"></div>
              <span className="mr-4">After Training</span>
              <div className="w-3 h-3 bg-gray-300 rounded mr-1"></div>
              <span>Before Training</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Render line chart for content
  const renderLineChart = (chartData: ChartData) => {
    const maxValue = Math.max(...chartData.data.map((item: any) => item.value))
    const points = chartData.data
      .map((item: any, index: number) => {
        const x = (index / (chartData.data.length - 1)) * 100
        const y = 100 - (item.value / maxValue) * 100
        return `${x},${y}`
      })
      .join(" ")

    return (
      <div className="mt-4 mb-6">
        <h4 className="text-sm font-medium mb-2 text-gray-700">{chartData.title}</h4>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="h-40 w-full relative">
            {/* Grid lines */}
            <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="border-t border-gray-200 w-full" style={{ top: `${i * 25}%` }}></div>
              ))}
              {[...Array(5)].map((_, i) => (
                <div key={i} className="border-l border-gray-200 h-full" style={{ left: `${i * 25}%` }}></div>
              ))}
            </div>

            {/* Line */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polyline points={points} fill="none" stroke="#2563eb" strokeWidth="2" />

              {/* Data points */}
              {chartData.data.map((item: any, index: number) => {
                const x = (index / (chartData.data.length - 1)) * 100
                const y = 100 - (item.value / maxValue) * 100
                return <circle key={index} cx={x} cy={y} r="2" fill="#2563eb" />
              })}
            </svg>

            {/* X-axis labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between">
              {chartData.data.map((item: any, index: number) => (
                <div key={index} className="text-xs text-gray-500">
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          {/* Y-axis range */}
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>0</span>
            <span>{maxValue}</span>
          </div>
        </div>
      </div>
    )
  }

  // Render pie chart for content
  const renderPieChart = (chartData: ChartData) => {
    const total = chartData.data.reduce((sum: number, item: any) => sum + item.value, 0)
    let currentAngle = 0

    // Generate colors for pie slices
    const colors = ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe"]

    return (
      <div className="mt-4 mb-6">
        <h4 className="text-sm font-medium mb-2 text-gray-700">{chartData.title}</h4>
        <div className="bg-gray-50 p-4 rounded-lg flex flex-col md:flex-row items-center">
          <div className="relative w-40 h-40">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {chartData.data.map((item: any, index: number) => {
                const percentage = (item.value / total) * 100
                const angle = (percentage / 100) * 360

                // Calculate start and end angles
                const startAngle = currentAngle
                const endAngle = currentAngle + angle

                // Convert angles to radians
                const startRad = ((startAngle - 90) * Math.PI) / 180
                const endRad = ((endAngle - 90) * Math.PI) / 180

                // Calculate points
                const x1 = 50 + 50 * Math.cos(startRad)
                const y1 = 50 + 50 * Math.sin(startRad)
                const x2 = 50 + 50 * Math.cos(endRad)
                const y2 = 50 + 50 * Math.sin(endRad)

                // Determine if the arc should be drawn as a large arc
                const largeArcFlag = angle > 180 ? 1 : 0

                // Create the path for the slice
                const path = [`M 50 50`, `L ${x1} ${y1}`, `A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2}`, `Z`].join(" ")

                // Update current angle for next slice
                currentAngle += angle

                return <path key={index} d={path} fill={colors[index % colors.length]} />
              })}
            </svg>
          </div>

          <div className="mt-4 md:mt-0 md:ml-6 flex-1">
            <div className="space-y-2">
              {chartData.data.map((item: any, index: number) => (
                <div key={index} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  ></div>
                  <span className="text-xs text-gray-700">{item.label}</span>
                  <span className="text-xs font-medium ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const pathDetails = detailedTrainingPathContent.find((content) => content.pathSlug === path.slug)

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center mb-8">
          <Button variant="ghost" asChild className="mr-4">
            <Link href="/training-modules">
              <ArrowLeft size={20} />
            </Link>
          </Button>
          <h1 className="text-4xl font-bold text-primary">{path.title}</h1>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex flex-wrap gap-4 mb-6">
            <span className="px-3 py-1 rounded-full bg-accent text-primary">{path.category}</span>
            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800">{path.duration}</span>
            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800">{path.modules} modules</span>
          </div>

          <p className="text-lg text-gray-700 mb-8">{path.description}</p>

          <div className="mt-8 text-center">
            {!isPathRegistered ? (
              <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                  <CardTitle>Register for this Training Path</CardTitle>
                  <CardDescription>Enter your email to register and access the full path content.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Register Now
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center text-green-600">You are registered! Redirecting to dashboard...</div>
            )}
          </div>
        </div>

        {pathDetails && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Path Overview</h2>
            <p>{pathDetails.overview}</p>

            <h3 className="text-xl font-semibold">Modules in this Path:</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {pathDetails.modules.map((module, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{module.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{module.description}</p>
                    {module.courseId && (
                      <Link href={`/courses/${module.courseId}`} className="text-blue-600 hover:underline">
                        View Course Details
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Detailed Path Content Sections */}
        <div className="space-y-6 mb-8">{/* Additional sections can be added here if needed */}</div>

        {/* Registration Modal */}
        <Dialog open={showRegistrationModal} onOpenChange={setShowRegistrationModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Training Path Registration</DialogTitle>
            </DialogHeader>
            <RegistrationForm
              itemTitle={path.title}
              onSuccess={handleRegistrationSuccess}
              onCancel={() => setShowRegistrationModal(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
