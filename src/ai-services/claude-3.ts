import Anthropic from "@anthropic-ai/sdk"

class Claude_Ai {
  private readonly instance = new Anthropic({
    apiKey: process.env.Claude_API_KEY,
  })

  public async getClaudeResponse(message: string): Promise<Anthropic.Message> {
    const params: Anthropic.MessageCreateParams = {
      max_tokens: 1024,
      messages: [{ role: "user", content: message }],
      model: "claude-3-opus-20240229",
    }
    const response: Anthropic.Message = await this.instance.messages.create(
      params
    )
    return response
  }
}
