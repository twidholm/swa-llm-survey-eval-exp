import fs from "fs"
import { sum, transpose } from "mathjs" // Optional: Für Matrixoperationen

// Typdefinitionen
interface SurveyResult {
  results: { role: string; content: string }[]
}

// Hilfsfunktion zur Berechnung von Proportion Agreement
function calculateProportionAgreement(responses: number[]): number {
  let totalPairs = 0
  let agreements = 0

  for (let i = 0; i < responses.length; i++) {
    for (let j = i + 1; j < responses.length; j++) {
      totalPairs++
      if (responses[i] === responses[j]) agreements++
    }
  }
  return totalPairs === 0 ? 0 : agreements / totalPairs
}

// Hilfsfunktion zur Berechnung von Cohen's Kappa
function calculateCohensKappa(
  responses1: number[],
  responses2: number[]
): number {
  console.log("Antwort 1: ", responses1)
  console.log("Antwort 2: ", responses2)
  if (responses1.length !== responses2.length) {
    throw new Error("Antwortsätze haben unterschiedliche Längen")
  }

  const n = responses1.length
  let observedAgreement = 0
  const labelCounts: Record<number, number> = {}

  for (let i = 0; i < n; i++) {
    if (responses1[i] === responses2[i]) observedAgreement++
    labelCounts[responses1[i]] = (labelCounts[responses1[i]] || 0) + 1
    labelCounts[responses2[i]] = (labelCounts[responses2[i]] || 0) + 1
  }

  const totalPairs = n
  observedAgreement /= totalPairs

  let expectedAgreement = 0
  const totalLabels = Object.values(labelCounts).reduce((a, b) => a + b, 0)
  for (const label in labelCounts) {
    const proportion = labelCounts[parseInt(label)] / totalLabels
    expectedAgreement += proportion * proportion
  }

  return (observedAgreement - expectedAgreement) / (1 - expectedAgreement)
}

// Hilfsfunktion zur Berechnung von Cramérs V
function calculateCramersV(matrix: number[][]): number {
  console.log("Matrix: ", matrix)

  const total = sum(matrix.flat())
  const rowSums = matrix.map((row) => sum(row))
  const colSums = transpose(matrix).map((row) => sum(row) as number)

  console.log("total: ", total)
  console.log("rowSums: ", rowSums)
  console.log("colSums: ", colSums)

  let chiSquare = 0

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      const expected = (rowSums[i] * colSums[j]) / total
      if (expected === 0) continue // Vermeidet Division durch 0
      chiSquare += Math.pow(matrix[i][j] - expected, 2) / expected
    }
  }

  console.log("chiSquare: ", chiSquare)

  const minDimension = Math.min(matrix.length - 1, matrix[0].length - 1)
  if (minDimension <= 0) {
    console.error("Matrix ist zu klein für die Berechnung von Cramér's V.")
    return NaN
  }

  console.log("minDimension: ", minDimension)

  return Math.sqrt(chiSquare / (total * minDimension))
}
function createContingencyMatrixForHumanAndModel(
  humanResponses: { [key: string]: number },
  modelResponses: { [key: string]: number },
  answerOptions: number[]
): number[][] {
  const matrix: number[][] = Array(answerOptions.length)
    .fill(0)
    .map(() => Array(answerOptions.length).fill(0))

  for (const question in humanResponses) {
    const humanAnswer = humanResponses[question]
    const modelAnswer = modelResponses[question]

    const row = answerOptions.indexOf(humanAnswer)
    const col = answerOptions.indexOf(modelAnswer)

    if (row >= 0 && col >= 0) {
      matrix[row][col]++
    }
  }

  return matrix
}

// Hauptlogik
export async function evaluate() {
  const rawData = fs.readFileSync("results.json", "utf8")
  const data: SurveyResult[] = JSON.parse(rawData)
  console.log(data)
  // Extrahiere Antworten der Modelle
  const allResponses: number[][] = data.map((entry) =>
    entry.results
      .filter((result) => result.role === "assistant")
      .map((result) => parseInt(result.content.trim()))
  )
  console.log(allResponses)
  if (allResponses.length < 2) {
    throw new Error("Nicht genügend Modelle für die Berechnung.")
  }

  // Berechnung von Proportion Agreement
  const proportionAgreement = calculateProportionAgreement(allResponses.flat())

  // Beispielhafte Berechnung von Cohen's Kappa zwischen zwei Modellen
  const cohensKappa = calculateCohensKappa(allResponses[0], allResponses[1])

  // Beispielhafte 2x2-Matrix für Cramérs V (erforderlich: Matrix aus Kontingenztabellen)
  const exampleMatrix: number[][] = [
    [10, 5], // Antworten Ja
    [3, 12], // Antworten Nein
  ]
  const humanResponses = { q1: 1, q2: 3, q3: 2, q4: 4, q5: 2 }
  const modelResponses = { q1: 2, q2: 3, q3: 2, q4: 4, q5: 1 }
  const answerOptions = [1, 2, 3, 4, 5] // Alle möglichen Antwortmöglichkeiten
  const matrix = createContingencyMatrixForHumanAndModel(
    humanResponses,
    modelResponses,
    answerOptions
  )
  const cramersV = calculateCramersV(matrix)

  console.log("Proportion Agrrement: ", proportionAgreement)
  console.log("Cohens Kappa: ", cohensKappa)
  console.log("Cramers V: ", cramersV)
}

// Ausführung
