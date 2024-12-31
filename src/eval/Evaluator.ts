import fs from "fs"

import {
  human_results,
  HumanResult,
} from "../data/data_set_human_results/human_results.js"
import {
  ComparisonResults,
  ModelAverages,
  QuestionAverage,
  SurveyResult,
} from "../types/Evaluate.js"
import { calculateProportionAgreement } from "./eval-functions/proportion-agreement.js"
import { calculateCohensKappa } from "./eval-functions/kappa.js"
import { calculateCramersV } from "./eval-functions/cramer-v.js"
import {
  calculateAverage,
  calculateAveragePerTopic,
  Topics,
} from "./eval-functions/calculateAverages.js"

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
      percentages[a.code - 1] = Number(a.percentage)
    })

    formatted[human.questionId] = percentages
  })
  return formatted
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

function calculateModelDist(data: SurveyResult[]): ModelAverages {
  const modelAggregates: {
    [modeltype: number]: { [questionId: string]: { [answer: string]: number } }
  } = {}
  const modelCounts: { [modeltype: number]: { [questionId: string]: number } } =
    {}

  data.forEach((entry) => {
    const modeltype = entry.modeltype

    if (!modelAggregates[modeltype]) {
      modelAggregates[modeltype] = {}
      modelCounts[modeltype] = {}
    }

    let currentQuestionId: string | null = null

    entry.results.forEach((result) => {
      // Wenn es eine "user"-Frage ist, finde die entsprechende questionId
      if (result.role === "user") {
        const matchedQuestion = compareQuestion(result.content)
        if (matchedQuestion) {
          currentQuestionId = matchedQuestion.questionId
        } else {
          currentQuestionId = null
        }
      }

      // Wenn es eine "assistant"-Antwort ist, benutze die gespeicherte Frage-ID
      if (result.role === "assistant" && currentQuestionId) {
        const answer = result.content.trim()

        // Initialisiere die Strukturen für die Frage
        if (!modelAggregates[modeltype][currentQuestionId]) {
          modelAggregates[modeltype][currentQuestionId] = {}
          modelCounts[modeltype][currentQuestionId] = 0
        }

        // Antwort aggregieren
        modelAggregates[modeltype][currentQuestionId][answer] =
          (modelAggregates[modeltype][currentQuestionId][answer] || 0) + 1

        // Zähle die Gesamtzahl der Antworten für diese Frage
        modelCounts[modeltype][currentQuestionId]++
      }
    })
  })

  // Berechnung der durchschnittlichen Verteilungen
  const averages: ModelAverages = {}

  Object.entries(modelAggregates).forEach(([modeltype, questions]) => {
    averages[parseInt(modeltype)] = Object.entries(questions).map(
      ([questionId, answers]) => {
        const totalAnswers = modelCounts[parseInt(modeltype)][questionId]
        const averageDistribution: { [key: string]: number } = {}

        // Prozentwerte berechnen
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

function compareQuestion(content: string): { questionId: string } | null {
  const match = content.match(/Q\d+/)

  if (match) {
    return { questionId: match[0] }
  }

  return null
}

function compareModelsWithHumans(
  modelResults: Array<QuestionAverage>,
  humanResults: HumanResult[]
) {
  const formattedModels = formatModelResults(modelResults, humanResults)
  const formattedHumans = formatHumanResults(humanResults)
  const comparisonResults: ComparisonResults = {}

  Object.keys(formattedModels).forEach((questionId) => {
    if (formattedHumans[questionId]) {
      const model = formattedModels[questionId]
      const human = formattedHumans[questionId]

      comparisonResults[questionId] = {
        proportionAgreement: calculateProportionAgreement(model, human),
        cohensKappa: calculateCohensKappa(model, human),
        cramersV: calculateCramersV(model, human),
      }
    }
  })

  return comparisonResults
}

export async function evaluate() {
  const fileNames = [
    "results_0_model.json",
    "results_1_model.json",
    "results_2_model.json",
    "results_3_model.json",
  ]

  let data: SurveyResult[] = []

  for (const file of fileNames) {
    try {
      const rawFileData = fs.readFileSync(file, "utf8")
      const fileData: SurveyResult[] = JSON.parse(rawFileData)

      fileData.forEach((person) => {
        const formattedPerson: SurveyResult = {
          modeltype: person.modeltype,
          results: person.results.slice(2, person.results.length - 1), // Filter unnötige Rollen
        }
        data.push(formattedPerson)
      })
    } catch (error) {
      console.error(`Fehler beim Verarbeiten der Datei ${file}:`, error)
    }
  }

  const distributions = calculateModelDist(data)

  for (let i = 0; i <= 3; i++) {
    console.log(`Verarbeite Modelltyp ${i}...`)

    const modelDist = distributions[i]
      ? distributions[i].slice(0, human_results.length)
      : []
    const humanResultsSubset = human_results.slice(0, human_results.length)

    const results = compareModelsWithHumans(modelDist, humanResultsSubset)
    const averages = calculateAverage(results)

    try {
      fs.writeFileSync(
        `averages_results_model_${i}.json`,
        JSON.stringify(averages, null, 2)
      )
    } catch (error) {
      console.error(
        `Fehler beim Speichern von averages_results_model_${i}.json:`,
        error
      )
    }

    const topicAverages = []
    for (const topic of Topics) {
      const averagePerTopic = calculateAveragePerTopic(results, [
        topic[0],
        topic[1],
      ])
      topicAverages.push({ averagePerTopic, topic })
    }

    try {
      fs.writeFileSync(
        `topic_averages_results_model_${i}.json`,
        JSON.stringify(topicAverages, null, 2)
      )
    } catch (error) {
      console.error(
        `Fehler beim Speichern von topic_averages_results_model_${i}.json:`,
        error
      )
    }
  }
}
