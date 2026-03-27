export interface LLMResponse {
  candidates?: {
    content?: {
      parts?: { text?: string }[];
    };
  }[];
}
