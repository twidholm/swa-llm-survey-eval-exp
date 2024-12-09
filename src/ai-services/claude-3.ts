import { Persona } from "../types/Persona.js"
import { Question } from "../types/Question.js"

import Anthropic from "@anthropic-ai/sdk"
import Model from "./model.js"
import { Result } from "../types/Result.js"
import { createPersonaPrompt } from "../functions/createPersonaPrompt.js"
import { createQuestionPrompt } from "../functions/createQuestionPrompt.js"

class Claude_Ai extends Model {
  private readonly instance = new Anthropic({
    apiKey: process.env.Claude_API_KEY,
  })
  private persona: Persona
  private messages: Array<any>

  constructor(modelType) {
    super(modelType)
    this.messages = [] // Initialize messages array
    this.persona = null // Initialize persona
  }

  public async generateResponse(question: Question) {
    const content = createQuestionPrompt(question)

    this.addMessage("user", content)
    try {
      const params: Anthropic.MessageCreateParams = {
        max_tokens: 1024,
        messages: this.messages,
        model: "claude-3-opus-20240229",
        temperature: 0.2,
      }
      const response = await this.instance.messages.create(params)

      if (response.content[0].type === "text") {
        const responseContent = response.content[0].text

        if (!responseContent) {
          throw new Error("No response received from the model.")
        }

        this.addMessage("assistant", responseContent)
      }
    } catch (error) {
      console.error(error)
    }
  }
  public async initPersona(questionCount: number) {
    const personaText = createPersonaPrompt(this.persona, questionCount)
    this.addMessage("user", personaText)
    try {
      const params: Anthropic.MessageCreateParams = {
        max_tokens: 1024,
        messages: this.messages,
        model: "claude-3-opus-20240229",
        temperature: 0.2,
      }
      const response = await this.instance.messages.create(params)

      if (response.content[0].type === "text") {
        const text = response.content[0].text
        this.addMessage("assistant", text)
      }
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

export default Claude_Ai
