import { InternalServerError } from "../shared/exceptions";
import { LLMResponse } from "../types/index";
import { config } from "./config";
export async function llm(prompt: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const res = await fetch(config.url(), {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": config.key!,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.85,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 1500,
          responseMimeType: "application/json",
        },
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error(`[gemini error] ${res.status}: ${err}`);
      throw new InternalServerError("AI generation failed");
    }
    const data = (await res.json()) as LLMResponse;
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new InternalServerError("AI returned an empty response.");
    }
    return text;
  } catch (e) {
    console.log(e);
    if (e instanceof Error) {
      if (e.name === "AbortError") {
        throw new InternalServerError("AI request timed out.");
      }
      throw e;
    }
    throw new InternalServerError();
  } finally {
    clearTimeout(timeout);
  }
}
