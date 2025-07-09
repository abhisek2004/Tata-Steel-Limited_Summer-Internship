"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeft, 
  BookOpen, 
  BarChart2, 
  MessageSquare, 
  FileText, 
  Download, 
  Clock, 
  Archive, 
  CheckCircle, 
  Circle, 
  Trophy,
  Award,
  Calendar,
  User,
  ChevronRight,
  ChevronDown,
  Play,
  Bookmark,
  AlertCircle
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Course, ModuleType } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"
import SimpleMarkdown from "./SimpleMarkdown"

interface CourseDashboardContentProps {
  course: Course
  userName?: string
}

export default function CourseDashboardContent({ course, userName = "User" }: CourseDashboardContentProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [moduleProgress, setModuleProgress] = useState<{[key: string]: boolean}>({})
  const [expandedModules, setExpandedModules] = useState<{[key: string]: boolean}>({})
  const [quizScores, setQuizScores] = useState<{[key: string]: number}>({})
  const [timeSpent, setTimeSpent] = useState<{[key: string]: number}>({})
  const [certificateAvailable, setCertificateAvailable] = useState(false)
  const { toast } = useToast()

  // Initialize module progress from localStorage if available
  useEffect(() => {
    try {
      if (!course?.curriculum || !Array.isArray(course.curriculum)) {
        throw new Error('Invalid curriculum data')
      }

      // Load progress from localStorage
      const savedProgress = localStorage.getItem(`course-${course.id}-progress`)
      const savedQuizScores = localStorage.getItem(`course-${course.id}-quiz-scores`)
      const savedTimeSpent = localStorage.getItem(`course-${course.id}-time-spent`)
      
      if (savedProgress) {
        setModuleProgress(JSON.parse(savedProgress))
      } else {
        // Initialize with all modules incomplete
        const initialProgress = course.curriculum.reduce((acc, _, index) => {
          acc[`module-${index + 1}`] = false
          return acc
        }, {} as {[key: string]: boolean})
        setModuleProgress(initialProgress)
      }

      if (savedQuizScores) {
        setQuizScores(JSON.parse(savedQuizScores))
      } else {
        // Initialize with zero scores
        const initialScores = course.curriculum.reduce((acc, _, index) => {
          acc[`module-${index + 1}`] = 0
          return acc
        }, {} as {[key: string]: number})
        setQuizScores(initialScores)
      }

      if (savedTimeSpent) {
        setTimeSpent(JSON.parse(savedTimeSpent))
      } else {
        // Initialize with zero time spent
        const initialTime = course.curriculum.reduce((acc, _, index) => {
          acc[`module-${index + 1}`] = 0
          return acc
        }, {} as {[key: string]: number})
        setTimeSpent(initialTime)
      }
    } catch (error) {
      console.error('Error initializing module data:', error)
      setModuleProgress({})
      setQuizScores({})
      setTimeSpent({})
    }
  }, [course?.curriculum, course?.id])

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(moduleProgress).length > 0) {
      localStorage.setItem(`course-${course.id}-progress`, JSON.stringify(moduleProgress))
      
      // Check if all modules are completed to enable certificate
      const allModulesCompleted = Object.values(moduleProgress).every(Boolean)
      setCertificateAvailable(allModulesCompleted)
    }
  }, [moduleProgress, course?.id])

  // Save quiz scores to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(quizScores).length > 0) {
      localStorage.setItem(`course-${course.id}-quiz-scores`, JSON.stringify(quizScores))
    }
  }, [quizScores, course?.id])

  // Save time spent to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(timeSpent).length > 0) {
      localStorage.setItem(`course-${course.id}-time-spent`, JSON.stringify(timeSpent))
    }
  }, [timeSpent, course?.id])

  // Track time spent on active module
  useEffect(() => {
    if (activeTab === "content") {
      const timer = setInterval(() => {
        const activeModuleId = Object.keys(expandedModules).find(key => expandedModules[key])
        if (activeModuleId) {
          setTimeSpent(prev => ({
            ...prev,
            [activeModuleId]: (prev[activeModuleId] || 0) + 1
          }))
        }
      }, 60000) // Update every minute

      return () => clearInterval(timer)
    }
  }, [activeTab, expandedModules])

  // Safely calculate progress metrics
  const totalModules = course?.curriculum?.length || 0
  const completedModules = Object.values(moduleProgress).filter(Boolean).length
  const progress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0

  const handleModuleCompletion = (moduleIndex: number) => {
    const moduleId = `module-${moduleIndex + 1}`
    setModuleProgress(prev => {
      const newProgress = {
        ...prev,
        [moduleId]: !prev[moduleId]
      }
      return newProgress
    })

    if (!moduleProgress[moduleId]) {
      toast({
        title: "Module Completed",
        description: `You've completed ${course?.curriculum?.[moduleIndex] || `Module ${moduleIndex + 1}`}`,
      })
    }
  }

  const toggleModuleExpansion = (moduleIndex: number) => {
    const moduleId = `module-${moduleIndex + 1}`
    setExpandedModules(prev => {
      // Close all other modules
      const newState = Object.keys(prev).reduce((acc, key) => {
        acc[key] = false
        return acc
      }, {} as {[key: string]: boolean})
      
      // Toggle the clicked module
      newState[moduleId] = !prev[moduleId]
      return newState
    })
  }

  const handleQuizSubmission = (moduleIndex: number, score: number) => {
    const moduleId = `module-${moduleIndex + 1}`
    setQuizScores(prev => ({
      ...prev,
      [moduleId]: score
    }))

    toast({
      title: "Quiz Completed",
      description: `You scored ${score}% on the ${course?.curriculum?.[moduleIndex] || `Module ${moduleIndex + 1}`} quiz`,
    })

    // Automatically mark module as complete if score is above 70%
    if (score >= 70 && !moduleProgress[moduleId]) {
      handleModuleCompletion(moduleIndex)
    }
  }

  const handleDownloadCertificate = () => {
    // In a real application, this would generate and download a PDF certificate
    toast({
      title: "Certificate Downloaded",
      description: `Your certificate for ${course?.title} has been downloaded.`,
    })
  }

  const handleDownloadResource = (resourceName: string, resourceType: string) => {
    // In a real application, this would download the actual resource
    toast({
      title: "Resource Downloaded",
      description: `${resourceName} (${resourceType}) has been downloaded.`,
    })
  }

  // Process module content with type safety
  const moduleContent = (course?.curriculum || []).map((module, index) => {
    const isString = typeof module === 'string'
    const moduleId = `module-${index + 1}`
    
    try {
      if (isString) {
        return {
          title: module,
          content: `This module covers detailed topics to provide a comprehensive understanding of the subject. Each topic includes explanations, examples, and resources to enhance learning.`,
          topics: [
            {
              title: "Topic 1: Introduction and Overview",
              explanation: "An overview of the module's main concepts and objectives.",
              example: null,
              resources: [
                { type: "pdf", link: "https://example.com/intro-overview.pdf" },
                { type: "video", link: "https://example.com/intro-overview-video" }
              ],
              level: "Beginner"
            },
            {
              title: "Topic 2: Key Concepts and Terminology",
              explanation: "Detailed explanation of key terms and concepts used in this module.",
              example: null,
              resources: [
                { type: "pdf", link: "https://example.com/key-concepts.pdf" }
              ],
              level: "Beginner"
            },
            {
              title: "Topic 3: Practical Applications",
              explanation: "Use-cases and examples demonstrating practical applications of the concepts.",
              example: "const example = 'Practical example code snippet';",
              resources: [
                { type: "video", link: "https://example.com/practical-applications-video" }
              ],
              level: "Intermediate"
            },
            {
              title: "Topic 4: Case Studies and Examples",
              explanation: "In-depth case studies to illustrate real-world scenarios.",
              example: null,
              resources: [
                { type: "pdf", link: "https://example.com/case-studies.pdf" }
              ],
              level: "Intermediate"
            },
            {
              title: "Topic 5: Summary and Review",
              explanation: "Summary of key points and review questions.",
              example: null,
              resources: [],
              level: "Beginner"
            }],
          resources: [],
          isCompleted: Boolean(moduleProgress[moduleId]),
          quizScore: quizScores[moduleId] || 0,
          timeSpent: timeSpent[moduleId] || 0,
          quiz: {
            questions: [
              {
                question: 'What is the main purpose of this module?',
                options: ['To introduce the topic', 'To provide advanced knowledge', 'To test prior knowledge', 'To summarize the course'],
                correctAnswerIndex: 0
              },
              {
                question: 'Which topic covers practical applications?',
                options: ['Topic 1', 'Topic 3', 'Topic 5', 'Topic 2'],
                correctAnswerIndex: 1
              }
            ]
          },
          assignment: null,
          videoLectures: [],
          pdfNotes: [],
          learningOutcomes: [],
          difficultyLevel: null
        }
      }

      const typedModule = module as ModuleType
      return {
        title: typedModule?.title || 'Untitled Module',
        content: typedModule?.content || 'Detailed topics for this module will be added here. Each topic can include explanations, examples, and resources to enhance learning.',
        topics: typedModule?.topics || [
          'Topic 1: Introduction and Overview',
          'Topic 2: Key Concepts and Terminology',
          'Topic 3: Practical Applications',
          'Topic 4: Case Studies and Examples',
          'Topic 5: Summary and Review'
        ],
        resources: Array.isArray(typedModule?.resources) ? typedModule.resources : [],
        isCompleted: Boolean(moduleProgress[moduleId]),
        quizScore: quizScores[moduleId] || 0,
        timeSpent: timeSpent[moduleId] || 0,
        quiz: typedModule?.quiz || {
          questions: [
            {
              question: 'What is the main purpose of this module?',
              options: ['To introduce the topic', 'To provide advanced knowledge', 'To test prior knowledge', 'To summarize the course'],
              correctAnswerIndex: 0
            },
            {
              question: 'Which topic covers practical applications?',
              options: ['Topic 1', 'Topic 3', 'Topic 5', 'Topic 2'],
              correctAnswerIndex: 1
            }
          ]
        },
        assignment: typedModule?.assignment || null,
        videoLectures: typedModule?.videoLectures || [],
        pdfNotes: typedModule?.pdfNotes || [],
        learningOutcomes: typedModule?.learningOutcomes || [],
        difficultyLevel: typedModule?.difficultyLevel || null
      }
    } catch (error) {
      console.error(`Error processing module ${index + 1}:`, error)
      return {
        title: `Module ${index + 1}`,
        content: 'Detailed topics for this module will be added here. Each topic can include explanations, examples, and resources to enhance learning.',
        topics: [
          'Topic 1: Introduction and Overview',
          'Topic 2: Key Concepts and Terminology',
          'Topic 3: Practical Applications',
          'Topic 4: Case Studies and Examples',
          'Topic 5: Summary and Review'
        ],
        resources: [],
        isCompleted: false,
        quizScore: 0,
        timeSpent: 0,
        quiz: {
          questions: [
            {
              question: 'What is the main purpose of this module?',
              options: ['To introduce the topic', 'To provide advanced knowledge', 'To test prior knowledge', 'To summarize the course'],
              correctAnswerIndex: 0
            },
            {
              question: 'Which topic covers practical applications?',
              options: ['Topic 1', 'Topic 3', 'Topic 5', 'Topic 2'],
              correctAnswerIndex: 1
            }
          ]
        },
        assignment: null,
        videoLectures: [],
        pdfNotes: [],
        learningOutcomes: [],
        difficultyLevel: null
      }
    }
  })

  // Calculate average quiz score
  const quizScoreValues = Object.values(quizScores)
  const averageQuizScore = quizScoreValues.length > 0 
    ? Math.round(quizScoreValues.reduce((sum, score) => sum + score, 0) / quizScoreValues.length) 
    : 0

  // Calculate total time spent (in minutes)
  const totalTimeSpent = Object.values(timeSpent).reduce((sum, time) => sum + time, 0)

  return (
    <div className="space-y-6">
      {/* Header with back button and course title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/courses" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-10 py-2 px-4 bg-secondary text-secondary-foreground hover:bg-secondary/80">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Link>
          <h1 className="text-2xl font-bold">{course?.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">
            Welcome, <span className="font-medium">{userName}</span>
          </div>
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
            <User className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Course progress overview */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Course Progress</CardTitle>
          <CardDescription>
            {completedModules} of {totalModules} modules completed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <Progress value={progress} className="h-2 w-full" />
            <div className="flex justify-between text-sm">
              <span>{progress}% complete</span>
              <span>{totalTimeSpent} minutes spent learning</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main content tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">
            <BookOpen className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="content">
            <FileText className="mr-2 h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="resources">
            <Archive className="mr-2 h-4 w-4" />
            Resources
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart2 className="mr-2 h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="certificate">
            <Trophy className="mr-2 h-4 w-4" />
            Certificate
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Overview</CardTitle>
              <CardDescription>{course?.desc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Course Details</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Duration: {course?.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span>Modules: {course?.modules}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span>Level: {course?.level}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <span>Category: {course?.category}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Your Progress</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Completed: {completedModules} modules</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Circle className="h-4 w-4 text-amber-500" />
                      <span>Remaining: {totalModules - completedModules} modules</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BarChart2 className="h-4 w-4 text-blue-500" />
                      <span>Avg. Quiz Score: {averageQuizScore}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-indigo-500" />
                      <span>Started: {new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Learning Objectives</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {course?.objectives?.map((objective, index) => (
                    <li key={index} className="text-sm">{objective}</li>
                  )) || <li className="text-sm">No objectives specified</li>}
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Prerequisites</h3>
                <p className="text-sm">{course?.prerequisites || "None"}</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Certification</h3>
                <p className="text-sm">{course?.certification || "No certification available"}</p>
                {certificateAvailable && (
                  <Button variant="outline" size="sm" onClick={() => setActiveTab("certificate")}>
                    <Trophy className="mr-2 h-4 w-4" />
                    View Certificate
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>
                Work through each module to complete the course
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {moduleContent.map((module, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <div 
                    className={`flex items-center justify-between p-4 cursor-pointer ${module.isCompleted ? 'bg-green-50' : ''}`}
                    onClick={() => toggleModuleExpansion(index)}
                  >
                    <div className="flex items-center gap-3">
                      {module.isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-300" />
                      )}
                      <div>
                        <h3 className="font-medium">{module.title}</h3>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Quiz Score: {module.quizScore}%</span>
                          <span>Time Spent: {module.timeSpent} minutes</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation()
                          handleModuleCompletion(index)
                        }}
                      >
                        {module.isCompleted ? "Mark Incomplete" : "Mark Complete"}
                      </Button>
                      {expandedModules[`module-${index + 1}`] ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                    </div>
                  </div>
                  
                  {expandedModules[`module-${index + 1}`] && (
                    <div className="p-4 border-t bg-gray-50">
                      <div className="space-y-4">
                        {/* Difficulty Level Tag */}
                        {module.difficultyLevel && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Difficulty:</span>
                            {module.difficultyLevel === "Beginner" && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                🟢 Beginner
                              </span>
                            )}
                            {module.difficultyLevel === "Intermediate" && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                🟡 Intermediate
                              </span>
                            )}
                            {module.difficultyLevel === "Advanced" && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                🔴 Advanced
                              </span>
                            )}
                          </div>
                        )}

                        {/* Module content */}
                        <div className="space-y-2">
                          <h4 className="font-medium">Module Content</h4>
                          {module.content ? (
                            <div className="prose prose-sm max-w-none">
                              <SimpleMarkdown>{module.content}</SimpleMarkdown>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center p-8 border rounded-md bg-gray-100">
                              <div className="text-center">
                                <Play className="h-8 w-8 mx-auto mb-2 text-primary" />
                                <p className="text-sm font-medium">Start Learning</p>
                                <p className="text-xs text-muted-foreground">Click to begin this module</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Video Lectures */}
                        {module.videoLectures && module.videoLectures.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium">📺 Video Lectures</h4>
                            <div className="grid grid-cols-1 gap-3">
                              {module.videoLectures.map((video, videoIndex) => (
                                <Card key={videoIndex}>
                                  <CardHeader className="pb-2">
                                    <div className="flex justify-between items-center">
                                      <CardTitle className="text-sm">{video.title}</CardTitle>
                                      <span className="text-xs text-muted-foreground">{video.duration}</span>
                                    </div>
                                    <CardDescription className="text-xs">{video.provider}</CardDescription>
                                  </CardHeader>
                                  <CardContent className="pt-0">
                                    <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center">
                                      <Button variant="outline" size="sm">
                                        <Play className="h-4 w-4 mr-2" /> Watch Video
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* PDF Notes */}
                        {module.pdfNotes && module.pdfNotes.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium">📄 PDF Notes</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {module.pdfNotes.map((pdf, pdfIndex) => (
                                <Card key={pdfIndex}>
                                  <CardHeader className="p-3">
                                    <div className="flex justify-between items-center">
                                      <CardTitle className="text-sm">{pdf.title}</CardTitle>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => handleDownloadResource(pdf.title, "PDF")}
                                      >
                                        <Download className="h-4 w-4" />
                                      </Button>
                                    </div>
                                    <CardDescription className="text-xs">{pdf.pages} pages</CardDescription>
                                  </CardHeader>
                                </Card>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Module quiz */}
                        <div className="space-y-2">
                          <h4 className="font-medium">🧪 Module Quiz</h4>
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">Knowledge Check</CardTitle>
                              <CardDescription>
                                Test your understanding of this module
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              {module.quiz ? (
                                <div className="space-y-4">
                                  {module.quiz.questions.map((question, qIndex) => {
                                    const userAnswer = quizScores[`${index}-q${qIndex}`]?.answer || "";
                                    const isCorrect = quizScores[`${index}-q${qIndex}`]?.isCorrect;
                                    return (
                                      <div key={qIndex} className="mb-4">
                                        <p className="font-medium">{qIndex + 1}. {question.question}</p>
                                        <div className="mt-2 space-y-2">
                                          {question.options.map((option, oIndex) => {
                                            const optionValue = typeof option === "string" ? option : option.text;
                                            return (
                                              <label key={oIndex} className={`block cursor-pointer rounded border p-2 ${userAnswer === optionValue ? (isCorrect ? "bg-green-100 border-green-500" : "bg-red-100 border-red-500") : "border-gray-300"}`}>
                                                <input
                                                  type="radio"
                                                  name={`quiz-${index}-q${qIndex}`}
                                                  value={optionValue}
                                                  checked={userAnswer === optionValue}
                                                  onChange={() => handleQuizSubmission(index, qIndex, optionValue)}
                                                  className="mr-2"
                                                />
                                                {optionValue}
                                              </label>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <p className="text-sm">No quiz available for this module.</p>
                              )}
                            </CardContent>
                            {module.quizScore > 0 && (
                              <CardFooter className="border-t pt-4">
                                <div className="w-full">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium">Your Score</span>
                                    <span className="text-sm font-medium">{module.quizScore}%</span>
                                  </div>
                                  <Progress value={module.quizScore} className="h-2" />
                                </div>
                              </CardFooter>
                            )}
                          </Card>
                        </div>

                        {/* Assignment */}
                        {module.assignment && (
                          <div className="space-y-2">
                            <h4 className="font-medium">📝 Assignment</h4>
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg">{module.assignment.title}</CardTitle>
                                {module.assignment.dueDate && (
                                  <CardDescription>
                                    Due: {module.assignment.dueDate}
                                  </CardDescription>
                                )}
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm">{module.assignment.description}</p>
                              </CardContent>
                              <CardFooter>
                                <Button variant="outline" size="sm">
                                  Submit Assignment
                                </Button>
                              </CardFooter>
                            </Card>
                          </div>
                        )}
                        
                        {/* Module resources */}
                        {module.resources && module.resources.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium">📚 Module Resources</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {module.resources.map((resource, resourceIndex) => (
                                <Card key={resourceIndex}>
                                  <CardHeader className="p-3">
                                    <div className="flex justify-between items-center">
                                      <CardTitle className="text-sm">{resource.name}</CardTitle>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => handleDownloadResource(resource.name, resource.type)}
                                      >
                                        <Download className="h-4 w-4" />
                                      </Button>
                                    </div>
                                    <CardDescription className="text-xs">{resource.type}</CardDescription>
                                  </CardHeader>
                                </Card>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Learning Outcomes */}
                        {module.learningOutcomes && module.learningOutcomes.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium">📌 Learning Outcomes</h4>
                            <Card>
                              <CardContent className="pt-4">
                                <ul className="space-y-2">
                                  {module.learningOutcomes.map((outcome, outcomeIndex) => (
                                    <li key={outcomeIndex} className="flex items-start gap-2">
                                      <span className="text-green-500 mt-0.5">✅</span>
                                      <span className="text-sm">{outcome}</span>
                                    </li>
                                  ))}
                                </ul>
                              </CardContent>
                            </Card>
                          </div>
                        )}

                        {/* Progress Tracker */}
                        <div className="space-y-2">
                          <h4 className="font-medium">🧭 Progress Tracker</h4>
                          <Card>
                            <CardContent className="pt-4">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="radio" 
                                    id={`completed-${index}`} 
                                    name={`progress-${index}`} 
                                    checked={module.isCompleted} 
                                    onChange={() => module.isCompleted ? null : handleModuleCompletion(index)}
                                    className="h-4 w-4 text-primary"
                                  />
                                  <label htmlFor={`completed-${index}`} className="text-sm">✅ Completed</label>
                                </div>
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="radio" 
                                    id={`in-progress-${index}`} 
                                    name={`progress-${index}`} 
                                    checked={!module.isCompleted && module.timeSpent > 0} 
                                    onChange={() => {}}
                                    className="h-4 w-4 text-amber-500"
                                  />
                                  <label htmlFor={`in-progress-${index}`} className="text-sm">🕓 In Progress</label>
                                </div>
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="radio" 
                                    id={`not-started-${index}`} 
                                    name={`progress-${index}`} 
                                    checked={!module.isCompleted && module.timeSpent === 0} 
                                    onChange={() => {}}
                                    className="h-4 w-4 text-red-500"
                                  />
                                  <label htmlFor={`not-started-${index}`} className="text-sm">❌ Not Started</label>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Resources</CardTitle>
              <CardDescription>
                Download materials to support your learning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Course resources */}
                {course?.resources && course.resources.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {course.resources.map((resource, index) => (
                      <Card key={index} className="overflow-hidden">
                        <div className="bg-gray-100 p-6 flex items-center justify-center">
                          {resource.type.includes("PDF") && <FileText className="h-12 w-12 text-red-500" />}
                          {resource.type.includes("Video") && <Play className="h-12 w-12 text-blue-500" />}
                          {resource.type.includes("Presentation") && <Bookmark className="h-12 w-12 text-amber-500" />}
                          {!resource.type.includes("PDF") && 
                           !resource.type.includes("Video") && 
                           !resource.type.includes("Presentation") && 
                           <Archive className="h-12 w-12 text-gray-500" />}
                        </div>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{resource.name}</CardTitle>
                          <CardDescription>{resource.type}</CardDescription>
                        </CardHeader>
                        <CardFooter>
                          <Button 
                            variant="outline" 
                            className="w-full" 
                            onClick={() => handleDownloadResource(resource.name, resource.type)}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-gray-50">
                    <Archive className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Resources Available</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      This course doesn't have any downloadable resources yet. Check back later or explore the course content.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Learning Analytics</CardTitle>
              <CardDescription>
                Track your progress and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Overall Progress */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Overall Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-sm">
                          <span>Course Completion</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-sm">
                          <span>Quiz Performance</span>
                          <span>{averageQuizScore}%</span>
                        </div>
                        <Progress value={averageQuizScore} className="h-2" />
                      </div>
                      
                      <div className="pt-2">
                        <div className="flex justify-between text-sm font-medium">
                          <span>Estimated Completion</span>
                          <span>{progress < 100 ? "In Progress" : "Completed"}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {progress < 100 
                            ? `Based on your current pace, you'll complete this course in approximately ${Math.ceil((totalModules - completedModules) * 2)} days.`
                            : "Congratulations on completing this course!"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Quiz Performance */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Quiz Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(quizScores).length > 0 ? (
                        <div className="space-y-3">
                          {Object.entries(quizScores).map(([moduleId, score], index) => {
                            const moduleIndex = parseInt(moduleId.split('-')[1]) - 1
                            const moduleTitle = course?.curriculum?.[moduleIndex] || `Module ${moduleIndex + 1}`
                            const module = moduleContent[moduleIndex]
                            return (
                              <div key={moduleId} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <div className="flex items-center gap-2">
                                    <span>{moduleTitle}</span>
                                    {module?.difficultyLevel && (
                                      <div>
                                        {module.difficultyLevel === "Beginner" && (
                                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                            🟢
                                          </span>
                                        )}
                                        {module.difficultyLevel === "Intermediate" && (
                                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                            🟡
                                          </span>
                                        )}
                                        {module.difficultyLevel === "Advanced" && (
                                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                            🔴
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  <span>{score}%</span>
                                </div>
                                <Progress value={score} className="h-1.5" />
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-8 text-center">
                          <AlertCircle className="h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-sm font-medium">No Quiz Data Available</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Complete module quizzes to see your performance here
                          </p>
                        </div>
                      )}
                      
                      <div className="pt-2 border-t">
                        <div className="flex justify-between text-sm font-medium">
                          <span>Average Score</span>
                          <span>{averageQuizScore}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {averageQuizScore >= 80 
                            ? "Excellent performance! You have a strong understanding of the material." 
                            : averageQuizScore >= 60 
                              ? "Good progress. Review the modules where you scored lower to improve your understanding." 
                              : "Keep practicing. Review the course materials to improve your scores."}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Time Spent */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Time Spent</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(timeSpent).length > 0 ? (
                        <div className="space-y-3">
                          {Object.entries(timeSpent).map(([moduleId, minutes], index) => {
                            const moduleIndex = parseInt(moduleId.split('-')[1]) - 1
                            const moduleTitle = course?.curriculum?.[moduleIndex] || `Module ${moduleIndex + 1}`
                            const module = moduleContent[moduleIndex]
                            const maxTime = Math.max(...Object.values(timeSpent))
                            const percentage = maxTime > 0 ? (minutes / maxTime) * 100 : 0
                            
                            return (
                              <div key={moduleId} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <div className="flex items-center gap-2">
                                    <span>{moduleTitle}</span>
                                    {module?.difficultyLevel && (
                                      <div>
                                        {module.difficultyLevel === "Beginner" && (
                                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                            🟢
                                          </span>
                                        )}
                                        {module.difficultyLevel === "Intermediate" && (
                                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                            🟡
                                          </span>
                                        )}
                                        {module.difficultyLevel === "Advanced" && (
                                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                            🔴
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex flex-col items-end">
                                    <span>{minutes} minutes</span>
                                    {module?.videoLectures && module.videoLectures.length > 0 && (
                                      <span className="text-xs text-muted-foreground">
                                        {module.videoLectures.length} video{module.videoLectures.length > 1 ? 's' : ''}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <Progress value={percentage} className="h-1.5" />
                                {module?.assignment && (
                                  <div className="flex justify-between text-xs text-muted-foreground pt-1">
                                    <span>Assignment: {module.assignment.title}</span>
                                    <span>{module.isCompleted ? "Completed" : "Pending"}</span>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-8 text-center">
                          <Clock className="h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-sm font-medium">No Time Data Available</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Spend time on modules to track your learning time
                          </p>
                        </div>
                      )}
                      
                      <div className="pt-2 border-t">
                        <div className="flex justify-between text-sm font-medium">
                          <span>Total Time</span>
                          <span>{totalTimeSpent} minutes</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          You've spent approximately {Math.floor(totalTimeSpent / 60)} hours and {totalTimeSpent % 60} minutes learning this course.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Module-wise Progress */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Module-wise Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {moduleContent.map((module, index) => (
                        <div key={index} className="flex items-center gap-3">
                          {module.isCompleted ? (
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-300 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium truncate">{module.title}</p>
                              {module.difficultyLevel && (
                                <div>
                                  {module.difficultyLevel === "Beginner" && (
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                      🟢
                                    </span>
                                  )}
                                  {module.difficultyLevel === "Intermediate" && (
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                      🟡
                                    </span>
                                  )}
                                  {module.difficultyLevel === "Advanced" && (
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                      🔴
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center flex-wrap gap-2 text-xs text-muted-foreground">
                              <span>Quiz: {module.quizScore}%</span>
                              <span>•</span>
                              <span>Time: {module.timeSpent} min</span>
                              {module.videoLectures && module.videoLectures.length > 0 && (
                                <>
                                  <span>•</span>
                                  <span>Videos: {module.videoLectures.length}</span>
                                </>
                              )}
                              {module.assignment && (
                                <>
                                  <span>•</span>
                                  <span>Assignment: {module.isCompleted ? "✓" : "⌛"}</span>
                                </>
                              )}
                              {module.learningOutcomes && module.learningOutcomes.length > 0 && (
                                <>
                                  <span>•</span>
                                  <span>Outcomes: {module.learningOutcomes.length}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex-shrink-0"
                            onClick={() => {
                              setActiveTab("content")
                              setTimeout(() => toggleModuleExpansion(index), 100)
                            }}
                          >
                            {module.isCompleted ? "Review" : "Start"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certificate Tab */}
        <TabsContent value="certificate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Certificate</CardTitle>
              <CardDescription>
                Your achievement for completing this course
              </CardDescription>
            </CardHeader>
            <CardContent>
              {certificateAvailable ? (
                <div className="space-y-6">
                  <div className="border p-6 rounded-lg bg-gray-50">
                    <div className="text-center space-y-4">
                      <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full">
                        <Trophy className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold">Certificate of Completion</h3>
                      <p className="text-muted-foreground">This certifies that</p>
                      <p className="text-2xl font-bold text-primary">{userName}</p>
                      <p className="text-muted-foreground">has successfully completed</p>
                      <p className="text-xl font-semibold">{course?.title}</p>
                      <p className="text-muted-foreground">on {new Date().toLocaleDateString()}</p>
                      
                      <div className="pt-4">
                        <Image 
                          src="/images/certificate-seal.png" 
                          alt="Certificate Seal" 
                          width={80} 
                          height={80}
                          className="mx-auto"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Completion Details</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Date Issued</span>
                            <span>{new Date().toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Certificate ID</span>
                            <span>TATA-{course?.id}-{Date.now().toString().slice(-6)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Modules Completed</span>
                            <span>{completedModules}/{totalModules}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Average Score</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col items-center justify-center h-full">
                          <div className="relative w-24 h-24 flex items-center justify-center">
                            <svg className="w-24 h-24" viewBox="0 0 100 100">
                              <circle
                                className="text-gray-200"
                                strokeWidth="8"
                                stroke="currentColor"
                                fill="transparent"
                                r="40"
                                cx="50"
                                cy="50"
                              />
                              <circle
                                className="text-primary"
                                strokeWidth="8"
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="transparent"
                                r="40"
                                cx="50"
                                cy="50"
                                strokeDasharray={`${2 * Math.PI * 40}`}
                                strokeDashoffset={`${2 * Math.PI * 40 * (1 - averageQuizScore / 100)}`}
                              />
                            </svg>
                            <span className="absolute text-xl font-bold">{averageQuizScore}%</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">Quiz Performance</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Download Certificate</CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col items-center justify-center h-full">
                        <p className="text-sm text-center text-muted-foreground mb-4">
                          Download your certificate to showcase your achievement
                        </p>
                        <Button onClick={handleDownloadCertificate}>
                          <Download className="mr-2 h-4 w-4" />
                          Download Certificate
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-gray-50">
                  <Trophy className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Certificate Not Available</h3>
                  <p className="text-sm text-muted-foreground max-w-md mb-6">
                    Complete all modules to earn your course certificate. You've completed {completedModules} out of {totalModules} modules.
                  </p>
                  <Progress value={progress} className="h-2 w-full max-w-md mb-6" />
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("content")}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Continue Learning
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}