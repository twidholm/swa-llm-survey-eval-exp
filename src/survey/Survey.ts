import dotenv from "dotenv"
import { Persona, personas } from "../types/Personas.js"
import { questions } from "../types/Questions.js"
import Model from "../ai-services/model.js"
import Claude_Ai from "../ai-services/claude-3.js"
import Gemini_Ai from "../ai-services/gemini-1.5.js"
import Gpt_Ai from "../ai-services/gpt-4o.js"
import Grok_Ai from "../ai-services/grok-2.js"
import { PersonaModelResult, Result } from "../types/Result.js"
import { ModelType } from "../types/ModelType.js"

dotenv.config()

class Survey {
  private surveyResults: Array<PersonaModelResult> = []
  constructor() {}
  private createModel(modelType: ModelType): Model {
    switch (modelType) {
      case ModelType.Claude:
        return new Claude_Ai(modelType)
      case ModelType.Gemini:
        return new Gemini_Ai(modelType) // Implementiere Gemini_Ai separat
      case ModelType.GPT:
        return new Gpt_Ai(modelType) // Implementiere Gpt_Ai separat
      case ModelType.Grok:
        return new Grok_Ai(modelType) // Implementiere Grok_Ai separat
      default:
        throw new Error("Unknown model type")
    }
  }
  private addResult(modelResults, modelType, persona) {
    this.surveyResults.push({
      results: modelResults,
      modeltype: modelType,
      persona,
    })
  }
  public getSurveyResults() {
    return this.surveyResults
  }
  async run() {
    for (const persona of personas) {
      //10 Personas
      for (let i = 0; i <= 3; i++) {
        // 4 Models
        const modelType = i as ModelType
        const model = this.createModel(modelType)
        model.setPersona(persona)

        for (const question of questions) {
          model.generateResponse(question)
        }
        const modelResults = model.getResults() as Array<Result>
        this.addResult(modelResults, modelType, persona)
      }
    }
  }
}

export default Survey
