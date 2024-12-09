import { Persona } from "../types/Persona.js"
import { Question } from "../types/Question.js"

export function createQuestionPrompt(question: Question) {
  const optionsText = question.answer_options
    .map((option) => `${option.code}: ${option.optionText}`)
    .join(" | ") // Trennt die Optionen mit " | "

  const prompt = `
      ${question.text}:
      ${optionsText}
    `
  return prompt.trim() // Entfernt unnötige Leerzeichen am Anfang/Ende
}
