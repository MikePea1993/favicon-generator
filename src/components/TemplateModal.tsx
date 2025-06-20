// src/components/TemplateModal.tsx - Template Selector Modal

import { useState } from "react";
import { Search, X, Sparkles, Filter } from "lucide-react";
import { FAVICON_TEMPLATES, type FaviconTemplate } from "./TemplateCard";
import type { FaviconConfig } from "../types/favicon";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: FaviconTemplate) => void;
}

const CATEGORIES = [
  { id: "all", name: "All Templates" },
  { id: "tech", name: "Tech & Startup" },
  { id: "creative", name: "Creative & Design" },
  { id: "business", name: "Business & Corporate" },
  { id: "ecommerce", name: "E-commerce" },
  { id: "personal", name: "Personal Brand" },
  { id: "medical", name: "Medical & Healthcare" },
  { id: "education", name: "Education" },
  { id: "gaming", name: "Gaming & Entertainment" },
];

export default function TemplateModal({ isOpen, onClose, onSelect }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredTemplates = FAVICON_TEMPLATES.filter((template) => {
    const matchesCategory =
      selectedCategory === "all" || template.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    return matchesCategory && matchesSearch;
  });

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

  const renderTemplatePreview = (template: FaviconTemplate) => {
    const { config } = template;
    return (
      <div
        className="w-12 h-12 rounded flex items-center justify-center text-white font-bold shadow-lg border border-white/20 relative overflow-hidden"
        style={{
          background:
            config.backgroundType === "transparent"
              ? getBackgroundStyle(config)
              : getBackgroundStyle(config),
          backgroundSize:
            config.backgroundType === "transparent" ? "6px 6px" : "auto",
          backgroundPosition:
            config.backgroundType === "transparent"
              ? "0 0, 0 3px, 3px -3px, -3px 0px"
              : "auto",
          color: config.textColor,
          fontSize: `${Math.floor(config.fontSize * 0.25)}px`,
          borderRadius:
            config.shape === "circle"
              ? "50%"
              : config.shape === "rounded"
                ? "20%"
                : "8%",
        }}
      >
        {config.text}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="bg-gray-900/95 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
          <div>
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-400" />
              Template Gallery
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              <span className="font-semibold text-purple-400">
                {FAVICON_TEMPLATES.length}
              </span>{" "}
              professional templates • {filteredTemplates.length} showing
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search & Filters */}
        <div className="p-6 border-b border-white/10">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-4">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setSearchQuery(""); // Clear search when selecting category
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category.id && !searchQuery
                    ? "bg-purple-500 text-white"
                    : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Filter Stats */}
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Categories: <strong>{CATEGORIES.length - 1}</strong>
            </span>
            {searchQuery && (
              <span>
                Search results: <strong>{filteredTemplates.length}</strong>
              </span>
            )}
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Clear all
            </button>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto max-h-[50vh] custom-scroll">
          {filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredTemplates.map((template, index) => (
                <button
                  key={template.id}
                  onClick={() => onSelect(template)}
                  className="group bg-white/5 border border-white/10 rounded-xl p-4 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-200 text-left hover:scale-[1.02]"
                  style={{ animationDelay: `${index * 0.02}s` }}
                >
                  <div className="flex items-center gap-4">
                    {/* Template Preview */}
                    <div className="flex-shrink-0">
                      {renderTemplatePreview(template)}
                    </div>

                    {/* Template Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                          {template.name}
                        </h4>
                        {template.premium && (
                          <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs font-bold rounded">
                            PRO
                          </span>
                        )}
                        <span className="px-2 py-0.5 bg-white/10 text-gray-300 text-xs rounded capitalize">
                          {template.category}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">
                        {template.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {template.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-white/10 text-gray-300 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {template.tags.length > 4 && (
                          <span className="text-gray-500 text-xs">
                            +{template.tags.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Arrow indicator */}
                    <div className="flex-shrink-0 text-gray-400 group-hover:text-purple-400 transition-colors">
                      <div className="w-6 h-6 flex items-center justify-center">
                        →
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Sparkles className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">No templates found</p>
              <p className="text-gray-500 text-sm">
                Try a different search term or browse categories
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-white/5">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              <span className="font-medium text-purple-400">
                {FAVICON_TEMPLATES.length} professional templates
              </span>{" "}
              across {CATEGORIES.length - 1} categories • More templates added
              weekly
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
