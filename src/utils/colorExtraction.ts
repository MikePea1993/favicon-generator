// src/utils/colorExtraction.ts - Brand Color Extraction with Smart Analysis

export interface ColorAnalysis {
  dominantColors: string[];
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  suggestedPalettes: {
    name: string;
    description: string;
    backgroundColor: string;
    textColor: string;
    gradientStart?: string;
    gradientEnd?: string;
  }[];
  brightness: "light" | "dark";
  saturation: "low" | "medium" | "high";
}

interface ColorInfo {
  hex: string;
  rgb: [number, number, number];
  frequency: number;
  brightness: number;
  saturation: number;
}

/**
 * Extract dominant colors from an image using advanced color analysis
 */
export async function extractBrandColors(
  imageUrl: string,
): Promise<ColorAnalysis> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        // Resize image for faster processing (max 200x200)
        const maxSize = 200;
        const scale = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Extract and analyze colors
        const colorMap = new Map<string, ColorInfo>();

        // Sample every 4th pixel for performance
        for (let i = 0; i < data.length; i += 16) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          // Skip transparent pixels
          if (a < 128) continue;

          // Skip very light/dark pixels (likely background)
          const brightness = (r + g + b) / 3;
          if (brightness < 20 || brightness > 235) continue;

          const hex = rgbToHex(r, g, b);
          const existing = colorMap.get(hex);

          if (existing) {
            existing.frequency++;
          } else {
            colorMap.set(hex, {
              hex,
              rgb: [r, g, b],
              frequency: 1,
              brightness: brightness,
              saturation: calculateSaturation(r, g, b),
            });
          }
        }

        // Sort colors by frequency and filter by minimum occurrence
        const sortedColors = Array.from(colorMap.values())
          .filter((color) => color.frequency > 5) // Minimum frequency threshold
          .sort((a, b) => b.frequency - a.frequency);

        if (sortedColors.length === 0) {
          // Fallback to basic analysis if no significant colors found
          const fallbackColors = ["#3b82f6", "#8b5cf6", "#ec4899"];
          resolve(createFallbackAnalysis(fallbackColors));
          return;
        }

        // Group similar colors and get dominant ones
        const dominantColors = groupSimilarColors(sortedColors).slice(0, 8);

        // Analyze brightness and saturation
        const avgBrightness =
          dominantColors.reduce((sum, c) => sum + c.brightness, 0) /
          dominantColors.length;
        const avgSaturation =
          dominantColors.reduce((sum, c) => sum + c.saturation, 0) /
          dominantColors.length;

        const brightness = avgBrightness > 127 ? "light" : "dark";
        const saturation =
          avgSaturation < 30 ? "low" : avgSaturation > 70 ? "high" : "medium";

        // Select primary, secondary, and accent colors
        const primaryColor = dominantColors[0].hex;
        const secondaryColor = findComplementaryColor(
          dominantColors,
          primaryColor,
        );
        const accentColor = findAccentColor(
          dominantColors,
          primaryColor,
          secondaryColor,
        );

        // Generate smart color palettes
        const suggestedPalettes = generateSmartPalettes(
          dominantColors,
          brightness,
          saturation,
        );

        resolve({
          dominantColors: dominantColors.map((c) => c.hex),
          primaryColor,
          secondaryColor,
          accentColor,
          suggestedPalettes,
          brightness,
          saturation,
        });
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = imageUrl;
  });
}

/**
 * Group similar colors together to avoid near-duplicates
 */
function groupSimilarColors(colors: ColorInfo[]): ColorInfo[] {
  const grouped: ColorInfo[] = [];
  const threshold = 30; // Color similarity threshold

  for (const color of colors) {
    const isSimilar = grouped.some((existing) => {
      const [r1, g1, b1] = color.rgb;
      const [r2, g2, b2] = existing.rgb;
      const distance = Math.sqrt(
        Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2),
      );
      return distance < threshold;
    });

    if (!isSimilar) {
      grouped.push(color);
    }
  }

  return grouped;
}

/**
 * Find complementary color from available options
 */
function findComplementaryColor(
  colors: ColorInfo[],
  primaryColor: string,
): string {
  const primary = colors.find((c) => c.hex === primaryColor);
  if (!primary) return colors[1]?.hex || "#8b5cf6";

  // Find color with good contrast and different hue
  for (const color of colors.slice(1)) {
    const contrast = calculateContrast(primary.rgb, color.rgb);
    if (contrast > 2) {
      return color.hex;
    }
  }

  return colors[1]?.hex || "#8b5cf6";
}

