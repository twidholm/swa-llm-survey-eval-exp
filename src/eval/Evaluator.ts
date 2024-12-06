import { questions } from "../data/data_set_questions/questions.js"
import { PersonaModelResult } from "../types/Result.js"

class Evaluator {
  constructor(private results: Array<PersonaModelResult>) {}

  private getResponsesByQuestion(questionId: string): Array<string> {
    return this.results.map(
      (result) =>
        result.results.find((r) => r.questionId === questionId)
          ?.responseOption || ""
    )
  }

  calculateProportionAgreement(): number {
    let totalAgreements = 0
    let totalComparisons = 0

    for (const question of questions) {
      const responses = this.getResponsesByQuestion(question.id)

      for (let i = 0; i < responses.length; i++) {
        for (let j = i + 1; j < responses.length; j++) {
          if (responses[i] === responses[j]) {
            totalAgreements++
          }
          totalComparisons++
        }
      }
    }
    return totalComparisons > 0 ? totalAgreements / totalComparisons : 0
  }

  calculateCohensKappa(): number {
    let totalObservedAgreement = 0
    let totalExpectedAgreement = 0
    const totalComparisons = this.results.length * questions.length

    // Erstelle eine Häufigkeitstabelle (Contingency Table)
    const responseFrequencies: Record<string, number> = {}
    const pairs: Record<string, number> = {}

    for (const question of questions) {
      const responses = this.getResponsesByQuestion(question.id)
      responses.forEach((response) => {
        responseFrequencies[response] = (responseFrequencies[response] || 0) + 1
      })

      for (let i = 0; i < responses.length; i++) {
        for (let j = i + 1; j < responses.length; j++) {
          const pair = `${responses[i]}-${responses[j]}`
          pairs[pair] = (pairs[pair] || 0) + 1
          if (responses[i] === responses[j]) {
            totalObservedAgreement++
          }
        }
      }
    }

    // Berechne erwartete Übereinstimmung
    const totalResponses = Object.values(responseFrequencies).reduce(
      (a, b) => a + b,
      0
    )
    for (const count of Object.values(responseFrequencies)) {
      const proportion = count / totalResponses
      totalExpectedAgreement += proportion * proportion
    }

    // Cohen's Kappa
    const observedAgreement = totalObservedAgreement / totalComparisons
    const expectedAgreement = totalExpectedAgreement / totalComparisons

    return (observedAgreement - expectedAgreement) / (1 - expectedAgreement)
  }

  calculateCramersV(): number {
    const responseMatrix: Record<string, Record<string, number>> = {}

    for (const question of questions) {
      const responses = this.getResponsesByQuestion(question.id)

      for (let i = 0; i < responses.length; i++) {
        for (let j = 0; j < responses.length; j++) {
          if (!responseMatrix[responses[i]]) responseMatrix[responses[i]] = {}
          if (!responseMatrix[responses[i]][responses[j]])
            responseMatrix[responses[i]][responses[j]] = 0
          responseMatrix[responses[i]][responses[j]]++
        }
      }
    }

    const rowTotals = Object.values(responseMatrix).map((row) =>
      Object.values(row).reduce((sum, val) => sum + val, 0)
    )
    const colTotals = Object.keys(responseMatrix).map((col) =>
      Object.values(responseMatrix).reduce(
        (sum, row) => sum + (row[col] || 0),
        0
      )
    )
    const total = rowTotals.reduce((sum, val) => sum + val, 0)

    let chiSquared = 0
    for (const [rowKey, row] of Object.entries(responseMatrix)) {
      for (const [colKey, value] of Object.entries(row)) {
        const expected = (rowTotals[rowKey] * colTotals[colKey]) / total
        chiSquared += Math.pow(value - expected, 2) / expected
      }
    }

    const minDim = Math.min(
      Object.keys(responseMatrix).length,
      colTotals.length
    )
    return Math.sqrt(chiSquared / (total * (minDim - 1)))
  }

  evaluate() {
    return {
      proportionAgreement: this.calculateProportionAgreement(),
      cohensKappa: this.calculateCohensKappa(),
      cramersV: this.calculateCramersV(),
    }
  }
}

export default Evaluator
