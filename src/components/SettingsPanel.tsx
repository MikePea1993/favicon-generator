// src/components/SettingsPanel.tsx - UPDATED TO USE DROPDOWN COLOR PICKER
import { useState, useRef } from "react";
import {
  Target,
  Sparkles,
  FlipHorizontal,
  Palette,
  RotateCw,
  RotateCcw,
  Type,
} from "lucide-react";
import { Button } from "./common";
import ColorPickerDropdown from "./ColorPickerDropdown";
import type { FaviconConfig } from "../types/favicon";

interface Props {
  config: FaviconConfig;
  onConfigUpdate: (updates: Partial<FaviconConfig>) => void;
  imageScale: number;
  onScaleChange: (scale: number) => void;
  onReset: () => void;
  onOpenFontModal: () => void;
  // Preview props
  inputType?: "text" | "icon" | "image" | "template";
  selectedIconData?: any;
  uploadedImage?: string | null;
  renderFaviconContent?: (size: number) => React.ReactNode;
  getBackgroundStyle?: (config: FaviconConfig) => string;
}

type TabType = "scale" | "radius" | "flip" | "fonts" | "colors";

export default function SettingsPanel({
  config,
  onConfigUpdate,
  imageScale,
  onScaleChange,
  onReset,
  onOpenFontModal,
  inputType = "text",
  selectedIconData,
  uploadedImage,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabType>("scale");
  const [rotation, setRotation] = useState(0);
  const [activeColorPicker, setActiveColorPicker] = useState<
    "text" | "background" | null
  >(null);

  // Refs for positioning dropdowns
  const textColorButtonRef = useRef<HTMLButtonElement>(null);
  const backgroundColorButtonRef = useRef<HTMLButtonElement>(null);

  const tabs = [
    { id: "scale" as const, label: "Scale", icon: Target },
    { id: "radius" as const, label: "Radius", icon: Sparkles },
    { id: "flip" as const, label: "Flip", icon: FlipHorizontal },
    { id: "fonts" as const, label: "Fonts", icon: Type },
    { id: "colors" as const, label: "Colors", icon: Palette },
  ];

  const shapes = [
    { value: "transparent", label: "No Shape", icon: "✕" },
    { value: "square", label: "Square", icon: "▢" },
    { value: "rounded", label: "Rounded", icon: "▢" },
    { value: "circle", label: "Circle", icon: "●" },
  ];

  // Favicon Preview Component - UNCHANGED
  const FaviconPreview = () => {
    const sizes = [
      { size: 16, label: "16px", desc: "Browser tab" },
      { size: 32, label: "32px", desc: "Bookmark" },
      { size: 48, label: "48px", desc: "Windows" },
      { size: 64, label: "64px", desc: "Desktop" },
      { size: 96, label: "96px", desc: "Android" },
      { size: 180, label: "180px", desc: "Apple touch" },
    ];

    const getFaviconBackground = () => {
      if (config.backgroundType === "transparent") {
        return `linear-gradient(45deg, #374151 25%, transparent 25%), linear-gradient(-45deg, #374151 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #374151 75%), linear-gradient(-45deg, transparent 75%, #374151 75%)`;
      } else if (config.backgroundType === "gradient") {
        const startColor = config.gradientStart || "#3b82f6";
        const endColor = config.gradientEnd || "#8b5cf6";
        return `linear-gradient(${config.gradientDirection || "45deg"}, ${startColor}, ${endColor})`;
      } else {
        return config.backgroundColor;
      }
    };

    return (
      <div className="p-4 bg-white/5 rounded-lg border border-white/10">
        <h4 className="text-sm font-medium text-gray-300 mb-3 text-center">
          Live Preview
        </h4>
        <div className="grid grid-cols-3 gap-3">
          {sizes.map(({ size, label, desc }) => (
            <div key={size} className="text-center">
              <div className="mb-2 flex justify-center">
                <div
                  className="flex items-center justify-center border border-white/20 relative overflow-hidden"
                  style={{
                    width: `${Math.min(size, 48)}px`,
                    height: `${Math.min(size, 48)}px`,
                    background:
                      config.shape === "transparent"
                        ? "transparent"
                        : config.backgroundType === "transparent"
                          ? getFaviconBackground()
                          : getFaviconBackground(),
                    backgroundSize:
                      config.backgroundType === "transparent"
                        ? "8px 8px"
                        : "auto",
                    backgroundPosition:
                      config.backgroundType === "transparent"
                        ? "0 0, 0 4px, 4px -4px, -4px 0px"
                        : "auto",
                    color: config.textColor,
                    borderRadius:
                      config.shape === "circle"
                        ? "50%"
                        : config.shape === "rounded"
                          ? "20%"
                          : config.shape === "square"
                            ? "8%"
                            : "0", // No border radius for "none"
                    transform: `rotate(${rotation}deg)`,
                    transition: "all 0.2s ease",
                  }}
                >
                  {inputType === "icon" && selectedIconData ? (
                    <selectedIconData.component
                      size={Math.floor(Math.min(size, 48) * 0.6 * imageScale)}
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
                              : "8%",
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        fontSize: `${Math.floor(Math.min(size, 48) * 0.4 * imageScale)}px`,
                        fontFamily: config.fontFamily || "Inter",
                        fontWeight: config.fontWeight || "bold",
                        lineHeight: 1,
                      }}
                    >
                      {config.text || "A"}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-xs">
                <div className="text-gray-300 font-mono">{label}</div>
                <div className="text-gray-500">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleRotate = (degrees: number) => {
    setRotation((prev) => prev + degrees);
  };

  const resetRotation = () => {
    setRotation(0);
  };

  const openColorPicker = (type: "text" | "background") => {
    setActiveColorPicker(activeColorPicker === type ? null : type);
  };

  const closeColorPicker = () => {
    setActiveColorPicker(null);
  };

  // Helper function to get background preview
  const getBackgroundPreview = () => {
    if (config.backgroundType === "transparent") {
      return `linear-gradient(45deg, #374151 25%, transparent 25%), linear-gradient(-45deg, #374151 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #374151 75%), linear-gradient(-45deg, transparent 75%, #374151 75%)`;
    } else if (config.backgroundType === "gradient") {
      const startColor = config.gradientStart || "#3b82f6";
      const endColor = config.gradientEnd || "#8b5cf6";
      return `linear-gradient(${config.gradientDirection || "45deg"}, ${startColor}, ${endColor})`;
    } else {
      return config.backgroundColor;
    }
  };

  const getBackgroundLabel = () => {
    if (config.backgroundType === "transparent") return "Transparent";
    if (config.backgroundType === "gradient") return "Gradient";
    return "Solid Color";
  };

  return (
    <>
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-xl font-bold text-white">Settings</h3>
          <p className="text-gray-400 mt-1">
            Adjust your favicon with various settings for a perfect one.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-blue-400 border-b-2 border-blue-400 bg-blue-500/10"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <tab.icon className="w-4 h-4 mx-auto mb-1" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content area with perfect height */}
        <div className="h-[485px] overflow-y-auto custom-scroll">
          <div className="p-6 space-y-6">
            {/* Scale Tab */}
            {activeTab === "scale" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-4">
                    Zoom In & Out the image to fit the optimal icon size.
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={imageScale}
                      onChange={(e) =>
                        onScaleChange(parseFloat(e.target.value))
                      }
                      className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider-dark"
                    />
                    <span className="text-white font-mono text-sm w-12">
                      {imageScale.toFixed(1)}x
                    </span>
                  </div>
                </div>

                <FaviconPreview />
              </div>
            )}

            {/* Radius Tab */}
            {activeTab === "radius" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-4">
                    Shape Style
                  </label>
                  <div className="flex gap-2 justify-between">
                    {shapes.map((shape) => (
                      <button
                        key={shape.value}
                        onClick={() =>
                          onConfigUpdate({ shape: shape.value as any })
                        }
                        className={`p-2 rounded-lg border transition-all duration-200 text-center flex-1 ${
                          config.shape === shape.value
                            ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
                            : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
                        }`}
                      >
                        <div className="text-lg mb-1">{shape.icon}</div>
                        <div className="text-xs">{shape.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <FaviconPreview />
              </div>
            )}

            {/* Flip Tab */}
            {activeTab === "flip" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-4">
                    Transform Options
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleRotate(-90)}
                      className="p-4 rounded-lg border border-white/10 bg-white/5 text-white hover:border-blue-400 hover:bg-blue-500/10 transition-colors"
                    >
                      <RotateCcw className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-xs">Rotate Left</div>
                    </button>
                    <button
                      onClick={() => handleRotate(90)}
                      className="p-4 rounded-lg border border-white/10 bg-white/5 text-white hover:border-blue-400 hover:bg-blue-500/10 transition-colors"
                    >
                      <RotateCw className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-xs">Rotate Right</div>
                    </button>
                  </div>
                </div>

                {rotation !== 0 && (
                  <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-300 text-sm font-medium">
                          Current Rotation: {rotation}°
                        </p>
                        <p className="text-blue-200 text-xs">
                          Visible in preview below
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetRotation}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                )}

                <FaviconPreview />
              </div>
            )}

            {/* Fonts Tab - MORE SUBTLE */}
            {activeTab === "fonts" && (
              <div className="space-y-6">
                <div className="text-center">
                  <label className="block text-sm font-medium text-gray-300 mb-4">
                    Choose the perfect font for your favicon text
                  </label>
                </div>

                {/* Subtle Current Font Display */}
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-3">
                    <Type className="w-5 h-5 text-blue-400" />
                    <div>
                      <div className="text-sm text-white font-medium">
                        {config.fontFamily || "Inter"}
                      </div>
                      <div className="text-xs text-gray-400">
                        Weight: {config.fontWeight || "bold"}
                      </div>
                    </div>
                  </div>
                  <div
                    className="text-lg text-white"
                    style={{
                      fontFamily: config.fontFamily || "Inter",
                      fontWeight: config.fontWeight || "bold",
                    }}
                  >
                    {config.text || "Aa"}
                  </div>
                </div>

                {/* Font Selector Button */}
                <div className="text-center">
                  <Button
                    variant="primary"
                    icon={Type}
                    onClick={onOpenFontModal}
                    size="sm"
                    className="px-6"
                  >
                    Browse All Fonts
                  </Button>
                  <p className="text-xs text-gray-400 mt-2">
                    Professional fonts bundled for instant loading
                  </p>
                </div>

                <FaviconPreview />
              </div>
            )}

            {/* Colors Tab - MUCH SIMPLER NOW */}
            {activeTab === "colors" && (
              <div className="space-y-6">
                <div className="text-center">
                  <label className="block text-sm font-medium text-gray-300 mb-4">
                    Click the buttons below to open the color picker
                  </label>
                </div>

                {/* Color Buttons */}
                <div className="space-y-4 relative">
                  {/* Text/Icon Color Button */}
                  <button
                    ref={textColorButtonRef}
                    onClick={() => openColorPicker("text")}
                    className={`w-full p-4 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 hover:bg-white/10 transition-all duration-200 group ${
                      activeColorPicker === "text"
                        ? "border-blue-500/50 bg-blue-500/10"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-lg border border-white/20 flex items-center justify-center"
                          style={{ backgroundColor: config.textColor }}
                        >
                          <span className="text-white font-bold text-lg contrast-100">
                            A
                          </span>
                        </div>
                        <div className="text-left">
                          <div className="text-white font-medium">
                            Text/Icon Color
                          </div>
                          <div className="text-gray-400 text-sm font-mono">
                            {config.textColor}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`transition-colors ${
                          activeColorPicker === "text"
                            ? "text-blue-400"
                            : "text-gray-400 group-hover:text-white"
                        }`}
                      >
                        <Palette className="w-5 h-5" />
                      </div>
                    </div>
                  </button>

                  {/* Background Color Button */}
                  <button
                    ref={backgroundColorButtonRef}
                    onClick={() => openColorPicker("background")}
                    className={`w-full p-4 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 hover:bg-white/10 transition-all duration-200 group ${
                      activeColorPicker === "background"
                        ? "border-purple-500/50 bg-purple-500/10"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-lg border border-white/20 relative overflow-hidden"
                          style={{
                            background: getBackgroundPreview(),
                            backgroundSize:
                              config.backgroundType === "transparent"
                                ? "8px 8px"
                                : "auto",
                            backgroundPosition:
                              config.backgroundType === "transparent"
                                ? "0 0, 0 4px, 4px -4px, -4px 0px"
                                : "auto",
                          }}
                        />
                        <div className="text-left">
                          <div className="text-white font-medium">
                            Background
                          </div>
                          <div className="text-gray-400 text-sm">
                            {getBackgroundLabel()}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`transition-colors ${
                          activeColorPicker === "background"
                            ? "text-purple-400"
                            : "text-gray-400 group-hover:text-white"
                        }`}
                      >
                        <Palette className="w-5 h-5" />
                      </div>
                    </div>
                  </button>
                </div>

                <FaviconPreview />
              </div>
            )}
          </div>
        </div>

        {/* Reset Button */}
        <div className="p-6 border-t border-white/10">
          <Button
            variant="ghost"
            icon={RotateCw}
            onClick={() => {
              onReset();
              resetRotation();
              closeColorPicker();
            }}
            fullWidth
            className="text-gray-400 hover:text-white"
          >
            Reset All Settings
          </Button>
        </div>
      </div>

      {/* Color Picker Dropdowns */}
      <ColorPickerDropdown
        isOpen={activeColorPicker === "text"}
        onClose={closeColorPicker}
        config={config}
        onConfigUpdate={onConfigUpdate}
        colorType="text"
        triggerRef={textColorButtonRef}
      />

      <ColorPickerDropdown
        isOpen={activeColorPicker === "background"}
        onClose={closeColorPicker}
        config={config}
        onConfigUpdate={onConfigUpdate}
        colorType="background"
        triggerRef={backgroundColorButtonRef}
      />
    </>
  );
}
