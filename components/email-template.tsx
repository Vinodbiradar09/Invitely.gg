interface InviteEmailProps {
  organizerName: string;
  recipientName: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  emailBody: string;
  token: string;
}

export function InviteEmail({
  organizerName,
  recipientName,
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

  return (
    <table
      width="100%"
      cellPadding="0"
      cellSpacing="0"
      style={{ backgroundColor: "#000000", padding: "40px 0" }}
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
                      padding: "12px 20px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "11px",
                        color: "#555555",
                        fontFamily: mono,
                        letterSpacing: "0.05em",
                      }}
                    >
                      INVITED BY{" "}
                      <strong style={{ color: "#ffffff" }}>
                        {organizerName.toUpperCase()}
                      </strong>
                    </span>
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      borderBottom: "1px solid #1f1f1f",
                      backgroundColor: "#0d0d0d",
                      padding: "14px 20px",
                    }}
                  >
                    <table width="100%" cellPadding="0" cellSpacing="0">
                      <tbody>
                        <tr>
                          <td
                            width="56"
                            style={{
                              fontSize: "10px",
                              color: "#444444",
                              fontFamily: mono,
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                              paddingBottom: "5px",
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
                              paddingBottom: "5px",
                            }}
                          >
                            Invitely.gg &lt;noreply@invitely.gg&gt;
                          </td>
                        </tr>
                        <tr>
                          <td
                            width="56"
                            style={{
                              fontSize: "10px",
                              color: "#444444",
                              fontFamily: mono,
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                              paddingBottom: "5px",
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
                              paddingBottom: "5px",
                            }}
                          >
                            {recipientName || "You"}
                          </td>
                        </tr>
                        <tr>
                          <td
                            width="56"
                            style={{
                              fontSize: "10px",
                              color: "#444444",
                              fontFamily: mono,
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
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
                  <td style={{ padding: "28px 20px" }}>
                    <table width="100%" cellPadding="0" cellSpacing="0">
                      <tbody>
                        <tr>
                          <td style={{ paddingBottom: "20px" }}>
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
                                    <p
                                      style={{
                                        margin: "0 0 8px 0",
                                        fontSize: "12px",
                                        color: "#888888",
                                        fontFamily: mono,
                                      }}
                                    >
                                      📅&nbsp;&nbsp;{eventDate}
                                    </p>
                                    <p
                                      style={{
                                        margin: 0,
                                        fontSize: "12px",
                                        color: "#888888",
                                        fontFamily: mono,
                                      }}
                                    >
                                      📍&nbsp;&nbsp;{eventLocation}
                                    </p>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              borderTop: "1px solid #1f1f1f",
                              paddingBottom: "20px",
                            }}
                          />
                        </tr>

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
                        <tr>
                          <td
                            style={{
                              borderTop: "1px solid #1f1f1f",
                              paddingBottom: "20px",
                            }}
                          />
                        </tr>

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
                                {recipientName || "there"}
                              </strong>
                              , will you be attending?
                            </p>
                          </td>
                        </tr>

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
                                      ✓ ATTENDING
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
                                      ? MAYBE
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
                                      ✕ CAN&apos;T MAKE IT
                                    </a>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>

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
                        color: "#333333",
                        fontFamily: mono,
                        letterSpacing: "0.05em",
                      }}
                    >
                      SENT VIA{" "}
                      <strong style={{ color: "#ffffff" }}>INVITELY.GG</strong>{" "}
                      ON BEHALF OF {organizerName.toUpperCase()}
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
