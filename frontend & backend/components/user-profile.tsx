"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, LogOut, Lock, Phone, BookOpen, Award, Clock, CheckCircle, AlertCircle, XCircle, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

export default function UserProfile() {
  const { data: session } = useSession()
  const router = useRouter()
  
  // State for profile update
  const [name, setName] = useState(session?.user?.name || "")
  const [department, setDepartment] = useState(session?.user?.department || "")
  const [phone, setPhone] = useState("") // Added phone field
  const [updateMessage, setUpdateMessage] = useState("") 
  const [updateError, setUpdateError] = useState("")
  
  // State for password change
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordMessage, setPasswordMessage] = useState("")
  const [passwordError, setPasswordError] = useState("")
  
  // Define types for course enrollments and certificates
  interface CourseEnrollment {
    id: string;
    title: string;
    progress: number;
    status: string;
    updatedAt: string;
  }
  
  interface Certificate {
    id: string;
    courseTitle: string;
    certificateId: string;
    issuedAt: string;
  }
  
  interface DashboardData {
    user: {
      id: string;
      name: string;
      email: string;
      department?: string;
      role?: string;
    };
    recentCourses: CourseEnrollment[];
    recentPaths: any[];
    recentCertificates: Certificate[];
    upcomingEvents: any[];
    stats: {
      coursesCompleted: number;
      totalCourses: number;
      courseCompletionRate: number;
      pathsCompleted: number;
      totalPaths: number;
      pathCompletionRate: number;
      certificatesEarned: number;
      eventsAttended: number;
    };
  }
  
  // State for course enrollments and certificates
  const [courseEnrollments, setCourseEnrollments] = useState<CourseEnrollment[]>([])
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)

  // Fetch user dashboard data including course enrollments and certificates
  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.id) {
        setIsLoading(true)
        try {
          // Fetch dashboard data
          const dashboardResponse = await fetch(`/api/dashboard?userId=${session.user.id}`)
          if (dashboardResponse.ok) {
            const data = await dashboardResponse.json()
            setDashboardData(data)
            setCourseEnrollments(data.recentCourses || [])
            setCertificates(data.recentCertificates || [])
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }
    
    fetchUserData()
  }, [session])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdateMessage("")
    setUpdateError("")
    
    try {
      const response = await fetch("/api/user/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session?.user?.id,
          name,
          department,
          phone, // Added phone field
        }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setUpdateMessage("Profile updated successfully!")
      } else {
        setUpdateError(data.error || "Failed to update profile")
      }
    } catch (error) {
      setUpdateError("An error occurred while updating profile")
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordMessage("")
    setPasswordError("")
    
    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match')
      return
    }
    
    try {
      const response = await fetch('/api/user/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        setPasswordError(data.error || 'Failed to change password')
      } else {
        setPasswordMessage('Password changed successfully!')
        // Clear password fields
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }
    } catch (error) {
      setPasswordError('An error occurred while changing password')
    }
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/login')
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <p>Please log in to view your profile.</p>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">User Profile</CardTitle>
            <CardDescription>Manage your account details</CardDescription>
          </div>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="bg-primary text-primary-foreground rounded-full p-3">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-medium text-lg">{session.user.name}</h3>
              <p className="text-sm text-gray-500">{session.user.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                  ID: {session.user.id}
                </span>
                {session.user.department && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                    {session.user.department}
                  </span>
                )}
                {session.user.role && (
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                    {session.user.role}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile Details</TabsTrigger>
            <TabsTrigger value="password">Change Password</TabsTrigger>
            <TabsTrigger value="activity">My Courses</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4 mt-4">
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              {updateError && <div className="text-red-500 text-sm p-2 bg-red-50 rounded">{updateError}</div>}
              {updateMessage && <div className="text-green-500 text-sm p-2 bg-green-50 rounded">{updateMessage}</div>}
              
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>Phone Number</span>
                  </div>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <select
                  id="department"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                >
                  <option value="">Select department</option>
                  <option value="Production">Production</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Finance">Finance</option>
                  <option value="Information Technology">Information Technology</option>
                </select>
              </div>
              
              <Button type="submit" className="w-full">Update Profile</Button>
            </form>
          </TabsContent>
          
          <TabsContent value="password" className="space-y-4 mt-4">
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {passwordError && <div className="text-red-500 text-sm p-2 bg-red-50 rounded">{passwordError}</div>}
              {passwordMessage && <div className="text-green-500 text-sm p-2 bg-green-50 rounded">{passwordMessage}</div>}
              
              <div className="space-y-2">
                <Label htmlFor="current-password">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    <span>Current Password</span>
                  </div>
                </Label>
                <Input
                  id="current-password"
                  type="password"
                  placeholder="Enter your current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter new password (min. 6 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Change Password
              </Button>
              
              <div className="text-center mt-4">
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password? Reset via email
                </Link>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="activity" className="space-y-4 mt-4">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : courseEnrollments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p>You haven't enrolled in any courses yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">My Course Activity</h3>
                  {dashboardData?.stats && (
                    <div className="text-sm text-gray-500">
                      <span className="font-medium text-primary">{dashboardData.stats.coursesCompleted}</span> of {dashboardData.stats.totalCourses} courses completed
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  {courseEnrollments.map((course) => {
                    // Check if there's a certificate for this course
                    const hasCertificate = certificates.some(cert => 
                      cert.courseTitle === course.title
                    );
                    
                    // Determine status icon
                    let StatusIcon = Clock;
                    let statusColor = "text-yellow-500";
                    let statusBg = "bg-yellow-50";
                    
                    if (course.status === "Completed") {
                      StatusIcon = CheckCircle;
                      statusColor = "text-green-500";
                      statusBg = "bg-green-50";
                    } else if (course.status === "Not Started") {
                      StatusIcon = AlertCircle;
                      statusColor = "text-gray-400";
                      statusBg = "bg-gray-50";
                    }
                    
                    return (
                      <div key={course.id} className={`p-4 rounded-lg border ${course.status === "Completed" ? 'border-green-100' : 'border-gray-100'}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-full ${statusBg} ${statusColor} mt-1`}>
                              <StatusIcon className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-medium">{course.title}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`text-xs px-2 py-0.5 rounded-full ${statusBg} ${statusColor}`}>
                                  {course.status}
                                </span>
                                {hasCertificate && (
                                  <span className="text-xs bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <Award className="h-3 w-3" />
                                    Certificate Available
                                  </span>
                                )}
                                <span className="text-xs text-gray-500">
                                  Updated {new Date(course.updatedAt).toLocaleDateString()}
                                </span>
                              </div>
                              
                              {course.status === "In Progress" && (
                                <div className="mt-3 space-y-1">
                                  <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>Progress</span>
                                    <span>{course.progress}%</span>
                                  </div>
                                  <Progress value={course.progress} className="h-2" />
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-gray-400 hover:text-gray-600"
                            disabled={course.status === "Completed"}
                            title={course.status === "Completed" ? "Course already completed" : "Continue course"}
                          >
                            <ChevronRight className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {certificates.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">My Certificates</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {certificates.map((cert) => (
                        <div key={cert.id} className="p-4 rounded-lg border border-blue-100 bg-blue-50">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-blue-100 text-blue-500">
                              <Award className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-medium">{cert.courseTitle}</h4>
                              <p className="text-xs text-gray-500">
                                Issued on {new Date(cert.issuedAt).toLocaleDateString()}
                              </p>
                              <p className="text-xs text-blue-500 mt-1">
                                Certificate ID: {cert.certificateId}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}