import * as React from "react";

interface InviteEmailProps {
  organizerName: string;
  recipientName: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  emailBody: string;
  token: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;

const btnBase: React.CSSProperties = {
  display: "inline-block",
  padding: "12px 24px",
  borderRadius: "6px",
  textDecoration: "none",
  fontWeight: "bold",
  fontSize: "14px",
  color: "#ffffff",
};

export function InviteEmail({
  organizerName,
  recipientName,
  eventName,
  eventDate,
  eventLocation,
  emailBody,
  token,
}: InviteEmailProps) {
  const attendingUrl = `${baseUrl}/rsvp/${token}?status=attending`;
  const maybeUrl = `${baseUrl}/rsvp/${token}?status=maybe`;
  const declinedUrl = `${baseUrl}/rsvp/${token}?status=declined`;

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        color: "#1a1a1a",
      }}
    >
      <div
        style={{
          background: "#4f46e5",
          padding: "24px",
          borderRadius: "8px 8px 0 0",
        }}
      >
        <p style={{ color: "#c7d2fe", margin: "0 0 4px", fontSize: "13px" }}>
          You have been invited by
        </p>
        <h2 style={{ color: "#ffffff", margin: "0", fontSize: "20px" }}>
          {organizerName}
        </h2>
      </div>

      <div
        style={{
          background: "#f9fafb",
          padding: "32px",
          borderRadius: "0 0 8px 8px",
        }}
      >
        <h1 style={{ margin: "0 0 24px", fontSize: "28px", color: "#111827" }}>
          {eventName}
        </h1>

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "24px",
          }}
        >
          <p style={{ margin: "0 0 8px", fontSize: "15px" }}>
            📅 <strong>{eventDate}</strong>
          </p>
          <p style={{ margin: "0", fontSize: "15px" }}>
            📍 <strong>{eventLocation}</strong>
          </p>
        </div>

        <div
          style={{
            marginBottom: "32px",
            lineHeight: "1.7",
            fontSize: "15px",
            color: "#374151",
          }}
        >
          {emailBody.split("\n").map((line, i) => (
            <p key={i} style={{ margin: "0 0 10px" }}>
              {line}
            </p>
          ))}
        </div>

        <p
          style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "16px" }}
        >
          Hey {recipientName}, will you be attending?
        </p>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <a href={attendingUrl} style={{ ...btnBase, background: "#16a34a" }}>
            ✅ Attending
          </a>
          <a href={maybeUrl} style={{ ...btnBase, background: "#d97706" }}>
            🤔 Maybe
          </a>
          <a href={declinedUrl} style={{ ...btnBase, background: "#dc2626" }}>
            ❌ Cant Make It
          </a>
        </div>

        <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "24px" }}>
          You can change your response anytime before the event.
        </p>
      </div>

      <p
        style={{
          textAlign: "center",
          fontSize: "12px",
          color: "#9ca3af",
          marginTop: "16px",
        }}
      >
        Sent via <strong>Invitel.gg</strong> on behalf of {organizerName}
      </p>
    </div>
  );
}
