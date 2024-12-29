import dotenv from "dotenv"
import { PersonaModelResult, Result } from "../types/Result.js"
import { ModelType } from "../types/ModelType.js"
import { createModel } from "../functions/createModel.js"
import { Persona } from "../types/Persona.js"
import { Question } from "../types/Question.js"
import * as cliProgress from "cli-progress"
import * as fs from "fs/promises" // Promisified File Operations
import chalk from "chalk"

dotenv.config()

class Survey {
  private surveyResults: Array<PersonaModelResult> = []
  private questions: Array<Question>
  private personas: Array<Persona>
  private progressBars: cliProgress.MultiBar
  private totalBar: cliProgress.SingleBar
  private personaBar: cliProgress.SingleBar
  private modelBar: cliProgress.SingleBar
  private questionBar: cliProgress.SingleBar
  private modelCount: number = 0

  constructor(personas: Array<Persona>, questions: Array<Question>) {
    this.personas = personas
    this.questions = questions

    // MultiBar für mehrere Fortschrittsbalken initialisieren
    this.progressBars = new cliProgress.MultiBar({
      format: `{name} ${chalk.cyan("{bar}")} | {percentage}% | {value}/{total}`,
      barCompleteChar: "\u2588",
      barIncompleteChar: "\u2591",
      hideCursor: true,
    })

    // Fortschrittsbalken hinzufügen
    this.totalBar = this.progressBars.create(100, 0, { name: "Total Progress" })
    this.personaBar = this.progressBars.create(personas.length, 0, {
      name: "Persona Progress",
    })
    this.modelBar = this.progressBars.create(
      4, // Maximal 4 Modelle
      0,
      { name: "Model Progress" }
    )
    this.questionBar = this.progressBars.create(questions.length, 0, {
      name: "Question Progress",
    })
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

  public async saveResults(modelNumber: string) {
    const jsonString = JSON.stringify(this.surveyResults, null, 2)

    // Heutiges Datum und Uhrzeit in einem Dateinamen-freundlichen Format
    const today = new Date()
    const formattedDate = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
    const formattedTime = `${String(today.getHours()).padStart(
      2,
      "0"
    )}-${String(today.getMinutes()).padStart(2, "0")}-${String(
      today.getSeconds()
    ).padStart(2, "0")}`
    const timestamp = `${formattedDate}_${formattedTime}`

    try {
      // Erstelle den Dateinamen mit sicherem Zeitstempel
      const fileName = `results_${modelNumber}_${timestamp}_model.json`

      // Schreibe die Datei
      await fs.writeFile(fileName, jsonString)
      console.log(
        chalk.green(
          `Die Ergebnisse wurden erfolgreich in "${fileName}" gespeichert.`
        )
      )
    } catch (err) {
      console.error(chalk.red("Fehler beim Speichern der Datei:"), err)
    }
  }

  private async processModel(persona: Persona, modelType: ModelType) {
    const model = createModel(modelType)
    model.setPersona(persona)
    await model.initPersona(this.questions.length)

    for (let i = 0; i < this.questions.length; i++) {
      const question = this.questions[i]
      await model.generateResponse(question)

      // Aktualisiere Question Progress Bar
      this.questionBar.update(i + 1)
    }

    // Aktualisiere Model Progress Bar
    this.modelBar.increment()
    const modelResults = model.getResults() as Array<Result>
    this.addResult(modelResults, modelType, persona)
  }

  public async run(
    modelNumber: string,
    startPersonaIndex: number = 0,
    endPersonaIndex: number = this.personas.length - 1
  ) {
    this.modelCount = modelNumber.includes("all") ? 4 : 1

    // Fortschrittsbalken initialisieren
    this.totalBar.setTotal(
      (endPersonaIndex - startPersonaIndex + 1) *
        this.questions.length *
        this.modelCount
    )
    this.personaBar.setTotal(endPersonaIndex - startPersonaIndex + 1)
    this.modelBar.setTotal(this.modelCount)
    this.questionBar.setTotal(this.questions.length)

    for (
      let personaIndex = startPersonaIndex;
      personaIndex <= endPersonaIndex;
      personaIndex++
    ) {
      const persona = this.personas[personaIndex]
      this.personaBar.update(personaIndex - startPersonaIndex + 1)
      this.modelBar.update(0) // Zurücksetzen für neue Persona
      this.questionBar.update(0) // Zurücksetzen für neue Persona

      const modelTypes = modelNumber.includes("all")
        ? ([0, 1, 2, 3] as Array<ModelType>)
        : ([Number(modelNumber)] as Array<ModelType>)

      for (const modelType of modelTypes) {
        await this.processModel(persona, modelType)

        // Aktualisiere Total Progress Bar
        this.totalBar.increment(this.questions.length)
      }
    }

    // Alle Fortschrittsbalken stoppen
    this.progressBars.stop()
    await this.saveResults(modelNumber)
  }
}

export default Survey
