import {
  ChatSession,
  GenerateContentResult,
  GenerativeModel,
  GoogleGenerativeAI,
} from "@google/generative-ai"
import dotenv from "dotenv"
import { Persona } from "../types/Persona.js"
import Model from "./model.js"
import { Question } from "../types/Question.js"
import { Result } from "../types/Result.js"
import { createPersonaPrompt } from "../functions/createPersonaPrompt.js"
import { createQuestionPrompt } from "../functions/createQuestionPrompt.js"
dotenv.config()

class Gemini_Ai extends Model {
  private readonly instance = new GoogleGenerativeAI(process.env.Gemini_API_Key)
  private persona: Persona

  private messages: Array<any>

  private readonly model: GenerativeModel
  private chat: ChatSession
  constructor(modelType) {
    super(modelType)
    this.messages = [] // Initialize messages array
    this.persona = null // Initialize persona
    this.model = this.instance.getGenerativeModel({
      model: "gemini-1.5-flash",
    })
    this.chat = this.model.startChat()
  }

  public async generateResponse(question: Question) {
    const content = createQuestionPrompt(question)

    this.addMessage("user", content)
    try {
      const response = (await this.chat.sendMessage(
        question.text
      )) as GenerateContentResult
      const responseContent = response.response.text()
      if (!responseContent) {
        throw new Error("No response received from the model.")
      }
      this.addMessage("assistant", responseContent)
    } catch (error) {
      console.error(error)
    }
  }
  public async initPersona(questionCount: number) {
    const personaText = createPersonaPrompt(this.persona, questionCount)
    try {
      const response = await this.chat.sendMessage(personaText)
      this.addMessage("user", personaText)
      this.addMessage("assistent", response.response.text())
    } catch (error) {
      console.error(error)
    }
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
    return this.messages
  }
}
export default Gemini_Ai
