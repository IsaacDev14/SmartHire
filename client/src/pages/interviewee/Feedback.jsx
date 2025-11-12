"use client"

import { useState } from "react"
import { Send, MessageSquare, Lightbulb, Bug, CheckCircle } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Separator } from "../../components/ui/separator"
import IntervieweeSidebar from "../../components/IntervieweeSidebar"
import DashboardNavbar from "../../components/DashboardNavbar"
import { useToast } from "../../components/ui/use-toast"

const feedbackTypes = [
  {
    id: 'general',
    label: 'General Comment',
    description: 'Share your thoughts and experiences',
    icon: MessageSquare,
    color: 'bg-blue-500'
  },
  {
    id: 'suggestion',
    label: 'Suggestion',
    description: 'Help us improve the platform',
    icon: Lightbulb,
    color: 'bg-yellow-500'
  },
  {
    id: 'bug_report',
    label: 'Bug Report',
    description: 'Report issues you encountered',
    icon: Bug,
    color: 'bg-red-500'
  }
]

export default function Feedback() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [selectedType, setSelectedType] = useState('general')
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.subject.trim() || !formData.message.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          type: selectedType,
          subject: formData.subject.trim(),
          message: formData.message.trim()
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Feedback submitted successfully! Thank you for your input.",
          variant: "default"
        })
        
        // Reset form
        setFormData({
          subject: '',
          message: ''
        })
        setSelectedType('general')
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to submit feedback",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <IntervieweeSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardNavbar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Provide Feedback</h1>
              <p className="text-muted-foreground">Help us improve your experience on SmartHire</p>
            </div>


            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle>Submit Your Feedback</CardTitle>
                <CardDescription>
                  We value your opinion! Please share your suggestions, report issues, or provide general comments.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <Label>Type of Feedback</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {feedbackTypes.map((type) => (
                        <Button
                          key={type.id}
                          type="button"
                          variant={selectedType === type.id ? "default" : "outline"}
                          className={`h-auto p-6 flex flex-col items-center space-y-3 ${
                            selectedType === type.id ? type.color : ""
                          }`}
                          onClick={() => setSelectedType(type.id)}
                        >
                          <type.icon className="h-6 w-6" />
                          <div className="text-center">
                            <div className="font-medium text-base">{type.label}</div>
                            <div className="text-sm opacity-70 mt-1">{type.description}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="Briefly describe your feedback"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Provide detailed feedback here..."
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={8}
                      required
                      className="text-base resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-medium"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-3" />
                        Send Feedback
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Tips for Great Feedback</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-start space-x-3">
                    <Badge variant="outline" className="mt-1 text-sm">1</Badge>
                    <div>
                      <p className="font-medium text-base">Be Specific</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Provide detailed information about your experience or issue.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Badge variant="outline" className="mt-1 text-sm">2</Badge>
                    <div>
                      <p className="font-medium text-base">Include Context</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Mention what you were doing when the issue occurred or what feature you're suggesting.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Badge variant="outline" className="mt-1 text-sm">3</Badge>
                    <div>
                      <p className="font-medium text-base">Be Constructive</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Focus on how we can improve rather than just pointing out problems.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}


