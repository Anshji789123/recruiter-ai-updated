"use client"

import { useState, useEffect } from "react"
import { ref, push, update, onValue } from "firebase/database"
import { database } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { v4 as uuidv4 } from 'uuid'

interface AIAssignmentProps {
  jobRole: string
  candidateId: string
  jobId: string
  onComplete: (assignment: any) => void
}

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: string
}

export default function AIAssignmentGenerator({
  jobRole,
  candidateId,
  jobId,
  onComplete
}: AIAssignmentProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAssignment, setShowAssignment] = useState(false)

  const generateQuestions = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Generate 10 multiple choice questions for a ${jobRole} role. Each question should have 4 options (A, B, C, D) and a clear correct answer. Format the response as JSON with the following structure: {"questions": [{"question": "", "options": ["A.", "B.", "C.", "D."], "correctAnswer": ""}]}`
                }
              ]
            }
          ]
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate questions')
      }

      const data = await response.json()
      const questionsData = JSON.parse(data.candidates[0].content.parts[0].text)
      setQuestions(questionsData.questions)
      setShowAssignment(true)
    } catch (err) {
      setError('Failed to generate questions. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (answers: Record<string, string>) => {
    const correctCount = questions.reduce((count, q) => {
      return count + (answers[q.id] === q.correctAnswer ? 1 : 0)
    }, 0)

    const score = (correctCount / questions.length) * 100
    const passed = score >= 70

    const assignmentId = uuidv4()
    const assignment = {
      id: assignmentId,
      jobId,
      jobRole,
      candidateId,
      status: 'completed',
      score,
      passed,
      correctAnswers: correctCount,
      totalQuestions: questions.length,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    }

    try {
      await update(ref(database, `assignments/${assignmentId}`), assignment)
      onComplete(assignment)
    } catch (error) {
      console.error('Failed to save assignment:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {!showAssignment ? (
        <Button onClick={generateQuestions}>
          Generate AI Assignment
        </Button>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Generated Assignment</h3>
          <div className="space-y-4">
            {questions.map((q) => (
              <div key={q.id} className="space-y-2">
                <p className="font-medium">{q.question}</p>
                {['A', 'B', 'C', 'D'].map((option, index) => (
                  <label key={option} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      value={option}
                      className="h-4 w-4"
                    />
                    <span>{option}. {q.options[index]}</span>
                  </label>
                ))}
              </div>
            ))}
          </div>
          <Button onClick={() => handleSubmit({})}>
            Submit Assignment
          </Button>
        </div>
      )}
    </div>
  )
}
