import { type NextRequest, NextResponse } from "next/server"
import { generateCertificatePDF } from "@/lib/pdf-generator"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const course = searchParams.get("course")
  const name = searchParams.get("name")

  if (!course || !name) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
  }

  try {
    const result = await generateCertificatePDF(course, name)

    // Return the PDF data URI for client-side download
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error generating certificate:", error)
    return NextResponse.json({ error: "Failed to generate certificate" }, { status: 500 })
  }
}
