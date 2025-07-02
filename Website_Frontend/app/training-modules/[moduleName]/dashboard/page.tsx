"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChevronLeft,
  Download,
  FileText,
  CheckCircle,
  BookOpen,
  Target,
  Clock,
  ChevronDown,
  ChevronUp,
  User,
} from "lucide-react"
import { trainingModules, detailedTrainingModuleContent } from "@/lib/data"
import { downloadResource } from "@/lib/download-utils"
import type { ChartData as ChartDataType, TrainingModule } from "@/lib/types"
import RegistrationForm from "@/components/registration-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog" // Keep Dialog for RegistrationForm
import CertificateModal from "@/components/certificate-modal" // Import CertificateModal
import { useUser } from "@/components/user-provider"

export default function TrainingModuleDashboardPage() {
  const params = useParams()
  const router = useRouter()
  const moduleSlug = Array.isArray(params.moduleName) ? params.moduleName[0] : params.moduleName
  const decodedModuleSlug = decodeURIComponent(moduleSlug || "")

  // Find the TrainingModule object using the slug
  let moduleOverview: TrainingModule | undefined
  for (const category in trainingModules) {
    moduleOverview = trainingModules[category].find((m) => m.slug === decodedModuleSlug)
    if (moduleOverview) break
  }

  // Use the module's original name to get its detailed content
  const moduleContent = moduleOverview ? detailedTrainingModuleContent[moduleOverview.name] : undefined

  const [isRegistered, setIsRegistered] = useState(false)
  const [overallProgress, setOverallProgress] = useState(0)
  const [moduleCompleted, setModuleCompleted] = useState(false)
  const [downloadingResource, setDownloadingResource] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [showCertificateModal, setShowCertificateModal] = useState(false) // State to control CertificateModal
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({}) // New state for expanded sections
  const [completedContentSections, setCompletedContentSections] = useState<Record<string, boolean>>({}) // New state for section completion
  const [registeredUserName, setRegisteredUserName] = useState("")
  const [registeredEmployeeId, setRegisteredEmployeeId] = useState("")
  const [registeredDepartment, setRegisteredDepartment] = useState("")

  const { userName, setUserName } = useUser() // Get userName and setUserName from context

  useEffect(() => {
    // Check global registration status from localStorage
    const globalRegistration = localStorage.getItem("tata-steel-training-registered")
    const storedUserName = localStorage.getItem("registeredUserName")
    const storedEmployeeId = localStorage.getItem("registeredEmployeeId")
    const storedDepartment = localStorage.getItem("registeredDepartment")

    if (globalRegistration === "true" && storedUserName) {
      setIsRegistered(true)
      setRegisteredUserName(storedUserName)
      setRegisteredEmployeeId(storedEmployeeId || "")
      setRegisteredDepartment(storedDepartment || "")
    }

    // Load dummy progress and completion status
    const storedProgress = localStorage.getItem(`module-${decodedModuleSlug}-progress`)
    if (storedProgress) {
      setOverallProgress(Number.parseInt(storedProgress, 10))
    } else {
      setOverallProgress(0) // Default if not found
    }

    const storedCompletion = localStorage.getItem(`module-${decodedModuleSlug}-completed`)
    setModuleCompleted(storedCompletion === "true")

    // Load section completion status from localStorage
    const storedSectionCompletion = localStorage.getItem(`module-${decodedModuleSlug}-section-completion`)
    if (storedSectionCompletion) {
      setCompletedContentSections(JSON.parse(storedSectionCompletion))
    } else {
      // Initialize all sections as not completed if not found
      const initialCompletion: Record<string, boolean> = {}
      moduleContent?.detailedContent?.forEach((_, index) => {
        initialCompletion[`content-${index}`] = false
      })
      setCompletedContentSections(initialCompletion)
    }
  }, [decodedModuleSlug, moduleContent]) // Add moduleContent to dependencies

  const handleRegistrationSuccess = (userName: string, employeeId: string, department: string) => {
    setIsRegistered(true)
    setRegisteredUserName(userName)
    setRegisteredEmployeeId(employeeId)
    setRegisteredDepartment(department)
    localStorage.setItem("registeredUserName", userName)
    localStorage.setItem("registeredEmployeeId", employeeId)
    localStorage.setItem("registeredDepartment", department)
    localStorage.setItem("tata-steel-training-registered", "true")
    setUserName(userName) // Set the user name in the global context
  }

  const handleDownloadResource = async (resourceName: string, resourceType: string) => {
    try {
      setDownloadingResource(resourceName)
      const result = await downloadResource(moduleOverview?.name || "", resourceType, resourceName)
      alert(result.message)
    } catch (error) {
      console.error(`Error downloading resource:`, error)
      alert(`Failed to download resource. Please try again.`)
    } finally {
      setDownloadingResource(null)
    }
  }

  const handleMarkComplete = () => {
    setModuleCompleted(true)
    setOverallProgress(100)
    localStorage.setItem(`module-${decodedModuleSlug}-completed`, "true")
    localStorage.setItem(`module-${decodedModuleSlug}-progress`, "100")
    alert(`Module "${moduleOverview?.name}" marked as complete!`)
  }

  const handleGenerateCertificate = () => {
    setShowCertificateModal(true)
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  const markContentSectionComplete = (sectionId: string) => {
    setCompletedContentSections((prev) => {
      const newState = {
        ...prev,
        [sectionId]: !prev[sectionId], // Toggle completion status
      }
      localStorage.setItem(`module-${decodedModuleSlug}-section-completion`, JSON.stringify(newState))

      // Update overall module progress based on section completion
      const totalSections = moduleContent?.detailedContent?.length || 0
      const currentCompletedSectionsCount = Object.values(newState).filter(Boolean).length
      const newOverallProgress =
        totalSections > 0 ? Math.round((currentCompletedSectionsCount / totalSections) * 100) : 0
      setOverallProgress(newOverallProgress)
      localStorage.setItem(`module-${decodedModuleSlug}-progress`, newOverallProgress.toString())

      if (newOverallProgress === 100) {
        setModuleCompleted(true)
        localStorage.setItem(`module-${decodedModuleSlug}-completed`, "true")
      } else {
        setModuleCompleted(false)
        localStorage.setItem(`module-${decodedModuleSlug}-completed`, "false")
      }

      return newState
    })
  }

  // Render bar chart for module content
  const renderBarChart = (chartData: ChartDataType) => {
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

  const renderLineChart = (chartData: ChartDataType) => {
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

  const renderPieChart = (chartData: ChartDataType) => {
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

  if (!moduleOverview || !moduleContent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Module Not Found</h1>
        <p className="text-gray-700 mb-6">
          The requested training module could not be found or its detailed content is missing.
        </p>
        <Button onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4 mr-2" /> Back to Training Modules
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Banner */}
      {isRegistered && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="container mx-auto">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Welcome back, {registeredUserName}!</h2>
                <p className="text-blue-100">
                  {registeredEmployeeId && `Employee ID: ${registeredEmployeeId}`}
                  {registeredEmployeeId && registeredDepartment && " • "}
                  {registeredDepartment && `Department: ${registeredDepartment}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-8">
        <div className="container mx-auto">
          <Button variant="outline" onClick={() => router.back()} className="mb-6">
            <ChevronLeft className="h-4 w-4 mr-2" /> Back to Modules
          </Button>
          <h1 className="text-4xl font-bold text-blue-800 mb-8 text-center">{moduleOverview.name} Dashboard</h1>

          {!isRegistered ? (
            <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-center mb-4">Register for {moduleOverview.name}</h2>
              <Dialog open={!isRegistered} onOpenChange={() => {}}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Course Registration</DialogTitle>
                  </DialogHeader>
                  <RegistrationForm itemTitle={moduleOverview.name} onSuccess={handleRegistrationSuccess} />
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 md:grid-cols-4 lg:grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="content">Course Content</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-blue-700">Overall Course Progress</CardTitle>
                      <CardDescription>Your progress through this module.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4">
                        <Progress value={overallProgress} className="w-full" />
                        <span className="text-lg font-semibold">{overallProgress}%</span>
                      </div>
                      {moduleCompleted ? (
                        <div className="flex items-center text-green-600 mt-4">
                          <CheckCircle className="h-5 w-5 mr-2" />
                          <span>Module Completed!</span>
                        </div>
                      ) : (
                        <Button onClick={handleMarkComplete} className="mt-4" disabled={overallProgress === 100}>
                          Mark as Complete
                        </Button>
                      )}
                      {moduleCompleted && (
                        <Button onClick={handleGenerateCertificate} className="mt-4 ml-4">
                          Generate Certificate
                        </Button>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-blue-700">Module Objectives & Aims</CardTitle>
                      <CardDescription>Key learning outcomes for this module.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-gray-700">
                        {moduleContent.objectives.map((obj, index) => (
                          <li key={index} className="flex items-start">
                            <Target className="h-4 w-4 mr-2 mt-1 text-purple-600 flex-shrink-0" />
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-blue-700">Key Topics Covered</CardTitle>
                      <CardDescription>Main areas explored in this module.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-gray-700 grid grid-cols-1 md:grid-cols-2">
                        {moduleContent.topics.map((topic, index) => (
                          <li key={index} className="flex items-start">
                            <BookOpen className="h-4 w-4 mr-2 mt-1 text-orange-600 flex-shrink-0" />
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="content" className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-700">Detailed Course Content</CardTitle>
                    <CardDescription>
                      A deeper dive into the module's curriculum with interactive sections.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {moduleContent.detailedContent && moduleContent.detailedContent.length > 0 ? (
                      <section className="space-y-4">
                        {moduleContent.detailedContent.map((content, idx) => {
                          const contentId = `content-${idx}`
                          const isCompleted = completedContentSections[contentId]
                          return (
                            <Card key={contentId} className={isCompleted ? "border-green-300 bg-green-50" : ""}>
                              <CardContent className="p-0">
                                <div
                                  className="p-4 flex items-center justify-between cursor-pointer"
                                  onClick={() => toggleSection(contentId)}
                                >
                                  <div className="flex items-center">
                                    {isCompleted ? (
                                      <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                                    ) : (
                                      <div className="h-6 w-6 rounded-full border-2 border-gray-300 mr-3 flex-shrink-0" />
                                    )}
                                    <div>
                                      <h3 className="font-semibold text-lg">{content.title}</h3>
                                    </div>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="text-sm text-gray-500 mr-3">
                                      <Clock className="h-4 w-4 inline mr-1" />
                                      {content.duration}
                                    </span>
                                    {!isCompleted && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="mr-2"
                                        onClick={(e) => {
                                          e.stopPropagation() // Prevent card from toggling
                                          markContentSectionComplete(contentId)
                                        }}
                                      >
                                        Mark Complete
                                      </Button>
                                    )}
                                    {expandedSections[contentId] ? (
                                      <ChevronUp className="h-5 w-5 text-gray-500" />
                                    ) : (
                                      <ChevronDown className="h-5 w-5 text-gray-500" />
                                    )}
                                  </div>
                                </div>

                                {expandedSections[contentId] && (
                                  <div className="border-t border-gray-200 px-4 pb-4 pt-2">
                                    <div
                                      className="prose max-w-none"
                                      dangerouslySetInnerHTML={{ __html: content.content }}
                                    />
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          )
                        })}
                      </section>
                    ) : (
                      <p className="text-gray-600 text-center py-8">
                        No detailed content available for this module yet.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="resources" className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-700">Module Resources</CardTitle>
                    <CardDescription>Downloadable materials for this module.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {moduleContent.resources.map((resource, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-blue-500 mr-2" />
                            <span>{resource.name}</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={downloadingResource === resource.name}
                            onClick={() => handleDownloadResource(resource.name, resource.type)}
                          >
                            {downloadingResource === resource.name ? (
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
              </TabsContent>

              <TabsContent value="analytics" className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-700">Overview Analytics & Skill Coverage</CardTitle>
                    <CardDescription>Insights into your performance and skill development.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {moduleContent.charts.map((chart: ChartDataType, index: number) => (
                      <div key={index}>
                        {chart.type === "bar" && renderBarChart(chart)}
                        {chart.type === "line" && renderLineChart(chart)}
                        {chart.type === "pie" && renderPieChart(chart)}
                      </div>
                    ))}
                    {/* Dummy Skill Coverage Assessment */}
                    <h3 className="font-semibold text-lg mb-3 mt-6">Skill Coverage Assessment</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Core Concepts</span>
                        <Progress value={85} className="w-[70%]" />
                        <span className="text-sm">85%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Practical Application</span>
                        <Progress value={70} className="w-[70%]" />
                        <span className="text-sm">70%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Problem Solving</span>
                        <Progress value={75} className="w-[70%]" />
                        <span className="text-sm">75%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          {/* Certificate Modal */}
          {moduleOverview && (
            <CertificateModal
              isOpen={showCertificateModal}
              onClose={() => setShowCertificateModal(false)}
              userName={registeredUserName}
              courseName={moduleOverview.name}
              completionDate={new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            />
          )}
        </div>
      </div>
    </div>
  )
}
