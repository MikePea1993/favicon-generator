// src/components/TemplatesPanel.tsx - FIXED HEIGHT VERSION

import { Sparkles, Grid3X3 } from "lucide-react";
import { Button } from "./common";
import { FAVICON_TEMPLATES, type FaviconTemplate } from "./TemplateCard";
import type { FaviconConfig } from "../types/favicon";

interface Props {
  onOpenTemplateModal: () => void;
  onTemplateSelect: (template: FaviconTemplate) => void;
  currentConfig: FaviconConfig;
}

export default function TemplatesPanel({
  onOpenTemplateModal,
  onTemplateSelect,
  currentConfig,
}: Props) {
  // Get featured templates (top picks from each category)
  const getFeaturedTemplates = (): FaviconTemplate[] => {
    const featured = [
      FAVICON_TEMPLATES.find((t) => t.id === "tech-gradient-modern"),
      FAVICON_TEMPLATES.find((t) => t.id === "creative-rainbow-gradient"),
      FAVICON_TEMPLATES.find((t) => t.id === "business-professional-blue"),
      FAVICON_TEMPLATES.find((t) => t.id === "personal-initials-modern"),
    ].filter(Boolean) as FaviconTemplate[];

    return featured;
  };

  const getBackgroundStyle = (config: FaviconConfig) => {
    if (config.backgroundType === "transparent") {
      return `
        linear-gradient(45deg, #374151 25%, transparent 25%), 
        linear-gradient(-45deg, #374151 25%, transparent 25%), 
        linear-gradient(45deg, transparent 75%, #374151 75%), 
        linear-gradient(-45deg, transparent 75%, #374151 75%)
      `;
    } else if (config.backgroundType === "gradient") {
      return `linear-gradient(${config.gradientDirection || "45deg"}, ${config.gradientStart || config.backgroundColor}, ${config.gradientEnd || config.backgroundColor})`;
    } else {
      return config.backgroundColor;
    }
  };

  const renderTemplatePreview = (
    template: FaviconTemplate,
    size = "w-12 h-12",
  ) => {
    const { config } = template;
    return (
      <div
        className={`${size} rounded flex items-center justify-center text-white font-bold shadow-lg border border-white/20 relative overflow-hidden hover:scale-110 transition-transform cursor-pointer`}
        style={{
          background:
            config.shape === "transparent"
              ? "transparent"
              : getBackgroundStyle(config),
          backgroundSize:
            config.backgroundType === "transparent" ? "6px 6px" : "auto",
          backgroundPosition:
            config.backgroundType === "transparent"
              ? "0 0, 0 3px, 3px -3px, -3px 0px"
              : "auto",
          color: config.textColor,
          fontSize:
            size === "w-12 h-12"
              ? `${Math.floor(config.fontSize * 0.25)}px`
              : `${Math.floor(config.fontSize * 0.4)}px`,
          borderRadius:
            config.shape === "circle"
              ? "50%"
              : config.shape === "rounded"
                ? "20%"
                : config.shape === "square"
                  ? "8%"
                  : "0", // No border radius for "none"
        }}
        onClick={() => onTemplateSelect(template)}
        title={`Use ${template.name} template`}
      >
        {config.text}
      </div>
    );
  };

  return (
    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
      <div className="text-center space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            Professional Templates
          </h3>
          <p className="text-gray-400 text-sm">
            Get started instantly with our curated favicon templates
          </p>
        </div>

        {/* Featured Templates Preview */}
        <div className="flex justify-center gap-3">
          {getFeaturedTemplates().map((template) => (
            <div key={template.id} className="text-center group">
              {renderTemplatePreview(template, "w-10 h-10")}
              <span className="text-xs text-gray-400 mt-1 block group-hover:text-blue-400 transition-colors">
                {template.name.split(" ")[0]}
              </span>
            </div>
          ))}
        </div>

        <Button
          variant="primary"
          onClick={onOpenTemplateModal}
          icon={Grid3X3}
          size="sm"
          className="px-6"
        >
          Browse All Templates ({FAVICON_TEMPLATES.length})
        </Button>
      </div>
    </div>
  );
}
