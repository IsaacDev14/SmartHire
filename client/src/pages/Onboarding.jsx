"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Label } from "../components/ui/label"
import Navbar from "../components/Navbar"
// import Footer from "../components/Footer"
import Footer from "./Footer"
import { Code2 } from "lucide-react"
import { useToast } from "../components/ui/use-toast"

// Dummy
const interests = [
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "Go",
  "Rust",
  "React",
  "Angular",
  "Vue.js",
  "Node.js",
  "Django",
  "Spring Boot",
  "Machine Learning",
  "Data Science",
  "Web Development",
  "Mobile Development",
  "Cloud Computing",
  "DevOps",
  "Cybersecurity",
  "UI/UX Design",
]

export default function Onboarding() {
  const [selectedInterests, setSelectedInterests] = useState([])
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleInterestChange = (interest) => {
    setSelectedInterests((prevSelected) =>
      prevSelected.includes(interest) ? prevSelected.filter((item) => item !== interest) : [...prevSelected, interest],
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (selectedInterests.length < 3) {
      toast({ title: "Error", description: "Please select at least 3 interests.", variant: "destructive" })
      return
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/onboarding`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ skills: selectedInterests }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast({ title: "Error", description: data.error || "Onboarding failed", variant: "destructive" })
        return
      }
      toast({ title: "Success", description: "Onboarding complete!", variant: "default" })
      if (data.redirect) {
        navigate(data.redirect)
      } else {
        navigate("/interviewee/dashboard")
      }
    } catch (err) {
      toast({ title: "Error", description: "Onboarding failed: " + err.message, variant: "destructive" })
    }
  }

  return (
    <div className="min-h-screen bg-background-alt flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-16 flex-grow flex items-center justify-center">
        <div className="max-w-3xl w-full">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Code2 className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">SmartHire</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Tell Us About Your Interests</h1>
            <p className="text-muted-foreground">
              Help us tailor your experience by selecting topics you're interested in.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Select Your Skills & Interests</CardTitle>
              <CardDescription>Choose at least 3 topics that align with your professional goals.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {interests.map((interest) => (
                    <div
                      key={interest}
                      className={`flex items-center space-x-2 border rounded-lg p-3 cursor-pointer transition-colors ${
                        selectedInterests.includes(interest)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card text-card-foreground border-border hover:bg-muted/50"
                      }`}
                      onClick={() => handleInterestChange(interest)}
                    >
                      <input
                        type="checkbox"
                        id={interest}
                        checked={selectedInterests.includes(interest)}
                        onChange={() => {}}
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center ${
                          selectedInterests.includes(interest)
                            ? "bg-primary-foreground border-primary-foreground"
                            : "border-muted-foreground"
                        }`}
                      >
                        {selectedInterests.includes(interest) && (
                          <svg
                            className="w-3 h-3 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                        )}
                      </div>
                      <Label htmlFor={interest} className="cursor-pointer text-sm font-medium">
                        {interest}
                      </Label>
                    </div>
                  ))}
                </div>
                <Button type="submit" className="w-full" disabled={selectedInterests.length < 3}>
                  Continue
                </Button>
   
         
       
       </form>
             </CardContent>
           </Card>
   
            </div>
          </div>
           <Footer />
          </div>
        
          
   
        
   
          
         
         
       )
   }

