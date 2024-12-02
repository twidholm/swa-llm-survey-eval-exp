import { Persona } from "../types/Personas.js"
import { Question } from "../types/Questions.js"

import Anthropic from "@anthropic-ai/sdk"
import Model from "./model.js"
import path from "path"
import { existsSync, readFileSync, writeFileSync } from "fs"
import { Result } from "../types/Result.js"

class Claude_Ai extends Model {
  private readonly instance = new Anthropic({
    apiKey: process.env.Claude_API_KEY,
  })

  private persona: Persona
  private results: Array<Result>
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