/**
 * Find accent color (brightest or most saturated)
 */
function findAccentColor(
  colors: ColorInfo[],
  primaryColor: string,
  secondaryColor: string,
): string {
  const excluded = [primaryColor, secondaryColor];
  const candidates = colors.filter((c) => !excluded.includes(c.hex));

  if (candidates.length === 0) return "#ec4899";

  // Prefer high saturation colors for accent
  const accentColor = candidates.reduce((best, current) =>
    current.saturation > best.saturation ? current : best,
  );

  return accentColor.hex;
}

/**
 * Generate intelligent color palettes based on extracted colors
 */
function generateSmartPalettes(
  colors: ColorInfo[],
  brightness: "light" | "dark",
  saturation: "low" | "medium" | "high",
): ColorAnalysis["suggestedPalettes"] {
  const primary = colors[0].hex;
  const secondary = colors[1]?.hex || "#8b5cf6";
  const accent = colors[2]?.hex || "#ec4899";

  const palettes: ColorAnalysis["suggestedPalettes"] = [];

  // Brand Colors Palette
  palettes.push({
    name: "Brand Colors",
    description: "Your main brand colors extracted from the image",
    backgroundColor: primary,
    textColor: brightness === "light" ? "#000000" : "#ffffff",
  });

  // Brand Gradient Palette
  palettes.push({
    name: "Brand Gradient",
    description: "Gradient using your extracted brand colors",
    backgroundColor: "transparent",
    textColor: brightness === "light" ? "#000000" : "#ffffff",
    gradientStart: primary,
    gradientEnd: secondary,
  });

  // High Contrast Palette
  const contrastBg = brightness === "light" ? "#000000" : "#ffffff";
  const contrastText = brightness === "light" ? "#ffffff" : "#000000";
  palettes.push({
    name: "High Contrast",
    description: "Maximum readability with extracted accent color",
    backgroundColor: contrastBg,
    textColor: accent,
  });

  // Monochromatic Palette
  const monoBg = adjustBrightness(primary, brightness === "light" ? -40 : 40);
  palettes.push({
    name: "Monochromatic",
    description: "Single color theme based on your primary brand color",
    backgroundColor: monoBg,
    textColor: brightness === "light" ? "#000000" : "#ffffff",
  });

  // Complementary Palette
  const complementary = generateComplementaryColor(primary);
  palettes.push({
    name: "Complementary",
    description: "Opposite color harmony for vibrant contrast",
    backgroundColor: "transparent",
    textColor: "#ffffff",
    gradientStart: primary,
    gradientEnd: complementary,
  });

  // Accent Focus Palette
  palettes.push({
    name: "Accent Focus",
    description: "Subtle background with vibrant accent color",
    backgroundColor: adjustBrightness(
      primary,
      brightness === "light" ? 60 : -60,
    ),
    textColor: accent,
  });

  return palettes;
}

/**
 * Utility functions
 */
function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = Math.round(x).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

function calculateSaturation(r: number, g: number, b: number): number {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  return max === 0 ? 0 : (delta / max) * 100;
}

function calculateContrast(
  rgb1: [number, number, number],
  rgb2: [number, number, number],
): number {
  const l1 = getLuminance(rgb1);
  const l2 = getLuminance(rgb2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function getLuminance([r, g, b]: [number, number, number]): number {
  const sRGB = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}

function adjustBrightness(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amount));
  const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amount));
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

function generateComplementaryColor(hex: string): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = 255 - (num >> 16);
  const g = 255 - ((num >> 8) & 0x00ff);
  const b = 255 - (num & 0x0000ff);
  return rgbToHex(r, g, b);
}

function createFallbackAnalysis(colors: string[]): ColorAnalysis {
  return {
    dominantColors: colors,
    primaryColor: colors[0],
    secondaryColor: colors[1],
    accentColor: colors[2],
    brightness: "dark",
    saturation: "medium",
    suggestedPalettes: [
      {
        name: "Default Blue",
        description: "Professional blue theme",
        backgroundColor: "#3b82f6",
        textColor: "#ffffff",
      },
      {
        name: "Blue Gradient",
        description: "Modern gradient design",
        backgroundColor: "transparent",
        textColor: "#ffffff",
        gradientStart: "#3b82f6",
        gradientEnd: "#8b5cf6",
      },
    ],
  };
}
