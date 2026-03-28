export const config = {
  model: process.env.MODEL,
  key: process.env.GEMINI_API_KEY,
  url() {
    console.log("fhhfhf", process.env.MODEL);
    if (!this.key) throw new Error("key required");
    console.log("model", this.model);
    if (!this.model) throw new Error("model is required");
    return `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.key}`;
  },
};
