'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Download, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'

interface Certificate {
  id: string
  certificateId: string
  issuedAt: string
}

interface CompletedCourse {
  id: string
  title: string
  description: string
  category: string
  level: string
  completedAt: string
  certificate: Certificate | null
}

export default function CompletedCourses() {
  const { data: session } = useSession()
  const [completedCourses, setCompletedCourses] = useState<CompletedCourse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [downloadingCertificate, setDownloadingCertificate] = useState<string | null>(null)

  useEffect(() => {
    const fetchCompletedCourses = async () => {
      if (!session?.user?.id) return

      try {
        setIsLoading(true)
        const response = await fetch(`/api/courses/completed?userId=${session.user.id}`)
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to fetch completed courses')
        }
        
        const data = await response.json()
        setCompletedCourses(data)
      } catch (err) {
        console.error('Error fetching completed courses:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCompletedCourses()
  }, [session])

  const handleDownloadCertificate = async (courseId: string, certificateId: string) => {
    try {
      setDownloadingCertificate(courseId)
      
      // Use the new API endpoint for downloading certificates
      const response = await fetch(`/api/certificates/${certificateId}/download`)
      
      if (!response.ok) {
        throw new Error('Failed to download certificate')
      }
      
      // Get the blob from the response
      const blob = await response.blob()
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob)
      
      // Create a temporary anchor element and trigger download
      const a = document.createElement('a')
      a.href = url
      a.download = `certificate-${certificateId}.pdf`
      document.body.appendChild(a)
      a.click()
      
      // Clean up
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('Error downloading certificate:', err)
      alert('Failed to download certificate. Please try again later.')
    } finally {
      setDownloadingCertificate(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-red-500">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (completedCourses.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 text-center">
          <p className="text-gray-500">You haven't completed any courses yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {completedCourses.map((course) => (
          <Card key={course.id} className="h-full flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{course.title}</CardTitle>
                <Badge className="bg-green-500 hover:bg-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Completed
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Category: {course.category}</p>
                  <p className="text-sm text-gray-500">Level: {course.level}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Completed on:</p>
                  <p className="text-sm">
                    {format(new Date(course.completedAt), 'PPP')}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {course.certificate ? (
                <Button 
                  variant="outline" 
                  className="w-full flex items-center gap-2"
                  onClick={() => handleDownloadCertificate(course.id, course.certificate!.certificateId)}
                  disabled={downloadingCertificate === course.id}
                >
                  {downloadingCertificate === course.id ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Download Certificate
                    </>
                  )}
                </Button>
              ) : (
                <p className="text-sm text-gray-500 w-full text-center">No certificate available</p>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}