import dotenv from "dotenv"

import { PersonaModelResult, Result } from "../types/Result.js"
import { ModelType } from "../types/ModelType.js"
import { createModel } from "../functions/createModel.js"
import { Persona } from "../types/Persona.js"
import { Question } from "../types/Question.js"

dotenv.config()

class Survey {
  private surveyResults: Array<PersonaModelResult> = []
  private questions: Array<Question>
  private personas: Array<Persona>
  constructor(personas: Array<Persona>, questions: Array<Question>) {
    this.personas = personas
    this.questions = questions
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
    for (const persona of this.personas) {
      for (let i = 0; i <= 3; i++) {
        const modelType = i as ModelType
        const model = createModel(modelType)
        model.setPersona(persona)
        await model.initPersona(this.questions.length)
        for (const question of this.questions) {
          await model.generateResponse(question)
        }
        const modelResults = model.getResults() as Array<Result>
        console.log("Results", modelResults)
        this.addResult(modelResults, modelType, persona)
      }
    }
  }
}

export default Survey
