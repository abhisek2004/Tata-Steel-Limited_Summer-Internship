"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  BookOpen,
  BarChart,
  MessageSquare,
  Award,
  CheckCircle,
  Download,
  User,
  Users,
  FileText,
} from "lucide-react"
import {
  detailedTrainingPathContent,
  courses,
  detailedTrainingModuleContent,
  discussionPosts,
  popularTrainingPaths,
} from "@/lib/data"
import { slugify } from "@/lib/slug-utils"
import CertificateModal from "@/components/certificate-modal"
import { downloadResource } from "@/lib/download-utils"
import { formatDistanceToNowStrict } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import RegistrationForm from "@/components/registration-form"

interface TrainingPathDashboardPageProps {
  params: {
    pathName: string
  }
}

export default function TrainingPathDashboardPage({ params }: TrainingPathDashboardPageProps) {
  const pathSlug = params.pathName
  const pathDetailedContent = detailedTrainingPathContent[pathSlug]

  const [activeTab, setActiveTab] = useState("overview")
  const [showCertificateModal, setShowCertificateModal] = useState(false)
  const [showResourceDownloadModal, setShowResourceDownloadModal] = useState(false)
  const [selectedResource, setSelectedResource] = useState<{
    courseTitle: string
    resourceType: string
    resourceName: string
  } | null>(null)
  const [resourceDownloadStatus, setResourceDownloadStatus] = useState<{
    message: string
    success: boolean
  } | null>(null)
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false) // Simulate registration status
  const [registeredUserName, setRegisteredUserName] = useState("")
  // New state for tracking module completion within the path
  const [completedPathModulesState, setCompletedPathModulesState] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // Check registration status from local storage
    const storedUserName = localStorage.getItem("registeredUserName")
    if (storedUserName) {
      setIsRegistered(true)
      setRegisteredUserName(storedUserName)
    }

    // Initialize module completion state from pathDetailedContent
    if (pathDetailedContent?.analytics?.moduleCompletion) {
      const initialCompletion = pathDetailedContent.analytics.moduleCompletion.reduce(
        (acc, mod) => {
          acc[mod.module] = mod.completed
          return acc
        },
        {} as Record<string, boolean>,
      )
      setCompletedPathModulesState(initialCompletion)
    }
  }, [pathDetailedContent])

  const handleRegistrationSuccess = (data: { userName: string }) => {
    setRegisteredUserName(data.userName)
    localStorage.setItem("registeredUserName", data.userName) // Store for persistence
    setShowRegistrationModal(false)
    setIsRegistered(true)
  }

  const handleDownloadResource = async () => {
    if (selectedResource) {
      setResourceDownloadStatus({ message: "Generating...", success: true })
      const result = await downloadResource(
        selectedResource.courseTitle,
        selectedResource.resourceType,
        selectedResource.resourceName,
      )
      setResourceDownloadStatus(result)
      if (result.success) {
        setTimeout(() => setShowResourceDownloadModal(false), 2000) // Close after 2 seconds on success
      }
    }
  }

  if (!pathDetailedContent) {
    notFound()
  }

  const pathName = popularTrainingPaths.find((path) => path.slug === pathSlug)?.name || pathSlug

  // Safely access analytics properties with optional chaining and fallbacks
  const totalModules = pathDetailedContent.modules?.length || 0
  const completedModulesCount = Object.values(completedPathModulesState).filter(Boolean).length
  const progressPercentage = totalModules > 0 ? Math.round((completedModulesCount / totalModules) * 100) : 0

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "🎯":
        return <Award className="h-8 w-8 text-primary" />
      case "🔄":
        return <RefreshCcw className="h-8 w-8 text-primary" />
      case "📊":
        return <BarChart className="h-8 w-8 text-primary" />
      case "⚖️":
        return <Scale className="h-8 w-8 text-primary" />
      case "💬":
        return <MessageSquare className="h-8 w-8 text-primary" />
      case "👥":
        return <Users className="h-8 w-8 text-primary" />
      case "💻":
        return <Laptop className="h-8 w-8 text-primary" />
      case "🏭":
        return <Factory className="h-8 w-8 text-primary" />
      case "🔍":
        return <Search className="h-8 w-8 text-primary" />
      case "🔧":
        return <Wrench className="h-8 w-8 text-primary" />
      case "⚠️":
        return <AlertTriangle className="h-8 w-8 text-primary" />
      case "🌱":
        return <Leaf className="h-8 w-8 text-primary" />
      case "💡":
        return <Lightbulb className="h-8 w-8 text-primary" />
      case "📈":
        return <LineChart className="h-8 w-8 text-primary" />
      case "🤖":
        return <Bot className="h-8 w-8 text-primary" />
      case "🔬":
        return <Microscope className="h-8 w-8 text-primary" />
      case "🖨️":
        return <Printer className="h-8 w-8 text-primary" />
      case "📡":
        return <Wifi className="h-8 w-8 text-primary" />
      default:
        return <BookOpen className="h-8 w-8 text-primary" />
    }
  }

  const getModuleStatus = (moduleName: string) => {
    return completedPathModulesState[moduleName] ? "Completed" : "In Progress"
  }

  const getModuleProgress = (moduleName: string) => {
    return completedPathModulesState[moduleName] ? 100 : Math.floor(Math.random() * 80) + 10 // Random progress if not completed
  }

  const getSkillCoverageColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500"
    if (percentage >= 50) return "bg-yellow-500"
    return "bg-red-500"
  }

  const filteredDiscussionPosts = discussionPosts.filter(
    (post) =>
      pathDetailedContent.modules?.some((module) => module.name === post.module) ||
      pathDetailedContent.topics?.includes(post.module || ""),
  )

  // Function to mark a module as complete
  const markPathModuleComplete = (moduleName: string) => {
    setCompletedPathModulesState((prev) => ({
      ...prev,
      [moduleName]: !prev[moduleName], // Toggle completion status
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center mb-8">
          <Button variant="ghost" asChild className="mr-4">
            <Link href={`/training-paths/${pathSlug}`}>
              <ArrowLeft size={20} />
            </Link>
          </Button>
          <h1 className="text-4xl font-bold text-primary">{pathName} Dashboard</h1>
        </div>

        {!isRegistered ? (
          <Card className="mb-8 p-6 text-center">
            <CardTitle className="text-2xl font-semibold text-primary mb-4">Enroll to Access Your Dashboard</CardTitle>
            <p className="text-gray-700 mb-6">
              You need to be enrolled in the "{pathName}" training path to view your personalized dashboard, track
              progress, and access all resources.
            </p>
            <Button
              className="bg-primary hover:bg-primary/90 px-8 py-3 text-lg"
              onClick={() => setShowRegistrationModal(true)}
            >
              Enroll Now
            </Button>
          </Card>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="course-content">Path Modules</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="discussion-forum">Discussion Forum</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="col-span-1 md:col-span-2 lg:col-span-1">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-primary">Your Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-medium text-gray-800">Overall Progress</span>
                      <span className="text-lg font-bold text-primary">{progressPercentage}%</span>
                    </div>
                    <Progress value={progressPercentage} className="w-full" />
                    <p className="text-sm text-gray-600 mt-2">
                      {completedModulesCount} of {totalModules} modules completed
                    </p>
                    {progressPercentage === 100 && (
                      <Button
                        className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => setShowCertificateModal(true)}
                      >
                        <Award className="mr-2 h-5 w-5" /> Generate Certificate
                      </Button>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-primary">Path Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{pathDetailedContent.description}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-primary">Learning Objectives</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {pathDetailedContent.objectives?.map((objective, idx) => (
                        <li key={idx} className="flex items-start text-gray-700">
                          <CheckCircle className="text-green-500 mr-2 h-5 w-5 mt-0.5" />
                          {objective}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="col-span-full">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-primary">Key Topics Covered</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {pathDetailedContent.topics?.map((topic, idx) => (
                        <span key={idx} className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="col-span-full">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-primary">Resources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {pathDetailedContent.resources?.map((resource, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-sm"
                        >
                          <div className="flex items-center">
                            <FileText className="h-6 w-6 text-gray-600 mr-3" />
                            <div>
                              <p className="font-medium text-gray-800">{resource.name}</p>
                              <span className="text-sm text-gray-500 uppercase">{resource.type}</span>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedResource({
                                courseTitle: pathName,
                                resourceType: resource.type,
                                resourceName: resource.name,
                              })
                              setShowResourceDownloadModal(true)
                            }}
                          >
                            <Download className="h-4 w-4 mr-2" /> Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="course-content" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-primary">
                    Courses and modules included in this training path.
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pathDetailedContent.modules?.map((module, idx) => {
                      let displayTitle = module.name
                      let displayDescription = "No description available."
                      let moduleLink: string
                      let icon = module.icon || "📚"

                      if (module.courseId) {
                        const course = courses.find((c) => c.id === module.courseId)
                        if (course) {
                          displayTitle = course.title
                          displayDescription = course.description || course.desc // Use description or desc
                          moduleLink = `/courses/${course.id}`
                          if (course.category === "Digital Tools") icon = "💻"
                          else if (course.category === "Technical") icon = "⚙️"
                          else if (course.category === "Emerging Tech") icon = "💡"
                          else if (course.category === "Automation") icon = "🤖"
                        } else {
                          moduleLink = `/training-modules/${slugify(module.name)}`
                        }
                      } else {
                        const detailedModule = detailedTrainingModuleContent[module.name]
                        if (detailedModule) {
                          displayDescription = detailedModule.description
                          icon = module.icon || icon
                        }
                        moduleLink = `/training-modules/${slugify(module.name)}`
                      }

                      const isModuleCompleted = completedPathModulesState[module.name]

                      return (
                        <Card key={idx} className={isModuleCompleted ? "border-green-300 bg-green-50" : ""}>
                          <CardHeader className="flex flex-row items-center space-x-4">
                            {getIconComponent(icon)}
                            <div className="space-y-1">
                              <CardTitle className="text-lg font-semibold text-primary">{displayTitle}</CardTitle>
                              <p className="text-sm text-gray-600">{displayDescription}</p>
                            </div>
                          </CardHeader>
                          <CardContent className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Status: {getModuleStatus(module.name)}</span>
                            <div className="flex items-center space-x-2">
                              {!isModuleCompleted && (
                                <Button variant="outline" size="sm" onClick={() => markPathModuleComplete(module.name)}>
                                  Mark Complete
                                </Button>
                              )}
                              <Button asChild size="sm">
                                <Link href={moduleLink}>View Module</Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-primary">Overall Path Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-medium text-gray-800">Completion Rate</span>
                      <span className="text-lg font-bold text-primary">
                        {pathDetailedContent.analytics?.overallProgress || 0}%
                      </span>
                    </div>
                    <Progress value={pathDetailedContent.analytics?.overallProgress || 0} className="w-full" />
                    <p className="text-sm text-gray-600 mt-2">Based on module completion and assessment scores.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-primary">Skill Coverage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {pathDetailedContent.analytics?.skillCoverage?.map((skill, idx) => (
                        <div key={idx}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-700">{skill.skill}</span>
                            <span className="text-sm font-medium text-gray-800">{skill.percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full ${getSkillCoverageColor(skill.percentage)}`}
                              style={{ width: `${skill.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="col-span-full">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-primary">Module-wise Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pathDetailedContent.modules?.map((module, idx) => {
                        const progress = getModuleProgress(module.name)
                        let displayTitle = module.name
                        if (module.courseId) {
                          const course = courses.find((c) => c.id === module.courseId)
                          if (course) {
                            displayTitle = course.title
                          }
                        }
                        return (
                          <div key={idx} className="flex items-center">
                            <div className="w-1/3 text-gray-700 font-medium">{displayTitle}</div>
                            <div className="w-2/3 flex items-center">
                              <Progress value={progress} className="w-full" />
                              <span className="ml-3 text-sm font-medium text-primary">{progress}%</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {pathDetailedContent.caseStudy && (
                  <Card className="col-span-full">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold text-primary">
                        Case Study: {pathDetailedContent.caseStudy.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{pathDetailedContent.caseStudy.description}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="discussion-forum" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-primary">Discussion Forum</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* New Post Form */}
                    <div className="border p-4 rounded-lg bg-gray-50">
                      <h3 className="text-lg font-semibold mb-3 text-primary">Start a New Discussion</h3>
                      <form className="space-y-4">
                        <div>
                          <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
                            Topic
                          </label>
                          <input
                            type="text"
                            id="topic"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            placeholder="e.g., Challenges in Digital Transformation"
                          />
                        </div>
                        <div>
                          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                            Category
                          </label>
                          <select
                            id="category"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                          >
                            <option>General</option>
                            <option>Technical</option>
                            <option>Soft Skills</option>
                            <option>Leadership</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                            Message
                          </label>
                          <textarea
                            id="message"
                            rows={4}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            placeholder="Share your thoughts or questions..."
                          ></textarea>
                        </div>
                        <Button type="submit" className="bg-primary hover:bg-primary/90">
                          Post Discussion
                        </Button>
                      </form>
                    </div>

                    {/* Existing Posts */}
                    <h3 className="text-lg font-semibold mb-4 text-primary">Recent Discussions</h3>
                    {filteredDiscussionPosts.length > 0 ? (
                      <div className="space-y-4">
                        {filteredDiscussionPosts.map((post) => (
                          <Card key={post.id} className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <User className="h-5 w-5 text-gray-500" />
                                <span className="font-semibold text-gray-800">{post.author}</span>
                                <span className="text-sm text-gray-500">
                                  • {formatDistanceToNowStrict(new Date(post.timestamp), { addSuffix: true })}
                                </span>
                              </div>
                              {post.module && (
                                <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                                  {post.module}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-700 mb-3">{post.content}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <Button variant="ghost" size="sm" className="p-0 h-auto">
                                Reply ({post.replies?.length || 0})
                              </Button>
                              <Button variant="ghost" size="sm" className="p-0 h-auto">
                                Like
                              </Button>
                            </div>
                            {post.replies && post.replies.length > 0 && (
                              <div className="ml-8 mt-3 space-y-3 border-l pl-4">
                                {post.replies.map((reply) => (
                                  <div key={reply.id}>
                                    <div className="flex items-center space-x-2 mb-1">
                                      <User className="h-4 w-4 text-gray-400" />
                                      <span className="font-semibold text-gray-700">{reply.author}</span>
                                      <span className="text-xs text-gray-500">
                                        • {formatDistanceToNowStrict(new Date(reply.timestamp), { addSuffix: true })}
                                      </span>
                                    </div>
                                    <p className="text-gray-600">{reply.content}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 text-center py-8">No discussions yet. Be the first to post!</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Certificate Modal */}
      <CertificateModal
        course={{
          id: pathSlug,
          title: pathName,
          desc: "", // Ensure description is provided
          category: "",
          level: "",
          duration: "",
          modules: 0, // Ensure modules is a number
          objectives: [], // Ensure objectives is an array
          curriculum: [], // Ensure curriculum is an array
        }}
        isOpen={showCertificateModal}
        onClose={() => setShowCertificateModal(false)}
        userName={registeredUserName} // Pass the registered user name
        courseName={pathName} // Pass the path name as course name
      />

      {/* Resource Download Modal */}
      <Dialog open={showResourceDownloadModal} onOpenChange={setShowResourceDownloadModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Download Resource</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <p className="text-sm text-gray-700">
              You are about to download: <strong>{selectedResource?.resourceName}</strong>
            </p>
            {resourceDownloadStatus && (
              <p className={`text-sm ${resourceDownloadStatus.success ? "text-green-600" : "text-red-600"}`}>
                {resourceDownloadStatus.message}
              </p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowResourceDownloadModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleDownloadResource} disabled={resourceDownloadStatus?.message === "Generating..."}>
              {resourceDownloadStatus?.message === "Generating..." ? "Generating..." : "Confirm Download"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Registration Modal */}
      <Dialog open={showRegistrationModal} onOpenChange={setShowRegistrationModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Course Registration</DialogTitle>
          </DialogHeader>
          <RegistrationForm
            itemTitle={pathName}
            onSuccess={handleRegistrationSuccess}
            onCancel={() => setShowRegistrationModal(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Helper components for icons (assuming these are available or need to be defined)
// If these are not defined elsewhere, they would need to be imported from lucide-react
import {
  RefreshCcw,
  Scale,
  Laptop,
  Factory,
  Search,
  Wrench,
  AlertTriangle,
  Leaf,
  Lightbulb,
  LineChart,
  Bot,
  Microscope,
  Printer,
  Wifi,
} from "lucide-react"
