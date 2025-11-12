"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { CodeSquare, CheckCircle, XCircle } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { useToast } from "../components/ui/use-toast"

export default function VerifyEmail() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [hasAttempted, setHasAttempted] = useState(false)
  const [showResendForm, setShowResendForm] = useState(false)
  const [resendEmail, setResendEmail] = useState('')
  const [isResending, setIsResending] = useState(false)
  
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    const token = searchParams.get('token')
    
    if (!token) {
      setError('Invalid verification link. Please check your email for the correct link.')
      setIsLoading(false)
      return
    }

    if (!hasAttempted) {
      setHasAttempted(true)
      verifyEmail(token)
    }
  }, [searchParams, hasAttempted])

  const verifyEmail = async (token) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setIsSuccess(true)
        toast({ 
          title: "Success", 
          description: "Email verified successfully! You can now log in.", 
          variant: "default" 
        })
      } else {
        // Check if it's already verified (token already used)
        if (data.error && data.error.includes('Invalid or expired')) {
          setError('This verification link has already been used or has expired.')
        } else {
          setError(data.error || 'Verification failed. Please try again.')
        }
        toast({ 
          title: "Error", 
          description: data.error || "Verification failed", 
          variant: "destructive" 
        })
      }
    } catch (err) {
      console.error("Verification error:", err)
      setError('Failed to verify email. Please try again.')
      toast({ 
        title: "Error", 
        description: "Failed to verify email: " + err.message, 
        variant: "destructive" 
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendVerification = async (e) => {
    e.preventDefault()
    if (!resendEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive"
      })
      return
    }

    setIsResending(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resendEmail.trim() }),
      })
      
      const data = await res.json()
      
      if (res.ok) {
        toast({
          title: "Success",
          description: data.message || "Verification email sent successfully!",
          variant: "default"
        })
        setShowResendForm(false)
        setResendEmail('')
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to send verification email",
          variant: "destructive"
        })
      }
    } catch (err) {
      console.error("Resend verification error:", err)
      toast({
        title: "Error",
        description: "Failed to send verification email. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsResending(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-alt">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <CodeSquare className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold text-foreground">SmartHire</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Verifying Email</h1>
              <p className="text-muted-foreground">Please wait while we verify your email address...</p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Verifying your email address...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-alt">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <CodeSquare className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">SmartHire</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {isSuccess ? "Email Verified!" : "Verification Failed"}
            </h1>
            <p className="text-muted-foreground">
              {isSuccess 
                ? "Your email has been successfully verified" 
                : "We couldn't verify your email address"
              }
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                  isSuccess ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {isSuccess ? (
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  ) : (
                    <XCircle className="h-8 w-8 text-red-600" />
                  )}
                </div>
                
                <h3 className="text-lg font-semibold text-foreground">
                  {isSuccess ? "Verification Successful" : "Verification Failed"}
                </h3>
                
                <p className="text-muted-foreground">
                  {isSuccess 
                    ? "Your email address has been verified. You can now log in to your account."
                    : error || "The verification link is invalid or has expired. Please request a new verification email."
                  }
                </p>

                <div className="space-y-3 pt-4">
                  {isSuccess ? (
                    <Button asChild className="w-full">
                      <Link to="/login">
                        Continue to Login
                      </Link>
                    </Button>
                  ) : (
                    <>
                      <Button asChild variant="outline" className="w-full">
                        <Link to="/login">
                          Back to Login
                        </Link>
                      </Button>
                      
                      {!showResendForm ? (
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-3">
                            Need a new verification email?
                          </p>
                          <div className="space-y-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setShowResendForm(true)}
                              className="w-full"
                            >
                              Resend Verification Email
                            </Button>
                            <p className="text-xs text-muted-foreground">
                              Or{" "}
                              <Link to="/resend-verification" className="text-primary hover:underline">
                                visit our dedicated page
                              </Link>
                            </p>
                          </div>
                        </div>
                      ) : (
                        <form onSubmit={handleResendVerification} className="space-y-3">
                          <div>
                            <label htmlFor="resend-email" className="block text-sm font-medium text-foreground mb-1">
                              Email Address
                            </label>
                            <input
                              id="resend-email"
                              type="email"
                              value={resendEmail}
                              onChange={(e) => setResendEmail(e.target.value)}
                              placeholder="Enter your email address"
                              className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                              required
                            />
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              type="submit" 
                              disabled={isResending}
                              className="flex-1"
                            >
                              {isResending ? "Sending..." : "Send Verification Email"}
                            </Button>
                            <Button 
                              type="button" 
                              variant="outline"
                              onClick={() => {
                                setShowResendForm(false)
                                setResendEmail('')
                              }}
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      )}
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
} 