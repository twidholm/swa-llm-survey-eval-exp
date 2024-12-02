import {
  GenerateContentResult,
  GoogleGenerativeAI,
} from "@google/generative-ai"
import dotenv from "dotenv"
import { Persona } from "../types/Personas.js"
import Model from "./model.js"
import { Question } from "../types/Questions.js"
import { Result } from "../types/Result.js"
dotenv.config()

class Gemini_Ai extends Model {
  private readonly instance = new GoogleGenerativeAI(process.env.Gemini_API_Key)
  private persona: Persona
  private results: Array<Result>
  private readonly model = this.instance.getGenerativeModel({
    model: "gemini-1.5-flash",
  })

  constructor(modelType) {
    super(modelType)
  }

  public async generateResponse(question: Question) {
    const response = (await this.model.generateContent(
      question.text
    )) as GenerateContentResult
    const content = response.response.text()
    this.results.push({
      questionId: question.id,
      responseOption: content,
    })
  }
  public setPersona(persona: any): void {
    this.persona = persona
  }

  public getPersona(): any {
    return this.persona
  }
  public getResults() {
    return this.results
  }
}
export default Gemini_Ai
