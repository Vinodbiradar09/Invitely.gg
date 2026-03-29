interface CancelEmailProps {
  organizerName: string;
  organizerEmail: string;
  recipientName: string;
  recipientEmail: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
}

export function CancelEmail({
  organizerName,
  organizerEmail,
  recipientName,
  recipientEmail,
  eventName,
  eventDate,
  eventLocation,
}: CancelEmailProps) {
  const mono = "'Courier New', Courier, monospace";
  const toValue = recipientEmail || recipientName || "You";
  const greetName = recipientName || recipientEmail || "there";

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
                            {organizerEmail}
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
                            Cancelled: {eventName}
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
                                      borderLeft: "2px solid #7f1d1d",
                                      paddingLeft: "10px",
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontSize: "11px",
                                        color: "#f87171",
                                        fontFamily: mono,
                                        fontWeight: "bold",
                                      }}
                                    >
                                      EVENT CANCELLED
                                    </span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>

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
                                              fontSize: "10px",
                                              color: "#444444",
                                              fontFamily: mono,
                                              paddingRight: "12px",
                                              paddingBottom: "8px",
                                              verticalAlign: "top",
                                              whiteSpace: "nowrap",
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
                                              textDecoration: "line-through",
                                            }}
                                          >
                                            {eventDate}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td
                                            style={{
                                              fontSize: "10px",
                                              color: "#444444",
                                              fontFamily: mono,
                                              paddingRight: "12px",
                                              verticalAlign: "top",
                                              whiteSpace: "nowrap",
                                            }}
                                          >
                                            LOCATION
                                          </td>
                                          <td
                                            style={{
                                              fontSize: "12px",
                                              color: "#888888",
                                              fontFamily: mono,
                                              textDecoration: "line-through",
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
                            <p
                              style={{
                                margin: "0 0 10px 0",
                                fontSize: "13px",
                                color: "#aaaaaa",
                                fontFamily: mono,
                                lineHeight: "1.7",
                              }}
                            >
                              Hey{" "}
                              <strong style={{ color: "#ffffff" }}>
                                {greetName}
                              </strong>
                              , unfortunately this event has been cancelled.
                            </p>
                            <p
                              style={{
                                margin: 0,
                                fontSize: "13px",
                                color: "#aaaaaa",
                                fontFamily: mono,
                                lineHeight: "1.7",
                              }}
                            >
                              We&apos;re sorry for any inconvenience. You
                              don&apos;t need to take any action.
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
