import fs from "fs"
import { sum, transpose } from "mathjs" // Optional: Für Matrixoperationen
import { PersonaModelResult } from "../types/Result.js"
import { ModelType } from "../types/ModelType.js"
import { human_results } from "../data/data_set_human_results/human_results.js"

// Typdefinitionen
interface SurveyResult {
  results: { role: string; content: string }[]
  modeltype: number
}

interface QuestionAverage {
  questionId: string
  averageDistribution: { [key: string]: number }
}

interface ModelAverages {
  [modeltype: number]: QuestionAverage[]
}
type HumanResult = {
  questionId: string
  answerdistribution: Array<{ code: string; percentage: number }>
}
function formatHumanResults(humans: HumanResult[]): {
  [key: string]: number[]
} {
  const formatted: { [key: string]: number[] } = {}
  humans.forEach((human) => {
    const maxCode = Math.max(
      ...human.answerdistribution.map((a) => Number(a.code))
    )
    const percentages: number[] = Array(maxCode).fill(0)

    human.answerdistribution.forEach((a) => {
      percentages[Number(a.code) - 1] = a.percentage
    })

    formatted[human.questionId] = percentages
  })
  return formatted
}

// Proportion Agreement
function calculateProportionAgreement(
  model: number[],
  human: number[]
): number {
  let agreements = 0
  for (let i = 0; i < model.length; i++) {
    if (Math.round(model[i]) === Math.round(human[i])) agreements++
  }
  return agreements / model.length
}

// Cohen's Kappa
function calculateCohensKappa(model: number[], human: number[]): number {
  const total = model.reduce((a, b) => a + b, 0)
  const observed =
    model.reduce((sum, val, i) => sum + Math.min(val, human[i]), 0) / total

  const modelProp = model.map((v) => v / total)
  const humanProp = human.map((v) => v / total)
  const expected = modelProp.reduce((sum, p, i) => sum + p * humanProp[i], 0)

  return (observed - expected) / (1 - expected)
}

// Cramér's V
function calculateCramersV(model: number[], human: number[]): number {
  const total = sum(model) + sum(human)
  const matrix = [model, human]

  const rowSums = matrix.map((row) => sum(row))
  const colSums = transpose(matrix).map((col) => sum(col as number[]))

  let chiSquare = 0
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      const expected = (rowSums[i] * colSums[j]) / total
      chiSquare += expected
        ? Math.pow(matrix[i][j] - expected, 2) / expected
        : 0
    }
  }

  const minDim = Math.min(matrix.length - 1, matrix[0].length - 1)
  return Math.sqrt(chiSquare / (total * minDim))
}

// Umformatierung der Modellresultate
function formatModelResults(
  models: {
    questionId: string
    averageDistribution: { [key: string]: number }
  }[],
  humanResults: Array<HumanResult>
): { [key: string]: number[] } {
  const formatted: { [key: string]: number[] } = {}

  models.forEach((model) => {
    const { questionId, averageDistribution } = model

    const humanResult = humanResults.find((hr) => hr.questionId === questionId)
    const numOptions = humanResult?.answerdistribution.length

    const percentages: number[] = new Array(numOptions).fill(0)
    if (numOptions) {
      // Fülle die vorhandenen Antwortverteilungen ein
      Object.entries(averageDistribution).forEach(([code, percentage]) => {
        const index = Number(code) - 1 // 0-basierter Index
        if (index < numOptions) {
          percentages[index] = percentage
        }
      })

      // Speichere die umgewandelte Verteilung für die Frage
      formatted[questionId] = percentages
    }
  })

  return formatted
}

