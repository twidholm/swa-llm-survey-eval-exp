import OpenAI from "openai"
import { Persona } from "../types/Persona.js"
import Model from "./model.js"
import { Question } from "../types/Question.js"
import { text } from "stream/consumers"
import { Result } from "../types/Result.js"
import { createPersonaPrompt } from "../functions/createPersonaPrompt.js"
import { createQuestionPrompt } from "../functions/createQuestionPrompt.js"
import { ModelType } from "../types/ModelType.js"

class Grok_Ai extends Model {
  private readonly instance = new OpenAI({
    apiKey: process.env.Grok_API_Key,
    baseURL: "https://api.x.ai/v1",
  })
  private persona: Persona | null
  private messages: Array<any>

  constructor(modelType: ModelType) {
    super(modelType)
    this.messages = [] // Initialize messages array
    this.persona = null // Initialize persona
  }

  public async generateResponse(question: Question) {
    const content = createQuestionPrompt(question)

    this.addMessage("user", content)
    try {
      const response = (await this.instance.chat.completions.create({
        model: "grok-2",
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
  public async initPersona(questionCount: number) {
    if (this.persona) {
      const personaText = createPersonaPrompt(this.persona, questionCount)
      this.addMessage("user", personaText)
      try {
        const response = (await this.instance.chat.completions.create({
          model: "grok-2",
          messages: [...this.messages],
          temperature: 0.2,
        })) as OpenAI.Chat.ChatCompletion
        if (response.choices[0].message.content) {
          this.addMessage("assistant", response.choices[0].message.content)
        }
      } catch (error) {
        console.error(error)
      }
    }
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
    return this.messages
  }
}
export default Grok_Ai
