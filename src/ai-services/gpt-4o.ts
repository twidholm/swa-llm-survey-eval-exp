import { GoogleGenerativeAI } from "@google/generative-ai"
import dotenv from "dotenv"
import { Persona } from "../types/Personas.js"
import Model from "./model.js"
import { Question } from "../types/Questions.js"
import path from "path"
import { existsSync, readFileSync, writeFileSync } from "fs"
import OpenAI from "openai"
import { Result } from "../types/Result.js"
dotenv.config()

class Gpt_Ai extends Model {
  private persona: Persona
  private results: Array<Result>
  private readonly instance = new OpenAI({
    apiKey: process.env.GPT_API_Key, // This is the default and can be omitted
  })
  constructor(modelType) {
    super(modelType)
  }
  public async generateResponse(question: Question) {
    const response = (await this.instance.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: question.text }],
      temperature: 0.2,
    })) as OpenAI.Chat.ChatCompletion
    this.results.push({
      questionId: question.id,
      responseOption: response.choices[0].message.content,
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
export default Gpt_Ai
