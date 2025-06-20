"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, XCircle, Clock, Target, Award, AlertCircle } from 'lucide-react'
import { type MCQQuestion } from '@/lib/gemini'

interface Assignment {
  id: string
  jobTitle: string
  questions: MCQQuestion[]
  duration: number
  passingScore: number
  answers: number[]
  score: number
  passed: boolean
  correctAnswers: number
  totalQuestions: number
  completedAt: string
}

interface AssignmentResultsProps {
  assignment: Assignment
}

export default function AssignmentResults({ assignment }: AssignmentResultsProps) {
  const timeTaken = assignment.duration // You might want to calculate actual time taken

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Results Header */}
      <Card className={`mb-6 border-2 ${assignment.passed ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`}>
        <CardHeader>
          <CardTitle className={`text-2xl flex items-center ${assignment.passed ? 'text-emerald-800' : 'text-red-800'}`}>
            {assignment.passed ? (
              <>
                <Award className="h-8 w-8 mr-3" />
                Congratulations! You Passed
              </>
            ) : (
              <>
                <AlertCircle className="h-8 w-8 mr-3" />
                Assignment Not Passed
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="h-5 w-5 text-blue-600" />
                <span className="font-semibold">Score</span>
              </div>
              <p className={`text-3xl font-bold ${assignment.passed ? 'text-emerald-600' : 'text-red-600'}`}>
                {assignment.score}%
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <span className="font-semibold">Correct</span>
              </div>
              <p className="text-3xl font-bold text-emerald-600">
                {assignment.correctAnswers}/{assignment.totalQuestions}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="h-5 w-5 text-orange-600" />
                <span className="font-semibold">Required</span>
              </div>
              <p className="text-3xl font-bold text-orange-600">
                {assignment.passingScore}%
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-5 w-5 text-purple-600" />
                <span className="font-semibold">Duration</span>
              </div>
              <p className="text-3xl font-bold text-purple-600">
                {assignment.duration}m
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Results */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {assignment.questions.map((question, index) => {
              const userAnswer = assignment.answers[index]
              const isCorrect = userAnswer === question.correctAnswer
              
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    isCorrect ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-lg">
                      Q{index + 1}. {question.question}
                    </h3>
                    {isCorrect ? (
                      <CheckCircle className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    {question.options.map((option, optIndex) => {
                      let className = 'p-3 rounded border text-sm '
                      
                      if (optIndex === question.correctAnswer) {
                        className += 'border-emerald-500 bg-emerald-100 text-emerald-800 font-semibold'
                      } else if (optIndex === userAnswer && userAnswer !== question.correctAnswer) {
                        className += 'border-red-500 bg-red-100 text-red-800'
                      } else {
                        className += 'border-slate-200 bg-slate-50 text-slate-700'
                      }

                      return (
                        <div key={optIndex} className={className}>
                          <span className="font-semibold mr-2">
                            {String.fromCharCode(65 + optIndex)}.
                          </span>
                          {option}
                          {optIndex === question.correctAnswer && (
                            <span className="ml-2 text-emerald-600">✓ Correct</span>
                          )}
                          {optIndex === userAnswer && userAnswer !== question.correctAnswer && (
                            <span className="ml-2 text-red-600">✗ Your Answer</span>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  <div className="bg-white p-3 rounded border border-slate-200">
                    <p className="text-sm text-slate-700">
                      <span className="font-semibold">Explanation:</span> {question.explanation}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}