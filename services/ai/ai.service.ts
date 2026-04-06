import { PlantAI, plantAISchema } from "./ai.schema";

/**
 * Serviço responsável por se comunicar com a API de IA
 */
export class AiService {
  private apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

  /**
   * Gera dados para uma planta
   * @param name Nome da planta
   */
  public async generatePlantData(name: string): Promise<PlantAI | null> {
    const prompt = `
        You are a strict JSON generator and plant care expert.

        The plant name will be provided in Portuguese: "${name}".

        Your task is to return ONLY a valid JSON object with:
        - sunlight (enum: "low", "medium", "high")
        - minTemperature (number in Celsius)
        - maxTemperature (number in Celsius)
        - humidity (number between 0 and 100)

        Strict rules:
        - Output ONLY JSON. No text before or after.
        - No comments, no explanations.
        - No units in values.
        - Always return numbers (not strings).
        - Ensure valid JSON syntax.

        If the plant is unknown, make a reasonable assumption based on similar plants.

        Output example:
        {
        "sunlight": "medium",
        "minTemperature": 18,
        "maxTemperature": 30,
        "humidity": 70
        }
    `;

    const response = await fetch(`${process.env.EXPO_PUBLIC_GEMINI_URL}?key=${this.apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });

    const data = await response.json();

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    try {
      const parsed = JSON.parse(text);

      const result = plantAISchema.safeParse(parsed);

      if (!result.success) {
        console.warn("AI validation error:", result.error);
        return null;
      }

      return result.data;
    } catch {
      throw new Error("Não foi possível processar a resposta da IA");
    }
  }
}
