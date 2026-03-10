import { GeminiResponse } from "./types";
const GEMINI_MODEL = "gemini-2.5-flash-lite";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export async function llm(prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("api key is missing");
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
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
      throw new Error(`gemini api error ${res.status}: ${err}`);
    }
    const data = (await res.json()) as GeminiResponse;
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error("gemini returned empty response");
    }
    return text;
  } catch (e) {
    console.log(e);
    if (e instanceof Error) {
      if (e.name === "AbortError") {
        throw new Error("gemini response error");
      }
      throw e;
    }
    throw new Error("internal server error");
  } finally {
    clearTimeout(timeout);
  }
}
