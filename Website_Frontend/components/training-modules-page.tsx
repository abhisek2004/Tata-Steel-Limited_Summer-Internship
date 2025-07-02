"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Download } from "lucide-react"
import { trainingModules, detailedTrainingModuleContent, popularTrainingPaths } from "@/lib/data"
import { downloadResource } from "@/lib/download-utils"
import { FileText } from "lucide-react"
import type { ChartData, TrainingModule } from "@/lib/types"
import RegistrationForm from "./registration-form"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs" // Import Tabs components

export default function TrainingModulesPage() {
  const [activeTab, setActiveTab] = useState("Technical")
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null)
  const [downloadingResource, setDownloadingResource] = useState<string | null>(null)
  const [isModuleRegistered, setIsModuleRegistered] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Updated to pass resource.name directly
  const handleDownloadResource = async (resourceName: string, resourceType: string) => {
    try {
      setDownloadingResource(resourceName) // Set loading state with just the resource name
      // Pass selectedModule.name as courseTitle to the API
      const result = await downloadResource(selectedModule?.name || "", resourceType, resourceName)
      alert(result.message)
    } catch (error) {
      console.error(`Error downloading resource:`, error)
      alert(`Failed to download resource. Please try again.`)
    } finally {
      setDownloadingResource(null)
    }
  }

  const handleModuleClick = (module: TrainingModule) => {
    setSelectedModule(module)
    const storedRegistration = localStorage.getItem(`module-${module.slug}-registered`)
    setIsModuleRegistered(storedRegistration === "true")
    setExpandedSections({})
  }

  const handleRegistrationSuccess = () => {
    setIsModuleRegistered(true)
    if (selectedModule) {
      localStorage.setItem(`module-${selectedModule.slug}-registered`, "true")
    }
  }

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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-blue-800 mb-8 text-center">Training Modules & Paths</h1>

        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-4">All Training Modules</h2>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
                  {Object.keys(trainingModules).map((category) => (
                    <TabsTrigger key={category} value={category}>
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {Object.keys(trainingModules).map((category) => (
                  <TabsContent key={category} value={category} className="mt-8">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {trainingModules[category].map((module) => (
                        <Card key={module.name} className="flex flex-col">
                          <CardHeader className="flex-row items-center space-x-4">
                            <div className="text-4xl">{module.icon}</div>
                            <div>
                              <CardTitle className="text-xl text-blue-700">{module.name}</CardTitle>
                              <CardDescription className="text-gray-600">
                                {module.modules} modules • {category}
                              </CardDescription>
                            </div>
                          </CardHeader>
                          <CardContent className="flex-grow flex items-end justify-end p-4">
                            <Button onClick={() => handleModuleClick(module)}>View Details</Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Popular Training Paths</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {popularTrainingPaths.map((path) => (
                  <Card key={path.name} className="flex flex-col">
                    <CardHeader>
                      <CardTitle className="text-xl text-green-700">{path.name}</CardTitle>
                      <CardDescription className="text-gray-600">
                        {path.modules} modules • {path.duration}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow flex items-end justify-end p-4">
                      <Button asChild variant="outline">
                        <Link href={`/training-paths/${path.slug}`}>Explore Path</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        </main>

        {/* Module Detail Dialog */}
        {selectedModule && (
          <Dialog open={!!selectedModule} onOpenChange={(open) => !open && setSelectedModule(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl flex items-center">
                  <span className="text-3xl mr-3">{selectedModule.icon}</span>
                  {selectedModule.name}
                </DialogTitle>
              </DialogHeader>

              {!isModuleRegistered ? (
                <RegistrationForm
                  itemTitle={selectedModule.name}
                  onSuccess={handleRegistrationSuccess}
                  onCancel={() => setSelectedModule(null)}
                />
              ) : detailedTrainingModuleContent[selectedModule.name] ? (
                <div className="mt-4">
                  <p className="text-gray-700 mb-6">{detailedTrainingModuleContent[selectedModule.name].description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-800 mb-3">Learning Objectives</h3>
                      <ul className="space-y-2">
                        {detailedTrainingModuleContent[selectedModule.name].objectives.map(
                          (objective: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <div className="h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs mr-2 mt-0.5">
                                {index + 1}
                              </div>
                              <span className="text-sm">{objective}</span>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-800 mb-3">Key Topics</h3>
                      <ul className="space-y-2">
                        {detailedTrainingModuleContent[selectedModule.name].topics.map(
                          (topic: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <div className="h-5 w-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs mr-2 mt-0.5">
                                {index + 1}
                              </div>
                              <span className="text-sm">{topic}</span>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-3">Performance Analytics</h3>

                    {detailedTrainingModuleContent[selectedModule.name].charts.map(
                      (chart: ChartData, index: number) => (
                        <div key={index}>
                          {chart.type === "bar" && renderBarChart(chart)}
                          {chart.type === "line" && renderLineChart(chart)}
                          {chart.type === "pie" && renderPieChart(chart)}
                        </div>
                      ),
                    )}
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg mb-6">
                    <h3 className="font-semibold text-purple-800 mb-2">Case Study</h3>
                    <h4 className="font-medium mb-2">
                      {detailedTrainingModuleContent[selectedModule.name].caseStudy.title}
                    </h4>
                    <p className="text-sm">
                      {detailedTrainingModuleContent[selectedModule.name].caseStudy.description}
                    </p>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">Module Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {detailedTrainingModuleContent[selectedModule.name].resources.map((resource, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-blue-500 mr-2" />
                            <span>{resource.name}</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={downloadingResource === resource.name} // Use just resource.name for loading state
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
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button asChild>
                      <Link href={`/training-modules/${selectedModule.slug}/dashboard`}>Go to Module Dashboard</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500">
                  <p>Detailed content for this module is being developed.</p>
                  <p className="mt-2">Please check back soon!</p>
                </div>
              )}
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
