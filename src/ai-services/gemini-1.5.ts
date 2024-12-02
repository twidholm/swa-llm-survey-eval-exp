import {
  ChatSession,
  GenerateContentResult,
  GoogleGenerativeAI,
} from "@google/generative-ai"
import dotenv from "dotenv"
import { Persona } from "../types/Persona.js"
import Model from "./model.js"
import { Question } from "../types/Question.js"
import { Result } from "../types/Result.js"
import { createPersonaText } from "../functions/template.js"
dotenv.config()

class Gemini_Ai extends Model {
  private readonly instance = new GoogleGenerativeAI(process.env.Gemini_API_Key)
  private persona: Persona
  private results: Array<Result>
  private messages: Array<any>
  private chat: ChatSession
  private readonly model = this.instance.getGenerativeModel({
    model: "gemini-1.5-flash",
  })

  constructor(modelType) {
    super(modelType)
  }

  public async generateResponse(question: Question) {
    const response = (await this.chat.sendMessage(
      question.text
    )) as GenerateContentResult
    this.addMessage("assistent", response.response.text())
    this.results.push({
      questionId: question.id,
      responseOption: response.response.text(),
    })
  }
  public async initPersona() {
    const personaText = createPersonaText(this.persona, 100)
    this.model.systemInstruction.role = personaText

    this.chat = this.model.startChat({
      history: [...this.messages],
    })
    const response = await this.chat.sendMessage(personaText)

    this.addMessage("user", personaText)
    this.addMessage("assistent", response.response.text()) // Müssen die messages gespeichert werden hier wenn ein chat kreiiert wird?
  }
  public addMessage(role: string, content: string) {
    this.messages.push({
      role,
      content,
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
