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
}): string {
  return `
You are an expert at email marketing and event management.
Given the event details and current time, suggest the single best time to send invitation emails to maximise open rates and responses.

Event Details:
- Event Name: ${data.eventName}
- Event Date: ${data.eventDate}
- Location: ${data.eventLocation}
- Description: ${data.eventDesc || "Not provided"}
- Current Time: ${data.currentTime}

Rules:
- Suggest a time between 1 hour and 14 days from now
- Best times are typically Tuesday–Thursday, 9AM–11AM or 6PM–8PM in a general timezone
- Consider how far away the event is — closer events need sooner sends
- Reason must be one concise sentence, max 15 words
- Return ONLY valid JSON, no markdown, no backticks, no explanation

Return exactly this JSON shape:
{
  "suggestedAt": "ISO 8601 datetime string e.g. 2026-03-18T19:00:00.000Z",
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
  totalInvited: number;
  attending: number;
  maybe: number;
  declined: number;
  pending: number;
  responseRate: number;
  avgResponseHours: number | null;
}): string {
  return `
You are an expert event analytics assistant.
Analyse this event's RSVP data and provide actionable insights for the organiser.

Event: ${data.eventName}
Event Date: ${data.eventDate}
Total Invited: ${data.totalInvited}
Attending: ${data.attending}
Maybe: ${data.maybe}
Declined: ${data.declined}
Pending (no response): ${data.pending}
Response Rate: ${data.responseRate}%
Average Response Time: ${data.avgResponseHours !== null ? `${data.avgResponseHours} hours after sending` : "not available"}

Rules:
- summary: 2 sentences max, plain language overview of the response situation
- topInsight: the single most important observation, 1 sentence max 20 words
- suggestion: one actionable thing the organiser should do next, 1 sentence max 20 words
- responseRate: return the number as-is from the data provided
- Be direct and specific — no generic platitudes
- Return ONLY valid JSON, no markdown, no backticks

Return exactly this JSON shape:
{
  "summary": "2 sentence overview",
  "responseRate": ${data.responseRate},
  "topInsight": "single most important observation",
  "suggestion": "one actionable next step"
}
`.trim();
}
