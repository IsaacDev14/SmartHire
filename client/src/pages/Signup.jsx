"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, Code2, User, Building } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"
import Navbar from "../components/Navbar"
import Footer from "./Footer";
import { useToast } from "../components/ui/use-toast"

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "interviewee",
    bio: "",
    companyName: "",
  })
  // const { login } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      toast({ title: "Error", description: "All fields are required.", variant: "destructive" })
      return
    }
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(formData.email)) {
      toast({ title: "Error", description: "Please enter a valid email address.", variant: "destructive" })
      return
    }
    if (formData.password.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters.", variant: "destructive" })
      return
    }
    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Error", description: "Passwords don't match!", variant: "destructive" })
      return
    }
    if (formData.role === "recruiter" && !formData.companyName) {
      toast({ title: "Error", description: "Company name is required for recruiters.", variant: "destructive" })
      return
    }
    // if (formData.bio.length < 20) {
    //   toast({ title: "Error", description: "Bio must be at least 20 characters.", variant: "destructive" })
    //   return
    // }
    const payload = {
      role: formData.role,
      email: formData.email,
      password: formData.password,
      first_name: formData.firstName,
      last_name: formData.lastName,
      bio: formData.bio,
    }
    if (formData.role === "recruiter") {
      payload.company_name = formData.companyName
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      let err = null
      let data = null
      if (!res.ok) {
        try {
          err = await res.json()
        } catch (e) {
          err = { error: "Signup failed. Please try again later." }
        }
        toast({ title: "Error", description: err.error || "Signup failed", variant: "destructive" })
        return
      } else {
        try {
          data = await res.json()
        } catch (e) {
          data = { message: "Account created successfully!" }
        }
      }
      toast({ title: "Success", description: data.message || "Account created successfully!", variant: "default" })

      
      navigate("/login")
    } catch (err) {
      toast({ title: "Error", description: "Signup failed: " + err.message, variant: "destructive" })
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleRoleChange = (value) => {
    setFormData({
      ...formData,
      role: value,
    })
  }

  return (
    <div className="min-h-screen bg-background-alt">
      {" "}
      
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Code2 className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">SmartHire</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Create Your Account</h1>
            <p className="text-muted-foreground">Join thousands of professionals using SmartHire</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>Create your account to get started with SmartHire</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label>I am a...</Label>
                  <RadioGroup value={formData.role} onValueChange={handleRoleChange} className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-muted/50 cursor-pointer">
                      <RadioGroupItem value="recruiter" id="recruiter" />
                      <Label htmlFor="recruiter" className="flex items-center space-x-2 cursor-pointer">
                        <Building className="h-4 w-4" />
                        <span>Recruiter</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-muted/50 cursor-pointer">
                      <RadioGroupItem value="interviewee" id="interviewee" />
                      <Label htmlFor="interviewee" className="flex items-center space-x-2 cursor-pointer">
                        <User className="h-4 w-4" />
                        <span>Interviewee</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                </div>
                {formData.role === "recruiter" && (
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      placeholder="Enter your company name"
                      value={formData.companyName}
                      onChange={handleChange}
                      required={formData.role === "recruiter"}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
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
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>


                <div className="space-y-2">
                  <Label htmlFor="bio">
                    Bio {formData.role === "recruiter" ? "(Company Description)" : "(Professional Summary)"}
                  </Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    placeholder={
                      formData.role === "recruiter"
                        ? "Tell us about your company and hiring needs..."
                        : "Tell us about your skills and experience..."
                    }
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>

                <Button type="submit" className="w-full">
                  Create Account
                </Button>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
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


