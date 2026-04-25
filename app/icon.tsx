import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "radial-gradient(circle at 35% 30%, #2f2f33 0%, #09090b 55%, #000 100%)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 16,
          display: "flex",
          height: "100%",
          justifyContent: "center",
          position: "relative",
          width: "100%"
        }}
      >
        <div
          style={{
            border: "3px solid rgba(255,255,255,0.9)",
            borderRadius: 14,
            display: "flex",
            height: 32,
            position: "relative",
            transform: "rotate(-18deg)",
            width: 18
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.95)",
              borderRadius: "999px",
              height: 8,
              left: 5,
              position: "absolute",
              top: 7,
              width: 8
            }}
          />
          <div
            style={{
              borderBottom: "8px solid transparent",
              borderLeft: "10px solid rgba(255,255,255,0.92)",
              borderTop: "8px solid transparent",
              height: 0,
              position: "absolute",
              right: -9,
              top: 8,
              width: 0
            }}
          />
          <div
            style={{
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: "12px solid rgba(255,255,255,0.92)",
              bottom: -11,
              height: 0,
              left: 3,
              position: "absolute",
              width: 0
            }}
          />
        </div>

        <div
          style={{
            border: "1.5px solid rgba(255,255,255,0.35)",
            borderRadius: "999px",
            height: 44,
            position: "absolute",
            right: 8,
            top: 10,
            width: 44
          }}
        />
        <div
          style={{
            background: "rgba(255,255,255,0.96)",
            borderRadius: "999px",
            bottom: 14,
            height: 6,
            position: "absolute",
            right: 18,
            width: 6
          }}
        />
      </div>
    ),
    size
  );
}
