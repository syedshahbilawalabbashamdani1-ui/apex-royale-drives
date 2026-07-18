import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A1A2E",
          borderRadius: "6px",
          position: "relative",
        }}
      >
        {/* Gear shape - outer ring */}
        <svg
          viewBox="0 0 100 100"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
        >
          <defs>
            <linearGradient id="gearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#20E0FF" />
              <stop offset="100%" stopColor="#14649B" />
            </linearGradient>
          </defs>
          {/* Gear teeth */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <rect
              key={angle}
              x="46"
              y="2"
              width="8"
              height="14"
              rx="2"
              fill="url(#gearGrad)"
              transform={`rotate(${angle} 50 50)`}
            />
          ))}
          {/* Gear circle */}
          <circle
            cx="50"
            cy="50"
            r="32"
            fill="none"
            stroke="url(#gearGrad)"
            strokeWidth="6"
          />
        </svg>
        {/* AR text */}
        <div
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            fontFamily: "sans-serif",
            color: "white",
            letterSpacing: "-2px",
            zIndex: 1,
          }}
        >
          AR
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
