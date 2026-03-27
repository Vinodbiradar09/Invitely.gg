//buildSmartSendTimePrompt
export function generateSmartSendRecommendationPrompt(data: {
  eventName: string;
  eventDate: string;
  eventLocation: string;
  eventDesc: string;
  currentTime: string;
  currentIso: string;
}): string {
  return `
You are an expert at email marketing and event management.
Given the event details and current time, suggest the single best time to send invitation emails to maximise open rates and responses.

Event Details:
- Event Name: ${data.eventName}
- Event Date: ${data.eventDate}
- Location: ${data.eventLocation}
- Description: ${data.eventDesc || "Not provided"}
- Current Time (human readable): ${data.currentTime}
- Current Time (exact ISO): ${data.currentIso}

Rules:
- suggestedAt MUST be AFTER ${data.currentIso} — never suggest a time in the past
- Suggested time must be at least 30 minutes from now
- Suggested time MUST be at least 18 hours before the event date
- If the event is less than 18 hours away, set suggestedAt to exactly 30 minutes from now
- Best times are typically Tuesday–Thursday, 9AM–11AM or 6PM–8PM
- Consider how far away the event is — closer events need sooner sends
- Reason must be one concise sentence, max 15 words
- Return ONLY valid JSON, no markdown, no backticks

Return exactly this JSON shape:
{
  "suggestedAt": "ISO 8601 datetime string",
  "dayLabel": "e.g. Tuesday",
  "timeLabel": "e.g. 7:00 PM",
  "reason": "one sentence reason max 15 words"
}
`.trim();
}
