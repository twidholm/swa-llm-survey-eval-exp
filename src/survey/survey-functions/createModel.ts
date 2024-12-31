import Claude_Ai from "../../ai-services/claude-3.js"
import Gemini_Ai from "../../ai-services/gemini-1.5.js"
import Gpt_Ai from "../../ai-services/gpt-4o.js"
import Grok_Ai from "../../ai-services/grok-2.js"
import Model from "../../ai-services/model.js"
import { ModelType } from "../../types/ModelType.js"

export function createModel(modelType: ModelType): Model {
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
