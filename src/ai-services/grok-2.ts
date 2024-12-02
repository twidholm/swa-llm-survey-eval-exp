import OpenAI from "openai"
import { Persona } from "../types/Persona.js"
import Model from "./model.js"
import { Question } from "../types/Question.js"
import { text } from "stream/consumers"
import { Result } from "../types/Result.js"
import { createPersonaText } from "../functions/template.js"

class Grok_Ai extends Model {
  private readonly instance = new OpenAI({
    apiKey: process.env.Grok_API_Key,
    baseURL: "https://api.x.ai/v1",
  })
  private results: Array<Result>
  private persona: Persona
  private messages: Array<any>

  constructor(modelType) {
    super(modelType)
  }

  public async generateResponse(question: Question) {
    const response = (await this.instance.chat.completions.create({
      model: "grok-beta",
      messages: [{ role: "user", content: question.text }],
      temperature: 0.2,
    })) as OpenAI.Chat.ChatCompletion
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
export default Grok_Ai
