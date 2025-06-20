// src/components/ColorPickerDropdown.tsx - FIXED: Dragging, Gradients & Transparency
import { useState, useEffect, useRef } from "react";
import { Copy, Check } from "lucide-react";
import type { FaviconConfig } from "../types/favicon";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  config: FaviconConfig;
  onConfigUpdate: (updates: Partial<FaviconConfig>) => void;
  colorType: "text" | "background";
  triggerRef: React.RefObject<HTMLElement>;
}

interface ColorHSV {
  h: number; // 0-360
  s: number; // 0-100
  v: number; // 0-100
  a: number; // 0-1
}

interface ColorRGB {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
  a: number; // 0-1
}

type BackgroundType = "solid" | "gradient" | "transparent";

export default function ColorPickerDropdown({
  isOpen,
  onClose,
  config,
  onConfigUpdate,
  colorType,
  triggerRef,
}: Props) {
  const [backgroundType, setBackgroundType] = useState<BackgroundType>(
    (config.backgroundType as BackgroundType) || "solid",
  );

  // Current color being edited
  const [currentColor, setCurrentColor] = useState<ColorHSV>({
    h: 0,
    s: 100,
    v: 100,
    a: 1,
  });
  const [hexInput, setHexInput] = useState("#ffffff");
  const [copied, setCopied] = useState(false);

  // For gradient mode
  const [gradientStart, setGradientStart] = useState<ColorHSV>({
    h: 210,
    s: 100,
    v: 75,
    a: 1,
  });
  const [gradientEnd, setGradientEnd] = useState<ColorHSV>({
    h: 270,
    s: 100,
    v: 75,
    a: 1,
  });
  const [gradientDirection, setGradientDirection] = useState("45deg");
  const [editingGradientSide, setEditingGradientSide] = useState<
    "start" | "end"
  >("start");

  // Dragging states
  const [isDragging, setIsDragging] = useState(false);
  const [isHueDragging, setIsHueDragging] = useState(false);
  const [cursorColor, setCursorColor] = useState<string>("#ffffff");
  const [cursorPosition, setCursorPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hueRef = useRef<HTMLCanvasElement>(null);

  // Common colors
  const quickColors = [
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#f59e0b",
    "#10b981",
    "#ef4444",
    "#000000",
    "#ffffff",
    "#6b7280",
    "#1f2937",
    "#374151",
    "#9ca3af",
  ];

  // Position dropdown
  useEffect(() => {
    if (isOpen && triggerRef.current && dropdownRef.current) {
      const trigger = triggerRef.current.getBoundingClientRect();
      const dropdown = dropdownRef.current;

      // Position below the trigger
      dropdown.style.position = "fixed";
      dropdown.style.top = `${trigger.bottom + 8}px`;
      dropdown.style.left = `${trigger.left}px`;
      dropdown.style.zIndex = "9999";
    }
  }, [isOpen, triggerRef]);

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, triggerRef]);

  // Initialize colors from config
  useEffect(() => {
    if (isOpen) {
      if (colorType === "text") {
        const color = hexToHsv(config.textColor);
        setCurrentColor(color);
        setHexInput(config.textColor);
        setCursorColor(config.textColor);
      } else {
        const bgType = (config.backgroundType as BackgroundType) || "solid";
        setBackgroundType(bgType);

        if (bgType === "gradient") {
          const startColor = hexToHsv(config.gradientStart || "#3b82f6");
          const endColor = hexToHsv(config.gradientEnd || "#8b5cf6");
          setGradientStart(startColor);
          setGradientEnd(endColor);
          setGradientDirection(config.gradientDirection || "45deg");

          // Set current color to the side being edited
          const editingColor =
            editingGradientSide === "start" ? startColor : endColor;
          setCurrentColor(editingColor);
          setHexInput(hsvToHex(editingColor));
          setCursorColor(hsvToHex(editingColor));
        } else if (bgType === "solid") {
          const color = hexToHsv(config.backgroundColor);
          setCurrentColor(color);
          setHexInput(config.backgroundColor);
          setCursorColor(config.backgroundColor);
        } else {
          // For transparent, still need a color for when switching back
          const color = hexToHsv(config.backgroundColor || "#3b82f6");
          setCurrentColor(color);
          setHexInput(hsvToHex(color));
          setCursorColor(hsvToHex(color));
        }
      }
    }
  }, [isOpen, config, colorType]);

  // Separate effect for gradient side switching to ensure smooth updates
  useEffect(() => {
    if (backgroundType === "gradient" && colorType === "background") {
      const editingColor =
        editingGradientSide === "start" ? gradientStart : gradientEnd;
      setCurrentColor(editingColor);
      setHexInput(hsvToHex(editingColor));
      setCursorColor(hsvToHex(editingColor));
    }
  }, [
    editingGradientSide,
    gradientStart,
    gradientEnd,
    backgroundType,
    colorType,
  ]);

  // Color conversion utilities
  function hexToHsv(hex: string): ColorHSV {
    const rgb = hexToRgb(hex);
    return rgbToHsv(rgb);
  }

  function hexToRgb(hex: string): ColorRGB {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
          a: 1,
        }
      : { r: 0, g: 0, b: 0, a: 1 };
  }

  function rgbToHsv({ r, g, b, a }: ColorRGB): ColorHSV {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;

    let h = 0;
    if (diff !== 0) {
      if (max === r) h = ((g - b) / diff) % 6;
      else if (max === g) h = (b - r) / diff + 2;
      else h = (r - g) / diff + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;

    const s = max === 0 ? 0 : Math.round((diff / max) * 100);
    const v = Math.round(max * 100);

    return { h, s, v, a };
  }

  function hsvToRgb({ h, s, v, a }: ColorHSV): ColorRGB {
    s /= 100;
    v /= 100;

    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;

    let r = 0,
      g = 0,
      b = 0;

    if (h >= 0 && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (h >= 60 && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (h >= 120 && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (h >= 180 && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (h >= 240 && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else if (h >= 300 && h < 360) {
      r = c;
      g = 0;
      b = x;
    }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255),
      a,
    };
  }

  function rgbToHex({ r, g, b }: ColorRGB): string {
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

  function hsvToHex(hsv: ColorHSV): string {
    return rgbToHex(hsvToRgb(hsv));
  }

  // Update current color and hex input
  function updateColor(newColor: ColorHSV) {
    setCurrentColor(newColor);
    const newHex = hsvToHex(newColor);
    setHexInput(newHex);
    setCursorColor(newHex);

    // Update gradient colors if in gradient mode
    if (colorType === "background" && backgroundType === "gradient") {
      if (editingGradientSide === "start") {
        setGradientStart(newColor);
      } else {
        setGradientEnd(newColor);
      }
    }

    // Auto-apply colors in real-time
    applyColors(newColor);
  }

  // Apply colors to config
  function applyColors(color = currentColor) {
    if (colorType === "text") {
      onConfigUpdate({ textColor: hsvToHex(color) });
    } else {
      if (backgroundType === "solid") {
        onConfigUpdate({
          backgroundType: "solid",
          backgroundColor: hsvToHex(color),
        });
      } else if (backgroundType === "gradient") {
        // Use the most current gradient colors
        const currentGradientStart =
          editingGradientSide === "start" ? color : gradientStart;
        const currentGradientEnd =
          editingGradientSide === "end" ? color : gradientEnd;

        onConfigUpdate({
          backgroundType: "gradient",
          gradientStart: hsvToHex(currentGradientStart),
          gradientEnd: hsvToHex(currentGradientEnd),
          gradientDirection: gradientDirection,
        });
      } else {
        onConfigUpdate({ backgroundType: "transparent" });
      }
    }
  }

  // Handle background type change
  const handleBackgroundTypeChange = (newType: BackgroundType) => {
    setBackgroundType(newType);

    if (newType === "transparent") {
      onConfigUpdate({ backgroundType: "transparent" });
    } else if (newType === "gradient") {
      // Ensure we have valid gradient colors
      const startColor =
        gradientStart.h !== undefined ? gradientStart : hexToHsv("#3b82f6");
      const endColor =
        gradientEnd.h !== undefined ? gradientEnd : hexToHsv("#8b5cf6");

      setGradientStart(startColor);
      setGradientEnd(endColor);

      onConfigUpdate({
        backgroundType: "gradient",
        gradientStart: hsvToHex(startColor),
        gradientEnd: hsvToHex(endColor),
        gradientDirection: gradientDirection,
      });

      // Set current color to editing side
      const editingColor =
        editingGradientSide === "start" ? startColor : endColor;
      setCurrentColor(editingColor);
      setHexInput(hsvToHex(editingColor));
      setCursorColor(hsvToHex(editingColor));
    } else {
      // Solid color
      const solidColor =
        currentColor.h !== undefined ? currentColor : hexToHsv("#3b82f6");
      setCurrentColor(solidColor);
      setHexInput(hsvToHex(solidColor));
      setCursorColor(hsvToHex(solidColor));

      onConfigUpdate({
        backgroundType: "solid",
        backgroundColor: hsvToHex(solidColor),
      });
    }
  };

  // Handle gradient side change
  const handleGradientSideChange = (side: "start" | "end") => {
    setEditingGradientSide(side);
    // The useEffect will handle updating currentColor
  };

  // Mouse event handlers for dragging
  const handleMainCanvasMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleMainCanvasMove(e);
  };

  const handleMainCanvasMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = (1 - (e.clientY - rect.top) / rect.height) * 100;

    const newColor = {
      ...currentColor,
      s: Math.max(0, Math.min(100, x)),
      v: Math.max(0, Math.min(100, y)),
    };
    updateColor(newColor);

    // Update cursor position for preview
    setCursorPosition({ x: e.clientX, y: e.clientY });
  };

  const handleHueMouseDown = (e: React.MouseEvent) => {
    setIsHueDragging(true);
    handleHueMove(e);
  };

  const handleHueMove = (e: React.MouseEvent) => {
    if (!hueRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const h = ((e.clientX - rect.left) / rect.width) * 360;

    const newColor = { ...currentColor, h: Math.max(0, Math.min(360, h)) };
    updateColor(newColor);

    // Update cursor position for preview
    setCursorPosition({ x: e.clientX, y: e.clientY });
  };

  // Global mouse events for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = (1 - (e.clientY - rect.top) / rect.height) * 100;

        const newColor = {
          ...currentColor,
          s: Math.max(0, Math.min(100, x)),
          v: Math.max(0, Math.min(100, y)),
        };
        updateColor(newColor);
        setCursorPosition({ x: e.clientX, y: e.clientY });
      }

      if (isHueDragging && hueRef.current) {
        const rect = hueRef.current.getBoundingClientRect();
        const h = ((e.clientX - rect.left) / rect.width) * 360;

        const newColor = { ...currentColor, h: Math.max(0, Math.min(360, h)) };
        updateColor(newColor);
        setCursorPosition({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsHueDragging(false);
    };

    if (isDragging || isHueDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isHueDragging, currentColor]);

  // Canvas drawing for color picker
  useEffect(() => {
    if (!canvasRef.current || !isOpen) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas first
    ctx.clearRect(0, 0, width, height);

    // Create saturation/value gradient
    const saturationGradient = ctx.createLinearGradient(0, 0, width, 0);
    saturationGradient.addColorStop(0, `hsl(${currentColor.h || 0}, 0%, 100%)`);
    saturationGradient.addColorStop(
      1,
      `hsl(${currentColor.h || 0}, 100%, 50%)`,
    );

    ctx.fillStyle = saturationGradient;
    ctx.fillRect(0, 0, width, height);

    const valueGradient = ctx.createLinearGradient(0, 0, 0, height);
    valueGradient.addColorStop(0, "rgba(0, 0, 0, 0)");
    valueGradient.addColorStop(1, "rgba(0, 0, 0, 1)");

    ctx.fillStyle = valueGradient;
    ctx.fillRect(0, 0, width, height);
  }, [currentColor.h, isOpen, backgroundType, editingGradientSide, colorType]);

  // Hue slider canvas
  useEffect(() => {
    if (!hueRef.current || !isOpen) return;

    const canvas = hueRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas first
    ctx.clearRect(0, 0, width, height);

    const hueGradient = ctx.createLinearGradient(0, 0, width, 0);
    for (let i = 0; i <= 360; i += 60) {
      hueGradient.addColorStop(i / 360, `hsl(${i}, 100%, 50%)`);
    }

    ctx.fillStyle = hueGradient;
    ctx.fillRect(0, 0, width, height);
  }, [isOpen, backgroundType, editingGradientSide, colorType]);

  const copyColor = () => {
    navigator.clipboard?.writeText(hexInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        ref={dropdownRef}
        className="bg-gray-900/95 backdrop-blur-sm border border-white/20 rounded-xl shadow-2xl w-80 animate-scale-in"
      >
        <div className="p-4">
          {/* Background Type Selector (only for background) */}
          {colorType === "background" && (
            <div className="mb-4">
              <div className="grid grid-cols-3 gap-1 mb-3">
                <button
                  onClick={() => handleBackgroundTypeChange("solid")}
                  className={`p-2 rounded text-xs transition-all ${
                    backgroundType === "solid"
                      ? "bg-blue-500/20 border border-blue-500/50 text-blue-400"
                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  Solid
                </button>
                <button
                  onClick={() => handleBackgroundTypeChange("gradient")}
                  className={`p-2 rounded text-xs transition-all ${
                    backgroundType === "gradient"
                      ? "bg-purple-500/20 border border-purple-500/50 text-purple-400"
                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  Gradient
                </button>
                <button
                  onClick={() => handleBackgroundTypeChange("transparent")}
                  className={`p-2 rounded text-xs transition-all ${
                    backgroundType === "transparent"
                      ? "bg-green-500/20 border border-green-500/50 text-green-400"
                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  Clear
                </button>
              </div>

              {/* Gradient Controls */}
              {backgroundType === "gradient" && (
                <div className="space-y-3 mb-4">
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleGradientSideChange("start")}
                      className={`flex-1 p-2 rounded text-xs transition-all ${
                        editingGradientSide === "start"
                          ? "bg-blue-500/20 border border-blue-500/50 text-blue-400"
                          : "bg-white/5 text-gray-400"
                      }`}
                    >
                      Start
                    </button>
                    <button
                      onClick={() => handleGradientSideChange("end")}
                      className={`flex-1 p-2 rounded text-xs transition-all ${
                        editingGradientSide === "end"
                          ? "bg-purple-500/20 border border-purple-500/50 text-purple-400"
                          : "bg-white/5 text-gray-400"
                      }`}
                    >
                      End
                    </button>
                  </div>

                  {/* Direction */}
                  <div className="grid grid-cols-4 gap-1">
                    {[
                      { value: "45deg", label: "↗" },
                      { value: "0deg", label: "→" },
                      { value: "135deg", label: "↘" },
                      { value: "90deg", label: "↓" },
                    ].map((dir) => (
                      <button
                        key={dir.value}
                        onClick={() => {
                          setGradientDirection(dir.value);
                          applyColors();
                        }}
                        className={`p-1 rounded border text-sm transition-all ${
                          gradientDirection === dir.value
                            ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
                            : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
                        }`}
                      >
                        {dir.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Only show color picker if not transparent */}
          {!(
            colorType === "background" && backgroundType === "transparent"
          ) && (
            <div
              key={`${backgroundType}-${editingGradientSide}`}
              className="space-y-3"
            >
              {/* Key forces re-render */}
              {/* Main Color Area */}
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={240}
                  height={120}
                  className="w-full h-24 rounded border border-white/20 cursor-crosshair"
                  onMouseDown={handleMainCanvasMouseDown}
                  onMouseMove={isDragging ? handleMainCanvasMove : undefined}
                  style={{ cursor: isDragging ? "crosshair" : "crosshair" }}
                />
                {/* Crosshair */}
                <div
                  className="absolute w-2 h-2 border border-white rounded-full pointer-events-none"
                  style={{
                    left: `${currentColor.s}%`,
                    top: `${100 - currentColor.v}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </div>

              {/* Hue Slider */}
              <div className="relative">
                <canvas
                  ref={hueRef}
                  width={240}
                  height={16}
                  className="w-full h-4 rounded cursor-pointer"
                  onMouseDown={handleHueMouseDown}
                  onMouseMove={isHueDragging ? handleHueMove : undefined}
                />
                <div
                  className="absolute w-0.5 h-6 bg-white border border-gray-600 rounded pointer-events-none"
                  style={{
                    left: `${(currentColor.h / 360) * 100}%`,
                    top: "-2px",
                    transform: "translateX(-50%)",
                  }}
                />
              </div>

              {/* Hex Input & Copy */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={hexInput}
                  onChange={(e) => {
                    setHexInput(e.target.value);
                    if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                      updateColor({
                        ...hexToHsv(e.target.value),
                        a: currentColor.a,
                      });
                    }
                  }}
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm font-mono"
                />
                <button
                  onClick={copyColor}
                  className="p-2 bg-white/10 border border-white/20 rounded hover:bg-white/20 text-gray-400 hover:text-white transition-colors"
                  title="Copy hex"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Quick Colors */}
              <div>
                <div className="text-xs text-gray-400 mb-2">Quick Colors</div>
                <div className="grid grid-cols-6 gap-1">
                  {quickColors.map((color) => (
                    <button
                      key={color}
                      onClick={() =>
                        updateColor({ ...hexToHsv(color), a: currentColor.a })
                      }
                      className="w-8 h-6 rounded border border-white/20 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cursor Color Preview */}
      {(isDragging || isHueDragging) && (
        <div
          className="fixed pointer-events-none z-[10000] w-6 h-6 rounded-full border-2 border-white shadow-lg"
          style={{
            left: cursorPosition.x + 15,
            top: cursorPosition.y - 15,
            backgroundColor: cursorColor,
            transform: "translate(-50%, -50%)",
          }}
        />
      )}
    </>
  );
}
