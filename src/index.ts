import dotenv from "dotenv"
import Survey from "./survey/Survey.js"
import { evaluate } from "./eval/Evaluator.js"
import { performQuestionQuery } from "./functions/performQuestionQuery.js"
import { questions } from "./data/data_set_questions/questions.js"

import { testQuestionsToResults } from "./functions/testQuestionsToResults.js"
import { personas_poll_dist_large } from "./data/data_set_personas/personas_large_distribution_poll.js"
import { personas_poll_dist_small } from "./data/data_set_personas/personas_small.js"
import { getStartAndEndIndices } from "./functions/getStartAndEndIndices.js"

dotenv.config()

async function main() {
  console.log("Testing...")
  const errors = testQuestionsToResults()
  console.log("Testing done!")
  console.error("Errors in Data: ", errors)

  if (errors.length === 0) {
    const questionProcessResponse = await performQuestionQuery(
      "Do you want to start a survey or evaluate results? (Type 'survey' or 'evaluate')",
      ["survey", "evaluate"]
    )

    if (questionProcessResponse.includes("survey")) {
      const modelResponse = await performQuestionQuery(
        "What AI-Model do you want to choose?",
        ["Claude", "Gemini", "GPT", "Grok", "All four"]
      )

      const modelNumber =
        {
          Claude: "0",
          Gemini: "1",
          GPT: "2",
          Grok: "3",
          "All four": "all",
        }[modelResponse] || "none"

      const questionDatasetResponse = await performQuestionQuery(
        "What question dataset do you want to choose?",
        ["small (10)", "large (full)"]
      )

      const questionDataset = questionDatasetResponse.includes("small")
        ? questions.slice(0, 5)
        : questions

      const personaDatasetResponse = await performQuestionQuery(
        "What persona dataset do you want to choose?",
        ["Small political distribution", "Large political distribution"]
      )

      const personaDataset = personaDatasetResponse.includes("Small")
        ? personas_poll_dist_small
        : personas_poll_dist_large

      const personaLengthResponse = await performQuestionQuery(
        "Do you want to set an individual end-/startpoint for the persona dataset?",
        ["yes", "no"]
      )

      let startPersonaIndex = 0
      let endPersonaIndex = personaDataset.length - 1

      if (personaLengthResponse.includes("yes")) {
        const { start, end } = await getStartAndEndIndices()
        if (
          start < 0 ||
          start >= personaDataset.length ||
          end < 0 ||
          end >= personaDataset.length ||
          start > end
        ) {
          throw new Error("Invalid start or end index.")
        }
        startPersonaIndex = start
        endPersonaIndex = end
      }

      console.log("Starting Survey...")
      const survey = new Survey(personaDataset, questionDataset)

      if (modelNumber !== "none") {
        try {
          await survey.run(modelNumber, startPersonaIndex, endPersonaIndex)
          console.log("Survey done...")
          return 0
        } catch (error) {
          console.error("Error during survey:", error)
        }
      }
    } else if (questionProcessResponse.includes("evaluate")) {
      console.log("Starting Evaluation...")
      evaluate()
    } else {
      console.log("Invalid choice. Exiting program.")
      return 0
    }
  }
  console.log("Exiting program. Goodbye!")
}

main().catch((error) => console.error("Error in main:", error))
