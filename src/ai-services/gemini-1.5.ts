import { GoogleGenerativeAI } from "@google/generative-ai"
import dotenv from "dotenv"
dotenv.config()

class Gemini_Ai {
  private readonly instance = new GoogleGenerativeAI(process.env.Gemini_API_Key)
  private readonly model = this.instance.getGenerativeModel({
    model: "gemini-1.5-flash",
  })

  public async getGeminiResponse(message: string) {
    const response = await this.model.generateContent(message)
    return response
  }
}
