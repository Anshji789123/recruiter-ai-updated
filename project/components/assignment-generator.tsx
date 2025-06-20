"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Brain, Clock, Target, Send, Loader2 } from 'lucide-react'
import { generateAssignment, type MCQQuestion } from '@/lib/gemini'
import { ref, push, serverTimestamp } from 'firebase/database'
import { database } from '@/lib/firebase'

interface AssignmentGeneratorProps {
  jobId: string
  jobTitle: string
  jobDescription: string
  requirements: string[]
  candidateId: string
  candidateName: string
  candidateEmail: string
  onClose: () => void
}

export default function AssignmentGenerator({
  jobId,
  jobTitle,
  jobDescription,
  requirements,
  candidateId,
  candidateName,
  candidateEmail,
  onClose
}: AssignmentGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [questions, setQuestions] = useState<MCQQuestion[]>([])
  const [duration, setDuration] = useState(30) // 30 minutes default
  const [passingScore, setPassingScore] = useState(70) // 70% default

  const handleGenerateAssignment = async () => {
    setIsGenerating(true)
    try {
      const generatedQuestions = await generateAssignment(jobTitle, jobDescription, requirements)
      setQuestions(generatedQuestions)
    } catch (error) {
      console.error('Error generating assignment:', error)
      alert('Failed to generate assignment. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSendAssignment = async () => {
    if (questions.length === 0) return

    setIsSending(true)
    try {
      const assignmentsRef = ref(database, 'assignments')
      const newAssignmentRef = push(assignmentsRef)

      const assignmentData = {
        jobId,
        jobTitle,
        jobDescription,
        candidateId,
        candidateName,
        candidateEmail,
        questions,
        duration,
        passingScore,
        status: 'pending',
        createdAt: new Date().toISOString(),
        timestamp: serverTimestamp(),
      }

      await newAssignmentRef.set(assignmentData)
      
      alert(`✅ Assignment sent to ${candidateName}! They will receive it in real-time.`)
      onClose()
    } catch (error) {
      console.error('Error sending assignment:', error)
      alert('Failed to send assignment. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                <Brain className="h-6 w-6 mr-2 text-purple-600" />
                AI Assignment Generator
              </h2>
              <p className="text-slate-600">Generate a custom MCQ assignment for {candidateName}</p>
            </div>
            <Button variant="outline" size="sm" onClick={onClose} className="border-slate-300">
              ✕
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Job Details */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">Job Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><span className="font-semibold">Position:</span> {jobTitle}</p>
                <p><span className="font-semibold">Description:</span> {jobDescription}</p>
                <div>
                  <span className="font-semibold">Requirements:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {requirements.map((req, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded">
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assignment Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-emerald-600" />
                Assignment Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <Clock className="h-4 w-4 inline mr-1" />
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="15"
                    max="120"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <Target className="h-4 w-4 inline mr-1" />
                    Passing Score (%)
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    value={passingScore}
                    onChange={(e) => setPassingScore(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generate Assignment */}
          {questions.length === 0 ? (
            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-8 text-center">
                <Brain className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-purple-800 mb-2">AI-Powered Question Generation</h3>
                <p className="text-purple-600 mb-6">
                  Generate 10 custom MCQ questions tailored to this specific job role using advanced AI
                </p>
                <Button
                  onClick={handleGenerateAssignment}
                  disabled={isGenerating}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Generating Questions...
                    </>
                  ) : (
                    <>
                      <Brain className="h-5 w-5 mr-2" />
                      Generate Assignment
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            /* Preview Generated Questions */
            <Card className="border-emerald-200 bg-emerald-50">
              <CardHeader>
                <CardTitle className="text-emerald-800 flex items-center">
                  ✅ Assignment Generated Successfully
                  <span className="ml-2 px-2 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full">
                    {questions.length} Questions
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {questions.map((question, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-emerald-200">
                      <h4 className="font-semibold text-slate-800 mb-2">
                        Q{index + 1}. {question.question}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                        {question.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`p-2 rounded text-sm ${
                              optIndex === question.correctAnswer
                                ? 'bg-emerald-100 text-emerald-800 font-semibold'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {String.fromCharCode(65 + optIndex)}. {option}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-slate-600 italic">
                        <span className="font-semibold">Explanation:</span> {question.explanation}
                      </p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 flex space-x-3">
                  <Button
                    onClick={handleSendAssignment}
                    disabled={isSending}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending Assignment...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Assignment to {candidateName}
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setQuestions([])}
                    className="border-slate-300"
                  >
                    Regenerate
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}