"use client"

import { Progress } from "@/components/ui/progress"

import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, CheckCircle, ChevronDown, ChevronUp } from "lucide-react"
import { detailedTrainingModuleContent } from "@/lib/data"
import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect } from "react"

interface TrainingModuleDetailPageProps {
  params: {
    moduleName: string
  }
}

export default function TrainingModuleDetailPage({ params }: TrainingModuleDetailPageProps) {
  const moduleSlug = params.moduleName

  // Find the module content by slugifying the keys and matching
  const moduleEntry = Object.entries(detailedTrainingModuleContent).find(([key]) => {
    // Simple slugify for comparison, assuming keys are consistent
    return key.toLowerCase().replace(/\s+/g, "-") === moduleSlug
  })

  if (!moduleEntry) {
    notFound()
  }

  const [moduleName, moduleContent] = moduleEntry

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const [completedContentSections, setCompletedContentSections] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // Initialize completion state from local storage or default to false
    const storedCompletion = localStorage.getItem(`module-${moduleSlug}-completion`)
    if (storedCompletion) {
      setCompletedContentSections(JSON.parse(storedCompletion))
    } else {
      // Initialize all sections as not completed
      const initialCompletion: Record<string, boolean> = {}
      moduleContent.detailedContent?.forEach((_, index) => {
        initialCompletion[`content-${index}`] = false
      })
      setCompletedContentSections(initialCompletion)
    }
  }, [moduleSlug, moduleContent.detailedContent])

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
      localStorage.setItem(`module-${moduleSlug}-completion`, JSON.stringify(newState))
      return newState
    })
  }

  const totalSections = moduleContent.detailedContent?.length || 0
  const completedSectionsCount = Object.values(completedContentSections).filter(Boolean).length
  const progress = totalSections > 0 ? (completedSectionsCount / totalSections) * 100 : 0
  const allSectionsCompleted = completedSectionsCount === totalSections && totalSections > 0

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center mb-8">
          <Button variant="ghost" asChild className="mr-4">
            <Link href="/training-modules">
              <ArrowLeft size={20} />
            </Link>
          </Button>
          <h1 className="text-4xl font-bold text-primary">{moduleName}</h1>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <p className="text-lg text-gray-700 mb-6">{moduleContent.description}</p>

          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Learning Objectives</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {moduleContent.objectives?.map((obj, idx) => (
                <li key={idx}>{obj}</li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Key Topics</h2>
            <div className="flex flex-wrap gap-3">
              {moduleContent.topics?.map((topic, idx) => (
                <span key={idx} className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
                  {topic}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Your Progress</h2>
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-medium text-gray-800">Module Completion</span>
              <span className="text-lg font-bold text-primary">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-600 mt-2">
              {completedSectionsCount} of {totalSections} sections completed
            </p>
          </div>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Module Content</h2>
          {moduleContent.detailedContent?.map((content, idx) => {
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
                      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content.content }} />
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </section>
      </div>
    </div>
  )
}
