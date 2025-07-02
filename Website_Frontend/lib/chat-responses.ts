export const chatResponses = {
  getResponse: (query: string) => {
    const lowerMessage = query.toLowerCase()

    // Import data from lib/data.ts (we'll assume these are available)
    const courses = [
      {
        title: "Microsoft Excel - Basic",
        desc: "Learn fundamental Excel skills for data management and analysis",
        level: "Beginner",
        duration: "2 weeks",
        modules: 8,
        certification: "Excel Basic Certificate",
        prerequisites: "Basic computer knowledge",
        category: "Technical",
      },
      {
        title: "React JS Development",
        desc: "Modern web development with React framework",
        level: "Intermediate",
        duration: "6 weeks",
        modules: 12,
        certification: "React Developer Certificate",
        prerequisites: "JavaScript knowledge",
        category: "Technical",
      },
      {
        title: "Leadership Excellence",
        desc: "Develop essential leadership and management skills",
        level: "Advanced",
        duration: "4 weeks",
        modules: 10,
        certification: "Leadership Certificate",
        prerequisites: "2+ years experience",
        category: "Soft Skills",
      },
      {
        title: "Safety Management",
        desc: "Comprehensive safety protocols and management",
        level: "Intermediate",
        duration: "3 weeks",
        modules: 6,
        certification: "Safety Management Certificate",
        prerequisites: "Basic safety training",
        category: "Safety",
      },
      {
        title: "Data Analytics",
        desc: "Advanced data analysis and visualization techniques",
        level: "Advanced",
        duration: "8 weeks",
        modules: 15,
        certification: "Data Analytics Certificate",
        prerequisites: "Statistics knowledge",
        category: "Technical",
      },
    ]

    const trainingModules = {
      Technical: [
        { name: "SAP Systems", modules: 12 },
        { name: "Plant Operations", modules: 8 },
        { name: "Quality Control", modules: 6 },
        { name: "Automation Systems", modules: 10 },
      ],
      Safety: [
        { name: "Industrial Safety", modules: 8 },
        { name: "Emergency Response", modules: 6 },
        { name: "Risk Assessment", modules: 4 },
      ],
      "Soft Skills": [
        { name: "Communication Skills", modules: 6 },
        { name: "Team Building", modules: 4 },
        { name: "Time Management", modules: 3 },
      ],
    }

    const initialUpcomingPrograms = [
      { title: "Advanced Data Analytics Workshop", date: "2024-07-15" },
      { title: "Leadership Development Summit", date: "2024-08-10" },
      { title: "Safety Excellence Training", date: "2024-07-25" },
      { title: "Digital Transformation Seminar", date: "2024-08-05" },
    ]

    const achievements = {
      yearsInOperation: 25,
      totalEmployeesTrained: 50000,
      yearlyTraining: 8500,
      partnerships: 15,
      recognitions: [
        "Best Learning Organization 2023",
        "Excellence in Employee Development",
        "Industry Innovation Award",
      ],
    }

    const facilities = [
      { name: "Power Plant", desc: "advanced power generation facility" },
      { name: "Steel Manufacturing Unit", desc: "state-of-the-art steel production facility" },
      { name: "Research & Development Center", desc: "cutting-edge innovation hub" },
      { name: "Training Center", desc: "comprehensive learning facility" },
    ]

    const testimonials = [
      {
        name: "Rajesh Kumar",
        role: "Senior Engineer",
        text: "The training programs have significantly enhanced my technical skills and career prospects.",
        rating: 5,
      },
      {
        name: "Priya Sharma",
        role: "Team Lead",
        text: "Excellent learning platform with practical, industry-relevant content.",
        rating: 5,
      },
      {
        name: "Amit Singh",
        role: "Safety Officer",
        text: "The safety training modules are comprehensive and very well structured.",
        rating: 4,
      },
    ]

    // General greetings and help
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
      return {
        text: "Hello! Welcome to Tata Steel L&D. I'm here to help with courses, training schedules, certifications, and career development. What would you like to know?",
        actions: [
          { label: "Browse Courses", type: "browse-courses" },
          { label: "View Calendar", type: "events" },
          { label: "Latest Tech News", type: "tech-news" },
        ],
      }
    }
    if (lowerMessage.includes("help") || lowerMessage.includes("what can you do") || lowerMessage.includes("assist")) {
      return {
        text: "I can assist with:\n• Course information & registration\n• Training schedules\n• Certifications\n• Career development\n• Learning portal help\n• Information about our facilities and achievements.\n\nWhat do you need help with?",
        actions: [
          { label: "View Courses", type: "browse-courses" },
          { label: "Upcoming Events", type: "events" },
          { label: "Get Certificate", type: "certificate" },
        ],
      }
    }
    if (
      lowerMessage.includes("about tata steel l&d") ||
      lowerMessage.includes("about the company") ||
      lowerMessage.includes("who are you")
    ) {
      return {
        text: "Tata Steel Learning & Development is dedicated to empowering employees through continuous learning. We offer a wide range of programs in technical skills, safety, soft skills, and leadership, leveraging our major facilities at Kalinganagar.",
        actions: [
          { label: "Our Achievements", type: "about-snti" },
          { label: "View Facilities", type: "browse-courses" },
        ],
      }
    }

    // Courses related queries
    if (
      lowerMessage.includes("list courses") ||
      lowerMessage.includes("all courses") ||
      lowerMessage.includes("what courses do you offer") ||
      lowerMessage.includes("show me available courses")
    ) {
      const courseTitles = courses.map((c) => c.title).join(", ")
      return {
        text: `We offer courses like: ${courseTitles}. You can explore them all on our 'Courses' page.`,
        actions: [
          { label: "Browse All Courses", type: "browse-courses" },
          { label: "Course Categories", type: "browse-courses" },
        ],
      }
    }
    if (
      lowerMessage.includes("course details") ||
      lowerMessage.includes("about course") ||
      (lowerMessage.includes("tell me about") && lowerMessage.includes("course"))
    ) {
      const courseNameMatch = courses.find((c) => lowerMessage.includes(c.title.toLowerCase()))
      if (courseNameMatch) {
        return {
          text: `The "${courseNameMatch.title}" course is about "${courseNameMatch.desc}". It's a ${courseNameMatch.level} level course, lasting ${courseNameMatch.duration} with ${courseNameMatch.modules} modules. It leads to a "${courseNameMatch.certification}" certification. Its prerequisites are: ${courseNameMatch.prerequisites}.`,
          actions: [
            { label: "Register for Course", type: "course-register", data: { title: courseNameMatch.title } },
            { label: "View All Courses", type: "browse-courses" },
          ],
        }
      }
      return {
        text: "Which specific course are you interested in? Please specify the course name, e.g., 'Tell me about Microsoft Excel - Basic' or 'What are the details for React JS?'",
        actions: [{ label: "Browse Courses", type: "browse-courses" }],
      }
    }

    // Training events
    if (
      lowerMessage.includes("training events") ||
      lowerMessage.includes("events") ||
      lowerMessage.includes("what training events are coming up")
    ) {
      return {
        text: "Upcoming training events include 'Advanced Data Analytics Workshop' on July 15th and 'Leadership Development Summit' on August 10th. Check our calendar for complete event details and registration!",
        actions: [
          { label: "View Full Calendar", type: "events" },
          { label: "Register for Event", type: "course-register" },
        ],
      }
    }

    // Certificate download queries
    if (
      lowerMessage.includes("download certificate") ||
      lowerMessage.includes("get certificate") ||
      lowerMessage.includes("how can i download my certificate")
    ) {
      return {
        text: "To download your certificate, log in to your dashboard and navigate to the 'My Certificates' section. Completed courses will have downloadable certificates available.",
        actions: [
          { label: "Go to Dashboard", type: "certificate" },
          { label: "View Courses", type: "browse-courses" },
        ],
      }
    }

    // Tech news queries
    if (
      lowerMessage.includes("tech news") ||
      lowerMessage.includes("latest tech news") ||
      lowerMessage.includes("latest technology") ||
      lowerMessage.includes("technology updates")
    ) {
      return {
        text: "Latest Tech News: 🚀 AI and Machine Learning continue to revolutionize manufacturing processes. 🔧 Industry 4.0 technologies are being integrated across steel production. 💡 IoT sensors are improving predictive maintenance. 📊 Big Data analytics is enhancing quality control. Stay updated with our tech newsletter!",
        actions: [
          { label: "More Tech News", type: "tech-news" },
          { label: "Tech Courses", type: "browse-courses" },
        ],
      }
    }

    // Course registration queries
    if (
      lowerMessage.includes("register for course") ||
      lowerMessage.includes("enroll in course") ||
      lowerMessage.includes("register")
    ) {
      return {
        text: "To register for a course, visit the 'Courses' page, select your desired course, and click 'Enroll Now'. You'll need to complete the registration form and meet any prerequisites.",
        actions: [
          { label: "Browse Courses", type: "browse-courses" },
          { label: "View Requirements", type: "browse-courses" },
        ],
      }
    }

    // Learning resources queries
    if (
      lowerMessage.includes("learning resources") ||
      lowerMessage.includes("study materials") ||
      lowerMessage.includes("resources")
    ) {
      return {
        text: "Our learning resources include: 📚 Digital libraries, 🎥 Video tutorials, 📋 Interactive assessments, 💻 Virtual labs, 📖 E-books and manuals. Access these through your dashboard after enrollment.",
        actions: [
          { label: "Browse Courses", type: "browse-courses" },
          { label: "Go to Dashboard", type: "certificate" },
        ],
      }
    }

    // Achievements queries
    if (
      lowerMessage.includes("achievements") ||
      lowerMessage.includes("what have you achieved") ||
      lowerMessage.includes("company milestones")
    ) {
      return {
        text: `We have ${achievements.yearsInOperation} years in operation, trained over ${achievements.totalEmployeesTrained.toLocaleString()} employees, and trained ${achievements.yearlyTraining.toLocaleString()} this year alone. We also have ${achievements.partnerships} industry partnerships and have received recognitions like "${achievements.recognitions.join(", ")}".`,
        actions: [
          { label: "About Us", type: "about-snti" },
          { label: "View Courses", type: "browse-courses" },
        ],
      }
    }

    // Contact information
    if (lowerMessage.includes("contact") || lowerMessage.includes("phone number") || lowerMessage.includes("email")) {
      return {
        text: "You can contact us at 📞 +91-6758-660000 or email us at ✉ learning@tatasteel.com. Our location is 📍 Kalinganagar, Jajpur, Odisha.",
      }
    }

    // Default fallback
    return {
      text: "Thanks for your question! I'm here to help with information about our courses, training modules, upcoming programs, facilities, achievements, course registrations, certificate downloads, training events, tech news, and accessing learning resources. Is there anything specific you'd like to know?",
      actions: [
        { label: "Browse Courses", type: "browse-courses" },
        { label: "Tech News", type: "tech-news" },
        { label: "Events", type: "events" },
        { label: "Certificates", type: "certificate" },
      ],
    }
  },
}
