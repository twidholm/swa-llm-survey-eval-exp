import { ComparisonResults, QuestionMetrics } from "../../types/Evaluate.js"

// export enum Topics {
//   SocialValues = [1, 45],
//   Wellfare,
//   Trust,
//   EconomicValues,
//   Corruption,
//   Migration,
//   Security,
//   PostmaterialValues,
//   EconomicTech,
//   ReligousValues,
//   EthicValues,

// }

const SocialValues = [1, 45]
const Wellfare = [46, 56]
const Trust = [57, 105]
const EconomicValues = [106, 111]
const Corruption = [112, 120]
const Migration = [121, 130]
const Security = [131, 151]
const PostmaterialValues = [152, 157]
const EconomicTech = [158, 163]
const ReligousValues = [164, 175]
const EthicValues = [176, 198]
const PoliticalInterest = [199, 234]
const PoliticalCulture = [235, 259]
const Demographics = [260, 289]
export const Topics = [
  SocialValues,
  Wellfare,
  Trust,
  EconomicValues,
  Corruption,
  Migration,
  Security,
  PostmaterialValues,
  EconomicTech,
  ReligousValues,
  EthicValues,
  PoliticalInterest,
  PoliticalCulture,
  Demographics,
]

export function calculateAverage(results: ComparisonResults) {
  let totalProportionAgreement = 0
  let totalCohensKappa = 0
  let totalCramersV = 0

  let countProportionAgreement = 0
  let countCohensKappa = 0
  let countCramersV = 0

  for (const key in results) {
    const metrics = results[key]

    // Null als 0 behandeln für proportionAgreement
    totalProportionAgreement += metrics.proportionAgreement ?? 0
    countProportionAgreement++

    // Null als 0 behandeln für cohensKappa
    totalCohensKappa += metrics.cohensKappa ?? 0
    countCohensKappa++

    // Null als 0 behandeln für cramersV
    totalCramersV += metrics.cramersV ?? 0
    countCramersV++
  }

  return {
    averageProportionAgreement:
      countProportionAgreement > 0
        ? parseFloat(
            (totalProportionAgreement / countProportionAgreement).toFixed(3)
          )
        : 0,
    averageCohensKappa:
      countCohensKappa > 0
        ? parseFloat((totalCohensKappa / countCohensKappa).toFixed(3))
        : 0,
    averageCramersV:
      countCramersV > 0
        ? parseFloat((totalCramersV / countCramersV).toFixed(3))
        : 0,
  }
}

export function calculateAveragePerTopic(
  results: ComparisonResults,
  interval: [number, number]
) {
  const start = interval[0]
  const end = interval[1]

  let totalProportionAgreement = 0
  let totalCohensKappa = 0
  let totalCramersV = 0

  let countProportionAgreement = 0
  let countCohensKappa = 0
  let countCramersV = 0

  // Hole alle Schlüssel in ein Array und sortiere nach den Q-Indizes
  const sortedKeys = Object.keys(results)
    .filter((key) => /^Q\d+/.test(key)) // Nur gültige Q-Ids berücksichtigen
    .sort((a, b) => {
      const aIndex = parseInt(a.match(/^Q(\d+)/)?.[1] || "0", 10)
      const bIndex = parseInt(b.match(/^Q(\d+)/)?.[1] || "0", 10)
      return aIndex - bIndex
    })

  // Finde die Indizes der Start- und Endwerte im sortierten Array
  const startIndex = sortedKeys.findIndex((key) => {
    const questionNumber = parseInt(key.match(/^Q(\d+)/)?.[1] || "0", 10)
    return questionNumber === start
  })

  let endIndex = sortedKeys.findIndex((key) => {
    const questionNumber = parseInt(key.match(/^Q(\d+)/)?.[1] || "0", 10)
    return questionNumber === end
  })

  if (endIndex === -1) {
    endIndex = sortedKeys.length - 1
  }
  if (startIndex === -1 || startIndex > endIndex) {
    throw new Error(
      "Invalid interval: Start or end question ID not found or out of order."
    )
  }

  // Iteriere nur über die relevanten Indizes
  for (let i = startIndex; i <= endIndex; i++) {
    const key = sortedKeys[i]
    const metrics = results[key]

    // Summiere proportionAgreement
    if (metrics.proportionAgreement !== null) {
      totalProportionAgreement += metrics.proportionAgreement
      countProportionAgreement++
    }

    // Summiere cohensKappa
    if (metrics.cohensKappa !== null) {
      totalCohensKappa += metrics.cohensKappa
      countCohensKappa++
    }

    // Summiere cramersV
    if (metrics.cramersV !== null) {
      totalCramersV += metrics.cramersV
      countCramersV++
    }
  }

  return {
    averageProportionAgreement:
      countProportionAgreement > 0
        ? parseFloat(
            (totalProportionAgreement / countProportionAgreement).toFixed(3)
          )
        : 0,
    averageCohensKappa:
      countCohensKappa > 0
        ? parseFloat((totalCohensKappa / countCohensKappa).toFixed(3))
        : 0,
    averageCramersV:
      countCramersV > 0
        ? parseFloat((totalCramersV / countCramersV).toFixed(3))
        : 0,
  }
}
