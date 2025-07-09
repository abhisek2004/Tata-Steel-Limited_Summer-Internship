"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Eye, EyeOff, Award, CheckCircle } from "lucide-react"
import { format } from "date-fns"

interface CourseCertificateProps {
  course: {
    id: string
    title: string
    level: string
    category: string
    duration: string
    modules: number
  }
  userName: string
  previewMode?: boolean
  completionDate?: Date
  averageScore?: number
}

export default function CourseCertificate({
  course,
  userName,
  previewMode = false,
  completionDate = new Date(),
  averageScore = 85
}: CourseCertificateProps) {
  const [isPreview, setIsPreview] = useState(previewMode)
  
  // Generate a unique certificate ID
  const generateCertificateId = () => {
    const prefix = "TATA"
    const courseId = course.id
    const timestamp = Date.now().toString().slice(-6)
    const userCode = userName.slice(0, 2).toUpperCase()
    
    return `${prefix}-${courseId}-${userCode}${timestamp}`
  }
  
  const certificateId = generateCertificateId()
  
  // Format date
  const formattedDate = format(completionDate, "MMMM dd, yyyy")
  
  // Handle certificate download
  const handleDownload = async () => {
    try {
      // Create a canvas element to render the certificate
      const certificateElement = document.querySelector('.border-2.border-primary\\/20');
      if (!certificateElement) return;

      // Use html2canvas to convert the certificate to an image
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(certificateElement);

      // Use jsPDF to create a PDF
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      
      // Add the image to the PDF
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      // Download the PDF with certificate details
      const fileName = `${course.title}-Certificate-${certificateId}.pdf`;
      pdf.save(fileName);
      
      // Show success message
      alert('Certificate downloaded successfully!');
      pdf.save(`${course.title}-Certificate-${certificateId}.pdf`);
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('Failed to generate certificate. Please try again.');
    }
  }
    alert("Certificate download functionality would be implemented here")
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Course Certificate</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsPreview(!isPreview)}>
            {isPreview ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                Hide Preview
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Show Preview
              </>
            )}
          </Button>
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>
      
      {isPreview && (
        <Card className="border-2 border-primary/20">
          <CardContent className="p-8">
            <div className="relative">
              {/* Watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                <Image 
                  src="/images/tata-steel-logo.png" 
                  alt="Tata Steel Watermark" 
                  width={400} 
                  height={400}
                  className="object-contain"
                />
              </div>
              
              <div className="text-center space-y-6 relative z-10">
                <div className="flex justify-center">
                  <Image 
                    src="/images/tata-steel-logo.png" 
                    alt="Tata Steel Logo" 
                    width={120} 
                    height={60}
                    className="object-contain"
                  />
                </div>
                
                <div>
                  <h3 className="text-xl text-muted-foreground font-medium">Tata Steel Learning Academy</h3>
                  <h1 className="text-3xl font-bold mt-2 text-primary">Certificate of Completion</h1>
                </div>
                
                <div className="my-8 space-y-2">
                  <p className="text-muted-foreground">This is to certify that</p>
                  <p className="text-3xl font-bold text-primary">{userName}</p>
                  <p className="text-muted-foreground">has successfully completed the course</p>
                  <p className="text-2xl font-semibold">{course.title}</p>
                  <p className="text-muted-foreground">with an average score of {averageScore}%</p>
                </div>
                
                <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
                  <div className="text-center">
                    <p className="text-muted-foreground text-sm">Date Issued</p>
                    <p className="font-medium">{formattedDate}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground text-sm">Certificate ID</p>
                    <p className="font-medium">{certificateId}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto mt-8">
                  <div className="text-center">
                    <div className="border-b-2 border-gray-300 pb-2 mb-2 w-40 mx-auto"></div>
                    <p className="text-muted-foreground text-sm">Course Director</p>
                  </div>
                  <div className="text-center">
                    <div className="border-b-2 border-gray-300 pb-2 mb-2 w-40 mx-auto"></div>
                    <p className="text-muted-foreground text-sm">Academy Director</p>
                  </div>
                </div>
                
                <div className="mt-8">
                  <Image 
                    src="/images/certificate-seal.png" 
                    alt="Certificate Seal" 
                    width={100} 
                    height={100}
                    className="mx-auto"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Course Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Completion Criteria
              </h3>
              <p className="text-sm text-muted-foreground pl-6">
                To earn this certificate, participants must complete all {course.modules} modules 
                and achieve a minimum average score of 70% across all assessments.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Prerequisites
              </h3>
              <p className="text-sm text-muted-foreground pl-6">
                This {course.level} level course requires basic understanding of industrial processes 
                and safety protocols. No specific prior certifications are required.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Certification Process</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Certificate Validity
              </h3>
              <p className="text-sm text-muted-foreground pl-6">
                This certificate is valid for 3 years from the date of issuance. 
                Recertification may be required to maintain active status.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Career Advancement
              </h3>
              <p className="text-sm text-muted-foreground pl-6">
                This certification contributes to professional development within Tata Steel 
                and may qualify you for advanced courses in {course.category}.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}