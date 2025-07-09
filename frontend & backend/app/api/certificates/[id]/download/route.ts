import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateCertificatePDF } from '@/lib/pdf-generator'

// GET /api/certificates/[id]/download - Download a certificate by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const certificateId = params.id

    if (!certificateId) {
      return NextResponse.json(
        { error: 'Certificate ID is required' },
        { status: 400 }
      )
    }

    // Find the certificate
    const certificate = await prisma.certificate.findFirst({
      where: {
        certificateId,
      },
      include: {
        course: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    })

    if (!certificate) {
      return NextResponse.json(
        { error: 'Certificate not found' },
        { status: 404 }
      )
    }

    // Generate the certificate PDF
    const result = await generateCertificatePDF(
      certificate.course.title,
      certificate.user.name
    )

    if (!result.success || !result.dataUri) {
      return NextResponse.json(
        { error: 'Failed to generate certificate' },
        { status: 500 }
      )
    }

    // Extract the base64 data from the data URI
    const base64Data = result.dataUri.split(',')[1]
    const binaryData = Buffer.from(base64Data, 'base64')

    // Return the PDF as a downloadable file
    return new NextResponse(binaryData, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="certificate-${certificateId}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error downloading certificate:', error)
    return NextResponse.json(
      { error: 'Failed to download certificate' },
      { status: 500 }
    )
  }
}