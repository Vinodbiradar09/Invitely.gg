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
        backgroundColor: "#000000",
        padding: "40px 16px",
        fontFamily: "'Courier New', Courier, monospace",
      }}
    >
      <div
        style={{
          maxWidth: "560px",
          margin: "0 auto",
          backgroundColor: "#0a0a0a",
          border: "1px solid #1f1f1f",
        }}
      >
        <div
          style={{
            borderBottom: "1px solid #1f1f1f",
            padding: "12px 20px",
            backgroundColor: "#111111",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "11px",
              color: "#555555",
              fontFamily: "'Courier New', Courier, monospace",
              letterSpacing: "0.05em",
            }}
          >
            INVITED BY{" "}
            <span style={{ color: "#ffffff", fontWeight: "bold" }}>
              {organizerName.toUpperCase()}
            </span>
          </p>
        </div>

        <div
          style={{
            borderBottom: "1px solid #1f1f1f",
            padding: "16px 20px",
            backgroundColor: "#0d0d0d",
          }}
        >
          {[
            { label: "From", value: `Invitely.gg <noreply@invitely.gg>` },
            {
              label: "To",
              value: recipientName
                ? `${recipientName} <${recipientName}>`
                : "You",
            },
            { label: "Subject", value: `You're invited to ${eventName}` },
          ].map(({ label, value }) => (
            <div
              key={label}
              style={{
                display: "flex",
                gap: "16px",
                marginBottom: "6px",
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  color: "#444444",
                  fontFamily: "'Courier New', Courier, monospace",
                  width: "52px",
                  flexShrink: 0,
                  paddingTop: "1px",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {label}
              </span>
              <span
                style={{
                  fontSize: "11px",
                  color: label === "Subject" ? "#ffffff" : "#888888",
                  fontFamily: "'Courier New', Courier, monospace",
                  fontWeight: label === "Subject" ? "bold" : "normal",
                }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            padding: "28px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "22px",
              fontWeight: "bold",
              color: "#ffffff",
              fontFamily: "'Courier New', Courier, monospace",
              lineHeight: "1.2",
            }}
          >
            {eventName}
          </h1>
          <div
            style={{
              border: "1px solid #1f1f1f",
              padding: "12px 16px",
              backgroundColor: "#080808",
            }}
          >
            <p
              style={{
                margin: "0 0 8px",
                fontSize: "11px",
                color: "#888888",
                fontFamily: "'Courier New', Courier, monospace",
              }}
            >
              📅&nbsp;&nbsp;{eventDate}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "11px",
                color: "#888888",
                fontFamily: "'Courier New', Courier, monospace",
              }}
            >
              📍&nbsp;&nbsp;{eventLocation}
            </p>
          </div>

          <div style={{ borderTop: "1px solid #1f1f1f" }} />
          <div>
            {emailBody.split("\n").map((line, i) =>
              line.trim() ? (
                <p
                  key={i}
                  style={{
                    margin: "0 0 10px",
                    fontSize: "12px",
                    color: "#aaaaaa",
                    fontFamily: "'Courier New', Courier, monospace",
                    lineHeight: "1.7",
                  }}
                >
                  {line}
                </p>
              ) : (
                <br key={i} />
              ),
            )}
          </div>
          <div style={{ borderTop: "1px solid #1f1f1f" }} />

          <div>
            <p
              style={{
                margin: "0 0 14px",
                fontSize: "11px",
                color: "#666666",
                fontFamily: "'Courier New', Courier, monospace",
              }}
            >
              {recipientName ? `Hey ${recipientName}, will` : "Will"} you be
              attending?
            </p>
            <table style={{ borderCollapse: "collapse", marginBottom: "12px" }}>
              <tbody>
                <tr>
                  <td style={{ paddingRight: "8px", paddingBottom: "8px" }}>
                    <a
                      href={attendingUrl}
                      style={{
                        display: "inline-block",
                        padding: "10px 18px",
                        backgroundColor: "#14532d",
                        border: "1px solid #166534",
                        color: "#4ade80",
                        fontSize: "11px",
                        fontFamily: "'Courier New', Courier, monospace",
                        fontWeight: "bold",
                        textDecoration: "none",
                        letterSpacing: "0.05em",
                      }}
                    >
                      ✓ ATTENDING
                    </a>
                  </td>
                  <td style={{ paddingRight: "8px", paddingBottom: "8px" }}>
                    <a
                      href={maybeUrl}
                      style={{
                        display: "inline-block",
                        padding: "10px 18px",
                        backgroundColor: "#422006",
                        border: "1px solid #78350f",
                        color: "#fbbf24",
                        fontSize: "11px",
                        fontFamily: "'Courier New', Courier, monospace",
                        fontWeight: "bold",
                        textDecoration: "none",
                        letterSpacing: "0.05em",
                      }}
                    >
                      ? MAYBE
                    </a>
                  </td>
                  <td style={{ paddingBottom: "8px" }}>
                    <a
                      href={declinedUrl}
                      style={{
                        display: "inline-block",
                        padding: "10px 18px",
                        backgroundColor: "#450a0a",
                        border: "1px solid #7f1d1d",
                        color: "#f87171",
                        fontSize: "11px",
                        fontFamily: "'Courier New', Courier, monospace",
                        fontWeight: "bold",
                        textDecoration: "none",
                        letterSpacing: "0.05em",
                      }}
                    >
                      ✕ CAN&rsquo;T MAKE IT
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>

            <p
              style={{
                margin: 0,
                fontSize: "10px",
                color: "#444444",
                fontFamily: "'Courier New', Courier, monospace",
              }}
            >
              You can change your response anytime before the event.
            </p>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid #1f1f1f",
            padding: "12px 20px",
            backgroundColor: "#080808",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "10px",
              color: "#333333",
              fontFamily: "'Courier New', Courier, monospace",
              textAlign: "center",
              letterSpacing: "0.05em",
            }}
          >
            SENT VIA{" "}
            <span style={{ color: "#ffffff", fontWeight: "bold" }}>
              INVITELY.GG
            </span>{" "}
            ON BEHALF OF {organizerName.toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
}
