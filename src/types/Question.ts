export type Question = {
  id: string
  text: string
  answer_options: Array<AnswerOption>
}
export type AnswerOption = {
  code: number
  optionText: string
}
