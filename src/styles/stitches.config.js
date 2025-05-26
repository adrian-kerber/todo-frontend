// src/styles/stitches.config.js
import { createStitches } from "@stitches/react";

export const { styled, css, globalCss } = createStitches({
  theme: {
    colors: {
      background: "#18181b",
      surface: "#232329",
      primary: "#22d3ee",
      accent: "#a78bfa",
      text: "#f1f5f9",
      muted: "#4b5563",
      danger: "#ef4444"
    },
    space: {
      xs: "6px",
      sm: "12px",
      md: "24px",
      lg: "48px"
    },
    radii: {
      sm: "8px",
      md: "18px",
      lg: "36px"
    },
    fontSizes: {
      base: "18px",
      lg: "26px",
      xl: "38px"
    },
    shadows: {
      glass: "0 8px 32px 0 rgba(31, 38, 135, 0.15)"
    }
  }
});
export const globalStyles = globalCss({
  body: {
    background: "#18181b",
    color: "#f1f5f9",
    fontFamily: "Inter, Arial, sans-serif",
    margin: 0,
    minHeight: "100vh",
  },
  "*": {
    boxSizing: "border-box",
  },
});