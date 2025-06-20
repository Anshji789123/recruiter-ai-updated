"use client"

import { useState, useEffect } from "react"
import { ref, push, onValue, update, serverTimestamp } from "firebase/database"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, FileText, Calendar, Clock, CheckCircle, LogOut, Star, Briefcase, Bell, Plus, X, Brain, Target } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { database } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import AssignmentTest from "@/components/assignment-test"
import AssignmentResults from "@/components/assignment-results"

interface Application {
  id: string
  jobId: string
  jobTitle: string
  company: string
  status: "pending" | "selected" | "rejected"
  appliedAt: string
  candidateId: string
  recruiterName: string
}

interface Interview {
  id: string
  candidateId: string
  candidateName: string
  jobTitle: string
  scheduledAt: string
  status: "scheduled" | "completed" | "cancelled"
  meetingLink?: string
  recruiterName: string
}

interface Job {
  id: string
  title: string
  description: string
  status: "active" | "closed"
  requirements: string[]
  createdAt: string
  recruiterName: string
  company: string
}

interface Assignment {
  id: string
  jobId: string
  jobTitle: string
  candidateId: string
  candidateName: string
  candidateEmail: string
  questions: any[]
  duration: number
  passingScore: number
  status: 'pending' | 'in-progress' | 'completed'
  score?: number
  passed?: boolean
  correctAnswers?: number
  totalQuestions?: number
  createdAt: string
  completedAt?: string
  answers?: number[]
}

interface CandidateProfile {
  name: string
  email: string
  phone: string
  location: string
  experience: string
  currentCompany: string
  skills: string[]
  projects: Array<{
    name: string
    description: string
    technologies: string[]
  }>
  certifications: string[]
  education: string
  summary: string
}

