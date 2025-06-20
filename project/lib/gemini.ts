import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyC6lMABvwQkmzRRBpfia8ybpw1ZNq0-o34');

export interface MCQQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Assignment {
  id: string;
  jobTitle: string;
  jobDescription: string;
  questions: MCQQuestion[];
  createdAt: string;
  duration: number; // in minutes
  passingScore: number; // percentage
}

export async function generateAssignment(jobTitle: string, jobDescription: string, requirements: string[]): Promise<MCQQuestion[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
Generate 10 multiple choice questions for a ${jobTitle} position based on the following job description and requirements:

Job Description: ${jobDescription}

Requirements: ${requirements.join(', ')}

Please generate exactly 10 MCQ questions that test:
- Technical knowledge relevant to the role
- Problem-solving abilities
- Best practices in the field
- Practical application of skills

For each question, provide:
1. A clear, specific question
2. 4 multiple choice options (A, B, C, D)
3. The correct answer (0-3 index)
4. A brief explanation of why the answer is correct

Format the response as a JSON array with this structure:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Explanation of why this answer is correct"
  }
]

Make sure questions are practical, relevant, and at an appropriate difficulty level for the position.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }
    
    const questions: MCQQuestion[] = JSON.parse(jsonMatch[0]);
    
    // Validate the response
    if (!Array.isArray(questions) || questions.length !== 10) {
      throw new Error('Invalid number of questions generated');
    }
    
    // Validate each question
    questions.forEach((q, index) => {
      if (!q.question || !Array.isArray(q.options) || q.options.length !== 4 || 
          typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3 ||
          !q.explanation) {
        throw new Error(`Invalid question format at index ${index}`);
      }
    });
    
    return questions;
  } catch (error) {
    console.error('Error generating assignment:', error);
    throw new Error('Failed to generate assignment. Please try again.');
  }
}