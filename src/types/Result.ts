import { ModelType } from "./ModelType.js"
import { Persona } from "./Personas.js"

export type Result = {
  questionId: string
  responseOption: string
}
export type PersonaModelResult = {
  results: Array<Result>
  modeltype: ModelType
  persona: Persona
}
