import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Jos North Culture & Tourism CDS Platform"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 60,
        background: "linear-gradient(135deg, #f5f5f0 0%, #e8f5f0 100%)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px",
        fontFamily: "system-ui",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: "bold",
            color: "#3D2817",
            marginBottom: 20,
            lineHeight: 1.2,
          }}
        >
          Jos North Culture & Tourism CDS
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#0F766E",
            marginTop: 20,
            maxWidth: 900,
            lineHeight: 1.4,
          }}
        >
          Empowering NYSC corps members to explore, document, and promote Jos's rich cultural heritage
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#666",
            marginTop: 40,
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <span>🏛️ Cultural Sites</span>
          <span>•</span>
          <span>📅 Events</span>
          <span>•</span>
          <span>📖 Stories</span>
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  )
}
