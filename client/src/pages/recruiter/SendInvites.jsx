"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom" // Import useParams
import { UserPlus, Users, Send, Loader2 } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import RecruiterSidebar from "../../components/RecruiterSidebar"
import DashboardNavbar from "../../components/DashboardNavbar"
import { CardSkeleton } from "../../components/LoadingSkeleton"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../../components/ui/dialog";
import { useToast } from "../../components/ui/use-toast";



const mockAssessments = [
  { id: "1", title: "Frontend Developer Assessment" },
  { id: "2", title: "Backend Engineer Test" },
  { id: "3", title: "Full Stack Challenge" },
  { id: "4", title: "Data Structures & Algorithms" },
]

export default function SendInvites() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState("");
  const [individualEmail, setIndividualEmail] = useState("");
  const [bulkEmails, setBulkEmails] = useState("");
  const [message, setMessage] = useState("You've been invited to take an assessment on SmartHire!");
  const [invitedCount, setInvitedCount] = useState(0);
  const [errors, setErrors] = useState({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const { toast } = useToast();
  const [sendingIndividual, setSendingIndividual] = useState(false);
  const [sendingBulk, setSendingBulk] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/assessments`, { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        const regularAssessments = data.filter(a => !a.is_test && a.type !== 'test');
        setAssessments(regularAssessments);
        if (id && regularAssessments.some(a => String(a.id) === String(id))) {
          setSelectedAssessment(String(id));
        } else if (regularAssessments.length > 0) {
          setSelectedAssessment(String(regularAssessments[0].id));
        } else {
          setSelectedAssessment("");
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);




  const validateEmails = (emailsString) => {
    const emailArray = emailsString
      .split(/[\n,;]+/)
      .map((email) => email.trim())
      .filter(Boolean)
    const invalidEmails = emailArray.filter((email) => !/\S+@\S+\.\S+/.test(email))
    return { valid: emailArray.filter((email) => /\S+@\S+\.\S+/.test(email)), invalid: invalidEmails }
  }



  const getAssessmentTitle = (id) => {
    return assessments.find((a) => String(a.id) === String(id))?.title || "";
  };

  const sendInviteRequest = async (emails, assessmentTitle, message, subject) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/send-invite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email: emails,
        assessment_title: assessmentTitle,
        assessment_id: selectedAssessment,
        message,
        subject,
      }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to send invite");
    }
  };




  const handleSendIndividualInvite = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!selectedAssessment) {
      setErrors((prev) => ({ ...prev, assessment: "Please select an assessment." }));
      return;
    }
    const { valid, invalid } = validateEmails(individualEmail);
    if (invalid.length > 0 || valid.length === 0) {
      setErrors((prev) => ({ ...prev, individualEmail: "Please enter a valid email address." }));
      return;
    }
    const assessmentTitle = getAssessmentTitle(selectedAssessment);
    setSendingIndividual(true);
    try {
      await sendInviteRequest(valid[0], assessmentTitle, message, `Invitation to ${assessmentTitle} on SmartHire`);
      setInvitedCount((prev) => prev + 1);
      setConfirmMessage(`Invitation sent to ${valid[0]} for ${assessmentTitle}!`);
      setConfirmOpen(true);
      setIndividualEmail("");
    } catch (err) {
      toast({ title: "Failed to send invite", description: err.message || "Could not send the invitation. Please try again later.", variant: "destructive" });
    } finally {
      setSendingIndividual(false);
    }
  };

  const handleSendBulkInvites = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!selectedAssessment) {
      setErrors((prev) => ({ ...prev, assessment: "Please select an assessment." }));
      return;
    }
    const { valid, invalid } = validateEmails(bulkEmails);
    if (valid.length === 0) {
      setErrors((prev) => ({ ...prev, bulkEmails: "Please enter at least one valid email address." }));
      return;
    }
    if (invalid.length > 0) {
      setErrors((prev) => ({ ...prev, bulkEmails: `Invalid emails: ${invalid.join(", ")}` }));
      return;
    }
    const assessmentTitle = getAssessmentTitle(selectedAssessment);
    setSendingBulk(true);
    try {
      await sendInviteRequest(valid, assessmentTitle, message, `Invitation to ${assessmentTitle} on SmartHire`);
      setInvitedCount((prev) => prev + valid.length);
      setConfirmMessage(`Invitations sent to ${valid.length} candidates for ${assessmentTitle}!`);
      setConfirmOpen(true);
      setBulkEmails("");
    } catch (err) {
      toast({ title: "Failed to send invites", description: err.message || "Could not send the invitations. Please try again later.", variant: "destructive" });
    } finally {
      setSendingBulk(false);
    }
  };



  if (loading) {
    return (
      <div className="w-full bg-background flex">
        <div className="fixed left-0 top-0 h-screen z-30">
        <RecruiterSidebar />
        </div>
        <div className="flex-1 flex flex-col ml-64">
          <DashboardNavbar />
          <main className="flex-1 p-6 overflow-auto">
            <CardSkeleton />
          </main>
        </div>
      </div>
    )
  }



  return (
    <div className="w-full bg-muted/40 flex">
      <div className="fixed left-0 top-0 h-screen z-30">
      <RecruiterSidebar />
      </div>
      <div className="flex-1 flex flex-col ml-64">
        <DashboardNavbar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="space-y-6 max-w-4xl mx-auto pt-4">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-foreground">Send Assessment Invitations</h1>
              <p className="text-muted-foreground">Invite candidates to take your assessments.</p>
            </div>

            {/* Invitation Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Invitation Summary</CardTitle>
                <CardDescription>Overview of your recent invitation activity.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Send className="h-6 w-6 text-primary" />
                    <span className="text-2xl font-bold">{invitedCount}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Total invitations sent this session</p>
                </div>
              </CardContent>
            </Card>

            {/* Select Assessment */}
            <Card>
              <CardHeader>
                <CardTitle>Select Assessment</CardTitle>
                <CardDescription>Choose the assessment you want to send invitations for.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="assessment">Assessment</Label>
                  <Select value={String(selectedAssessment)} onValueChange={setSelectedAssessment}>
                    <SelectTrigger id="assessment">
                      <SelectValue placeholder="Select an assessment" />
                    </SelectTrigger>
                    <SelectContent>
                      {assessments.map((assessment) => (
                        <SelectItem key={assessment.id} value={String(assessment.id)}>
                          {assessment.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.assessment && <p className="text-destructive text-sm mt-1">{errors.assessment}</p>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Send Individual Invite</CardTitle>
                <CardDescription>Send an invitation to a single candidate.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSendIndividualInvite} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="individual-email">Candidate Email</Label>
                    <Input
                      id="individual-email"
                      type="email"
                      placeholder="candidate@example.com"
                      value={individualEmail}
                      onChange={(e) => setIndividualEmail(e.target.value)}
                      required
                    />
                    {errors.individualEmail && (
                      <p className="text-destructive text-sm mt-1">{errors.individualEmail}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="individual-message">Custom Message (Optional)</Label>
                    <Textarea
                      id="individual-message"
                      placeholder="e.g., 'We'd like to invite you to take our Frontend Developer Assessment...'"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={!selectedAssessment || sendingIndividual}>
                    {sendingIndividual ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <UserPlus className="h-4 w-4 mr-2" />}
                    {sendingIndividual ? "Sending..." : "Send Individual Invite"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Send Bulk Invites</CardTitle>
                <CardDescription>Send invitations to multiple candidates at once.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSendBulkInvites} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bulk-emails">Candidate Emails (comma, semicolon, or new line separated)</Label>
                    <Textarea
                      id="bulk-emails"
                      placeholder="candidate1@example.com, candidate2@example.com\ncandidate3@example.com"
                      value={bulkEmails}
                      onChange={(e) => setBulkEmails(e.target.value)}
                      rows={5}
                      required
                    />
                    {errors.bulkEmails && <p className="text-destructive text-sm mt-1">{errors.bulkEmails}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bulk-message">Custom Message (Optional)</Label>
                    <Textarea
                      id="bulk-message"
                      placeholder="e.g., 'We'd like to invite you to take our Frontend Developer Assessment...'"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={!selectedAssessment || sendingBulk}>
                    {sendingBulk ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Users className="h-4 w-4 mr-2" />}
                    {sendingBulk ? "Sending..." : "Send Bulk Invites"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invitation Sent</DialogTitle>
            <DialogDescription>{confirmMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button>OK</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}