export default function CandidateDashboard() {
  const { user, userData, logout } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [availableJobs, setAvailableJobs] = useState<Job[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [activeAssignment, setActiveAssignment] = useState<Assignment | null>(null)
  const [completedAssignment, setCompletedAssignment] = useState<Assignment | null>(null)
  const [isApplying, setIsApplying] = useState<string | null>(null)
  const [showProfileForm, setShowProfileForm] = useState(false)
  const [profileCompleted, setProfileCompleted] = useState(false)
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile>({
    name: userData?.name || "",
    email: userData?.email || "",
    phone: userData?.phone || "",
    location: "",
    experience: "",
    currentCompany: "",
    skills: [],
    projects: [],
    certifications: [],
    education: "",
    summary: "",
  })
  const [newSkill, setNewSkill] = useState("")
  const [newCertification, setNewCertification] = useState("")
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    technologies: [] as string[],
  })
  const [newProjectTech, setNewProjectTech] = useState("")
  const router = useRouter()

  useEffect(() => {
    if (!user || !userData) {
      router.push("/auth/login")
      return
    }

    if (userData.userType !== "candidate") {
      router.push("/dashboard/recruiter")
      return
    }

    // Check if profile is completed
    const checkProfile = () => {
      const isComplete =
        candidateProfile.location &&
        candidateProfile.experience &&
        candidateProfile.skills.length > 0 &&
        candidateProfile.summary
      setProfileCompleted(isComplete)
    }
    checkProfile()

    // Real-time listener for available jobs
    const jobsRef = ref(database, "jobs")
    const unsubscribeJobs = onValue(jobsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const jobsArray = Object.entries(data)
          .map(([id, job]: [string, any]) => ({
            id,
            ...job,
          }))
          .filter((job: Job) => job.status === "active")
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        setAvailableJobs(jobsArray)
      } else {
        setAvailableJobs([])
      }
    })

    // Real-time listener for user's applications
    const applicationsRef = ref(database, "applications")
    const unsubscribeApplications = onValue(applicationsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const applicationsArray = Object.entries(data)
          .map(([id, application]: [string, any]) => ({
            id,
            ...application,
          }))
          .filter((app: any) => app.candidateId === user.uid)
          .sort((a: any, b: any) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
        setApplications(applicationsArray)
      } else {
        setApplications([])
      }
    })

    // Real-time listener for user's interviews
    const interviewsRef = ref(database, "interviews")
    const unsubscribeInterviews = onValue(interviewsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const interviewsArray = Object.entries(data)
          .map(([id, interview]: [string, any]) => ({
            id,
            ...interview,
          }))
          .filter((interview: any) => interview.candidateId === user.uid)
          .sort((a: any, b: any) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())
        setInterviews(interviewsArray)
      } else {
        setInterviews([])
      }
    })

    // Real-time listener for user's assignments
    const assignmentsRef = ref(database, "assignments")
    const unsubscribeAssignments = onValue(assignmentsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const assignmentsArray = Object.entries(data)
          .map(([id, assignment]: [string, any]) => ({
            id,
            ...assignment,
          }))
          .filter((assignment: any) => assignment.candidateId === user.uid)
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        setAssignments(assignmentsArray)
      } else {
        setAssignments([])
      }
    })

    return () => {
      unsubscribeJobs()
      unsubscribeApplications()
      unsubscribeInterviews()
      unsubscribeAssignments()
    }
  }, [user, userData, router, candidateProfile])

  const addSkill = () => {
    if (newSkill.trim() && !candidateProfile.skills.includes(newSkill.trim())) {
      setCandidateProfile({
        ...candidateProfile,
        skills: [...candidateProfile.skills, newSkill.trim()],
      })
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setCandidateProfile({
      ...candidateProfile,
      skills: candidateProfile.skills.filter((skill) => skill !== skillToRemove),
    })
  }

  const addCertification = () => {
    if (newCertification.trim() && !candidateProfile.certifications.includes(newCertification.trim())) {
      setCandidateProfile({
        ...candidateProfile,
        certifications: [...candidateProfile.certifications, newCertification.trim()],
      })
      setNewCertification("")
    }
  }

  const removeCertification = (certToRemove: string) => {
    setCandidateProfile({
      ...candidateProfile,
      certifications: candidateProfile.certifications.filter((cert) => cert !== certToRemove),
    })
  }

  const addProjectTech = () => {
    if (newProjectTech.trim() && !newProject.technologies.includes(newProjectTech.trim())) {
      setNewProject({
        ...newProject,
        technologies: [...newProject.technologies, newProjectTech.trim()],
      })
      setNewProjectTech("")
    }
  }

  const removeProjectTech = (techToRemove: string) => {
    setNewProject({
      ...newProject,
      technologies: newProject.technologies.filter((tech) => tech !== techToRemove),
    })
  }

  const addProject = () => {
    if (newProject.name.trim() && newProject.description.trim()) {
      setCandidateProfile({
        ...candidateProfile,
        projects: [...candidateProfile.projects, newProject],
      })
      setNewProject({ name: "", description: "", technologies: [] })
    }
  }

  const removeProject = (indexToRemove: number) => {
    setCandidateProfile({
      ...candidateProfile,
      projects: candidateProfile.projects.filter((_, index) => index !== indexToRemove),
    })
  }

  const saveProfile = async () => {
    try {
      const userRef = ref(database, `users/${user?.uid}`)
      await update(userRef, {
        candidateProfile,
        profileCompleted: true,
        profileUpdatedAt: new Date().toISOString(),
      })
      setProfileCompleted(true)
      setShowProfileForm(false)
      alert("✅ Profile saved successfully! You can now apply to jobs.")
    } catch (error) {
      console.error("Error saving profile:", error)
      alert("❌ Error saving profile. Please try again.")
    }
  }

  const applyToJob = async (job: Job) => {
    if (!profileCompleted) {
      alert("❌ Please complete your profile first!")
      return
    }

    if (!user || !userData) return

    // Check if already applied
    if (applications.some((app) => app.jobId === job.id)) {
      alert("❌ You have already applied to this job!")
      return
    }

    setIsApplying(job.id)
    try {
      // Create application in Realtime Database
      const applicationsRef = ref(database, "applications")
      const newApplicationRef = push(applicationsRef)

      const applicationData = {
        candidateId: user.uid,
        name: candidateProfile.name,
        email: candidateProfile.email,
        phone: candidateProfile.phone,
        location: candidateProfile.location,
        experience: candidateProfile.experience,
        currentCompany: candidateProfile.currentCompany,
        skills: candidateProfile.skills,
        projects: candidateProfile.projects,
        certifications: candidateProfile.certifications,
        education: candidateProfile.education,
        summary: candidateProfile.summary,
        jobId: job.id,
        jobTitle: job.title,
        status: "pending",
        appliedAt: new Date().toISOString(),
        company: job.company,
        recruiterName: job.recruiterName,
        timestamp: serverTimestamp(),
      }

      await update(newApplicationRef, applicationData)

      alert("✅ Application submitted successfully! Recruiter will be notified in real-time.")
    } catch (error) {
      console.error("Error applying to job:", error)
      alert("❌ Error submitting application. Please try again.")
    } finally {
      setIsApplying(null)
    }
  }

  const handleStartAssignment = (assignment: Assignment) => {
    setActiveAssignment(assignment)
  }

  const handleAssignmentComplete = () => {
    setActiveAssignment(null)
    // Refresh assignments to get updated data
  }

  const handleViewResults = (assignment: Assignment) => {
    setCompletedAssignment(assignment)
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

  // Show assignment test if there's an active assignment
  if (activeAssignment) {
    return <AssignmentTest assignment={activeAssignment} onComplete={handleAssignmentComplete} />
  }

  // Show assignment results if viewing completed assignment
  if (completedAssignment) {
    return (
      <div>
        <div className="p-4 bg-white border-b">
          <Button
            variant="outline"
            onClick={() => setCompletedAssignment(null)}
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
        </div>
        <AssignmentResults assignment={completedAssignment} />
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
              <div className="ml-4 px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold">
                🔴 LIVE - Real-time Jobs
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Notification for new assignments */}
              {assignments.filter((a) => a.status === "pending").length > 0 && (
                <div className="relative">
                  <Bell className="h-6 w-6 text-purple-600 animate-bounce" />
                  <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
                    {assignments.filter((a) => a.status === "pending").length}
                  </span>
                </div>
              )}
              {/* Notification for new interviews */}
              {interviews.filter((i) => i.status === "scheduled").length > 0 && (
                <div className="relative">
                  <Bell className="h-6 w-6 text-emerald-600 animate-bounce" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
                    {interviews.filter((i) => i.status === "scheduled").length}
                  </span>
                </div>
              )}
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-800">{userData.name}</p>
                <p className="text-xs text-slate-500">Candidate</p>
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
          <Card className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Applications</p>
                  <p className="text-3xl font-bold">{applications.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Pending</p>
                  <p className="text-3xl font-bold">{applications.filter((a) => a.status === "pending").length}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Selected</p>
                  <p className="text-3xl font-bold">{applications.filter((a) => a.status === "selected").length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-emerald-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Interviews</p>
                  <p className="text-3xl font-bold">{interviews.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-100 text-sm font-medium">AI Tests</p>
                  <p className="text-3xl font-bold">{assignments.length}</p>
                </div>
                <Brain className="h-8 w-8 text-cyan-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Assignments Section */}
        {assignments.length > 0 && (
          <Card className="mb-8 shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
              <CardTitle className="text-purple-800 flex items-center">
                <Brain className="h-6 w-6 mr-2" />
                AI Skill Assessments
                <span className="ml-2 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                {assignments.filter(a => a.status === 'pending').length > 0 && (
                  <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full animate-bounce">
                    {assignments.filter(a => a.status === 'pending').length} New
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
                      assignment.status === 'pending' 
                        ? 'border-purple-200 bg-purple-50' 
                        : assignment.status === 'completed'
                          ? assignment.passed
                            ? 'border-emerald-200 bg-emerald-50'
                            : 'border-red-200 bg-red-50'
                          : 'border-blue-200 bg-blue-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-slate-800">{assignment.jobTitle}</h3>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              assignment.status === 'pending'
                                ? 'bg-purple-100 text-purple-800'
                                : assignment.status === 'completed'
                                  ? assignment.passed
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-red-100 text-red-800'
                                  : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {assignment.status === 'pending' && '🔔 New Assignment'}
                            {assignment.status === 'in-progress' && '⏳ In Progress'}
                            {assignment.status === 'completed' && (assignment.passed ? '✅ Passed' : '❌ Failed')}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <span className="font-medium text-slate-700">Questions:</span>
                            <span className="ml-1 text-slate-600">{assignment.questions?.length || 10}</span>
                          </div>
                          <div>
                            <span className="font-medium text-slate-700">Duration:</span>
                            <span className="ml-1 text-slate-600">{assignment.duration} minutes</span>
                          </div>
                          <div>
                            <span className="font-medium text-slate-700">Passing Score:</span>
                            <span className="ml-1 text-slate-600">{assignment.passingScore}%</span>
                          </div>
                          {assignment.status === 'completed' && (
                            <div>
                              <span className="font-medium text-slate-700">Your Score:</span>
                              <span className={`ml-1 font-bold ${assignment.passed ? 'text-emerald-600' : 'text-red-600'}`}>
                                {assignment.score}%
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <p className="text-xs text-slate-500">
                          Received: {new Date(assignment.createdAt).toLocaleDateString()}
                          {assignment.completedAt && (
                            <span className="ml-4">
                              Completed: {new Date(assignment.completedAt).toLocaleDateString()}
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="ml-4">
                        {assignment.status === 'pending' && (
                          <Button
                            onClick={() => handleStartAssignment(assignment)}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            <Brain className="h-4 w-4 mr-2" />
                            Start Test
                          </Button>
                        )}
                        {assignment.status === 'completed' && (
                          <Button
                            variant="outline"
                            onClick={() => handleViewResults(assignment)}
                            className="border-slate-300"
                          >
                            <Target className="h-4 w-4 mr-2" />
                            View Results
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Candidate Profile */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-t-lg">
              <div className="flex justify-between items-center">
                <CardTitle className="text-slate-800">Candidate Profile</CardTitle>
                <Button
                  onClick={() => setShowProfileForm(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  size="sm"
                >
                  <User className="h-4 w-4 mr-1" />
                  {profileCompleted ? "Edit Profile" : "Complete Profile"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {profileCompleted ? (
                <div className="space-y-4">
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <p className="text-sm text-emerald-700 font-medium">
                      ✅ Profile completed! You can now apply to jobs.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-slate-800">Summary</h4>
                      <p className="text-sm text-slate-600">{candidateProfile.summary}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">Experience</h4>
                      <p className="text-sm text-slate-600">{candidateProfile.experience}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">Skills</h4>
                      <div className="flex flex-wrap gap-1">
                        {candidateProfile.skills.slice(0, 6).map((skill, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                            {skill}
                          </span>
                        ))}
                        {candidateProfile.skills.length > 6 && (
                          <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                            +{candidateProfile.skills.length - 6} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <User className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 mb-2">Complete your profile to apply for jobs</p>
                  <p className="text-sm text-slate-400">Add your skills, experience, and projects</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Available Jobs */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-t-lg">
              <CardTitle className="text-slate-800 flex items-center">
                Live Job Postings
                <span className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {availableJobs.length} Live Jobs
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {availableJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-all relative"
                  >
                    <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800 mb-2 flex items-center">
                          {job.title}
                          <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">LIVE</span>
                        </h3>
                        <p className="text-sm text-slate-600 mb-3">{job.description}</p>
                        <p className="text-sm text-slate-600 mb-3">
                          <span className="font-medium">Company:</span> {job.company}
                        </p>
                        <p className="text-sm text-slate-600 mb-3">
                          <span className="font-medium">Posted by:</span> {job.recruiterName}
                        </p>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {job.requirements?.slice(0, 4).map((req, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                              {req}
                            </span>
                          ))}
                        </div>

                        <p className="text-xs text-slate-500">Posted: {new Date(job.createdAt).toLocaleDateString()}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => applyToJob(job)}
                        disabled={
                          applications.some((a) => a.jobId === job.id) || !profileCompleted || isApplying === job.id
                        }
                        className={`ml-4 ${
                          applications.some((a) => a.jobId === job.id)
                            ? "bg-slate-400 cursor-not-allowed"
                            : !profileCompleted
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-emerald-600 hover:bg-emerald-700"
                        } text-white`}
                      >
                        {isApplying === job.id
                          ? "Applying..."
                          : applications.some((a) => a.jobId === job.id)
                            ? "Applied ✓"
                            : !profileCompleted
                              ? "Complete Profile First"
                              : "🚀 Apply Now"}
                      </Button>
                    </div>
                  </div>
                ))}
                {availableJobs.length === 0 && (
                  <div className="text-center py-12">
                    <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">No jobs available</p>
                    <p className="text-sm text-slate-400">New jobs will appear here in real-time</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Application Status */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-t-lg">
              <CardTitle className="text-slate-800 flex items-center">
                My Applications
                <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {applications.map((application) => (
                  <div
                    key={application.id}
                    className={`p-4 border rounded-lg hover:shadow-md transition-all relative ${
                      application.status === "selected"
                        ? "border-emerald-200 bg-emerald-50/30"
                        : application.status === "rejected"
                          ? "border-red-200 bg-red-50/30"
                          : "border-slate-200"
                    }`}
                  >
                    {application.status === "selected" && (
                      <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    )}
                    {application.status === "rejected" && (
                      <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    )}
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-slate-800">{application.jobTitle}</h3>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              application.status === "selected"
                                ? "bg-emerald-100 text-emerald-800"
                                : application.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {application.status}
                          </span>
                          {application.status === "selected" && (
                            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full animate-pulse">
                              🎉 Selected!
                            </span>
                          )}
                          {application.status === "rejected" && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                              ❌ Not Selected
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 mb-2">
                          {application.company} • {application.recruiterName}
                        </p>
                        <p className="text-xs text-slate-500">
                          Applied: {new Date(application.appliedAt).toLocaleDateString()}
                        </p>
                      </div>
                      {application.status === "selected" && (
                        <div className="ml-4">
                          <span className="inline-flex items-center px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                            <Star className="h-3 w-3 mr-1" />
                            Interview Scheduled
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {applications.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">No applications yet</p>
                    <p className="text-sm text-slate-400">Start applying to jobs to see your applications here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Interview Schedule */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-t-lg">
              <CardTitle className="text-slate-800 flex items-center">
                Interview Schedule
                <span className="ml-2 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                {interviews.filter((i) => i.status === "scheduled").length > 0 && (
                  <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full animate-bounce">
                    {interviews.filter((i) => i.status === "scheduled").length} Upcoming
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {interviews.map((interview) => (
                  <div
                    key={interview.id}
                    className={`p-4 border rounded-lg hover:shadow-md transition-all relative ${
                      interview.status === "scheduled" ? "border-purple-200 bg-purple-50/30" : "border-slate-200"
                    }`}
                  >
                    {interview.status === "scheduled" && (
                      <div className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    )}
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-slate-800">{interview.jobTitle}</h3>
                          {interview.status === "scheduled" && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full animate-pulse">
                              🔔 New Interview
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 mb-2">
                          <span className="font-medium">Interviewer:</span> {interview.recruiterName}
                        </p>
                        <div className="space-y-1 text-sm text-slate-600 mb-3">
                          <p className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(interview.scheduledAt).toLocaleDateString()}</span>
                          </p>
                          <p className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{new Date(interview.scheduledAt).toLocaleTimeString()}</span>
                          </p>
                        </div>
                        {interview.meetingLink && interview.status === "scheduled" && (
                          <Button
                            size="sm"
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                            onClick={() => window.open(interview.meetingLink, "_blank")}
                          >
                            🎥 Join Meeting
                          </Button>
                        )}
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          interview.status === "completed"
                            ? "bg-emerald-100 text-emerald-800"
                            : interview.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {interview.status}
                      </span>
                    </div>
                  </div>
                ))}
                {interviews.length === 0 && (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">No interviews scheduled</p>
                    <p className="text-sm text-slate-400">Interviews will appear here when you're selected</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Profile Form Modal */}
      {showProfileForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Complete Your Profile</h2>
                  <p className="text-slate-600">Fill in your details to apply for jobs</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowProfileForm(false)}
                  className="border-slate-300"
                >
                  ✕
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    value={candidateProfile.name}
                    onChange={(e) => setCandidateProfile({ ...candidateProfile, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    value={candidateProfile.email}
                    onChange={(e) => setCandidateProfile({ ...candidateProfile, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Phone *</label>
                  <input
                    type="tel"
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    value={candidateProfile.phone}
                    onChange={(e) => setCandidateProfile({ ...candidateProfile, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Location *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mumbai, Maharashtra"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    value={candidateProfile.location}
                    onChange={(e) => setCandidateProfile({ ...candidateProfile, location: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Experience *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 3+ years"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    value={candidateProfile.experience}
                    onChange={(e) => setCandidateProfile({ ...candidateProfile, experience: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Current Company</label>
                  <input
                    type="text"
                    placeholder="e.g. Tech Corp"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    value={candidateProfile.currentCompany}
                    onChange={(e) => setCandidateProfile({ ...candidateProfile, currentCompany: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Education</label>
                <input
                  type="text"
                  placeholder="e.g. B.Tech Computer Science"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  value={candidateProfile.education}
                  onChange={(e) => setCandidateProfile({ ...candidateProfile, education: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Professional Summary *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Brief summary of your professional background and career goals..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  value={candidateProfile.summary}
                  onChange={(e) => setCandidateProfile({ ...candidateProfile, summary: e.target.value })}
                />
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Skills *</label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add a skill"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addSkill()}
                  />
                  <Button onClick={addSkill} size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {candidateProfile.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full flex items-center"
                    >
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="ml-2 text-blue-500 hover:text-blue-700">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Projects</label>
                <div className="space-y-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Project name"
                      className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      value={newProject.name}
                      
                      onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    />
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Technology used"
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        value={newProjectTech}
                        onChange={(e) => setNewProjectTech(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addProjectTech()}
                      />
                      <Button onClick={addProjectTech} size="sm" variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Project description"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  />
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newProject.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-slate-100 text-slate-700 text-sm rounded flex items-center"
                      >
                        {tech}
                        <button
                          onClick={() => removeProjectTech(tech)}
                          className="ml-2 text-slate-500 hover:text-slate-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <Button onClick={addProject} size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                    Add Project
                  </Button>
                </div>
                <div className="space-y-2">
                  {candidateProfile.projects.map((project, idx) => (
                    <div key={idx} className="p-3 border border-slate-200 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-800">{project.name}</h4>
                          <p className="text-sm text-slate-600 mb-2">{project.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {project.technologies.map((tech, techIdx) => (
                              <span key={techIdx} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button onClick={() => removeProject(idx)} className="text-red-500 hover:text-red-700">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Certifications</label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add a certification"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    value={newCertification}
                    onChange={(e) => setNewCertification(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addCertification()}
                  />
                  <Button onClick={addCertification} size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {candidateProfile.certifications.map((cert, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full flex items-center"
                    >
                      {cert}
                      <button
                        onClick={() => removeCertification(cert)}
                        className="ml-2 text-green-500 hover:text-green-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-slate-200">
                <Button onClick={saveProfile} className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1">
                  Save Profile & Start Applying
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowProfileForm(false)}
                  className="border-slate-300 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}