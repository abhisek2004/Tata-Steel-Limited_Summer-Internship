import { NextResponse } from "next/server"
import {
  generateCourseHandbookPDF,
  generatePracticeExercisesPDF,
  generateReferenceGuidePDF,
  generateCaseStudiesPDF,
  generateIndustryStandardsPDF,
  generateQuickStartGuidePDF,
  // Module-specific resources
  generateCommunicationGuidePDF,
  generateCommunicationExercisesPDF,
  generateTeamBuildingGuidePDF,
  generateTeamBuildingExercisesPDF,
  generateProblemSolvingGuidePDF,
  generateProblemSolvingExercisesPDF,
  generateTimeManagementGuidePDF,
  generateTimeManagementExercisesPDF,
  generateStrategicThinkingGuidePDF,
  generateStrategicThinkingExercisesPDF,
  generateChangeManagementGuidePDF,
  generateChangeManagementExercisesPDF,
  generatePerformanceManagementGuidePDF,
  generatePerformanceManagementExercisesPDF,
  generateDecisionMakingGuidePDF,
  generateDecisionMakingExercisesPDF,
  generateSAPSystemsGuidePDF,
  generateSAPExercisesPDF,
  generatePlantOperationsGuidePDF,
  generatePlantOperationsExercisesPDF,
  generateQualityControlGuidePDF,
  generateQualityControlExercisesPDF,
  generateMaintenanceSystemsGuidePDF,
  generateMaintenanceSystemsExercisesPDF,
  generateWorkplaceSafetyGuidePDF,
  generateWorkplaceSafetyExercisesPDF,
  generateEmergencyProceduresGuidePDF,
  generateEmergencyProceduresExercisesPDF,
  generateEquipmentSafetyGuidePDF,
  generateEquipmentSafetyExercisesPDF,
  generateEnvironmentalSafetyGuidePDF,
  generateEnvironmentalSafetyExercisesPDF,
  generateRoboticsProgrammingGuidePDF,
  generateRobotSafetyChecklistPDF,
  // Path-specific resources
  generateLeadershipHandbookPDF,
  generateLeadershipCaseStudiesPDF,
  generateTechnicalExcellenceGuidePDF,
  generateTechnicalExcellenceCaseStudiesPDF,
  generateDigitalTransformationGuidePDF,
  generateDigitalTransformationCaseStudiesPDF,
  generateAutomationHandbookPDF,
  generateRoboticsCaseStudiesPDF,
  generateDigitalMarketingPlaybookPDF,
  generateWorkshopGuidePDF,
  generateDatasetFilesPDF,
  generateCommunicationWorkbookPDF,
  generatePresentationTipsPDF,
  generateEventMaterialPDF, // NEWLY ADDED: Generic fallback for event materials
} from "@/lib/pdf-generator"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const resourceId = searchParams.get("resourceId") // e.g., "1-handbook"
  const courseId = searchParams.get("courseId") // e.g., "1"
  
  // Extract resource type and name from resourceId
  let resourceType, resourceName, courseTitle
  
  if (!resourceId || !courseId) {
    // Fallback to old method for backward compatibility
    resourceType = searchParams.get("type") // e.g., "pdf", "excel"
    courseTitle = searchParams.get("course") // e.g., "Maintenance Systems" or "Leadership Development"
    resourceName = searchParams.get("resource") // e.g., "Course Handbook", "SAP Systems Guide"
    
    if (!resourceType || !courseTitle || !resourceName) {
      return NextResponse.json({ success: false, message: "Missing required parameters." }, { status: 400 })
    }
  } else {
    // Parse resourceId to get resource type and name
    const resourceIdParts = resourceId.split('-')
    const courseIdFromResource = resourceIdParts[0]
    const resourceType = resourceIdParts[1]
    
    // Ensure the courseId matches the one in resourceId
    if (courseId !== courseIdFromResource) {
      return NextResponse.json({ success: false, message: "Course ID mismatch." }, { status: 400 })
    }
    
    // Get course title from courseId
    // This is a simplified approach - in a real app, you'd fetch this from a database
    const courses = require('@/lib/data').courses
    const course = courses.find(c => String(c.id) === courseId)
    if (!course) {
      return NextResponse.json({ success: false, message: "Course not found." }, { status: 404 })
    }
    courseTitle = course.title
    
    // Map resourceType to resourceName
    switch (resourceType) {
      case "handbook":
        resourceName = "Course Handbook"
        break
      case "exercises":
        resourceName = "Practice Exercises"
        break
      case "guide":
        resourceName = "Reference Guide"
        break
      case "cases":
        resourceName = "Case Studies"
        break
      case "assessment":
        resourceName = "Leadership Assessment Tools"
        break
      case "templates":
        resourceName = "Team Management Templates"
        break
      case "specs":
        resourceName = "Technical Specifications"
        break
      case "troubleshooting":
        resourceName = "Troubleshooting Guide"
        break
      case "code":
        resourceName = "Code Samples"
        break
      case "installation":
        resourceName = "Software Installation Guide"
        break
      case "shortcuts":
        resourceName = "Keyboard Shortcuts Cheat Sheet"
        break
      case "data":
        resourceName = "Sample Data Files"
        break
      default:
        resourceName = `${course.title} ${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}`
        break
    }
  }

  let result: { success: boolean; message: string; filename: string; dataUri: string }

  try {
    // Use the exact resourceName to dispatch to the correct generator
    switch (resourceName) {
      case "Course Handbook":
        result = await generateCourseHandbookPDF(courseTitle)
        break
      case "Practice Exercises":
        result = await generatePracticeExercisesPDF(courseTitle)
        break
      case "Reference Guide":
        result = await generateReferenceGuidePDF(courseTitle)
        break
      case "Case Studies":
        result = await generateCaseStudiesPDF(courseTitle)
        break
      case "Industry Standards":
        result = await generateIndustryStandardsPDF(courseTitle)
        break
      case "Quick Start Guide":
        result = await generateQuickStartGuidePDF(courseTitle)
        break
      // New cases for module-specific resources
      case "Communication Guide":
        result = await generateCommunicationGuidePDF(courseTitle)
        break
      case "Communication Exercises":
        result = await generateCommunicationExercisesPDF(courseTitle)
        break
      case "Team Building Guide":
        result = await generateTeamBuildingGuidePDF(courseTitle)
        break
      case "Team Building Exercises":
        result = await generateTeamBuildingExercisesPDF(courseTitle)
        break
      case "Problem Solving Guide":
        result = await generateProblemSolvingGuidePDF(courseTitle)
        break
      case "Problem Solving Exercises":
        result = await generateProblemSolvingExercisesPDF(courseTitle)
        break
      case "Time Management Guide":
        result = await generateTimeManagementGuidePDF(courseTitle)
        break
      case "Time Management Exercises":
        result = await generateTimeManagementExercisesPDF(courseTitle)
        break
      case "Strategic Thinking Guide":
        result = await generateStrategicThinkingGuidePDF(courseTitle)
        break
      case "Strategic Thinking Exercises":
        result = await generateStrategicThinkingExercisesPDF(courseTitle)
        break
      case "Change Management Guide":
        result = await generateChangeManagementGuidePDF(courseTitle)
        break
      case "Change Management Exercises":
        result = await generateChangeManagementExercisesPDF(courseTitle)
        break
      case "Performance Management Guide":
        result = await generatePerformanceManagementGuidePDF(courseTitle)
        break
      case "Performance Management Exercises":
        result = await generatePerformanceManagementExercisesPDF(courseTitle)
        break
      case "Decision Making Guide":
        result = await generateDecisionMakingGuidePDF(courseTitle)
        break
      case "Decision Making Exercises":
        result = await generateDecisionMakingExercisesPDF(courseTitle)
        break
      case "SAP Systems Guide":
        result = await generateSAPSystemsGuidePDF(courseTitle)
        break
      case "SAP Exercises":
        result = await generateSAPExercisesPDF(courseTitle)
        break
      case "Plant Operations Guide":
        result = await generatePlantOperationsGuidePDF(courseTitle)
        break
      case "Plant Operations Exercises":
        result = await generatePlantOperationsExercisesPDF(courseTitle)
        break
      case "Quality Control Guide":
        result = await generateQualityControlGuidePDF(courseTitle)
        break
      case "Quality Control Exercises":
        result = await generateQualityControlExercisesPDF(courseTitle)
        break
      case "Maintenance Systems Guide":
        result = await generateMaintenanceSystemsGuidePDF(courseTitle)
        break
      case "Maintenance Systems Exercises":
        result = await generateMaintenanceSystemsExercisesPDF(courseTitle)
        break
      case "Workplace Safety Guide":
        result = await generateWorkplaceSafetyGuidePDF(courseTitle)
        break
      case "Workplace Safety Exercises":
        result = await generateWorkplaceSafetyExercisesPDF(courseTitle)
        break
      case "Emergency Procedures Guide":
        result = await generateEmergencyProceduresGuidePDF(courseTitle)
        break
      case "Emergency Procedures Exercises":
        result = await generateEmergencyProceduresExercisesPDF(courseTitle)
        break
      case "Equipment Safety Guide":
        result = await generateEquipmentSafetyGuidePDF(courseTitle)
        break
      case "Equipment Safety Exercises":
        result = await generateEquipmentSafetyExercisesPDF(courseTitle)
        break
      case "Environmental Safety Guide":
        result = await generateEnvironmentalSafetyGuidePDF(courseTitle)
        break
      case "Environmental Safety Exercises":
        result = await generateEnvironmentalSafetyExercisesPDF(courseTitle)
        break
      case "Robotics Programming Guide":
        result = await generateRoboticsProgrammingGuidePDF(courseTitle)
        break
      case "Robot Safety Checklist":
        result = await generateRobotSafetyChecklistPDF(courseTitle)
        break
      // New cases for path-specific resources
      case "Leadership Handbook":
        result = await generateLeadershipHandbookPDF(courseTitle)
        break
      case "Leadership Case Studies":
        result = await generateLeadershipCaseStudiesPDF(courseTitle)
        break
      case "Technical Excellence Guide":
        result = await generateTechnicalExcellenceGuidePDF(courseTitle)
        break
      case "Technical Excellence Case Studies":
        result = await generateTechnicalExcellenceCaseStudiesPDF(courseTitle)
        break
      case "Digital Transformation Guide":
        result = await generateDigitalTransformationGuidePDF(courseTitle)
        break
      case "Digital Transformation Case Studies":
        result = await generateDigitalTransformationCaseStudiesPDF(courseTitle)
        break
      case "Automation Handbook":
        result = await generateAutomationHandbookPDF(courseTitle)
        break
      case "Robotics Case Studies":
        result = await generateRoboticsCaseStudiesPDF(courseTitle)
        break
      case "Digital Marketing Playbook":
        result = await generateDigitalMarketingPlaybookPDF(courseTitle)
        break
      case "Workshop Guide":
        result = await generateWorkshopGuidePDF(courseTitle)
        break
      case "Dataset Files":
        result = await generateDatasetFilesPDF(courseTitle)
        break
      case "Communication Workbook":
        result = await generateCommunicationWorkbookPDF(courseTitle)
        break
      case "Presentation Tips":
        result = await generatePresentationTipsPDF(courseTitle)
        break
      default: // Fallback for any other event material
        result = await generateEventMaterialPDF(courseTitle, resourceName)
        break
    }

    // Check if we have a static file available in the public directory
    const staticFilePath = `/resources/${courseId}-${resourceType}.pdf`
    const staticExcelPath = `/resources/${courseId}-${resourceType}.xlsx`
    const staticZipPath = `/resources/${courseId}-${resourceType}.zip`
    
    // For demo purposes, use sample files
    const samplePdfPath = '/resources/sample-handbook.pdf'
    const sampleExcelPath = '/resources/sample-exercises.xlsx'
    const sampleGuidePath = '/resources/sample-guide.pdf'
    const sampleCodePath = '/resources/sample-code.zip'
    
    // Return file path for client-side download if static file exists
    if (resourceType === 'handbook' || resourceType === 'guide' || resourceType === 'specs' || 
        resourceType === 'troubleshooting' || resourceType === 'cases' || resourceType === 'assessment' || 
        resourceType === 'installation' || resourceType === 'shortcuts') {
      // For PDF files
      return NextResponse.json({
        success: true,
        message: "Resource found",
        filename: `${courseTitle}-${resourceName}.pdf`,
        filePath: samplePdfPath, // Use sample PDF for demo
        fileType: "application/pdf"
      })
    } else if (resourceType === 'exercises' || resourceType === 'templates') {
      // For Excel files
      return NextResponse.json({
        success: true,
        message: "Resource found",
        filename: `${courseTitle}-${resourceName}.xlsx`,
        filePath: sampleExcelPath, // Use sample Excel for demo
        fileType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      })
    } else if (resourceType === 'data' || resourceType === 'code') {
      // For ZIP files
      return NextResponse.json({
        success: true,
        message: "Resource found",
        filename: `${courseTitle}-${resourceName}.zip`,
        filePath: sampleCodePath, // Use sample ZIP for demo
        fileType: "application/zip"
      })
    } else if (result.success) {
      // Fallback to dynamically generated content
      return NextResponse.json(result)
    } else {
      return NextResponse.json({ success: false, message: result.message }, { status: 500 })
    }
  } catch (error: any) {
    console.error(`Error generating ${resourceName}:`, error)
    return NextResponse.json({ success: false, message: `Server error: ${error.message}` }, { status: 500 })
  }
}
