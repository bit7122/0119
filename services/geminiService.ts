
import { GoogleGenAI, Type } from "@google/genai";
import { AIResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function askGeminiAboutConversion(query: string): Promise<AIResponse> {
  const prompt = `User query: "${query}". 
  Provide a professional response including:
  1. The direct conversion result if possible.
  2. A brief explanation of the calculation.
  3. One interesting fun fact related to the units involved.
  Ensure the response is helpful and structured as JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            result: { type: Type.STRING, description: 'The final conversion result.' },
            explanation: { type: Type.STRING, description: 'Step by step explanation.' },
            fact: { type: Type.STRING, description: 'An interesting unit fact.' }
          },
          required: ['result', 'explanation', 'fact']
        }
      }
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      result: "AI Unavailable",
      explanation: "I couldn't process this request right now.",
      fact: "The metric system is used by almost every country except three: the US, Liberia, and Myanmar."
    };
  }
}
