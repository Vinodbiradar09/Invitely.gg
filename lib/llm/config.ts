export const config = {
  model: process.env.MODEL,
  key: process.env.GEMINI_API_KEY,
  url() {
    if (!this.key) throw new Error("key required");
    if (!this.model) throw new Error("model is required");
    return `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.key}`;
  },
};
