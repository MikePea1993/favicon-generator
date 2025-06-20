// src/components/FontModal.tsx - Updated with @fontsource fonts
import { useState, useEffect, useRef } from "react";
import { Search, X, Type, Star, Filter } from "lucide-react";
import type { FaviconConfig } from "../types/favicon";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (fontFamily: string, fontWeight: string) => void;
  currentFont: string;
  currentWeight: string;
  previewText: string;
  config?: FaviconConfig;
}

// Curated fonts using @fontsource (bundled, no loading needed!)
export const FAVICON_FONTS = [
  // System fonts (always available)
  {
    family: "system-ui",
    name: "System UI",
    category: "System",
    description: "Native system font",
    featured: true,
    weights: ["400", "500", "600", "700"],
    bundled: true, // No need to load
  },
  {
    family: "Arial",
    name: "Arial",
    category: "System",
    description: "Universal compatibility",
    featured: true,
    weights: ["400", "700"],
    bundled: true,
  },

  // @fontsource bundled fonts (already loaded via main.tsx)
  {
    family: "Inter",
    name: "Inter",
    category: "Sans-Serif",
    description: "Modern, highly legible",
    featured: true,
    weights: ["400", "600", "700"],
    bundled: true,
  },
  {
    family: "Roboto",
    name: "Roboto",
    category: "Sans-Serif",
    description: "Google's flagship font",
    featured: true,
    weights: ["400", "700"],
    bundled: true,
  },
  {
    family: "Poppins",
    name: "Poppins",
    category: "Sans-Serif",
    description: "Rounded, friendly",
    featured: true,
    weights: ["400", "600", "700"],
    bundled: true,
  },
  {
    family: "Montserrat",
    name: "Montserrat",
    category: "Sans-Serif",
    description: "Geometric, urban inspired",
    featured: true,
    weights: ["400", "600", "700"],
    bundled: true,
  },
  {
    family: "Playfair Display",
    name: "Playfair Display",
    category: "Serif",
    description: "High contrast, elegant",
    featured: true,
    weights: ["400", "700"],
    bundled: true,
  },
  {
    family: "JetBrains Mono",
    name: "JetBrains Mono",
    category: "Monospace",
    description: "For developers",
    featured: true,
    weights: ["400", "700"],
    bundled: true,
  },

  // Additional quality fonts
  {
    family: "Open Sans",
    name: "Open Sans",
    category: "Sans-Serif",
    description: "Optimized for legibility",
    featured: false,
    weights: ["400", "600", "700"],
    bundled: false, // Not bundled, but popular
  },
  {
    family: "Lato",
    name: "Lato",
    category: "Sans-Serif",
    description: "Humanist sans-serif",
    featured: false,
    weights: ["400", "700"],
    bundled: false,
  },
  {
    family: "Oswald",
    name: "Oswald",
    category: "Display",
    description: "Condensed, impactful",
    featured: false,
    weights: ["400", "600", "700"],
    bundled: false,
  },
  {
    family: "Source Code Pro",
    name: "Source Code Pro",
    category: "Monospace",
    description: "Adobe's monospace",
    featured: false,
    weights: ["400", "600", "700"],
    bundled: false,
  },
];

const CATEGORIES = [
  { id: "all", name: "All Fonts" },
  { id: "featured", name: "Featured" },
  { id: "bundled", name: "Instant Load" },
  { id: "Sans-Serif", name: "Sans-Serif" },
  { id: "Serif", name: "Serif" },
  { id: "Monospace", name: "Monospace" },
  { id: "Display", name: "Display" },
  { id: "System", name: "System" },
];

const FONT_WEIGHTS = [
  { value: "400", name: "Regular", label: "400" },
  { value: "500", name: "Medium", label: "500" },
  { value: "600", name: "Semi Bold", label: "600" },
  { value: "700", name: "Bold", label: "700" },
  { value: "800", name: "Extra Bold", label: "800" },
  { value: "900", name: "Black", label: "900" },
];

