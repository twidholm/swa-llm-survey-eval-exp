import { Persona } from "../types/Persona.js"
import { Question } from "../types/Question.js"

import Anthropic from "@anthropic-ai/sdk"
import Model from "./model.js"
import { Result } from "../types/Result.js"
import { createPersonaText } from "../functions/template.js"

class Claude_Ai extends Model {
  private readonly instance = new Anthropic({
    apiKey: process.env.Claude_API_KEY,
  })

  private persona: Persona
  private results: Array<Result>
  private messages: Array<any>

  constructor(modelType) {
    super(modelType)
  }

  public async generateResponse(question: Question) {
    this.messages.push({ role: "user", content: question.text })

    const params: Anthropic.MessageCreateParams = {
      max_tokens: 1024,
      messages: this.messages,
      model: "claude-3-opus-20240229",
      temperature: 0.2,
    }
    const response = await this.instance.messages.create(params)

    if (response.content[0].type === "text") {
      const text = response.content[0].text
      this.messages.push({ role: "assistant", content: text })
      this.results.push({
        questionId: question.id,
        responseOption: response.content[0].text,
      })
    }
  }
  public async initPersona() {
    const personaText = createPersonaText(this.persona, 100)
    this.messages.push({ role: "user", content: personaText })

    const params: Anthropic.MessageCreateParams = {
      max_tokens: 1024,
      messages: this.messages,
      model: "claude-3-opus-20240229",
      temperature: 0.2,
    }
    const response = await this.instance.messages.create(params)

    if (response.content[0].type === "text") {
      const text = response.content[0].text
      this.messages.push({ role: "assistant", content: text })
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
    return this.results
  }
}

export default Claude_Ai
