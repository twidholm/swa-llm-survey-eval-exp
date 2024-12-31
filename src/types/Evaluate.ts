export type QuestionMetrics = {
  proportionAgreement: number
  cohensKappa: number
  cramersV: number
}

export type ComparisonResults = {
  [questionId: string]: QuestionMetrics
}
// Typdefinitionen
export interface SurveyResult {
  results: Array<{ role: "user" | "assistant"; content: string }>
  modeltype: number
}

export interface QuestionAverage {
  questionId: string
  averageDistribution: { [key: string]: number }
}

export interface ModelAverages {
  [modeltype: number]: QuestionAverage[]
}
