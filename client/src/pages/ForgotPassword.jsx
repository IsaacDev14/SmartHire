"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Code2, Mail } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { useToast } from "../components/ui/use-toast"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email) {
      toast({ title: "Error", description: "Email is required.", variant: "destructive" })
      return
    }
    
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      toast({ title: "Error", description: "Please enter a valid email address.", variant: "destructive" })
      return
    }

    setIsLoading(true)
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setEmailSent(true)
        toast({ 
          title: "Success", 
          description: data.message || "Password reset email sent successfully!", 
          variant: "default" 
        })
      } else {
        toast({ 
          title: "Error", 
          description: data.error || "Failed to send password reset email", 
          variant: "destructive" 
        })
      }
    } catch (err) {
      console.error("Forgot password error:", err)
      toast({ 
        title: "Error", 
        description: "Failed to send password reset email: " + err.message, 
        variant: "destructive" 
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background-alt">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Code2 className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">SmartHire</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Forgot Password</h1>
            <p className="text-muted-foreground">Enter your email to receive a password reset link</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Reset Password</CardTitle>
              <CardDescription>
                {emailSent 
                  ? "Check your email for a password reset link" 
                  : "Enter your email address and we'll send you a link to reset your password"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!emailSent ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Remember your password?{" "}
                      <Link to="/login" className="text-primary hover:underline">
                        Sign in here
                      </Link>
                    </p>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <Mail className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Check Your Email
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      We've sent a password reset link to <strong>{email}</strong>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Didn't receive the email? Check your spam folder or try again.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Button 
                      onClick={() => setEmailSent(false)} 
                      variant="outline" 
                      className="w-full"
                    >
                      Try Again
                    </Button>
                    <Button asChild variant="ghost" className="w-full">
                      <Link to="/login">
                        Back to Sign In
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
} 