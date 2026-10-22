import { reactive } from 'vue'
import { seedQuestions, type QuizQuestion } from './questions'
import { seedUsers, type AdminUser } from './users'

export type { QuizQuestion } from './questions'
export type { AdminUser } from './users'


export const quizStore = reactive({
  users: seedUsers.map((user) => ({ ...user })) as AdminUser[],
  questions: seedQuestions.map((question) => ({
    ...question,
    options: [...question.options],
  })) as QuizQuestion[],
})

export function nextId(rows: { id: number }[]): number {
  return rows.reduce((max, row) => Math.max(max, row.id), 0) + 1
}
