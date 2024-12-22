import { human_results } from "../data/data_set_human_results/human_results.js"
import { questions } from "../data/data_set_questions/questions.js"

export type TestError = {
  questionid: string
  errorText: string
}

export function testQuestionsToResults(): Array<TestError> {
  const Errors: Array<TestError> = []

  for (const result of human_results) {
    const foundQuestion = questions.find((question) =>
      question.id.includes(result.questionId)
    )

    if (!foundQuestion) {
      Errors.push({
        questionid: result.questionId,
        errorText: "Result element has no matching question element",
      })
      continue // Keine weiteren Tests, wenn die Frage nicht existiert
    }

    if (
      foundQuestion.answer_options?.length !== result.answerdistribution?.length
    ) {
      Errors.push({
        questionid: result.questionId,
        errorText: `Mismatched answer option count: Question has ${foundQuestion.answer_options?.length}, Result has ${result.answerdistribution?.length}`,
      })
    }

    for (const answerOption of foundQuestion.answer_options || []) {
      const foundCode = result.answerdistribution?.find(
        (dist) => dist.code === answerOption.code
      )
      if (!foundCode) {
        Errors.push({
          questionid: result.questionId,
          errorText: `Missing answer code: ${answerOption.code}`,
        })
      }
    }
  }

  return Errors
}
