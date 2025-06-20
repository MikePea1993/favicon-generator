// src/hooks/useFavicon.ts
import { useState } from "react";
import { FaviconConfig, DEFAULT_CONFIG } from "../types/favicon";

export function useFavicon() {
  const [config, setConfig] = useState<FaviconConfig>(DEFAULT_CONFIG);

  const updateConfig = (updates: Partial<FaviconConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const resetConfig = () => {
    setConfig(DEFAULT_CONFIG);
  };

  return {
    config,
    updateConfig,
    resetConfig,
  };
}
