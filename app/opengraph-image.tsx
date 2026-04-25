import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Invitely.gg | Send Invitations at Scale, On Your Behalf";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const logoSrc = await fetch(
    new URL("https://invitely-gg.vercel.app/invitely.jpeg"),
  ).then((res) => res.arrayBuffer());

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
        fontFamily: "monospace",
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
          padding: "72px 96px",
          gap: "20px",
          zIndex: 1,
        }}
      >
        <img
          src={logoSrc as unknown as string}
          width={80}
          height={80}
          alt="Invitely.gg logo"
          style={{
            borderRadius: "0px",
            border: "1px solid #222",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />

        <div
          style={{
            color: "#ffffff",
            fontSize: 60,
            fontWeight: 700,
            letterSpacing: "-1px",
            marginTop: 8,
          }}
        >
          Invitely.gg
        </div>

        <div
          style={{
            color: "#666666",
            fontSize: 24,
            letterSpacing: "0.5px",
            marginTop: -4,
          }}
        >
          Send Invitations at Scale, On Your Behalf.
        </div>
      </div>
    </div>,
    size,
  );
}
