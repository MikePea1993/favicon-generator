// src/types/favicon.ts

export interface FaviconConfig {
  text: string;
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  shape: "transparent" | "square" | "rounded" | "circle";
  backgroundType?: "solid" | "gradient" | "transparent";
  gradientStart?: string;
  gradientEnd?: string;
  gradientDirection?: string;
  gradientStartTransparent?: boolean;
  gradientEndTransparent?: boolean;
}

export const DEFAULT_CONFIG: FaviconConfig = {
  text: "", // No default text - let users type what they want
  backgroundColor: "#3b82f6",
  textColor: "#ffffff",
  fontSize: 32,
  fontFamily: "Inter",
  fontWeight: "bold",
  shape: "rounded",
  backgroundType: "solid",
  gradientStart: "#3b82f6",
  gradientEnd: "#8b5cf6",
  gradientDirection: "45deg",
  gradientStartTransparent: false,
  gradientEndTransparent: false,
};
