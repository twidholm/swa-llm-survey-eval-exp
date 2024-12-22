import dotenv from "dotenv"
import Survey from "./survey/Survey.js"
import { evaluate } from "./eval/Evaluator.js"
import { performQuestionQuery } from "./functions/performQuestionQuery.js"
import { questions } from "./data/data_set_questions/questions.js"

import { testQuestionsToResults } from "./functions/testQuestionsToResults.js"
import { personas_poll_dist_large } from "./data/data_set_personas/personas_large_distribution_poll.js"
import { personas_poll_dist_small } from "./data/data_set_personas/personas_small.js"

dotenv.config()

async function main() {
  console.log("Testing...")
  const errors = testQuestionsToResults()
  console.log("Testing done!")
  console.error("Errors in Data: ", errors)
  if (errors.length === 0) {
    const questionProcessResponse = await performQuestionQuery(
      "Do you want to start a survey or evaluate results?",
      ["survey", "evaluate"]
    )

    if (questionProcessResponse.includes("survey")) {
      const modelResponse = await performQuestionQuery(
        "What AI-Model do you want to choose?",
        ["Claude", "Gemini", "GPT", "Grok", "All four"]
      )
      let modelNumber: string
      switch (modelResponse) {
        case "Claude":
          modelNumber = "0"
          break
        case "Gemini":
          modelNumber = "1"
          break
        case "GPT":
          modelNumber = "2"
          break
        case "Grok":
          modelNumber = "3"
          break
        case "All four":
          modelNumber = "all"
          break
        default:
          modelNumber = "none"
          break
      }
      const questionDatasetResponse = await performQuestionQuery(
        "What question dataset do you want to choose?",
        ["small (10)", "large (full)"]
      )
      const questionDataset = questionDatasetResponse.includes("small")
        ? questions.slice(0, 5)
        : questions

      const personaDatasetResponse = await performQuestionQuery(
        "What persona dataset do you want to choose?",
        ["pol_dist_small", "pol_dist_large"]
      )
      let personaDataset
      switch (personaDatasetResponse) {
        case "pol_dist_small":
          personaDataset = personas_poll_dist_small
          break
        default:
          personaDataset = personas_poll_dist_large
          break
      }

      console.log("Starting Survey...")
      const survey = new Survey(personaDataset, questionDataset)
      if (modelNumber.includes("none") === false) {
        await survey.run(modelNumber)
        const surveyResults = survey.getSurveyResults()
        console.log("Survey done...")
        console.log("Here are the results: ", surveyResults)
      }
    } else if (questionProcessResponse.includes("evaluate")) {
      console.log("Starting Evaluation...")
      evaluate()
    } else {
      return 0
    }
  }
  console.log("Exiting program. Goodbye!")
}

main().catch((error) => console.error("Error in main:", error))