function calculateModelAverages(data: SurveyResult[]): ModelAverages {
  const modelAggregates: {
    [modeltype: number]: { [questionId: string]: { [answer: string]: number } }
  } = {}
  const modelCounts: { [modeltype: number]: { [questionId: string]: number } } =
    {}

  // 1. Antworten aggregieren
  data.forEach((entry) => {
    const modeltype = entry.modeltype

    if (!modelAggregates[modeltype]) {
      modelAggregates[modeltype] = {}
      modelCounts[modeltype] = {}
    }

    entry.results.forEach((result, index) => {
      if (result.role === "user") {
        const questionId = `Q${Math.floor(index / 2) + 1}`
        const answer = entry.results[index + 1]?.content?.trim()

        if (!modelAggregates[modeltype][questionId]) {
          modelAggregates[modeltype][questionId] = {}
          modelCounts[modeltype][questionId] = 0
        }

        modelAggregates[modeltype][questionId][answer] =
          (modelAggregates[modeltype][questionId][answer] || 0) + 1

        modelCounts[modeltype][questionId] += 1
      }
    })
  })

  // 2. Prozentwerte berechnen
  const averages: ModelAverages = {}

  Object.entries(modelAggregates).forEach(([modeltype, questions]) => {
    averages[parseInt(modeltype)] = Object.entries(questions).map(
      ([questionId, answers]) => {
        const totalAnswers = modelCounts[parseInt(modeltype)][questionId]
        const averageDistribution: { [key: string]: number } = {}
        Object.entries(answers).forEach(([answer, count]) => {
          averageDistribution[answer] = parseFloat(
            ((count / totalAnswers) * 100).toFixed(2)
          )
        })

        return { questionId, averageDistribution }
      }
    )
  })

  return averages
}
function calculateModelAverages2(data: SurveyResult[]): ModelAverages {
  const modelAggregates: {
    [modeltype: number]: { [questionId: string]: { [answer: string]: number } }
  } = {}
  const modelCounts: { [modeltype: number]: { [questionId: string]: number } } =
    {}

  // 1. Antworten aggregieren über alle Personas eines Modeltypes
  data.forEach((entry) => {
    const modeltype = entry.modeltype

    if (!modelAggregates[modeltype]) {
      modelAggregates[modeltype] = {}
      modelCounts[modeltype] = {}
    }

    entry.results.forEach((result, index) => {
      // Nur Antworten von der Rolle "assistant" zählen
      if (result.role === "assistant") {
        const questionId = `Q${Math.floor(index / 2) + 1}`
        const answer = result.content.trim()

        // Initialisiere die Strukturen für die Frage
        if (!modelAggregates[modeltype][questionId]) {
          modelAggregates[modeltype][questionId] = {}
          modelCounts[modeltype][questionId] = 0
        }

        // Antwort aggregieren
        modelAggregates[modeltype][questionId][answer] =
          (modelAggregates[modeltype][questionId][answer] || 0) + 1

        // Zähle die Gesamtzahl der Antworten für diese Frage
        modelCounts[modeltype][questionId] += 1
      }
    })
  })

  // 2. Prozentwerte berechnen
  const averages: ModelAverages = {}

  Object.entries(modelAggregates).forEach(([modeltype, questions]) => {
    averages[parseInt(modeltype)] = Object.entries(questions).map(
      ([questionId, answers]) => {
        const totalAnswers = modelCounts[parseInt(modeltype)][questionId]
        const averageDistribution: { [key: string]: number } = {}

        // Berechne den Prozentwert pro Antwort
        Object.entries(answers).forEach(([answer, count]) => {
          averageDistribution[answer] = parseFloat(
            ((count / totalAnswers) * 100).toFixed(2)
          )
        })

        return { questionId, averageDistribution }
      }
    )
  })

  return averages
}

function compareModelsWithHumans(
  modelResults: ModelAverages,
  humanResults: HumanResult[]
) {
  const formattedModels = formatModelResults(modelResults, humanResults)
  const formattedHumans = formatHumanResults(humanResults)
  const comparisonResults: any = {}

  Object.keys(formattedModels).forEach((questionId) => {
    if (formattedHumans[questionId]) {
      // console.log("Question Id", questionId)
      const model = formattedModels[questionId]
      const human = formattedHumans[questionId]
      // console.log("Model", model)
      // console.log("Human", human)
      comparisonResults[questionId] = {
        proportionAgreement: calculateProportionAgreement(model, human),
        cohensKappa: calculateCohensKappa(model, human),
        cramersV: calculateCramersV(model, human),
      }
    }
  })

  return comparisonResults
}
// Hauptlogik
export async function evaluate() {
  const rawData = fs.readFileSync("results.json", "utf8")
  const data: SurveyResult[] = JSON.parse(rawData)
  // console.log(data)
  data.forEach((entry) => {
    const modeltype = entry.modeltype
    console.log(modeltype)
  })
  const distributions = calculateModelAverages2(data)
  // console.log(distributions)
  for (let i = 0; i <= 3; i++) {
    const modeldist = distributions[i]
    // console.log(modeldist)
    const newModeldist = modeldist.slice(0, 5)
    const humanResults = human_results.slice(0, 5)
    const results = compareModelsWithHumans(newModeldist, humanResults)
    console.log(JSON.stringify(results, null, 2))
  }
}

// Ausführung
