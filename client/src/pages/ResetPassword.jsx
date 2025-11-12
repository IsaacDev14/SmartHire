"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { Eye, EyeOff, CodeSquare, Lock } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { useToast } from "../components/ui/use-toast"

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    new_password: "",
    confirm_password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isValidToken, setIsValidToken] = useState(true)
  const [token, setToken] = useState("")
  
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    const tokenParam = searchParams.get('token')
    if (!tokenParam) {
      setIsValidToken(false)
      toast({ 
        title: "Error", 
        description: "Invalid reset link. Please request a new password reset.", 
        variant: "destructive" 
      })
    } else {
      setToken(tokenParam)
    }
  }, [searchParams, toast])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.new_password || !formData.confirm_password) {
      toast({ title: "Error", description: "All fields are required.", variant: "destructive" })
      return
    }
    
    if (formData.new_password.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters.", variant: "destructive" })
      return
    }
    
    if (formData.new_password !== formData.confirm_password) {
      toast({ title: "Error", description: "Passwords don't match!", variant: "destructive" })
      return
    }

    setIsLoading(true)
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token,
          new_password: formData.new_password,
        }),
      })
      
      const data = await res.json()
      
      if (res.ok) {
        toast({ 
          title: "Success", 
          description: data.message || "Password reset successfully!", 
          variant: "default" 
        })
        navigate("/login")
      } else {
        toast({ 
          title: "Error", 
          description: data.error || "Failed to reset password", 
          variant: "destructive" 
        })
      }
    } catch (err) {
      console.error("Reset password error:", err)
      toast({ 
        title: "Error", 
        description: "Failed to reset password: " + err.message, 
        variant: "destructive" 
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (!isValidToken) {
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
              <h1 className="text-3xl font-bold text-foreground mb-2">Invalid Reset Link</h1>
              <p className="text-muted-foreground">The password reset link is invalid or has expired</p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <Lock className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Link Expired
                  </h3>
                  <p className="text-muted-foreground">
                    This password reset link is no longer valid. Please request a new one.
                  </p>
                  <div className="space-y-3">
                    <Button asChild className="w-full">
                      <Link to="/forgot-password">
                        Request New Reset Link
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" className="w-full">
                      <Link to="/login">
                        Back to Sign In
                      </Link>
                    </Button>
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Reset Password</h1>
            <p className="text-muted-foreground">Enter your new password below</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Set New Password</CardTitle>
              <CardDescription>Create a new password for your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="new_password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new_password"
                      name="new_password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your new password"
                      value={formData.new_password}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm_password">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm_password"
                      name="confirm_password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your new password"
                      value={formData.confirm_password}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Resetting..." : "Reset Password"}
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
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
} 