// src/utils/faviconGenerator.ts - UPDATED WITH 20,000+ ICONS
import { FaviconConfig } from "../types/favicon";
import {
  renderReactIconToCanvas,
  MEGA_ICON_LIBRARY,
  type IconData,
} from "./quickIconLibrary";

// ICO file generation helper
async function generateIcoFile(
  canvas16: HTMLCanvasElement,
  canvas32: HTMLCanvasElement,
): Promise<Blob> {
  // Get image data from both canvases
  const imageData16 = canvas16.getContext("2d")!.getImageData(0, 0, 16, 16);
  const imageData32 = canvas32.getContext("2d")!.getImageData(0, 0, 32, 32);

  // Convert to RGBA arrays
  const rgba16 = imageData16.data;
  const rgba32 = imageData32.data;

  // ICO header (6 bytes)
  const header = new Uint8Array([
    0,
    0, // Reserved, must be 0
    1,
    0, // Type: 1 = ICO
    2,
    0, // Number of images: 2 (16x16 and 32x32)
  ]);

  // Directory entries (16 bytes each)
  const dir16 = new Uint8Array([
    16, // Width: 16
    16, // Height: 16
    0, // Colors: 0 = more than 256
    0, // Reserved
    1,
    0, // Color planes: 1
    32,
    0, // Bits per pixel: 32 (RGBA)
    0,
    0,
    0,
    0, // Size of image data (will be filled)
    0,
    0,
    0,
    0, // Offset to image data (will be filled)
  ]);

  const dir32 = new Uint8Array([
    32, // Width: 32
    32, // Height: 32
    0, // Colors: 0 = more than 256
    0, // Reserved
    1,
    0, // Color planes: 1
    32,
    0, // Bits per pixel: 32 (RGBA)
    0,
    0,
    0,
    0, // Size of image data (will be filled)
    0,
    0,
    0,
    0, // Offset to image data (will be filled)
  ]);

  // Create BMP data for 16x16
  const bmp16Header = new Uint8Array([
    40,
    0,
    0,
    0, // Header size: 40
    16,
    0,
    0,
    0, // Width: 16
    32,
    0,
    0,
    0, // Height: 32 (16*2 for AND mask)
    1,
    0, // Planes: 1
    32,
    0, // Bits per pixel: 32
    0,
    0,
    0,
    0, // Compression: 0 = none
    0,
    0,
    0,
    0, // Image size: 0 = uncompressed
    0,
    0,
    0,
    0, // X pixels per meter: 0
    0,
    0,
    0,
    0, // Y pixels per meter: 0
    0,
    0,
    0,
    0, // Colors used: 0
    0,
    0,
    0,
    0, // Important colors: 0
  ]);

  // Create BMP data for 32x32
  const bmp32Header = new Uint8Array([
    40,
    0,
    0,
    0, // Header size: 40
    32,
    0,
    0,
    0, // Width: 32
    64,
    0,
    0,
    0, // Height: 64 (32*2 for AND mask)
    1,
    0, // Planes: 1
    32,
    0, // Bits per pixel: 32
    0,
    0,
    0,
    0, // Compression: 0 = none
    0,
    0,
    0,
    0, // Image size: 0 = uncompressed
    0,
    0,
    0,
    0, // X pixels per meter: 0
    0,
    0,
    0,
    0, // Y pixels per meter: 0
    0,
    0,
    0,
    0, // Colors used: 0
    0,
    0,
    0,
    0, // Important colors: 0
  ]);

  // Convert RGBA to BGRA and flip vertically (BMP requirement)
  const bgra16 = new Uint8Array(16 * 16 * 4);
  const bgra32 = new Uint8Array(32 * 32 * 4);

  // 16x16 conversion
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const srcIndex = ((15 - y) * 16 + x) * 4; // Flip vertically
      const dstIndex = (y * 16 + x) * 4;
      bgra16[dstIndex] = rgba16[srcIndex + 2]; // B
      bgra16[dstIndex + 1] = rgba16[srcIndex + 1]; // G
      bgra16[dstIndex + 2] = rgba16[srcIndex]; // R
      bgra16[dstIndex + 3] = rgba16[srcIndex + 3]; // A
    }
  }

  // 32x32 conversion
  for (let y = 0; y < 32; y++) {
    for (let x = 0; x < 32; x++) {
      const srcIndex = ((31 - y) * 32 + x) * 4; // Flip vertically
      const dstIndex = (y * 32 + x) * 4;
      bgra32[dstIndex] = rgba32[srcIndex + 2]; // B
      bgra32[dstIndex + 1] = rgba32[srcIndex + 1]; // G
      bgra32[dstIndex + 2] = rgba32[srcIndex]; // R
      bgra32[dstIndex + 3] = rgba32[srcIndex + 3]; // A
    }
  }

  // AND masks (1 bit per pixel, all zeros since we use alpha channel)
  const andMask16 = new Uint8Array(Math.ceil((16 * 16) / 8));
  const andMask32 = new Uint8Array(Math.ceil((32 * 32) / 8));

  // Calculate sizes and offsets
  const image16Size = bmp16Header.length + bgra16.length + andMask16.length;
  const image32Size = bmp32Header.length + bgra32.length + andMask32.length;
  const offset16 = header.length + dir16.length + dir32.length;
  const offset32 = offset16 + image16Size;

  // Fill in the directory entries
  const view16 = new DataView(dir16.buffer);
  view16.setUint32(8, image16Size, true); // Size
  view16.setUint32(12, offset16, true); // Offset

  const view32 = new DataView(dir32.buffer);
  view32.setUint32(8, image32Size, true); // Size
  view32.setUint32(12, offset32, true); // Offset

  // Combine all parts
  const totalSize =
    header.length + dir16.length + dir32.length + image16Size + image32Size;
  const icoData = new Uint8Array(totalSize);
  let offset = 0;

  icoData.set(header, offset);
  offset += header.length;

  icoData.set(dir16, offset);
  offset += dir16.length;

  icoData.set(dir32, offset);
  offset += dir32.length;

  // 16x16 image
  icoData.set(bmp16Header, offset);
  offset += bmp16Header.length;
  icoData.set(bgra16, offset);
  offset += bgra16.length;
  icoData.set(andMask16, offset);
  offset += andMask16.length;

  // 32x32 image
  icoData.set(bmp32Header, offset);
  offset += bmp32Header.length;
  icoData.set(bgra32, offset);
  offset += bgra32.length;
  icoData.set(andMask32, offset);

  return new Blob([icoData], { type: "image/x-icon" });
}

