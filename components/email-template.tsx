import * as React from "react";

interface InviteEmailProps {
  organizerName: string;
  organizerEmail: string;
  recipientName: string;
  recipientEmail: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  emailBody: string;
  token: string;
}

export function InviteEmail({
  organizerName,
  organizerEmail,
  recipientName,
  recipientEmail,
  eventName,
  eventDate,
  eventLocation,
  emailBody,
  token,
}: InviteEmailProps) {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  const attendingUrl = `${baseUrl}/rsvp/${token}?status=attending`;
  const maybeUrl = `${baseUrl}/rsvp/${token}?status=maybe`;
  const declinedUrl = `${baseUrl}/rsvp/${token}?status=declined`;

  const mono = "'Courier New', Courier, monospace";

  const fromValue = organizerEmail || "noreply@invitely.gg";
  const toValue = recipientEmail || recipientName || "You";
  const greetName = recipientName || recipientEmail || "there";

  const labelStyle: React.CSSProperties = {
    fontSize: "10px",
    color: "#444444",
    fontFamily: mono,
    letterSpacing: "0.08em",
    whiteSpace: "nowrap" as const,
    paddingRight: "12px",
    verticalAlign: "top" as const,
  };

  return (
    <table
      width="100%"
      cellPadding="0"
      cellSpacing="0"
      style={{ backgroundColor: "#000000", padding: "40px 0", margin: 0 }}
    >
      <tbody>
        <tr>
          <td align="center">
            <table
              width="560"
              cellPadding="0"
              cellSpacing="0"
              style={{
                backgroundColor: "#0a0a0a",
                border: "1px solid #1f1f1f",
              }}
            >
              <tbody>
                <tr>
                  <td
                    style={{
                      borderBottom: "1px solid #1f1f1f",
                      backgroundColor: "#111111",
                      padding: "14px 20px",
                    }}
                  >
                    <table width="100%" cellPadding="0" cellSpacing="0">
                      <tbody>
                        <tr>
                          <td
                            width="60"
                            style={{
                              fontSize: "11px",
                              color: "#555555",
                              fontFamily: mono,
                              paddingBottom: "6px",
                              verticalAlign: "top",
                            }}
                          >
                            From
                          </td>
                          <td
                            style={{
                              fontSize: "11px",
                              color: "#888888",
                              fontFamily: mono,
                              paddingBottom: "6px",
                            }}
                          >
                            {fromValue}
                          </td>
                        </tr>
                        <tr>
                          <td
                            width="60"
                            style={{
                              fontSize: "11px",
                              color: "#555555",
                              fontFamily: mono,
                              paddingBottom: "6px",
                              verticalAlign: "top",
                            }}
                          >
                            To
                          </td>
                          <td
                            style={{
                              fontSize: "11px",
                              color: "#888888",
                              fontFamily: mono,
                              paddingBottom: "6px",
                            }}
                          >
                            {toValue}
                          </td>
                        </tr>
                        <tr>
                          <td
                            width="60"
                            style={{
                              fontSize: "11px",
                              color: "#555555",
                              fontFamily: mono,
                              verticalAlign: "top",
                            }}
                          >
                            Subject
                          </td>
                          <td
                            style={{
                              fontSize: "11px",
                              color: "#ffffff",
                              fontFamily: mono,
                              fontWeight: "bold",
                            }}
                          >
                            You&apos;re invited to {eventName}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "24px 20px 28px 20px" }}>
                    <table width="100%" cellPadding="0" cellSpacing="0">
                      <tbody>
                        <tr>
                          <td style={{ paddingBottom: "20px" }}>
                            <table cellPadding="0" cellSpacing="0">
                              <tbody>
                                <tr>
                                  <td
                                    style={{
                                      borderLeft: "2px solid #2a2a2a",
                                      paddingLeft: "10px",
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontSize: "11px",
                                        color: "#555555",
                                        fontFamily: mono,
                                      }}
                                    >
                                      <span style={{ color: "#444444" }}>
                                        Invited By
                                      </span>
                                      &nbsp;&nbsp;
                                      <strong style={{ color: "#cccccc" }}>
                                        {organizerName}
                                      </strong>
                                    </span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>

                        {/* Event name */}
                        <tr>
                          <td style={{ paddingBottom: "16px" }}>
                            <h1
                              style={{
                                margin: 0,
                                fontSize: "22px",
                                fontWeight: "bold",
                                color: "#ffffff",
                                fontFamily: mono,
                                lineHeight: "1.2",
                              }}
                            >
                              {eventName}
                            </h1>
                          </td>
                        </tr>

                        {/* Date + Location box */}
                        <tr>
                          <td style={{ paddingBottom: "20px" }}>
                            <table
                              width="100%"
                              cellPadding="0"
                              cellSpacing="0"
                              style={{
                                border: "1px solid #1f1f1f",
                                backgroundColor: "#080808",
                              }}
                            >
                              <tbody>
                                <tr>
                                  <td style={{ padding: "12px 16px" }}>
                                    <table
                                      width="100%"
                                      cellPadding="0"
                                      cellSpacing="0"
                                    >
                                      <tbody>
                                        <tr>
                                          <td
                                            style={{
                                              ...labelStyle,
                                              paddingBottom: "8px",
                                            }}
                                          >
                                            DATE
                                          </td>
                                          <td
                                            style={{
                                              fontSize: "12px",
                                              color: "#888888",
                                              fontFamily: mono,
                                              paddingBottom: "8px",
                                            }}
                                          >
                                            {eventDate}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td style={labelStyle}>LOCATION</td>
                                          <td
                                            style={{
                                              fontSize: "12px",
                                              color: "#888888",
                                              fontFamily: mono,
                                            }}
                                          >
                                            {eventLocation}
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>

                        {/* Divider */}
                        <tr>
                          <td
                            style={{
                              borderTop: "1px solid #1f1f1f",
                              paddingBottom: "20px",
                            }}
                          />
                        </tr>

                        {/* Email body */}
                        <tr>
                          <td style={{ paddingBottom: "20px" }}>
                            {emailBody.split("\n").map((line, i) =>
                              line.trim() ? (
                                <p
                                  key={i}
                                  style={{
                                    margin: "0 0 10px 0",
                                    fontSize: "13px",
                                    color: "#aaaaaa",
                                    fontFamily: mono,
                                    lineHeight: "1.7",
                                  }}
                                >
                                  {line}
                                </p>
                              ) : (
                                <br key={i} />
                              ),
                            )}
                          </td>
                        </tr>

                        {/* Divider */}
                        <tr>
                          <td
                            style={{
                              borderTop: "1px solid #1f1f1f",
                              paddingBottom: "20px",
                            }}
                          />
                        </tr>

                        {/* RSVP question */}
                        <tr>
                          <td style={{ paddingBottom: "14px" }}>
                            <p
                              style={{
                                margin: 0,
                                fontSize: "12px",
                                color: "#888888",
                                fontFamily: mono,
                              }}
                            >
                              Hey{" "}
                              <strong style={{ color: "#ffffff" }}>
                                {greetName}
                              </strong>
                              , will you be attending?
                            </p>
                          </td>
                        </tr>

                        {/* RSVP buttons */}
                        <tr>
                          <td style={{ paddingBottom: "14px" }}>
                            <table cellPadding="0" cellSpacing="0">
                              <tbody>
                                <tr>
                                  <td style={{ paddingRight: "8px" }}>
                                    <a
                                      href={attendingUrl}
                                      style={{
                                        display: "inline-block",
                                        padding: "10px 18px",
                                        backgroundColor: "#14532d",
                                        border: "1px solid #166534",
                                        color: "#4ade80",
                                        fontSize: "11px",
                                        fontFamily: mono,
                                        fontWeight: "bold",
                                        textDecoration: "none",
                                        letterSpacing: "0.05em",
                                      }}
                                    >
                                      Attending
                                    </a>
                                  </td>
                                  <td style={{ paddingRight: "8px" }}>
                                    <a
                                      href={maybeUrl}
                                      style={{
                                        display: "inline-block",
                                        padding: "10px 18px",
                                        backgroundColor: "#422006",
                                        border: "1px solid #78350f",
                                        color: "#fbbf24",
                                        fontSize: "11px",
                                        fontFamily: mono,
                                        fontWeight: "bold",
                                        textDecoration: "none",
                                        letterSpacing: "0.05em",
                                      }}
                                    >
                                      Maybe
                                    </a>
                                  </td>
                                  <td>
                                    <a
                                      href={declinedUrl}
                                      style={{
                                        display: "inline-block",
                                        padding: "10px 18px",
                                        backgroundColor: "#450a0a",
                                        border: "1px solid #7f1d1d",
                                        color: "#f87171",
                                        fontSize: "11px",
                                        fontFamily: mono,
                                        fontWeight: "bold",
                                        textDecoration: "none",
                                        letterSpacing: "0.05em",
                                      }}
                                    >
                                      Can&apos;t Make It
                                    </a>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>

                        {/* Change note */}
                        <tr>
                          <td>
                            <p
                              style={{
                                margin: 0,
                                fontSize: "10px",
                                color: "#444444",
                                fontFamily: mono,
                              }}
                            >
                              You can change your response anytime before the
                              event.
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>

                {/* Footer */}
                <tr>
                  <td
                    style={{
                      borderTop: "1px solid #1f1f1f",
                      backgroundColor: "#080808",
                      padding: "12px 20px",
                      textAlign: "center",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: "10px",
                        color: "#444444",
                        fontFamily: mono,
                      }}
                    >
                      Sent via{" "}
                      <strong style={{ color: "#ffffff" }}>Invitely.gg</strong>{" "}
                      on behalf of {organizerName}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
