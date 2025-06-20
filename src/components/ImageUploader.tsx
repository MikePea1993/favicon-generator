// src/components/ImageUploader.tsx - FIXED HEIGHT VERSION
import { useRef, useState, useEffect } from "react";
import {
  Upload,
  Image as ImageIcon,
  Palette,
  Scissors,
  Loader2,
  RotateCcw,
  Download,
  Wand2,
} from "lucide-react";
import { Button } from "./common";
import {
  extractBrandColors,
  type ColorAnalysis,
} from "../utils/colorExtraction";
import type { FaviconConfig } from "../types/favicon";

interface Props {
  uploadedImage: string | null;
  onImageUpload: (imageUrl: string) => void;
  onApplyColors?: (config: Partial<FaviconConfig>) => void;
}

type ActiveTool = "none" | "colors" | "background";

export default function ImageUploader({
  uploadedImage,
  onImageUpload,
  onApplyColors,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTool, setActiveTool] = useState<ActiveTool>("none");

  // Color extraction state
  const [colors, setColors] = useState<ColorAnalysis | null>(null);
  const [isAnalyzingColors, setIsAnalyzingColors] = useState(false);

  // Background removal state
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessingBg, setIsProcessingBg] = useState(false);
  const [bgError, setBgError] = useState<string | null>(null);

  // Auto-analyze colors when image uploads and colors tool is active
  useEffect(() => {
    if (uploadedImage && !colors && activeTool === "colors") {
      analyzeColors();
    }
  }, [uploadedImage, activeTool]);

  const analyzeColors = async () => {
    if (!uploadedImage) return;

    setIsAnalyzingColors(true);
    try {
      const analysis = await extractBrandColors(uploadedImage);
      setColors(analysis);
    } catch (error) {
      console.error("Color analysis failed:", error);
    } finally {
      setIsAnalyzingColors(false);
    }
  };

  const applyColorPalette = (
    palette: ColorAnalysis["suggestedPalettes"][0],
  ) => {
    if (!onApplyColors) return;

    const config: Partial<FaviconConfig> = {
      backgroundColor: palette.backgroundColor,
      textColor: palette.textColor,
    };

    if (palette.gradientStart && palette.gradientEnd) {
      config.backgroundType = "gradient";
      config.gradientStart = palette.gradientStart;
      config.gradientEnd = palette.gradientEnd;
    } else if (palette.backgroundColor === "transparent") {
      config.backgroundType = "transparent";
    } else {
      config.backgroundType = "solid";
    }

    onApplyColors(config);
  };

  // Background removal logic
  const removeBackground = async () => {
    if (!uploadedImage) return;

    setIsProcessingBg(true);
    setBgError(null);

    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = uploadedImage;
      });

      canvas.width = img.width;
      canvas.height = img.height;

      if (!ctx) throw new Error("Could not get canvas context");

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Simple background removal - remove pixels similar to corners
      const topLeft = [data[0], data[1], data[2]];
      const topRight = [
        data[(canvas.width - 1) * 4],
        data[(canvas.width - 1) * 4 + 1],
        data[(canvas.width - 1) * 4 + 2],
      ];
      const bottomLeft = [
        data[(canvas.height - 1) * canvas.width * 4],
        data[(canvas.height - 1) * canvas.width * 4 + 1],
        data[(canvas.height - 1) * canvas.width * 4 + 2],
      ];
      const bottomRight = [
        data[((canvas.height - 1) * canvas.width + (canvas.width - 1)) * 4],
        data[((canvas.height - 1) * canvas.width + (canvas.width - 1)) * 4 + 1],
        data[((canvas.height - 1) * canvas.width + (canvas.width - 1)) * 4 + 2],
      ];

      const bgColor = [
        Math.round(
          (topLeft[0] + topRight[0] + bottomLeft[0] + bottomRight[0]) / 4,
        ),
        Math.round(
          (topLeft[1] + topRight[1] + bottomLeft[1] + bottomRight[1]) / 4,
        ),
        Math.round(
          (topLeft[2] + topRight[2] + bottomLeft[2] + bottomRight[2]) / 4,
        ),
      ];

      const tolerance = 50;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const colorDiff = Math.sqrt(
          Math.pow(r - bgColor[0], 2) +
            Math.pow(g - bgColor[1], 2) +
            Math.pow(b - bgColor[2], 2),
        );

        if (colorDiff < tolerance) {
          data[i + 3] = 0; // Make transparent
        }
      }

      ctx.putImageData(imageData, 0, 0);
      const processedDataUrl = canvas.toDataURL("image/png");
      setProcessedImage(processedDataUrl);
    } catch (err) {
      console.error("Background removal failed:", err);
      setBgError(
        "Failed to remove background. Please try with a clearer image.",
      );
    } finally {
      setIsProcessingBg(false);
    }
  };

  const useProcessedImage = () => {
    if (processedImage) {
      onImageUpload(processedImage);
      setActiveTool("none");
      setProcessedImage(null);
    }
  };

  const resetBgRemoval = () => {
    setProcessedImage(null);
    setBgError(null);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert("Image size should be less than 10MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onImageUpload(result);
        setColors(null);
        setProcessedImage(null);
        setActiveTool("none");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > 10 * 1024 * 1024) {
        alert("Image size should be less than 10MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onImageUpload(result);
        setColors(null);
        setProcessedImage(null);
        setActiveTool("none");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToolClick = (tool: ActiveTool) => {
    if (activeTool === tool) {
      setActiveTool("none");
    } else {
      setActiveTool(tool);
      if (tool === "colors" && uploadedImage && !colors) {
        analyzeColors();
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area with Integrated Tools */}
      <div className="relative">
        <div
          className={`border-2 border-dashed rounded-2xl text-center transition-all duration-300 cursor-pointer bg-white/5 relative overflow-hidden ${
            isDragging
              ? "border-blue-400 bg-blue-500/10 scale-105"
              : uploadedImage
                ? "border-green-400/50 bg-green-500/5"
                : "border-white/20 hover:border-white/40 hover:bg-white/10"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !uploadedImage && fileInputRef.current?.click()}
        >
          {/* Tool Sidebar - Only shows when image is uploaded */}
          {uploadedImage && (
            <div className="absolute left-4 top-4 flex flex-col gap-2 z-20">
              {/* Brand Color Extraction Tool */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToolClick("colors");
                }}
                className={`p-3 rounded-xl border transition-all duration-200 ${
                  activeTool === "colors"
                    ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
                    : "bg-white/10 border-white/20 text-gray-400 hover:border-white/40 hover:text-white"
                }`}
                title="Extract Brand Colors"
              >
                <Palette className="w-5 h-5" />
              </button>

              {/* Background Remover Tool */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToolClick("background");
                }}
                className={`p-3 rounded-xl border transition-all duration-200 ${
                  activeTool === "background"
                    ? "bg-purple-500/20 border-purple-500/50 text-purple-400"
                    : "bg-white/10 border-white/20 text-gray-400 hover:border-white/40 hover:text-white"
                }`}
                title="Remove Background"
              >
                <Scissors className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Main Content Area - Always Centered */}
          <div className="w-full flex items-center justify-center p-6 relative z-10">
            {uploadedImage ? (
              <div className="w-full max-w-md mx-auto space-y-3">
                {/* Image Preview */}
                <div className="flex justify-center mb-3">
                  <div className="relative group">
                    <img
                      src={uploadedImage}
                      alt="Preview"
                      className="w-24 h-24 object-contain rounded-lg shadow-lg border border-white/20 group-hover:scale-105 transition-transform"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <p className="text-green-400 font-medium text-sm">
                      Image uploaded successfully
                    </p>
                  </div>
                  <p className="text-gray-400 text-xs">
                    Click image to change • Use tools on the left
                  </p>
                </div>

                {/* Active Tool Panel */}
                {activeTool === "colors" && (
                  <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Palette className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-white font-medium">
                        Brand Color Extraction
                      </span>
                    </div>

                    {isAnalyzingColors ? (
                      <div className="flex items-center justify-center gap-2 py-3">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                        <span className="text-blue-400 text-sm">
                          Analyzing colors...
                        </span>
                      </div>
                    ) : colors ? (
                      <div className="space-y-3">
                        {/* Color Swatches */}
                        <div>
                          <p className="text-xs text-gray-400 mb-2">
                            Dominant Colors ({colors.dominantColors.length}):
                          </p>
                          <div className="flex items-center gap-2 mb-2">
                            {colors.dominantColors
                              .slice(0, 6)
                              .map((color, index) => (
                                <div
                                  key={index}
                                  className="w-5 h-5 rounded border border-white/30 cursor-pointer hover:scale-110 transition-transform"
                                  style={{ backgroundColor: color }}
                                  title={`Copy ${color}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigator.clipboard?.writeText(color);
                                  }}
                                />
                              ))}
                            {colors.dominantColors.length > 6 && (
                              <span className="text-xs text-gray-400">
                                +{colors.dominantColors.length - 6}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Smart Palettes */}
                        <div>
                          <p className="text-xs text-gray-400 mb-2">
                            Smart Palettes:
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {colors.suggestedPalettes
                              .slice(0, 2)
                              .map((palette, index) => (
                                <button
                                  key={index}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    applyColorPalette(palette);
                                  }}
                                  className="p-2 rounded border border-white/20 hover:border-blue-400 transition-all group text-left"
                                >
                                  <div
                                    className="w-full h-3 rounded mb-1"
                                    style={{
                                      background:
                                        palette.gradientStart &&
                                        palette.gradientEnd
                                          ? `linear-gradient(135deg, ${palette.gradientStart}, ${palette.gradientEnd})`
                                          : palette.backgroundColor ===
                                              "transparent"
                                            ? `linear-gradient(45deg, #374151 25%, transparent 25%)`
                                            : palette.backgroundColor,
                                      backgroundSize:
                                        palette.backgroundColor ===
                                        "transparent"
                                          ? "6px 6px"
                                          : "auto",
                                    }}
                                  />
                                  <span className="text-xs text-gray-400 group-hover:text-blue-400">
                                    {palette.name}
                                  </span>
                                </button>
                              ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={Wand2}
                          onClick={(e) => {
                            e.stopPropagation();
                            analyzeColors();
                          }}
                        >
                          Analyze Colors
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {activeTool === "background" && (
                  <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Scissors className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-white font-medium">
                        Background Remover
                      </span>
                    </div>

                    {bgError && (
                      <div className="mb-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-xs">
                        {bgError}
                      </div>
                    )}

                    {!processedImage ? (
                      <div className="space-y-2">
                        <p className="text-gray-400 text-xs">
                          Remove the background from your image to create a
                          clean favicon.
                        </p>
                        <Button
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeBackground();
                          }}
                          loading={isProcessingBg}
                          disabled={isProcessingBg}
                          size="sm"
                          icon={isProcessingBg ? Loader2 : Scissors}
                          fullWidth
                        >
                          {isProcessingBg
                            ? "Removing Background..."
                            : "Remove Background"}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {/* Before/After Comparison */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-center">
                            <p className="text-xs text-gray-400 mb-1">
                              Original
                            </p>
                            <img
                              src={uploadedImage}
                              alt="Original"
                              className="w-12 h-12 object-contain mx-auto rounded bg-gray-200"
                            />
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-400 mb-1">
                              Background Removed
                            </p>
                            <div
                              className="w-12 h-12 mx-auto rounded flex items-center justify-center"
                              style={{
                                background: `
                                  linear-gradient(45deg, #374151 25%, transparent 25%), 
                                  linear-gradient(-45deg, #374151 25%, transparent 25%), 
                                  linear-gradient(45deg, transparent 75%, #374151 75%), 
                                  linear-gradient(-45deg, transparent 75%, #374151 75%)
                                `,
                                backgroundSize: "6px 6px",
                                backgroundPosition:
                                  "0 0, 0 3px, 3px -3px, -3px 0px",
                              }}
                            >
                              <img
                                src={processedImage}
                                alt="Processed"
                                className="w-12 h-12 object-contain"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Button
                            variant="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              useProcessedImage();
                            }}
                            icon={Download}
                            size="sm"
                            className="flex-1"
                          >
                            Use This
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              resetBgRemoval();
                            }}
                            icon={RotateCcw}
                            size="sm"
                          >
                            Reset
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full max-w-md mx-auto space-y-4 text-center">
                <div className="relative mb-4">
                  <div
                    className={`w-20 h-20 mx-auto rounded-lg border-2 border-dashed flex items-center justify-center transition-all duration-300 ${
                      isDragging
                        ? "border-blue-400 bg-blue-500/20 scale-110"
                        : "border-white/30 bg-white/5"
                    }`}
                  >
                    {isDragging ? (
                      <Upload className="w-8 h-8 text-blue-400 animate-bounce" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-lg font-semibold text-white">
                    {isDragging
                      ? "Drop your image here"
                      : "Click or Drag an Image"}
                  </p>
                  <p className="text-gray-400 text-sm">
                    PNG, JPG, or SVG • Tools unlock after upload
                  </p>
                </div>

                {/* Feature Preview */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1 text-gray-400 justify-center">
                    <Palette className="w-3 h-3 text-blue-400" />
                    <span>Color extraction</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400 justify-center">
                    <Scissors className="w-3 h-3 text-purple-400" />
                    <span>Background removal</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}
