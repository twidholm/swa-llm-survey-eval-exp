import dotenv from "dotenv"
import { Persona } from "../types/Persona.js"
import Model from "./model.js"
import { Question } from "../types/Question.js"
import OpenAI from "openai"
import { Result } from "../types/Result.js"
import { createPersonaPrompt } from "../functions/createPersonaPrompt.js"
import { ModelType } from "../types/ModelType.js"
import { createQuestionPrompt } from "../functions/createQuestionPrompt.js"

dotenv.config()

class Gpt_Ai extends Model {
  private persona: Persona | null
  private readonly instance = new OpenAI({
    apiKey: process.env.GPT_API_Key, // API Key aus der .env-Datei
  })
  private messages: Array<any> = []

  constructor(modelType: ModelType) {
    super(modelType)
    this.messages = [] // Initialize messages array
    this.persona = null // Initialize persona
  }

  public async generateResponse(question: Question): Promise<void> {
    const content = createQuestionPrompt(question)
    this.addMessage("user", content)
    try {
      const response = (await this.instance.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [...this.messages],
        temperature: 0.2,
      })) as OpenAI.Chat.ChatCompletion

      const responseContent = response.choices?.[0]?.message?.content
      if (!responseContent) {
        throw new Error("No response received from the model.")
      }
      this.addMessage("assistant", responseContent)
    } catch (error) {
      console.error(error)
    }
  }

  public async initPersona(questionCount: number): Promise<void> {
    if (this.persona) {
      const personaText = createPersonaPrompt(this.persona, questionCount)
      this.addMessage("user", personaText)
      try {
        const response = (await this.instance.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [...this.messages],
          temperature: 0.2,
        })) as OpenAI.Chat.ChatCompletion

        const responseContent = response.choices?.[0]?.message?.content
        if (!responseContent) {
          throw new Error("No response received from the model.")
        }

        this.addMessage("assistant", responseContent)
      } catch (error) {
        console.error(error)
      }
    }
  }

  public setPersona(persona: Persona): void {
    this.persona = persona
    this.messages = [] // Reset messages für eine neue Persona
  }

  public addMessage(role: string, content: string): void {
    this.messages.push({
      role,
      content,
    })
  }

  public getPersona(): Persona | null {
    if (this.persona) {
      return this.persona
    }
    return null
  }

  public getResults(): Array<Result> {
    return this.messages
  }
}

export default Gpt_Ai
