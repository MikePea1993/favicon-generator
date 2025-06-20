// src/components/FaviconPreview.tsx
import { useEffect, useRef } from "react";
import { FaviconConfig } from "../types/favicon";
import { generateFavicon } from "../utils/faviconGenerator";

interface Props {
  config: FaviconConfig;
}

export default function FaviconPreview({ config }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const generatePreview = async () => {
      try {
        const generatedCanvas = await generateFavicon(config, 128);
        const ctx = canvasRef.current?.getContext("2d");

        if (ctx && canvasRef.current) {
          canvasRef.current.width = 128;
          canvasRef.current.height = 128;
          ctx.clearRect(0, 0, 128, 128);
          ctx.drawImage(generatedCanvas, 0, 0);
        }
      } catch (error) {
        console.error("Error generating preview:", error);
      }
    };

    generatePreview();
  }, [config]);

  return (
    <div className="text-center">
      <div className="inline-block relative group">
        {/* Glow effect background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Main preview container */}
        <div
          className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 
        group-hover:border-white/20 transition-all duration-300"
        >
          <canvas
            ref={canvasRef}
            width="128"
            height="128"
            className="rounded-xl shadow-2xl border border-white/10 group-hover:scale-105 transition-transform duration-300"
            style={{
              width: "128px",
              height: "128px",
              filter: "drop-shadow(0 10px 25px rgba(0, 0, 0, 0.5))",
            }}
          />
        </div>
      </div>

      <div className="mt-4 space-y-1">
        <p className="text-sm font-medium text-gray-300">
          128×128 High Quality Preview
        </p>
        <p className="text-xs text-gray-500">Hover to see enhanced view</p>
      </div>
    </div>
  );
}
