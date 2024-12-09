import OpenAI from "openai"
import { Persona } from "../types/Persona.js"
import Model from "./model.js"
import { Question } from "../types/Question.js"
import { text } from "stream/consumers"
import { Result } from "../types/Result.js"
import { createPersonaPrompt } from "../functions/createPersonaPrompt.js"
import { createQuestionPrompt } from "../functions/createQuestionPrompt.js"

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
    const content = createQuestionPrompt(question)
    this.messages.push({ role: "user", content: content })
    const response = (await this.instance.chat.completions.create({
      model: "grok-beta",
      messages: [...this.messages],
      temperature: 0.2,
    })) as OpenAI.Chat.ChatCompletion

    const responseContent = response.choices?.[0]?.message?.content
    if (!responseContent) {
      throw new Error("No response received from the model.")
    }

    this.messages.push({
      role: "assistant",
      content: responseContent,
    })

    this.results.push({
      questionId: question.id,
      responseOption: responseContent,
    })
  }
  public async initPersona(questionCount: number) {
    const personaText = createPersonaPrompt(this.persona, questionCount)
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
