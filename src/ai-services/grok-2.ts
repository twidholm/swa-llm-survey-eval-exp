import OpenAI from "openai"

class Grok_Ai {
  private readonly instance = new OpenAI({
    apiKey: process.env.Grok_API_Key,
    baseURL: "https://api.x.ai/v1",
  })
  public async getGrokResponse(usermessage: string, systemmessage: string) {
    const response = await this.instance.chat.completions.create({
      model: "grok-beta",
      messages: [
        { role: "system", content: usermessage },
        {
          role: "user",
          content: systemmessage,
        },
      ],
    })
    return response
  }
}
