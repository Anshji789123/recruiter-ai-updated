"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ref, push, onValue, update, serverTimestamp } from "firebase/database"
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Users,
  FileText,
  LogOut,
  Plus,
  Send,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  Clock,
  Eye,
  Download,
  UserCheck,
  Building,
  Brain,
  Target,
  Award,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { database, storage } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import AIAssignmentGenerator from "@/components/ai-assignment-generator"

interface Job {
  id: string
  title: string
  description: string
  status: "active" | "closed"
  requirements: string[]
  createdAt: string
  recruiterId: string
  recruiterName: string
  company: string
  jobDescriptionUrl?: string
}

interface Candidate {
  id: string
  name: string
  email: string
  phone: string
  jobId: string
  jobTitle: string
  resumeUrl: string
  status: "pending" | "selected" | "rejected"
  appliedAt: string
  experience: string
  skills: string[]
  location: string
  currentCompany: string
  candidateId: string
  recruiterName: string
  company: string
  summary?: string
  education?: string
  projects?: { name: string; description: string; technologies: string[] }[]
  certifications?: string[]
}

interface Assignment {
  id: string
  jobId: string
  jobTitle: string
  candidateId: string
  candidateName: string
  candidateEmail: string
  status: 'pending' | 'in-progress' | 'completed'
  score?: number
  passed?: boolean
  correctAnswers?: number
  totalQuestions?: number
  createdAt: string
  completedAt?: string
  jobRole?: string
}

