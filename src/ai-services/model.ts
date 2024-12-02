import { ModelType } from "../types/ModelType.js"
import { Question } from "../types/Questions.js"

abstract class Model {
  protected constructor(public modelType: ModelType) {}

  // Abstrakte Methoden, die in den Unterklassen implementiert werden müssen
  abstract generateResponse(question: Question): Promise<any>
  abstract setPersona(persona: any): void
  abstract getPersona(): any
  abstract getResults(): any
}

export default Model
