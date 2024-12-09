import dotenv from "dotenv"
import Survey from "./survey/Survey.js"
import Evaluator from "./eval/Evaluator.js"
import { performQuestionQuery } from "./functions/performQuestionQuery.js"
import { questions } from "./data/data_set_questions/questions.js"
import { personas_overall_dist_small } from "./data/data_set_personas/personas_small_overall_german_dist.js"

import { personas_overall_dist_large } from "./data/data_set_personas/personas_large_overall_german_dist.js"
import { personas_poll_dist_small } from "./data/data_set_personas/personas_small.js"
import { personas_poll_dist_large } from "./data/data_set_personas/personas_large_distribution_poll.js"

// .env-Datei laden
dotenv.config()

// Zugriff auf die Umgebungsvariablen
async function main() {
  let continueSurvey = true

  while (continueSurvey) {
    // Frage-Datensatz auswählen
    const questionDatasetResponse = await performQuestionQuery(
      "What question dataset do you want to choose?",
      ["small (10)", "large (full)"]
    )
    const questionDataset = questionDatasetResponse.includes("small")
      ? questions.slice(0, 5)
      : questions

    // Persona-Datensatz auswählen
    const personaDatasetResponse = await performQuestionQuery(
      "What persona dataset do you want to choose?",
      [
        "overall_dist_small",
        "pol_dist_small",
        "overall_dist_large",
        "pol_dist_large",
      ]
    )
    let personaDataset
    switch (personaDatasetResponse) {
      case "overall_dist_small":
        personaDataset = personas_overall_dist_small
        break
      case "pol_dist_small":
        personaDataset = personas_poll_dist_small
        break
      case "overall_dist_large":
        personaDataset = personas_overall_dist_large
        break
      default:
        personaDataset = personas_poll_dist_large
        break
    }

    console.log("Starting Survey...")
    const survey = new Survey(personaDataset, questionDataset)
    await survey.run()
    const surveyResults = survey.getSurveyResults()
    console.log("Survey done...")
    console.log("Here are the results: ", surveyResults)

    console.log("Starting Evaluation...")
    const evaluator = new Evaluator(surveyResults)
    const evaluationResults = evaluator.evaluate()
    console.log("Evaluation Results: ", evaluationResults)

    // Abfrage, ob eine weitere Umfrage durchgeführt werden soll
    const continueResponse = await performQuestionQuery(
      "Do you want to run another survey?",
      ["Yes", "No"]
    )
    continueSurvey = continueResponse.includes("Yes")
  }

  console.log("Exiting program. Goodbye!")
}

main().catch((error) => console.error("Error in main:", error))
