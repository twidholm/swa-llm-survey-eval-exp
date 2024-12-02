import dotenv from "dotenv"
import Survey from "./survey/Survey.js"
import Evaluator from "./eval/Evaluator.js"
// .env-Datei laden
dotenv.config()

// Zugriff auf die Umgebungsvariablen
async function main() {
  console.log("Starting Survey...")
  const survey = new Survey()
  await survey.run()
  const surveyResults = survey.getSurveyResults()
  console.log("Survey done...")
  console.log("Here are the results: ", surveyResults)

  console.log("Starting Evaluation...")
  const evaluator = new Evaluator(surveyResults)
  const evaluationResults = evaluator.evaluate()
  console.log("Evaluation Results: ", evaluationResults)
}
main().catch((error) => console.error("Error in main:", error))
