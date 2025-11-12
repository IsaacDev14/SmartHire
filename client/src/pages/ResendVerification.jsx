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

export default function ResendVerification() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive"
      })
      return
    }

    if (!/^[^@]+@[^@]+\.[^@]+$/.test(email.trim())) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      })
      
      const data = await res.json()
      
      if (res.ok) {
        toast({
          title: "Success",
          description: data.message || "Verification email sent successfully! Please check your inbox.",
          variant: "default"
        })
        setEmail("")
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Resend Verification Email</h1>
            <p className="text-muted-foreground">Enter your email address to receive a new verification link</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>Email Verification</span>
              </CardTitle>
              <CardDescription>
                We'll send you a new verification email to confirm your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Verification Email"}
                </Button>

                <div className="text-center space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Remember your password?{" "}
                    <Link to="/login" className="text-primary hover:underline">
                      Sign in here
                    </Link>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-primary hover:underline">
                      Sign up here
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
} 