'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock, AlertCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTokenValid, setIsTokenValid] = useState(false)
  const [isTokenChecking, setIsTokenChecking] = useState(true)
  
  // Verify token on page load
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError('Missing reset token')
        setIsTokenChecking(false)
        return
      }
      
      try {
        const response = await fetch(`/api/user/reset-password/verify?token=${token}`)
        const data = await response.json()
        
        if (response.ok && data.valid) {
          setIsTokenValid(true)
        } else {
          setError(data.error || 'Invalid or expired reset token')
        }
      } catch (error) {
        setError('An error occurred while verifying the token')
      } finally {
        setIsTokenChecking(false)
      }
    }
    
    verifyToken()
  }, [token])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setError('')
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/user/reset-password/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password,
        }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setMessage('Password has been reset successfully')
        // Clear form
        setPassword('')
        setConfirmPassword('')
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      } else {
        setError(data.error || 'Failed to reset password')
      }
    } catch (error) {
      setError('An error occurred while resetting your password')
    } finally {
      setIsLoading(false)
    }
  }
  
  if (isTokenChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
          <p className="text-center text-gray-500">Verifying reset token...</p>
        </div>
      </div>
    )
  }
  
  if (!isTokenValid) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Password Reset</CardTitle>
            <CardDescription className="text-center">Invalid or expired token</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="p-3 rounded-full bg-red-100 text-red-500">
                <AlertCircle className="h-8 w-8" />
              </div>
              <p className="text-center text-red-500">{error}</p>
              <p className="text-center text-gray-500">
                The password reset link is invalid or has expired. Please request a new password reset link.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/forgot-password">Request New Reset Link</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Reset Your Password</CardTitle>
          <CardDescription className="text-center">
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          {message && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 text-green-600 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <p>{message}</p>
            </div>
          )}
          
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  <span>New Password</span>
                </div>
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter new password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  Resetting Password...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            Remember your password? <Link href="/login" className="text-primary hover:underline">Log in</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}