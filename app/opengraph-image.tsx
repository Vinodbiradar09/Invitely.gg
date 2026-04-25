import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Invitely.gg | Send Invitations at Scale, On Your Behalf";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        background: "#0a0a0a",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(#1f1f1f 1px, transparent 1px), linear-gradient(90deg, #1f1f1f 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#000",
          border: "1px solid #222",
          borderRadius: "24px",
          padding: "64px 80px",
          gap: "16px",
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            background: "#f80",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            marginBottom: 8,
          }}
        >
          ✉
        </div>

        <div
          style={{
            color: "#fff",
            fontSize: 56,
            fontWeight: 700,
            letterSpacing: "-1px",
          }}
        >
          Invitely.gg
        </div>

        <div style={{ color: "#888", fontSize: 26, marginTop: 4 }}>
          Send Invitations at Scale, On Your Behalf.
        </div>
      </div>
    </div>,
    size,
  );
}
