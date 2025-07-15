export type Course = {
  id: string | number
  title: string
  desc: string
  category: string
  level: string
  duration: string
  modules: number
  objectives: string[]
  curriculum: string[]
  prerequisites: string
  certification: string
  progress?: number // Optional, for user tracking
  status?: "Not Started" | "In Progress" | "Completed" // Optional, for user tracking
  resources?: { name: string; type: string }[] // Optional, for detailed course content
  keyTopics?: string[] // Optional, for detailed course content
  analytics?: {
    completionRate: number
    quizScores: number[]
    skillCoverage: string[]
  } // Optional, for detailed course content
}

export type Facility = {
  name: string
  desc: string
  icon: string // Emoji or LucideReact icon name
}

// Renamed to avoid conflict with the summary object
export type UserAchievement = {
  id: string
  title: string
  date: string // ISO date string
  type: "course" | "event" | "path"
  details: string
}

// This is the summary object type for HomePage
export type Achievement = {
  yearsInOperation: number
  totalEmployeesTrained: number
  yearlyTraining: number
  partnerships: number
  recognitions: {
    title: string
    subtitle: string
    icon: keyof typeof import("lucide-react") // Use keyof typeof for LucideReact icon names
  }[]
}

export type TrainingModule = {
  name: string
  slug: string
  modules: number
  icon: string // Emoji or LucideReact icon name
}

export type DetailedModuleSection = {
  title: string
  content: string
  duration: string
}

export type DetailedTrainingModuleContent = {
  description: string
  objectives: string[]
  topics: string[]
  charts: ChartDataEntry[]
  caseStudy: {
    title: string
    description: string
  }
  resources: { name: string; type: string }[]
  detailedContent: DetailedModuleSection[]
}

export type TrainingPath = {
  name: string
  slug: string
  modules: number
  duration: string
  courses?: { name: string; icon: string; courseId?: string | number }[] // Added courses for paths
}

export type DetailedTrainingPathContent = {
  description: string
  objectives: string[]
  topics: string[]
  charts: ChartDataEntry[]
  caseStudy: {
    title: string
    description: string
  }
  resources: { name: string; type: string }[]
  modules: { name: string; icon: string; courseId?: string | number }[] // Modules within a path
}

export type UpcomingProgram = {
  id: string
  title: string
  date: string // Changed to string for consistency with data source
  time: string
  location: string
  description: string
  category: string
  capacity: number
  registered: number
  speakers: { name: string; role: string; bio: string }[]
  materials: string[]
  prerequisites: string
  agenda: string[]
  meetingDetails?: {
    link: string
    id: string
    password: string
  }
}

export type Testimonial = {
  name: string
  role: string
  text: string
  rating: number
}

export type TechNews = {
  id: string
  title: string
  source: string
  url: string
  content: string
  category: string
  date: Date
}

export type DiscussionPost = {
  id: string
  author: string
  timestamp: string // ISO date string
  content: string
  module?: string // Optional, for linking to specific modules
  replies: number | DiscussionReply[] // Can be a count or an array of replies
}

export type DiscussionReply = {
  id: string
  author: string
  timestamp: string // ISO date string
  content: string
  replies: DiscussionReply[] // Nested replies
}

export type ChartDataEntry = {
  title: string
  type: "bar" | "line" | "pie"
  data: { label: string; value: number; comparison?: number; fill?: string }[]
}

export type ChartData = {
  barChartData: { name: string; value: number }[]
  lineChartData: { name: string; progress: number }[]
  pieChartData: { name: string; value: number }[]
}

// New types for Training Reports Dashboard
export type LearnerProgress = {
  name: string
  course: string
  progress: number
  timeSpent: number
  quizScore: number
  completed: boolean
  department: string // Added department for filtering
}

export type TeamReport = {
  department: string
  avgCompletionRate: number
  mostCompletedPath: string
  members: number
}

export type ModuleEngagement = {
  module: string
  enrollments: number
  dropOffRate: number
  feedbackScore: number
}

export type CertificateTracking = {
  learner: string
  path: string
  dateIssued: string // ISO date string
  validity: string
}
