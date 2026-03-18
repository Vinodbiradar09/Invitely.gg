export function buildPrompt(data: {
  casualText: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  eventDesc: string;
}): string {
  return `
You are an expert at writing warm, personal event invitation emails.

The organizer has written a casual message and you need to turn it into
a polished invite email.

Event Details:
- Event Name: ${data.eventName}
- Date: ${data.eventDate}
- Location: ${data.eventLocation}
- Description: ${data.eventDesc || "Not provided"}

Organizer's casual message:
"${data.casualText}"

Rules you must follow:
- Keep the tone warm, friendly and personal — not corporate or stiff
- Email subject must be concise and engaging (max 60 characters)
- Email body should be 2 to 4 short paragraphs
- Do NOT start with greetings like "Dear [Name]" or "Hi [Name]" — the template adds this
- Do NOT include RSVP instructions or buttons — these are added automatically
- Do NOT include a sign-off or signature — the template handles this
- Use the event details naturally in the body where relevant
- Return ONLY valid JSON with no markdown, no backticks, no explanation

Return exactly this JSON shape:
{
  "subject": "your subject here",
  "body": "your email body here with \\n for line breaks between paragraphs"
}
`.trim();
}

export function buildSmartSendTimePrompt(data: {
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

export function buildPersonalisationPrompt(data: {
  recipientName: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  eventDesc: string;
}): string {
  return `
You are an expert at writing warm, personalised event invitations.
Write a single opening line for an invitation email to this specific guest.

Guest Name: ${data.recipientName || "Guest"}
Event: ${data.eventName}
Date: ${data.eventDate}
Location: ${data.eventLocation}
Description: ${data.eventDesc || "Not provided"}

Rules:
- One sentence only, max 20 words
- Warm and personal, reference their name naturally
- Do NOT start with "Hey" or "Hi" — the template adds the greeting
- Do NOT mention RSVP, buttons, or links
- Make it feel like it was written just for them
- Return ONLY valid JSON, no markdown, no backticks

Return exactly this JSON shape:
{
  "opening": "your personalised opening line here"
}
`.trim();
}

export function buildInsightsPrompt(data: {
  eventName: string;
  eventDate: string;
  daysUntilEvent: number;
  totalInvited: number;
  attending: number;
  maybe: number;
  declined: number;
  pending: number;
  openedNotResponded: number;
  responseRate: number;
  avgResponseHours: number | null;
}): string {
  return `
You are an expert event analytics assistant helping an organiser understand their RSVP situation.

Event: ${data.eventName}
Event Date: ${data.eventDate}
Days Until Event: ${data.daysUntilEvent} day${data.daysUntilEvent === 1 ? "" : "s"}

RSVP Breakdown:
- Total Invited: ${data.totalInvited}
- Attending: ${data.attending}
- Maybe: ${data.maybe}
- Declined: ${data.declined}
- Pending (no response): ${data.pending}
- Opened email but not responded: ${data.openedNotResponded}
- Response Rate: ${data.responseRate}%
- Average Response Time: ${data.avgResponseHours !== null ? `${data.avgResponseHours} hours after receiving` : "not available"}

Your job:
Analyse this data and return insights that are specific, direct, and actionable. Use the numbers. Reference the days until event. Consider urgency based on how soon the event is.

Urgency rules:
- If daysUntilEvent <= 2: urgency is "high"
- If daysUntilEvent <= 7: urgency is "medium"
- If daysUntilEvent > 7: urgency is "low"

Field rules:
- summary: exactly 2 sentences. Sentence 1 states the response situation with specific numbers. Sentence 2 interprets what it means given the time remaining.
- topInsight: the single sharpest observation. Must reference actual numbers. BAD: "Response rate is low." GOOD: "12 guests opened the email but haven't responded — they are the easiest wins."
- suggestion: one concrete next step the organiser can take TODAY. Must be specific. BAD: "Send a reminder." GOOD: "Send a personal follow-up to the 12 guests who opened but haven't responded."
- urgency: "low", "medium", or "high" based on days until event and pending count
- responseRate: return exactly ${data.responseRate} — do not change this number

Return ONLY valid JSON, no markdown, no backticks, no explanation.

Return exactly this JSON shape:
{
  "summary": "2 sentence situation overview with specific numbers",
  "responseRate": ${data.responseRate},
  "topInsight": "sharpest observation referencing actual numbers",
  "suggestion": "one concrete actionable next step for today",
  "urgency": "low" | "medium" | "high"
}
`.trim();
}

export function getNextEventDate(eventAt: Date, recurrence: string): Date {
  const next = new Date(eventAt);
  switch (recurrence) {
    case "weekly":
      next.setDate(next.getDate() + 7);
      break;
    case "monthly":
      next.setMonth(next.getMonth() + 1);
      break;
    case "annually":
      next.setFullYear(next.getFullYear() + 1);
      break;
  }
  return next;
}
