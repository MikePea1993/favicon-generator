// src/components/InputTypeSelector.tsx - WITH FIXED FONT LOADING
import { useEffect } from "react";
import { Type, Upload, Grid3X3, Sparkles } from "lucide-react";
import type { FaviconConfig } from "../types/favicon";

export type InputType = "template" | "image" | "text" | "icon";

interface Props {
  inputType: InputType;
  onInputTypeChange: (type: InputType) => void;
  // Props for conditional preview
  config: FaviconConfig;
  uploadedImage: string | null;
  selectedIconData: any | null;
  imageScale: number;
  renderFaviconContent: (size: number) => React.ReactNode;
  getBackgroundStyle: (config: FaviconConfig) => string;
  hasSelectedTemplate?: boolean;
}

// Font loading utility
const loadGoogleFont = (fontFamily: string) => {
  // Skip system fonts
  const systemFonts = ["system-ui", "Arial", "Helvetica", "Monaco"];
  if (systemFonts.includes(fontFamily)) return;

  const fontName = fontFamily.replace(/\s+/g, "+");
  const link = document.createElement("link");
  link.href = `https://fonts.googleapis.com/css2?family=${fontName}:wght@400;500;600;700;800;900&display=swap`;
  link.rel = "stylesheet";

  // Check if font is already loaded
  const existingLink = document.querySelector(`link[href*="${fontName}"]`);
  if (!existingLink) {
    document.head.appendChild(link);
  }
};

export default function InputTypeSelector({
  inputType,
  onInputTypeChange,
  config,
  uploadedImage,
  selectedIconData,
  imageScale,
  renderFaviconContent,
  getBackgroundStyle,
  hasSelectedTemplate,
}: Props) {
  // Load font when config changes
  useEffect(() => {
    if (config.fontFamily) {
      loadGoogleFont(config.fontFamily);
    }
  }, [config.fontFamily]);

  const inputTypes = [
    {
      value: "template" as const,
      label: "Templates",
      icon: Sparkles,
      color: "purple",
      description: "Quick professional start",
    },
    {
      value: "image" as const,
      label: "Upload Image",
      icon: Upload,
      color: "blue",
      description: "Brand colors extracted",
    },
    {
      value: "text" as const,
      label: "Text",
      icon: Type,
      color: "green",
      description: "Simple & effective",
    },
    {
      value: "icon" as const,
      label: "Icon",
      icon: Grid3X3,
      color: "orange",
      description: "Massive library",
    },
  ];

  const getButtonClasses = (type: InputType, color: string) => {
    const isActive = inputType === type;
    const colorClasses = {
      purple: isActive
        ? "border-purple-500 bg-purple-500/10 text-purple-400"
        : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20",
      blue: isActive
        ? "border-blue-500 bg-blue-500/10 text-blue-400"
        : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20",
      green: isActive
        ? "border-green-500 bg-green-500/10 text-green-400"
        : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20",
      orange: isActive
        ? "border-orange-500 bg-orange-500/10 text-orange-400"
        : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20",
    };

    return `p-6 rounded-xl border transition-all duration-200 group hover:scale-105 ${colorClasses[color as keyof typeof colorClasses]}`;
  };

  // Check if user has content to show previews
  const hasContent =
    (inputType === "text" && config.text.trim() && config.text !== "F") ||
    (inputType === "image" && uploadedImage) ||
    (inputType === "icon" && selectedIconData) ||
    (inputType === "template" && config.text.trim() && config.text !== "F");

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-white mb-6">
        Create Your Favicon
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {inputTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => onInputTypeChange(type.value)}
            className={getButtonClasses(type.value, type.color)}
          >
            <type.icon className="w-8 h-8 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <div className="font-semibold text-sm mb-1">{type.label}</div>
            <div className="text-xs opacity-75">{type.description}</div>
          </button>
        ))}
      </div>

      {/* Conditional Content */}
      {hasContent ? (
        /* Size Previews */
        <div className="border-t border-white/10 pt-6">
          <h3 className="text-lg font-bold text-white mb-4 text-center">
            Size Previews
            {imageScale !== 1 && (
              <span className="text-sm text-blue-400 font-normal ml-2">
                (Scale: {imageScale.toFixed(1)}x)
              </span>
            )}
            {config.fontFamily && config.fontFamily !== "Inter" && (
              <span className="text-sm text-purple-400 font-normal ml-2">
                • {config.fontFamily} {config.fontWeight}
              </span>
            )}
          </h3>
          <div className="grid grid-cols-4 gap-4">
            {[16, 32, 48, 64].map((size) => {
              const needsCheckeredBg =
                config.backgroundType === "transparent" ||
                (config.backgroundType === "gradient" &&
                  (config.gradientStartTransparent ||
                    config.gradientEndTransparent));

              return (
                <div
                  key={size}
                  className="bg-white/5 rounded-lg p-4 text-center border border-white/10 hover:border-white/20 transition-colors"
                >
                  <div
                    className="w-12 h-12 mx-auto rounded mb-2 flex items-center justify-center border border-white/20 relative overflow-hidden"
                    style={{
                      background:
                        config.shape === "transparent"
                          ? "transparent"
                          : getBackgroundStyle(config),
                      borderRadius:
                        config.shape === "circle"
                          ? "50%"
                          : config.shape === "rounded"
                            ? "20%"
                            : config.shape === "square"
                              ? "8%"
                              : "0", // No border radius for "none"
                    }}
                  >
                    {/* Overlay gradient on top of checkered background if needed */}
                    {needsCheckeredBg &&
                      config.backgroundType === "gradient" && (
                        <div
                          className="absolute inset-0"
                          style={{
                            background: getBackgroundStyle(config),
                            borderRadius:
                              config.shape === "circle"
                                ? "50%"
                                : config.shape === "rounded"
                                  ? "20%"
                                  : "8%",
                          }}
                        />
                      )}
                    <div
                      className="relative z-10"
                      style={{
                        fontSize: `${Math.floor((config.fontSize || 32) * (size / 64) * 0.7)}px`,
                        fontFamily: config.fontFamily || "Inter",
                        fontWeight: config.fontWeight || "bold",
                        lineHeight: 1,
                      }}
                    >
                      {inputType === "icon" && selectedIconData ? (
                        <selectedIconData.component
                          size={Math.floor(size * 0.5 * imageScale)}
                          className="text-current"
                        />
                      ) : inputType === "image" && uploadedImage ? (
                        <img
                          src={uploadedImage}
                          alt="Preview"
                          className="w-full h-full object-contain"
                          style={{
                            transform: `scale(${imageScale})`,
                            borderRadius:
                              config.shape === "circle"
                                ? "50%"
                                : config.shape === "rounded"
                                  ? "20%"
                                  : config.shape === "square"
                                    ? "8%"
                                    : "0",
                          }}
                        />
                      ) : (
                        <span
                          style={{
                            fontSize: `${Math.floor((config.fontSize || 32) * (size / 64) * 0.7 * imageScale)}px`,
                            fontFamily: config.fontFamily || "Inter",
                            fontWeight: config.fontWeight || "bold",
                            lineHeight: 1,
                          }}
                        >
                          {config.text || "?"}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 font-mono">
                    {size}×{size}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Feature Tips */
        <div className="border-t border-white/10 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>
                <strong>Templates:</strong> Quick professional start
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>
                <strong>Images:</strong> Brand colors extracted
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>
                <strong>Text:</strong> Simple & effective
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span>
                <strong>Icons:</strong> Massive library
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
