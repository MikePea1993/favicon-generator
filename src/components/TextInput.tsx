// src/components/TextInput.tsx - SLIGHTLY SMALLER VERSION
import { Input } from "./common";
import type { FaviconConfig } from "../types/favicon";

interface Props {
  config: FaviconConfig;
  onConfigUpdate: (updates: Partial<FaviconConfig>) => void;
  onClearOthers: () => void;
}

export default function TextInput({
  config,
  onConfigUpdate,
  onClearOthers,
}: Props) {
  const handleTextChange = (text: string) => {
    onConfigUpdate({ text: text.slice(0, 2) });
    onClearOthers();
  };

  return (
    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
      <div className="space-y-3">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-1">
            Text Favicon
          </h3>
          <p className="text-gray-400 text-sm">
            Enter 1-2 characters for your favicon
          </p>
        </div>

        <Input
          placeholder="Enter 1-2 characters"
          value={config.text}
          onChange={(e) => handleTextChange(e.target.value)}
          maxLength={2}
          className="text-2xl text-center h-12 text-white font-bold bg-white/10 border-2 border-white/20"
        />

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 text-center">
            Font Size:{" "}
            <span className="text-blue-400 font-mono">{config.fontSize}px</span>
          </label>
          <input
            type="range"
            min="16"
            max="48"
            value={config.fontSize}
            onChange={(e) =>
              onConfigUpdate({ fontSize: parseInt(e.target.value) })
            }
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider-dark"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>16px</span>
            <span>32px</span>
            <span>48px</span>
          </div>
        </div>
      </div>
    </div>
  );
}
