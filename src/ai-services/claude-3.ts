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
    const params: Anthropic.MessageCreateParams = {
      max_tokens: 1024,
      messages: [{ role: "user", content: question.text }],
      model: "claude-3-opus-20240229",
      temperature: 0.2,
    }
    const response = await this.instance.messages.create(params)

    const content = response.content as Array<Anthropic.TextBlock>

    this.results.push({
      questionId: question.id,
      responseOption: content[0].text,
    })
  }
  public async initPersona() {
    const personaText = createPersonaText(this.persona, 100)

    this.addMessage("user", personaText)
    const response = ""
    this.addMessage("assistent", "")
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
