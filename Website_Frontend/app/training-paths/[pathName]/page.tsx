"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, BookOpen, FileText, Download, CheckCircle } from "lucide-react"
import { popularTrainingPaths, detailedTrainingPathContent, courses, detailedTrainingModuleContent } from "@/lib/data" // Added detailedTrainingModuleContent
import { downloadResource } from "@/lib/download-utils"
import RegistrationForm from "@/components/registration-form"
import type { ChartData } from "@/lib/types"
import { slugify } from "@/lib/slug-utils" // Corrected import path for slugify
import { useUser } from "@/components/user-provider" // Import useUser hook

export default function TrainingPathDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { userName, setUserName } = useUser() // Get user name and setUserName from context
  const pathName = Array.isArray(params.pathName) ? params.pathName[0] : params.pathName
  const decodedPathName = decodeURIComponent(pathName || "")

  const pathOverview = popularTrainingPaths.find((path) => path.slug === decodedPathName)
  const pathDetailedContent = detailedTrainingPathContent[pathOverview?.name || ""] // Use pathOverview.name to get detailed content

  const [isPathRegistered, setIsPathRegistered] = useState(false)
  const [downloadingResource, setDownloadingResource] = useState<string | null>(null)

  useEffect(() => {
    // Check global registration status from localStorage
    const globalRegistration = localStorage.getItem("tata-steel-training-registered")
    const storedUserName = localStorage.getItem("registeredUserName")

    if (globalRegistration === "true" && storedUserName) {
      setIsPathRegistered(true)
    }
  }, [pathName])

  const handleRegistrationSuccess = (registeredUserName: string) => {
    // Set global registration status
    setIsPathRegistered(true)
    localStorage.setItem("tata-steel-training-registered", "true")
    localStorage.setItem("registeredUserName", registeredUserName)
    setUserName(registeredUserName) // Set the user name in the global context
    // Redirect to dashboard after successful registration
    router.push(`/training-paths/${pathName}/dashboard`)
  }

  const handleDownloadResource = async (resourceName: string, resourceType: string) => {
    try {
      setDownloadingResource(`${resourceName} ${resourceType}`)
      const result = await downloadResource(resourceName, resourceType, `${resourceName} ${resourceType}`)
      alert(result.message)
    } catch (error) {
      console.error(`Error downloading resource:`, error)
      alert(`Failed to download resource. Please try again.`)
    } finally {
      setDownloadingResource(null)
    }
  }

  // Render chart functions (copied from training-modules-page for consistency)
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
            <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="border-t border-gray-200 w-full" style={{ top: `${i * 25}%` }}></div>
              ))}
              {[...Array(5)].map((_, i) => (
                <div key={i} className="border-l border-gray-200 h-full" style={{ left: `${i * 25}%` }}></div>
              ))}
            </div>
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polyline points={points} fill="none" stroke="#2563eb" strokeWidth="2" />
              {chartData.data.map((item: any, index: number) => {
                const x = (index / (chartData.data.length - 1)) * 100
                const y = 100 - (item.value / maxValue) * 100
                return <circle key={index} cx={x} cy={y} r="2" fill="#2563eb" />
              })}
            </svg>
            <div className="absolute bottom-0 left-0 right-0 flex justify-between">
              {chartData.data.map((item: any, index: number) => (
                <div key={index} className="text-xs text-gray-500">
                  {item.label}
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>0</span>
            <span>{maxValue}</span>
          </div>
        </div>
      </div>
    )
  }

  const renderPieChart = (chartData: ChartData) => {
    const total = chartData.data.reduce((sum: number, item: any) => sum + item.value, 0)
    let currentAngle = 0
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
                const startAngle = currentAngle
                const endAngle = currentAngle + angle
                const startRad = ((startAngle - 90) * Math.PI) / 180
                const endRad = ((endAngle - 90) * Math.PI) / 180
                const x1 = 50 + 50 * Math.cos(startRad)
                const y1 = 50 + 50 * Math.sin(startRad)
                const x2 = 50 + 50 * Math.cos(endRad)
                const y2 = 50 + 50 * Math.sin(endRad)
                const largeArcFlag = angle > 180 ? 1 : 0
                const path = [`M 50 50`, `L ${x1} ${y1}`, `A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2}`, `Z`].join(" ")
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

  if (!pathOverview) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Training Path Not Found</h1>
        <p className="text-gray-700 mb-6">The requested training path could not be found.</p>
        <Button onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4 mr-2" /> Back to Training Paths
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto">
        <Button variant="outline" onClick={() => router.back()} className="mb-6">
          <ChevronLeft className="h-4 w-4 mr-2" /> Back to Paths
        </Button>
        <h1 className="text-4xl font-bold text-blue-800 mb-8 text-center">{pathOverview.name}</h1>

        {!isPathRegistered ? (
          <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-4">Register for {pathOverview.name}</h2>
            <RegistrationForm itemTitle={pathOverview.name} onSuccess={handleRegistrationSuccess} />
          </div>
        ) : (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-700">Path Overview</CardTitle>
                <CardDescription>{pathOverview.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {userName && <p className="text-lg font-semibold mb-4">Welcome, {userName}!</p>}
                <p className="text-gray-700">
                  This path consists of {pathOverview.modules} modules and typically takes {pathOverview.duration} to
                  complete.
                </p>
              </CardContent>
            </Card>

            {pathDetailedContent && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-700">Learning Objectives</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {pathDetailedContent.objectives.map((obj: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-4 w-4 mr-2 mt-1 text-green-600 flex-shrink-0" />
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-700">Key Topics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-700 grid grid-cols-1 md:grid-cols-2">
                      {pathDetailedContent.topics.map((topic: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <BookOpen className="h-4 w-4 mr-2 mt-1 text-orange-600 flex-shrink-0" />
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-700">Path Modules</CardTitle>
                    <CardDescription>Courses and modules included in this training path.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {pathDetailedContent.modules.map((module: any, index: number) => {
                        let displayTitle = module.name || "Module Title" // Default to module.name or generic title
                        let displayDescription = ""
                        let displayIcon = module.icon || "📚" // Default icon from module object or fallback

                        if (module.courseId) {
                          const course = courses.find((c) => c.id === module.courseId)
                          if (course) {
                            displayTitle = course.title
                            displayDescription = course.desc
                            displayIcon = course.category === "Digital Tools" ? "💻" : displayIcon // Override icon if Digital Tools
                          }
                        } else {
                          // This is a direct training module (not a course)
                          const detailedModule = detailedTrainingModuleContent[module.name]
                          if (detailedModule) {
                            displayDescription = detailedModule.description
                            displayIcon = detailedModule.icon || displayIcon // Use detailed module's icon if available
                          }
                          // If module.description exists on the module object itself, use it as a fallback
                          if (!displayDescription && module.description) {
                            displayDescription = module.description
                          }
                        }

                        // Final fallback for description if it's still empty
                        if (!displayDescription) {
                          displayDescription = "No description available."
                        }

                        return (
                          <Card key={index} className="flex flex-col">
                            <CardHeader className="flex-row items-center space-x-4">
                              <div className="text-3xl">{displayIcon}</div>
                              <div>
                                <CardTitle className="text-lg">{displayTitle}</CardTitle>
                                <CardDescription className="text-sm">{displayDescription}</CardDescription>
                              </div>
                            </CardHeader>
                            <CardContent className="flex-grow flex items-end justify-end p-4">
                              {module.courseId ? (
                                <Button asChild size="sm">
                                  <Link href={`/courses/${module.courseId}`}>View Course</Link>
                                </Button>
                              ) : (
                                <Button asChild size="sm">
                                  <Link href={`/training-modules/${slugify(module.name)}/dashboard`}>View Module</Link>
                                </Button>
                              )}
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-700">Performance Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {pathDetailedContent.charts?.map((chart: ChartData, index: number) => (
                      <div key={index}>
                        {chart.type === "bar" && renderBarChart(chart)}
                        {chart.type === "line" && renderLineChart(chart)}
                        {chart.type === "pie" && renderPieChart(chart)}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-700">Case Study</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-medium mb-2">{pathDetailedContent.caseStudy.title}</h4>
                    <p className="text-sm">{pathDetailedContent.caseStudy.description}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-700">Path Resources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {pathDetailedContent.resources.map((resource: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-blue-500 mr-2" />
                            <span>{resource.name}</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={downloadingResource === `${resource.name} ${resource.type}`}
                            onClick={() => handleDownloadResource(resource.name, resource.type)}
                          >
                            {downloadingResource === `${resource.name} ${resource.type}` ? (
                              "..."
                            ) : (
                              <>
                                <Download className="h-4 w-4 mr-1" /> PDF
                              </>
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end mt-6">
                  <Button asChild>
                    <Link href={`/training-paths/${pathName}/dashboard`}>Go to Path Dashboard</Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
