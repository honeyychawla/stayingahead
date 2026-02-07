import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Staying Ahead | Join the Free AI Updates Community";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0A0A0A",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Lime accent bar at top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            backgroundColor: "#C4F249",
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#1A1A1A",
            border: "1px solid #333",
            borderRadius: "9999px",
            padding: "8px 24px",
            marginBottom: "32px",
          }}
        >
          <span style={{ color: "#C4F249", fontSize: "20px" }}>
            Free AI Community
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "72px",
            fontWeight: 700,
            color: "#FFFFFF",
            letterSpacing: "-0.02em",
            marginBottom: "20px",
          }}
        >
          Staying Ahead
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "28px",
            color: "#888888",
            maxWidth: "700px",
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          Curated AI updates, resources, and session invites on WhatsApp
        </div>

        {/* Lime accent bar at bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            backgroundColor: "#C4F249",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