// MEGA FAVICON GENERATOR with 20,000+ icons
export async function generateFavicon(
  config: FaviconConfig,
  size: number = 64,
  uploadedImage?: string,
  imageScale: number = 1,
  inputType: "text" | "icon" | "image" = "text",
  selectedIconData?: IconData | null,
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  canvas.width = size;
  canvas.height = size;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.clearRect(0, 0, size, size);

  // Apply shape clipping
  ctx.save();
  if (config.shape === "circle") {
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 2, 0, 2 * Math.PI);
    ctx.clip();
  } else if (config.shape === "rounded") {
    const radius = size * 0.2;
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(size - radius, 0);
    ctx.quadraticCurveTo(size, 0, size, radius);
    ctx.lineTo(size, size - radius);
    ctx.quadraticCurveTo(size, size, size - radius, size);
    ctx.lineTo(radius, size);
    ctx.quadraticCurveTo(0, size, 0, size - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.clip();
  } else if (config.shape === "square") {
    // Small border radius for square
    const radius = size * 0.08;
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(size - radius, 0);
    ctx.quadraticCurveTo(size, 0, size, radius);
    ctx.lineTo(size, size - radius);
    ctx.quadraticCurveTo(size, size, size - radius, size);
    ctx.lineTo(radius, size);
    ctx.quadraticCurveTo(0, size, 0, size - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.clip();
  }
  // For "transparent" shape, no clipping is applied

  // Draw background
  if (
    config.shape === "transparent" ||
    config.backgroundType === "transparent"
  ) {
    // Skip background
  } else if (config.backgroundType === "gradient") {
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    const startColor = config.gradientStartTransparent
      ? "rgba(0,0,0,0)"
      : config.gradientStart || "#3b82f6";
    const endColor = config.gradientEndTransparent
      ? "rgba(0,0,0,0)"
      : config.gradientEnd || "#8b5cf6";
    gradient.addColorStop(0, startColor);
    gradient.addColorStop(1, endColor);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  } else {
    ctx.fillStyle = config.backgroundColor;
    ctx.fillRect(0, 0, size, size);
  }

  // Draw content
  if (inputType === "image" && uploadedImage) {
    // Upload image
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = uploadedImage;
    });

    const scaledSize = size * imageScale;
    const x = (size - scaledSize) / 2;
    const y = (size - scaledSize) / 2;
    ctx.drawImage(img, x, y, scaledSize, scaledSize);
  } else if (inputType === "icon" && selectedIconData) {
    // 🚀 RENDER ANY OF 20,000+ ICONS
    try {
      const IconComponent = selectedIconData.component;
      if (IconComponent) {
        const iconSize = Math.floor(size * 0.7 * imageScale);
        const iconCanvas = await renderReactIconToCanvas(
          IconComponent,
          iconSize,
          config.textColor,
        );

        const x = (size - iconSize) / 2;
        const y = (size - iconSize) / 2;
        ctx.drawImage(iconCanvas, x, y);
      }
    } catch (error) {
      console.error("Icon rendering failed:", error);
      // Fallback to text with custom font
      ctx.fillStyle = config.textColor;
      const fontSize = Math.floor(config.fontSize * (size / 64) * imageScale);
      const fontWeight = config.fontWeight || "bold";
      const fontFamily = config.fontFamily || "Inter";

      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}, Arial, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        selectedIconData.displayName.charAt(0).toUpperCase(),
        size / 2,
        size / 2,
      );
    }
  } else if (inputType === "text" && config.text) {
    // Text rendering with custom font
    ctx.fillStyle = config.textColor;
    const scaledFontSize = Math.floor(
      config.fontSize * (size / 64) * imageScale,
    );

    // Apply custom font family and weight
    const fontWeight = config.fontWeight || "bold";
    const fontFamily = config.fontFamily || "Inter";

    ctx.font = `${fontWeight} ${scaledFontSize}px ${fontFamily}, Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(config.text, size / 2, size / 2);
  }

  ctx.restore();
  return canvas;
}

// Enhanced download with 20k+ icon support
export async function downloadFaviconPackage(
  config: FaviconConfig,
  uploadedImage?: string,
  imageScale: number = 1,
  inputType: "text" | "icon" | "image" = "text",
  selectedIconData?: IconData | null,
  brandInfo?: { name?: string; description?: string }, // Add brand info parameter
): Promise<void> {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();

  const sizes = [16, 32, 48, 64, 96, 128, 180, 192, 256, 512];
  let canvas16: HTMLCanvasElement | null = null;
  let canvas32: HTMLCanvasElement | null = null;

  // Generate all sizes
  for (const size of sizes) {
    const canvas = await generateFavicon(
      config,
      size,
      uploadedImage,
      imageScale,
      inputType,
      selectedIconData,
    );

    if (size === 16) canvas16 = canvas;
    if (size === 32) canvas32 = canvas;

    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => resolve(blob!), "image/png", 1.0);
    });

    let filename = `favicon-${size}x${size}.png`;
    if (size === 180) filename = "apple-touch-icon.png";
    if (size === 192) filename = "android-chrome-192x192.png";
    if (size === 512) filename = "android-chrome-512x512.png";

    zip.file(filename, blob);
  }

  // Generate favicon.ico
  if (canvas16 && canvas32) {
    try {
      const icoBlob = await generateIcoFile(canvas16, canvas32);
      zip.file("favicon.ico", icoBlob);
    } catch (error) {
      console.warn("Failed to generate .ico file:", error);
      // Fallback: use PNG as .ico
      if (canvas32) {
        const fallbackBlob = await new Promise<Blob>((resolve) => {
          canvas32.toBlob((blob) => resolve(blob!), "image/png", 1.0);
        });
        zip.file("favicon.ico", fallbackBlob);
      }
    }
  }

  // Add comprehensive HTML code
  const iconInfo = selectedIconData
    ? `${selectedIconData.displayName} (${selectedIconData.libraryName})`
    : inputType === "text"
      ? `Text: "${config.text}"`
      : "Custom image";

  const htmlCode = `<!-- 🚀 PROFESSIONAL FAVICON PACKAGE -->
<!-- Generated from: ${iconInfo} -->
<!-- Created with 20,000+ Icon Library -->

<!-- Primary favicon for all browsers -->
<link rel="icon" type="image/x-icon" href="/favicon.ico">

<!-- Modern PNG favicons -->
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">

<!-- Apple devices -->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

<!-- Android devices -->
<link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png">

<!-- Web app manifest -->
<link rel="manifest" href="/site.webmanifest">

<!-- Theme color for browsers -->
<meta name="theme-color" content="${getThemeColor(config)}">

<!-- Additional sizes for various uses -->
<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">
<link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
<link rel="icon" type="image/png" sizes="128x128" href="/favicon-128x128.png">
<link rel="icon" type="image/png" sizes="256x256" href="/favicon-256x256.png">

<!-- 
🎯 Professional Favicon Generator
✅ 20,000+ icons from top libraries
✅ Perfect quality at all sizes
✅ Universal browser compatibility
-->`;

  zip.file("favicon-html-code.html", htmlCode);

  // Add README with icon info
  const readme = `# 🚀 Professional Favicon Package

## 📊 Package Info:
- Generated: ${new Date().toLocaleString()}
- Content: ${iconInfo}
- Font: ${config.fontFamily} ${config.fontWeight}
- Scale: ${imageScale}x
- Shape: ${config.shape}
- Background: ${config.backgroundType || "solid"}
- Library: Professional Generator with 20,000+ icons
${brandInfo?.name ? `- Brand: ${brandInfo.name}` : ""}
${brandInfo?.description ? `- Description: ${brandInfo.description}` : ""}

## 📋 Installation Instructions:
1. Extract all files to the root of your website
2. Add the following code to the <head> section of your HTML:

\`\`\`html
<!-- Favicon Package Generated by Favicon Generator Pro -->
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="${getThemeColor(config)}">
\`\`\`

Generated by Favicon Generator Pro 🎯
${brandInfo?.name ? `For: ${brandInfo.name}` : ""}`;

  zip.file("README.md", readme);

  // Web manifest with brand info
  const manifest = {
    name: brandInfo?.name || "Your Website",
    short_name: brandInfo?.name?.split(" ")[0] || "Website",
    description: brandInfo?.description || "",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    theme_color: getThemeColor(config),
    background_color: getThemeColor(config),
    display: "standalone",
  };

  zip.file("site.webmanifest", JSON.stringify(manifest, null, 2));

  // Download
  const zipBlob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(zipBlob);
  const link = document.createElement("a");
  link.href = url;

  const iconName = selectedIconData
    ? selectedIconData.displayName
    : config.text || "favicon";
  link.download = `professional-favicon-${iconName.replace(/\s+/g, "-")}.zip`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Helper function
function getThemeColor(config: FaviconConfig): string {
  if (config.backgroundType === "transparent") return "#ffffff";
  if (config.backgroundType === "gradient") {
    if (config.gradientStartTransparent && !config.gradientEndTransparent) {
      return config.gradientEnd || "#8b5cf6";
    } else if (
      config.gradientEndTransparent &&
      !config.gradientStartTransparent
    ) {
      return config.gradientStart || "#3b82f6";
    } else if (
      config.gradientStartTransparent &&
      config.gradientEndTransparent
    ) {
      return "#ffffff";
    } else {
      return config.gradientStart || "#3b82f6";
    }
  }
  return config.backgroundColor;
}

export async function downloadFavicon(
  config: FaviconConfig,
  uploadedImage?: string,
  imageScale: number = 1,
  inputType: "text" | "icon" | "image" = "text",
  selectedIconData?: IconData | null,
): Promise<void> {
  const canvas = await generateFavicon(
    config,
    64,
    uploadedImage,
    imageScale,
    inputType,
    selectedIconData,
  );
  const iconName = selectedIconData
    ? selectedIconData.displayName
    : config.text || "icon";
  const link = document.createElement("a");
  link.download = `favicon-${iconName.replace(/\s+/g, "-")}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}
