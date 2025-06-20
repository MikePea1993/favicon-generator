// src/components/IconSelectorModal.tsx - UPDATED WITH 20,000+ ICONS

import { useState, useEffect } from "react";
import { Search, X, Star } from "lucide-react";
import {
  searchAllIcons,
  getPopularIcons,
  getIconsByCategory,
  MEGA_ICON_LIBRARY,
  TOTAL_ICONS,
  type IconData,
} from "../utils/quickIconLibrary";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (iconData: IconData) => void;
}

const CATEGORIES = [
  "Popular",
  "Social",
  "Business",
  "Tech",
  "Communication",
  "Media",
  "Navigation",
  "Action",
  "Emotion",
];

export default function IconSelectorModal({
  isOpen,
  onClose,
  onSelect,
}: Props) {
  const [iconSearch, setIconSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Popular");
  const [icons, setIcons] = useState<IconData[]>([]);
  const [loading, setLoading] = useState(false);

  // Load icons based on search/category
  useEffect(() => {
    setLoading(true);

    const loadIcons = async () => {
      try {
        let results: IconData[] = [];

        if (iconSearch.trim()) {
          // Search mode
          results = searchAllIcons(iconSearch, 100);
        } else if (selectedCategory === "Popular") {
          // Popular icons
          results = getPopularIcons(50);
        } else {
          // Category mode
          results = getIconsByCategory(selectedCategory, 100);
        }

        setIcons(results);
      } catch (error) {
        console.error("Failed to load icons:", error);
        setIcons([]);
      } finally {
        setLoading(false);
      }
    };

    loadIcons();
  }, [iconSearch, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="bg-gray-900/95 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
          <div>
            <h3 className="text-2xl font-bold text-white">Choose Icon</h3>
            <p className="text-gray-400 text-sm mt-1">
              <span className="font-semibold text-blue-400">
                {TOTAL_ICONS.toLocaleString()}+
              </span>{" "}
              professional icons • {icons.length} showing
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search & Categories */}
        <div className="p-6 border-b border-white/10">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search 20,000+ icons..."
              value={iconSearch}
              onChange={(e) => setIconSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-4">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setIconSearch(""); // Clear search when selecting category
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category && !iconSearch
                    ? "bg-blue-500 text-white"
                    : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Library Stats */}
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>
              Libraries:{" "}
              <strong>{Object.keys(MEGA_ICON_LIBRARY).length}</strong>
            </span>
            {iconSearch && (
              <span>
                Search results: <strong>{icons.length}</strong>
              </span>
            )}
            <button
              onClick={() => {
                setIconSearch("");
                setSelectedCategory("Popular");
              }}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Clear all
            </button>
          </div>
        </div>

        {/* Icon Grid */}
        <div className="p-6 overflow-y-auto max-h-[50vh] custom-scroll">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-400">Loading icons...</span>
            </div>
          ) : icons.length > 0 ? (
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
              {icons.map((icon, index) => (
                <button
                  key={`${icon.library}-${icon.name}`}
                  onClick={() => onSelect(icon)}
                  className="group p-3 rounded-xl border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-200 flex flex-col items-center gap-2 hover:scale-105 relative"
                  style={{ animationDelay: `${index * 0.01}s` }}
                  title={`${icon.displayName} (${icon.libraryName})`}
                >
                  <div className="w-8 h-8 flex items-center justify-center text-gray-300 group-hover:text-blue-400 transition-colors">
                    <icon.component size={24} />
                  </div>
                  <span className="text-xs text-gray-400 group-hover:text-blue-300 transition-colors text-center leading-tight">
                    {icon.displayName}
                  </span>
                  {/* Library badge */}
                  <span className="absolute top-1 right-1 text-xs bg-gray-800 text-gray-500 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {icon.library.toUpperCase()}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">No icons found</p>
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
              <span className="font-medium text-blue-400">
                {TOTAL_ICONS.toLocaleString()}+ icons
              </span>{" "}
              from Font Awesome, Material Design, Heroicons, Bootstrap, and 12+
              more libraries
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
