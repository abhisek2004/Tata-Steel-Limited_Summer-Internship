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
  const resourceType = searchParams.get("type") // e.g., "pdf", "excel"
  const courseTitle = searchParams.get("course") // e.g., "Maintenance Systems" or "Leadership Development"
  const resourceName = searchParams.get("resource") // e.g., "Course Handbook", "SAP Systems Guide"

  if (!resourceType || !courseTitle || !resourceName) {
    return NextResponse.json({ success: false, message: "Missing required parameters." }, { status: 400 })
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

    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json({ success: false, message: result.message }, { status: 500 })
    }
  } catch (error: any) {
    console.error(`Error generating ${resourceName}:`, error)
    return NextResponse.json({ success: false, message: `Server error: ${error.message}` }, { status: 500 })
  }
}
