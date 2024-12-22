import dotenv from "dotenv"

import { PersonaModelResult, Result } from "../types/Result.js"
import { ModelType } from "../types/ModelType.js"
import { createModel } from "../functions/createModel.js"
import { Persona } from "../types/Persona.js"
import { Question } from "../types/Question.js"

import { Db, MongoClient } from "mongodb"
import * as fs from "fs"
dotenv.config()

class Survey {
  private surveyResults: Array<PersonaModelResult> = []
  private questions: Array<Question>
  private personas: Array<Persona>
  // private db: Db
  constructor(personas: Array<Persona>, questions: Array<Question>) {
    this.personas = personas
    this.questions = questions
    // this.db = db
  }

  private addResult(
    modelResults: Array<Result>,
    modelType: ModelType,
    persona: Persona
  ) {
    this.surveyResults.push({
      results: modelResults,
      modeltype: modelType,
      persona,
    })
  }
  public getSurveyResults() {
    return this.surveyResults
  }
  public async saveResults(modelNumber: string) {
    const jsonString = JSON.stringify(this.surveyResults, null, 2)
    try {
      fs.writeFile(`results_${modelNumber}_model.json`, jsonString, (err) => {
        if (err) {
          console.error("Fehler beim Speichern der Datei:", err)
        } else {
          console.log(
            'Die Ergebnisse wurden erfolgreich in "results.json" gespeichert.'
          )
        }
      })
    } catch (error) {
      console.log(error)
    }
  }
  async run(modelNumber: string) {
    if (modelNumber.includes("all")) {
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
    } else {
      for (const persona of this.personas) {
        const modelType = Number(modelNumber) as ModelType
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
    this.saveResults(modelNumber)
  }
}

export default Survey
