// src/components/FontSelector.tsx - New Optimized Version
import { useState } from "react";
import { ChevronDown, Type } from "lucide-react";
import type { FaviconConfig } from "../types/favicon";

interface Props {
  config: FaviconConfig;
  onConfigUpdate: (updates: Partial<FaviconConfig>) => void;
}

const MODERN_FONTS = [
  // System fonts (always available)
  {
    family: "system-ui",
    name: "System UI",
    category: "System",
    weights: ["400", "500", "600", "700"],
    preview: "Modern system font",
  },
  {
    family: "Arial",
    name: "Arial",
    category: "System",
    weights: ["400", "700"],
    preview: "Universal classic",
  },

  // Bundled fonts (via @fontsource)
  {
    family: "Inter",
    name: "Inter",
    category: "Sans-Serif",
    weights: ["400", "600", "700"],
    preview: "Modern & clean",
  },
  {
    family: "Roboto",
    name: "Roboto",
    category: "Sans-Serif",
    weights: ["400", "700"],
    preview: "Google's classic",
  },
  {
    family: "Poppins",
    name: "Poppins",
    category: "Sans-Serif",
    weights: ["400", "600", "700"],
    preview: "Friendly & rounded",
  },
  {
    family: "Montserrat",
    name: "Montserrat",
    category: "Sans-Serif",
    weights: ["400", "600", "700"],
    preview: "Geometric design",
  },
  {
    family: "Playfair Display",
    name: "Playfair Display",
    category: "Serif",
    weights: ["400", "700"],
    preview: "Elegant serif",
  },
  {
    family: "JetBrains Mono",
    name: "JetBrains Mono",
    category: "Monospace",
    weights: ["400", "700"],
    preview: "Code-friendly",
  },
];

const FONT_WEIGHTS = [
  { value: "400", name: "Regular" },
  { value: "500", name: "Medium" },
  { value: "600", name: "Semi Bold" },
  { value: "700", name: "Bold" },
];

export default function FontSelector({ config, onConfigUpdate }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const currentFont =
    MODERN_FONTS.find((f) => f.family === config.fontFamily) || MODERN_FONTS[0];

  const handleFontSelect = (fontFamily: string) => {
    onConfigUpdate({ fontFamily });
    setIsOpen(false);
  };

  const handleWeightSelect = (fontWeight: string) => {
    onConfigUpdate({ fontWeight });
  };

  return (
    <div className="space-y-4">
      {/* Font Selector */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Font Family
        </label>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white hover:border-white/30 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Type className="w-4 h-4 text-blue-400" />
            <div className="text-left">
              <div className="font-medium">{currentFont.name}</div>
              <div className="text-xs text-gray-400">{currentFont.preview}</div>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800/95 backdrop-blur border border-white/20 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
            {MODERN_FONTS.map((font) => (
              <button
                key={font.family}
                onClick={() => handleFontSelect(font.family)}
                className={`w-full p-3 text-left hover:bg-white/10 transition-colors border-b border-white/10 last:border-b-0 ${
                  config.fontFamily === font.family
                    ? "bg-blue-500/20 text-blue-400"
                    : "text-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div
                      className="font-medium mb-1"
                      style={{ fontFamily: font.family }}
                    >
                      {font.name}
                    </div>
                    <div className="text-xs text-gray-400">{font.preview}</div>
                  </div>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">
                    {font.category}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Font Weight */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Font Weight
        </label>
        <div className="grid grid-cols-4 gap-2">
          {FONT_WEIGHTS.filter((weight) =>
            currentFont.weights.includes(weight.value),
          ).map((weight) => (
            <button
              key={weight.value}
              onClick={() => handleWeightSelect(weight.value)}
              className={`p-2 rounded text-xs font-medium transition-all ${
                config.fontWeight === weight.value
                  ? "bg-blue-500 text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              {weight.name}
            </button>
          ))}
        </div>
      </div>

      {/* Live Preview */}
      <div className="p-4 bg-white/5 rounded-lg border border-white/10">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Preview
        </label>
        <div
          className="text-2xl text-white mb-2"
          style={{
            fontFamily: config.fontFamily,
            fontWeight: config.fontWeight,
          }}
        >
          {config.text || "Sample Text"}
        </div>
        <div className="flex gap-3">
          {[16, 24, 32].map((size) => (
            <div key={size} className="text-center">
              <div
                className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold mb-1"
                style={{
                  fontFamily: config.fontFamily,
                  fontWeight: config.fontWeight,
                  fontSize: `${size * 0.4}px`,
                }}
              >
                {config.text?.charAt(0) || "A"}
              </div>
              <span className="text-xs text-gray-500">{size}px</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
