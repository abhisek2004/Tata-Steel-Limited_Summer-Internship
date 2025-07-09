import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import nodemailer from '@/lib/mock-nodemailer'
import crypto from 'crypto'

// Schema for validation
const resetPasswordSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
})

// POST /api/user/reset-password - Request password reset
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const result = resetPasswordSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      )
    }
    
    const { email } = result.data

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      // Don't reveal that the user doesn't exist for security reasons
      return NextResponse.json(
        { message: 'If your email is registered, you will receive a password reset link' },
        { status: 200 }
      )
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Store token in database
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    })

    // Create reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'nicdelhi2024@gmail.com',
        pass: 'zuff vkvx pamt kdor',
      },
    })

    // Send email
    await transporter.sendMail({
      from: 'nicdelhi2024@gmail.com',
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Hello ${user.name},</p>
          <p>We received a request to reset your password. Click the button below to reset it:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Reset Password</a>
          </div>
          <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
          <p>This link will expire in 1 hour.</p>
          <p>Regards,<br>Tata Steel Learning Team</p>
        </div>
      `,
    })

    return NextResponse.json(
      { message: 'If your email is registered, you will receive a password reset link' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    )
  }
}