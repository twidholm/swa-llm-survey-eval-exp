import { GoogleGenerativeAI } from "@google/generative-ai"
import dotenv from "dotenv"
import { Persona } from "../types/Persona.js"
import Model from "./model.js"
import { Question } from "../types/Question.js"
import path from "path"
import { existsSync, readFileSync, writeFileSync } from "fs"
import OpenAI from "openai"
import { Result } from "../types/Result.js"
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs"
import { createPersonaText } from "../functions/template.js"
dotenv.config()

class Gpt_Ai extends Model {
  private persona: Persona
  private results: Array<Result>
  private readonly instance = new OpenAI({
    apiKey: process.env.GPT_API_Key, // This is the default and can be omitted
  })
  private messages: Array<any>
  constructor(modelType) {
    super(modelType)
  }
  public async generateResponse(question: Question) {
    this.messages.push({ role: "user", content: question.text })

    const response = (await this.instance.chat.completions.create({
      model: "gpt-4o",
      messages: [...this.messages],
      temperature: 0.2,
    })) as OpenAI.Chat.ChatCompletion

    this.messages.push({
      role: "assistent",
      content: response.choices[0].message.content,
    })

    this.results.push({
      questionId: question.id,
      responseOption: response.choices[0].message.content,
    })
  }

  public async initPersona() {
    const personaText = createPersonaText(this.persona, 100)
    this.addMessage("user", personaText)
    const response = (await this.instance.chat.completions.create({
      model: "gpt-4o",
      messages: [...this.messages],
      temperature: 0.2,
    })) as OpenAI.Chat.ChatCompletion
    this.addMessage("assistent", response.choices[0].message.content)
  }
  public setPersona(persona: any): void {
    this.persona = persona
  }
  public addMessage(role: string, content: string) {
    this.messages.push({
      role,
      content,
    })
  }
  public getPersona(): any {
    return this.persona
  }
  public getResults() {
    return this.results
  }
}
export default Gpt_Ai