export default function FontModal({
  isOpen,
  onClose,
  onSelect,
  currentFont,
  currentWeight,
  previewText,
  config,
}: Props) {
  const [selectedCategory, setSelectedCategory] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFont, setSelectedFont] = useState(currentFont);
  const [selectedWeight, setSelectedWeight] = useState(currentWeight);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  // Generate favicon preview (optimized)
  const generateFaviconPreview = () => {
    if (!previewCanvasRef.current || !config) return;

    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 128;
    canvas.width = size;
    canvas.height = size;
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
    }

    // Draw background
    if (config.backgroundType === "transparent") {
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

    // Draw text with selected font
    ctx.fillStyle = config.textColor;
    const fontSize = Math.floor((config.fontSize || 32) * (size / 64));
    ctx.font = `${selectedWeight} ${fontSize}px ${selectedFont}, Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(previewText || config.text || "Aa", size / 2, size / 2);

    ctx.restore();
  };

  // Update favicon preview when font changes
  useEffect(() => {
    if (isOpen && config) {
      // Small delay for font rendering
      setTimeout(generateFaviconPreview, 100);
    }
  }, [selectedFont, selectedWeight, isOpen, config, previewText]);

  const filteredFonts = FAVICON_FONTS.filter((font) => {
    const matchesCategory =
      selectedCategory === "all" ||
      (selectedCategory === "featured" && font.featured) ||
      (selectedCategory === "bundled" && font.bundled) ||
      font.category === selectedCategory;

    const matchesSearch =
      searchQuery === "" ||
      font.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      font.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleFontSelect = (fontFamily: string) => {
    setSelectedFont(fontFamily);

    // Reset weight if not available in new font
    const font = FAVICON_FONTS.find((f) => f.family === fontFamily);
    if (font && !font.weights.includes(selectedWeight)) {
      const newWeight = font.weights.includes("700") ? "700" : font.weights[0];
      setSelectedWeight(newWeight);
    }
  };

  const handleWeightSelect = (fontWeight: string) => {
    setSelectedWeight(fontWeight);
  };

  const handleApply = () => {
    onSelect(selectedFont, selectedWeight);
    onClose();
  };

  const currentFontData = FAVICON_FONTS.find((f) => f.family === selectedFont);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="bg-gray-900/95 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
          <div>
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <Type className="w-6 h-6 text-blue-400" />
              Choose Font
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              <span className="font-semibold text-blue-400">
                {FAVICON_FONTS.length}
              </span>{" "}
              professional fonts • Bundled for instant loading
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex h-[600px]">
          {/* Left side - Font list */}
          <div className="flex-1 flex flex-col">
            {/* Search & Categories */}
            <div className="p-6 border-b border-white/10">
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search fonts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setSearchQuery(""); // Clear search when selecting category
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedCategory === category.id && !searchQuery
                        ? "bg-blue-500 text-white"
                        : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Grid */}
            <div className="flex-1 p-6 overflow-y-auto custom-scroll">
              {filteredFonts.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {filteredFonts.map((font, index) => (
                    <button
                      key={font.family}
                      onClick={() => handleFontSelect(font.family)}
                      className={`w-full p-4 rounded-lg border text-left transition-all hover:scale-[1.02] ${
                        selectedFont === font.family
                          ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
                          : "bg-white/5 border-white/10 text-white hover:border-white/20 hover:bg-white/10"
                      }`}
                      style={{ animationDelay: `${index * 0.02}s` }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{font.name}</span>
                        <div className="flex items-center gap-2">
                          {font.featured && (
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          )}
                          {font.bundled && (
                            <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">
                              Instant
                            </span>
                          )}
                          <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded">
                            {font.category}
                          </span>
                          {selectedFont === font.family && (
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mb-3">
                        {font.description}
                      </p>
                      {/* Font preview */}
                      <div
                        className="text-lg font-medium"
                        style={{
                          fontFamily: font.family,
                          fontWeight: "600",
                        }}
                      >
                        {previewText || "Sample Text"}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Type className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg mb-2">No fonts found</p>
                  <p className="text-gray-500 text-sm">
                    Try a different search term or browse categories
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right side - Favicon Preview */}
          <div className="w-80 border-l border-white/10 bg-white/5">
            <div className="p-6 h-full flex flex-col">
              <div className="text-center mb-6">
                <h4 className="text-lg font-bold text-white mb-2">
                  Favicon Preview
                </h4>
                <p className="text-gray-400 text-sm">
                  Live preview with selected font
                </p>
              </div>

              {/* Favicon Preview */}
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="relative group mb-6">
                    {/* Glow effect background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Main preview container */}
                    <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 group-hover:border-white/20 transition-all duration-300">
                      <canvas
                        ref={previewCanvasRef}
                        width="128"
                        height="128"
                        className="rounded-xl shadow-2xl border border-white/10 group-hover:scale-105 transition-transform duration-300"
                        style={{
                          width: "128px",
                          height: "128px",
                          filter: "drop-shadow(0 10px 25px rgba(0, 0, 0, 0.5))",
                          background:
                            config?.backgroundType === "transparent"
                              ? `linear-gradient(45deg, #374151 25%, transparent 25%), linear-gradient(-45deg, #374151 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #374151 75%), linear-gradient(-45deg, transparent 75%, #374151 75%)`
                              : "transparent",
                          backgroundSize:
                            config?.backgroundType === "transparent"
                              ? "8px 8px"
                              : "auto",
                          backgroundPosition:
                            config?.backgroundType === "transparent"
                              ? "0 0, 0 4px, 4px -4px, -4px 0px"
                              : "auto",
                        }}
                      />
                    </div>
                  </div>

                  {/* Font Info */}
                  <div className="mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <p className="text-blue-400 font-medium text-sm">
                        Currently Selected
                      </p>
                    </div>
                    <h5 className="text-white font-semibold text-lg mb-1">
                      {selectedFont}
                    </h5>
                    <p className="text-gray-400 text-sm">
                      Weight: {selectedWeight} • {currentFontData?.category}
                      {currentFontData?.bundled && (
                        <span className="text-green-400 ml-2">• Bundled</span>
                      )}
                    </p>
                  </div>

                  {/* Size previews */}
                  <div className="space-y-3">
                    <p className="text-gray-300 text-sm font-medium">
                      Size Previews:
                    </p>
                    <div className="flex justify-center gap-3">
                      {[16, 32, 48].map((size) => (
                        <div key={size} className="text-center">
                          <div
                            className="w-12 h-12 bg-white/10 rounded border border-white/20 flex items-center justify-center mb-1"
                            style={{
                              background:
                                config?.backgroundType === "transparent"
                                  ? `linear-gradient(45deg, #374151 25%, transparent 25%), linear-gradient(-45deg, #374151 25%, transparent 25%)`
                                  : config?.backgroundType === "gradient"
                                    ? `linear-gradient(45deg, ${config.gradientStart || "#3b82f6"}, ${config.gradientEnd || "#8b5cf6"})`
                                    : config?.backgroundColor || "#3b82f6",
                              backgroundSize:
                                config?.backgroundType === "transparent"
                                  ? "4px 4px"
                                  : "auto",
                              color: config?.textColor || "#ffffff",
                              fontSize: `${Math.floor(size * 0.4)}px`,
                              fontFamily: selectedFont,
                              fontWeight: selectedWeight,
                              borderRadius:
                                config?.shape === "circle"
                                  ? "50%"
                                  : config?.shape === "rounded"
                                    ? "20%"
                                    : config?.shape === "square"
                                      ? "8%"
                                      : "0", // No border radius for "none"
                            }}
                          >
                            {previewText?.charAt(0) ||
                              config?.text?.charAt(0) ||
                              "A"}
                          </div>
                          <span className="text-xs text-gray-500">
                            {size}px
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Font Weight Selector */}
        {currentFontData && (
          <div className="p-6 border-t border-white/10 bg-white/5">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Font Weight
              </label>
              <div className="grid grid-cols-6 gap-2">
                {FONT_WEIGHTS.filter((weight) =>
                  currentFontData.weights.includes(weight.value),
                ).map((weight) => (
                  <button
                    key={weight.value}
                    onClick={() => handleWeightSelect(weight.value)}
                    className={`p-2 rounded text-xs transition-all ${
                      selectedWeight === weight.value
                        ? "bg-blue-500 text-white"
                        : "bg-white/10 text-gray-300 hover:bg-white/20"
                    }`}
                  >
                    {weight.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-white/5">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              <span className="font-medium text-blue-400">
                {FAVICON_FONTS.length} professional fonts
              </span>{" "}
              • {FAVICON_FONTS.filter((f) => f.bundled).length} bundled for
              instant loading
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg transition-all font-medium"
              >
                Apply Font
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
