import { Persona } from "../types/Persona.js"
import { Question } from "../types/Question.js"

export function createQuestionPrompt(question: Question) {
  const prompt = `
      ${question.text}:
      ${question.answer_options.map((option) => {
        option.code
        option.optionText
      })}
    `
  return prompt
}
