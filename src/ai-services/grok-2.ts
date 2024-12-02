import OpenAI from "openai"
import { Persona } from "../types/Personas.js"
import Model from "./model.js"
import { Question } from "../types/Questions.js"
import { text } from "stream/consumers"
import { Result } from "../types/Result.js"

class Grok_Ai extends Model {
  private readonly instance = new OpenAI({
    apiKey: process.env.Grok_API_Key,
    baseURL: "https://api.x.ai/v1",
  })
  private results: Array<Result>
  private persona: Persona

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
export default Grok_Ai