export default function RecruiterDashboard() {
  const { user, userData, logout } = useAuth()
  const [jobs, setJobs] = useState<Job[]>([])
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [showJobForm, setShowJobForm] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [showAssignmentGenerator, setShowAssignmentGenerator] = useState<{
    candidate: Candidate
    job: Job
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!user || !userData) {
      router.push("/auth/login")
      return
    }

    if (userData.userType !== "recruiter") {
      router.push("/dashboard/candidate")
      return
    }

    // Real-time listener for jobs
    const jobsRef = ref(database, "jobs")
    const unsubscribeJobs = onValue(jobsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const jobsArray = Object.entries(data)
          .map(([id, job]: [string, any]) => ({
            id,
            ...job,
          }))
          .filter((job: Job) => job.recruiterId === user.uid)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        setJobs(jobsArray)
      } else {
        setJobs([])
      }
    })

    // Real-time listener for applications
    const applicationsRef = ref(database, "applications")
    const unsubscribeApplications = onValue(applicationsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const applicationsArray = Object.entries(data)
          .map(([id, application]: [string, any]) => ({
            id,
            ...application,
          }))
          .sort((a: any, b: any) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())

        // Filter applications for this recruiter's jobs
        const myJobIds = jobs.map((job) => job.id)
        const myApplications = applicationsArray.filter(
          (app: any) => myJobIds.includes(app.jobId) || jobs.some((job) => job.id === app.jobId),
        )
        setCandidates(myApplications)
      } else {
        setCandidates([])
      }
    })

    // Real-time listener for assignments
    const assignmentsRef = ref(database, "assignments")
    const unsubscribeAssignments = onValue(assignmentsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const assignmentsArray = Object.entries(data)
          .map(([id, assignment]: [string, any]) => ({
            id,
            ...assignment,
          }))
          .filter((assignment: any) => {
            // Filter assignments for this recruiter's jobs
            return jobs.some(job => job.id === assignment.jobId)
          })
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        setAssignments(assignmentsArray)
      } else {
        setAssignments([])
      }
    })

    return () => {
      unsubscribeJobs()
      unsubscribeApplications()
      unsubscribeAssignments()
    }
  }, [user, userData, router, jobs.length])

  const handleJobUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !userData) return

    setIsLoading(true)
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const file = formData.get("jobFile") as File
    const title = formData.get("jobTitle") as string
    const description = formData.get("jobDescription") as string
    const requirements = (formData.get("requirements") as string).split(",").map((r) => r.trim())

    try {
      let jobDescriptionUrl = ""

      if (file && file.size > 0) {
        // Upload job description file to Firebase Storage
        const fileRef = storageRef(storage, `job-descriptions/${user.uid}/${Date.now()}_${file.name}`)
        await uploadBytes(fileRef, file)
        jobDescriptionUrl = await getDownloadURL(fileRef)
      }

      // Create job data object
      const jobData = {
        title,
        description: description || `Job description: ${title}`,
        status: "active",
        requirements,
        createdAt: new Date().toISOString(),
        recruiterId: user.uid,
        recruiterName: userData.name,
        company: userData.company || "Company",
        ...(jobDescriptionUrl && { jobDescriptionUrl }),
      }

      // Add job to Realtime Database
      const jobsRef = ref(database, "jobs")
      const newJobRef = push(jobsRef)

      await update(newJobRef, jobData)

      // Reset form and close modal
      setShowJobForm(false)
      form.reset()

      // Show success message
      alert("✅ Job posted successfully! Candidates can now see it in real-time.")
    } catch (error) {
      console.error("Error creating job:", error)
      alert("❌ Error creating job. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const selectCandidate = async (candidateId: string) => {
    try {
      // Update application status
      const applicationRef = ref(database, `applications/${candidateId}`)
      await update(applicationRef, {
        status: "selected",
        selectedAt: new Date().toISOString(),
      })

      const candidate = candidates.find((c) => c.id === candidateId)
      if (candidate) {
        // Create interview record
        const interviewsRef = ref(database, "interviews")
        const newInterviewRef = push(interviewsRef)

        await update(newInterviewRef, {
          candidateId: candidate.candidateId,
          candidateName: candidate.name,
          candidateEmail: candidate.email,
          jobId: candidate.jobId,
          jobTitle: candidate.jobTitle,
          recruiterId: user?.uid,
          recruiterName: userData?.name,
          scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          status: "scheduled",
          meetingLink: `https://meet.google.com/${Math.random().toString(36).substring(7)}`,
          createdAt: new Date().toISOString(),
          timestamp: serverTimestamp(),
        })

        alert(`✅ ${candidate.name} has been selected! Interview scheduled and notification sent in real-time.`)
      }
    } catch (error) {
      console.error("Error selecting candidate:", error)
      alert("Error selecting candidate. Please try again.")
    }
  }

  const rejectCandidate = async (candidateId: string) => {
    try {
      const applicationRef = ref(database, `applications/${candidateId}`)
      await update(applicationRef, {
        status: "rejected",
        rejectedAt: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Error rejecting candidate:", error)
      alert("Error rejecting candidate. Please try again.")
    }
  }

  const handleSendAssignment = (candidate: Candidate) => {
    const job = jobs.find(j => j.id === candidate.jobId)
    if (job) {
      setShowAssignmentGenerator({ candidate, job })
    }
  }

  if (!user || !userData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">HG</span>
          </div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">HG</span>
              </div>
              <span className="text-xl font-bold text-slate-800">HireGenius</span>
              <div className="ml-4 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-semibold">
                🔴 LIVE - Real-time Updates
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-800">{userData.name}</p>
                <p className="text-xs text-slate-500">{userData.company}</p>
              </div>
              <Button
                variant="outline"
                onClick={logout}
                className="flex items-center space-x-2 border-slate-200 hover:bg-slate-50"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Active Jobs</p>
                  <p className="text-3xl font-bold">{jobs.filter((j) => j.status === "active").length}</p>
                </div>
                <FileText className="h-8 w-8 text-emerald-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Applications</p>
                  <p className="text-3xl font-bold">{candidates.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Selected</p>
                  <p className="text-3xl font-bold">{candidates.filter((c) => c.status === "selected").length}</p>
                </div>
                <UserCheck className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Pending Review</p>
                  <p className="text-3xl font-bold">{candidates.filter((c) => c.status === "pending").length}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-100 text-sm font-medium">AI Assignments</p>
                  <p className="text-3xl font-bold">{assignments.length}</p>
                </div>
                <Brain className="h-8 w-8 text-cyan-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Management */}
          <Card className="lg:col-span-1 shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-t-lg">
              <div className="flex justify-between items-center">
                <CardTitle className="text-slate-800 flex items-center">
                  Job Postings
                  <span className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                </CardTitle>
                <Button
                  onClick={() => setShowJobForm(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Job
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {showJobForm && (
                <form onSubmit={handleJobUpload} className="mb-6 p-4 bg-slate-50 rounded-lg border">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Job Title *</label>
                      <input
                        type="text"
                        name="jobTitle"
                        required
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="e.g. Senior Software Engineer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Job Description</label>
                      <textarea
                        name="jobDescription"
                        rows={3}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="Describe the role and responsibilities..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Requirements (comma separated) *
                      </label>
                      <input
                        type="text"
                        name="requirements"
                        required
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="React.js, Node.js, 5+ years experience"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Job Description (PDF - Optional)
                      </label>
                      <input
                        type="file"
                        name="jobFile"
                        accept=".pdf"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        type="submit"
                        size="sm"
                        disabled={isLoading}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        {isLoading ? "Creating Job..." : "🚀 Post Job Live"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowJobForm(false)}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </form>
              )}

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow relative"
                  >
                    <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-slate-800">{job.title}</h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          job.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {job.status} • LIVE
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{job.description}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {job.requirements?.slice(0, 3).map((req, idx) => (
                        <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                          {req}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500">Created: {new Date(job.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
                {jobs.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">No jobs posted yet</p>
                    <p className="text-sm text-slate-400">Create your first job posting to get started</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Candidate Management */}
          <Card className="lg:col-span-2 shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-t-lg">
              <CardTitle className="text-slate-800 flex items-center">
                Candidate Applications
                <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                {candidates.filter((c) => c.status === "pending").length > 0 && (
                  <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full animate-bounce">
                    {candidates.filter((c) => c.status === "pending").length} New
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className={`p-4 border rounded-lg hover:shadow-md transition-all relative ${
                      candidate.status === "pending" ? "border-orange-200 bg-orange-50/30" : "border-slate-200"
                    }`}
                  >
                    {candidate.status === "pending" && (
                      <div className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    )}
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-slate-800">{candidate.name}</h3>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              candidate.status === "selected"
                                ? "bg-emerald-100 text-emerald-800"
                                : candidate.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {candidate.status}
                          </span>
                          {candidate.status === "pending" && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full animate-pulse">
                              🔴 New Application
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600 mb-3">
                          <div className="flex items-center space-x-1">
                            <Mail className="h-3 w-3" />
                            <span>{candidate.email}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone className="h-3 w-3" />
                            <span>{candidate.phone}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{candidate.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Building className="h-3 w-3" />
                            <span>{candidate.currentCompany}</span>
                          </div>
                        </div>

                        <div className="mb-2">
                          <p className="text-sm text-slate-600">
                            <Briefcase className="h-3 w-3 inline mr-1" />
                            Applied for: <span className="font-medium">{candidate.jobTitle}</span>
                          </p>
                          <p className="text-sm text-slate-600">
                            <Clock className="h-3 w-3 inline mr-1" />
                            Experience: <span className="font-medium">{candidate.experience}</span>
                          </p>
                          {candidate.summary && (
                            <p className="text-sm text-slate-600 mt-2">
                              <span className="font-medium">Summary:</span> {candidate.summary.slice(0, 100)}...
                            </p>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1 mb-2">
                          {candidate.skills?.slice(0, 4).map((skill, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                              {skill}
                            </span>
                          ))}
                          {candidate.skills?.length > 4 && (
                            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                              +{candidate.skills.length - 4} more
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-500">
                          Applied: {new Date(candidate.appliedAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedCandidate(candidate)}
                          className="border-slate-300 hover:bg-slate-50"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        {candidate.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleSendAssignment(candidate)}
                              className="bg-purple-600 hover:bg-purple-700 text-white"
                            >
                              <Brain className="h-3 w-3 mr-1" />
                              AI Test
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => selectCandidate(candidate.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              <Send className="h-3 w-3 mr-1" />
                              Select
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => rejectCandidate(candidate.id)}
                              className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {candidates.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">No applications yet</p>
                    <p className="text-sm text-slate-400">
                      Applications will appear here in real-time when candidates apply
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Assignments Section */}
        <Card className="mt-8 shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
            <CardTitle className="text-purple-800 flex items-center">
              <Brain className="h-6 w-6 mr-2" />
              AI Assignment Results
              <span className="ml-2 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
              {assignments.filter(a => a.status === 'completed').length > 0 && (
                <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                  {assignments.filter(a => a.status === 'completed').length} Completed
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className={`p-4 border rounded-lg transition-all ${
                    assignment.status === 'completed' 
                      ? assignment.passed 
                        ? 'border-emerald-200 bg-emerald-50' 
                        : 'border-red-200 bg-red-50'
                      : assignment.status === 'in-progress'
                        ? 'border-blue-200 bg-blue-50'
                        : 'border-orange-200 bg-orange-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-slate-800">{assignment.candidateName}</h3>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            assignment.status === 'completed'
                              ? assignment.passed
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                              : assignment.status === 'in-progress'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-orange-100 text-orange-800'
                          }`}
                        >
                          {assignment.status === 'completed' 
                            ? assignment.passed ? 'PASSED' : 'FAILED'
                            : assignment.status.toUpperCase()
                          }
                        </span>
                        {assignment.status === 'completed' && assignment.passed && (
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                            <Award className="h-3 w-3 inline mr-1" />
                            Qualified
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-slate-600 mb-2">
                        <span className="font-medium">Position:</span> {assignment.jobTitle}
                      </p>
                      
                      {assignment.status === 'completed' && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-slate-700">Score:</span>
                            <span className={`ml-1 font-bold ${assignment.passed ? 'text-emerald-600' : 'text-red-600'}`}>
                              {assignment.score}%
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-slate-700">Correct:</span>
                            <span className="ml-1 text-slate-600">
                              {assignment.correctAnswers}/{assignment.totalQuestions}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-slate-700">Completed:</span>
                            <span className="ml-1 text-slate-600">
                              {assignment.completedAt ? new Date(assignment.completedAt).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-slate-700">Status:</span>
                            <span className={`ml-1 font-semibold ${assignment.passed ? 'text-emerald-600' : 'text-red-600'}`}>
                              {assignment.passed ? 'Qualified for Interview' : 'Not Qualified'}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <p className="text-xs text-slate-500 mt-2">
                        Sent: {new Date(assignment.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="ml-4">
                      {assignment.status === 'completed' && assignment.passed && (
                        <Button
                          size="sm"
                          onClick={() => selectCandidate(candidates.find(c => c.candidateId === assignment.candidateId)?.id || '')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          <Send className="h-3 w-3 mr-1" />
                          Schedule Interview
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {assignments.length === 0 && (
                <div className="text-center py-12">
                  <Brain className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No assignments sent yet</p>
                  <p className="text-sm text-slate-400">
                    Send AI-powered assignments to candidates to assess their skills
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignment Generator Modal */}
      {showAssignmentGenerator && (
        <AssignmentGenerator
          jobId={showAssignmentGenerator.job.id}
          jobTitle={showAssignmentGenerator.job.title}
          jobDescription={showAssignmentGenerator.job.description}
          requirements={showAssignmentGenerator.job.requirements}
          candidateId={showAssignmentGenerator.candidate.candidateId}
          candidateName={showAssignmentGenerator.candidate.name}
          candidateEmail={showAssignmentGenerator.candidate.email}
          onClose={() => setShowAssignmentGenerator(null)}
        />
      )}

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">{selectedCandidate.name}</h2>
                  <p className="text-slate-600">{selectedCandidate.jobTitle}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCandidate(null)}
                  className="border-slate-300"
                >
                  ✕
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Contact Information</h3>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-slate-400" />
                      <span>{selectedCandidate.email}</span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <span>{selectedCandidate.phone}</span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span>{selectedCandidate.location}</span>
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Professional Details</h3>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center space-x-2">
                      <Building className="h-4 w-4 text-slate-400" />
                      <span>{selectedCandidate.currentCompany}</span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-slate-400" />
                      <span>{selectedCandidate.experience} experience</span>
                    </p>
                    {selectedCandidate.education && (
                      <p className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-slate-400" />
                        <span>{selectedCandidate.education}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {selectedCandidate.summary && (
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Professional Summary</h3>
                  <p className="text-slate-600 leading-relaxed">{selectedCandidate.summary}</p>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCandidate.skills?.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {selectedCandidate.projects && selectedCandidate.projects.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Projects</h3>
                  <div className="space-y-3">
                    {selectedCandidate.projects.map((project, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-lg">
                        <h4 className="font-medium text-slate-800 mb-1">{project.name}</h4>
                        <p className="text-sm text-slate-600 mb-2">{project.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.map((tech, techIdx) => (
                            <span key={techIdx} className="px-2 py-1 bg-slate-200 text-slate-700 text-xs rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedCandidate.certifications && selectedCandidate.certifications.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Certifications</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidate.certifications.map((cert, idx) => (
                      <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedCandidate.status === "pending" && (
                <div className="flex space-x-3 pt-4 border-t border-slate-200">
                  <Button
                    onClick={() => {
                      handleSendAssignment(selectedCandidate)
                      setSelectedCandidate(null)
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white flex-1"
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    Send AI Assignment
                  </Button>
                  <Button
                    onClick={() => {
                      selectCandidate(selectedCandidate.id)
                      setSelectedCandidate(null)
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Select Candidate
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      rejectCandidate(selectedCandidate.id)
                      setSelectedCandidate(null)
                    }}
                    className="border-red-300 text-red-600 hover:bg-red-50 flex-1"
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}