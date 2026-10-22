export interface QuizQuestion {
  id: number
  question: string
  options: string[]
  answerIndex: number
}

export const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']


export const seedQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    answerIndex: 2,
  },
  {
    id: 2,
    question: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    answerIndex: 1,
  },
  {
    id: 3,
    question: 'What is the largest ocean on Earth?',
    options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
    answerIndex: 3,
  },
  {
    id: 4,
    question: 'What is the chemical symbol for gold?',
    options: ['Go', 'Gd', 'Au', 'Ag'],
    answerIndex: 2,
  },
  {
    id: 5,
    question: 'Who wrote “Pride and Prejudice”?',
    options: ['Charlotte Brontë', 'Jane Austen', 'Mary Shelley', 'George Eliot'],
    answerIndex: 1,
  },
]

export function optionLabel(question: QuizQuestion, index: number): string {
  const letter = OPTION_LETTERS[index] ?? '?'
  const option = question.options[index] ?? ''
  return `${letter}. ${option}`
}

export function formatOptions(question: QuizQuestion): string {
  return question.options
    .map((_, index) => optionLabel(question, index))
    .join('　')
}

export function answerLabel(question: QuizQuestion): string {
  return optionLabel(question, question.answerIndex)
}
