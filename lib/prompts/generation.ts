// was buildPrompt
export function generateInviteEmailPrompt(data: {
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
// was buildPersonalisationPrompt
export function generateGuestOpeningPrompt(data: {
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
