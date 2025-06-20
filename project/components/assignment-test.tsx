"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, CheckCircle, AlertCircle, Send } from 'lucide-react'
import { ref, update } from 'firebase/database'
import { database } from '@/lib/firebase'
import { type MCQQuestion } from '@/lib/gemini'

interface Assignment {
  id: string
  jobId: string
  jobTitle: string
  jobDescription: string
  candidateId: string
  candidateName: string
  candidateEmail: string
  questions: MCQQuestion[]
  duration: number
  passingScore: number
  status: 'pending' | 'in-progress' | 'completed'
  createdAt: string
  startedAt?: string
  completedAt?: string
  answers?: number[]
  score?: number
  passed?: boolean
}

interface AssignmentTestProps {
  assignment: Assignment
  onComplete: () => void
}

export default function AssignmentTest({ assignment, onComplete }: AssignmentTestProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>(new Array(assignment.questions.length).fill(-1))
  const [timeLeft, setTimeLeft] = useState(assignment.duration * 60) // Convert to seconds
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    if (!hasStarted) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmitAssignment()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [hasStarted])

  const startAssignment = async () => {
    setHasStarted(true)
    try {
      const assignmentRef = ref(database, `assignments/${assignment.id}`)
      await update(assignmentRef, {
        status: 'in-progress',
        startedAt: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Error starting assignment:', error)
    }
  }

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answerIndex
    setAnswers(newAnswers)
  }

  const handleSubmitAssignment = async () => {
    setIsSubmitting(true)
    try {
      // Calculate score
      let correctAnswers = 0
      assignment.questions.forEach((question, index) => {
        if (answers[index] === question.correctAnswer) {
          correctAnswers++
        }
      })

      const score = Math.round((correctAnswers / assignment.questions.length) * 100)
      const passed = score >= assignment.passingScore

      const assignmentRef = ref(database, `assignments/${assignment.id}`)
      await update(assignmentRef, {
        status: 'completed',
        completedAt: new Date().toISOString(),
        answers,
        score,
        passed,
        correctAnswers,
        totalQuestions: assignment.questions.length,
      })

      onComplete()
    } catch (error) {
      console.error('Error submitting assignment:', error)
      alert('Error submitting assignment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const answeredQuestions = answers.filter(answer => answer !== -1).length

  if (!hasStarted) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800 text-2xl">
              Assignment: {assignment.jobTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold">Duration</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-800">{assignment.duration} minutes</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold">Questions</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-800">{assignment.questions.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold">Passing Score</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-800">{assignment.passingScore}%</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-blue-200">
                <h3 className="font-bold text-lg mb-3">Instructions:</h3>
                <ul className="space-y-2 text-slate-700">
                  <li>• You have {assignment.duration} minutes to complete this assignment</li>
                  <li>• There are {assignment.questions.length} multiple choice questions</li>
                  <li>• You need to score at least {assignment.passingScore}% to pass</li>
                  <li>• Once you start, the timer cannot be paused</li>
                  <li>• Make sure you have a stable internet connection</li>
                  <li>• Click "Submit Assignment" when you're done or time runs out</li>
                </ul>
              </div>

              <Button
                onClick={startAssignment}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg"
              >
                Start Assignment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Timer and Progress */}
      <Card className="mb-6 border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <span className="font-semibold">Time Left:</span>
                <span className={`text-xl font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-orange-600'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <div className="text-slate-600">
                Question {currentQuestion + 1} of {assignment.questions.length}
              </div>
            </div>
            <div className="text-slate-600">
              Answered: {answeredQuestions}/{assignment.questions.length}
            </div>
          </div>
          <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-orange-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / assignment.questions.length) * 100}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      {/* Question */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">
            Question {currentQuestion + 1}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-semibold mb-6 leading-relaxed">
            {assignment.questions[currentQuestion].question}
          </h3>
          
          <div className="space-y-3">
            {assignment.questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  answers[currentQuestion] === index
                    ? 'border-blue-500 bg-blue-50 text-blue-800'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className="font-semibold mr-3">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          className="border-slate-300"
        >
          Previous
        </Button>

        <div className="flex space-x-2">
          {assignment.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-8 h-8 rounded-full text-sm font-semibold ${
                index === currentQuestion
                  ? 'bg-blue-600 text-white'
                  : answers[index] !== -1
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {currentQuestion === assignment.questions.length - 1 ? (
          <Button
            onClick={handleSubmitAssignment}
            disabled={isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isSubmitting ? (
              'Submitting...'
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Assignment
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={() => setCurrentQuestion(Math.min(assignment.questions.length - 1, currentQuestion + 1))}
            disabled={currentQuestion === assignment.questions.length - 1}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Next
          </Button>
        )}
      </div>
    </div>
  )
}