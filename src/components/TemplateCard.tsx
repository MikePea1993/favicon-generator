// src/components/TemplateCard.tsx - Professional Favicon Template Gallery

import { useState } from "react";
import { Palette, Sparkles, Zap, Crown } from "lucide-react";
import { Button } from "./common";
import type { FaviconConfig } from "../types/favicon";

export interface FaviconTemplate {
  id: string;
  name: string;
  category:
    | "tech"
    | "creative"
    | "business"
    | "ecommerce"
    | "personal"
    | "medical"
    | "education"
    | "gaming";
  description: string;
  config: FaviconConfig;
  tags: string[];
  premium?: boolean;
}

interface Props {
  onSelectTemplate: (template: FaviconTemplate) => void;
  onClose?: () => void;
}

// Professional favicon templates with fonts
const FAVICON_TEMPLATES: FaviconTemplate[] = [
  // Tech & Startup Templates
  {
    id: "tech-gradient-modern",
    name: "Tech Gradient",
    category: "tech",
    description: "Modern gradient perfect for tech startups and SaaS products",
    config: {
      text: "T",
      backgroundColor: "#1a1a1a",
      textColor: "#ffffff",
      fontSize: 32,
      fontFamily: "Inter",
      fontWeight: "700",
      shape: "rounded",
      backgroundType: "gradient",
      gradientStart: "#3b82f6",
      gradientEnd: "#8b5cf6",
      gradientDirection: "135deg",
    },
    tags: ["startup", "saas", "modern", "gradient"],
  },
  {
    id: "tech-neon-cyber",
    name: "Cyber Neon",
    category: "tech",
    description: "Futuristic neon design for AI and cybersecurity companies",
    config: {
      text: "AI",
      backgroundColor: "#0a0a0a",
      textColor: "#00ff88",
      fontSize: 28,
      fontFamily: "JetBrains Mono",
      fontWeight: "600",
      shape: "square",
      backgroundType: "gradient",
      gradientStart: "#001122",
      gradientEnd: "#003344",
      gradientDirection: "45deg",
    },
    tags: ["ai", "cybersecurity", "futuristic", "neon"],
  },
  {
    id: "tech-minimal-circle",
    name: "Minimal Tech",
    category: "tech",
    description: "Clean minimalist design for developer tools and APIs",
    config: {
      text: "API",
      backgroundColor: "#f8fafc",
      textColor: "#1e293b",
      fontSize: 24,
      fontFamily: "Poppins",
      fontWeight: "600",
      shape: "circle",
      backgroundType: "solid",
    },
    tags: ["minimal", "clean", "developer", "api"],
  },

  // Creative & Design Templates
  {
    id: "creative-rainbow-gradient",
    name: "Creative Rainbow",
    category: "creative",
    description: "Vibrant rainbow gradient for creative agencies and designers",
    config: {
      text: "C",
      backgroundColor: "#ffffff",
      textColor: "#ffffff",
      fontSize: 36,
      fontFamily: "Playfair Display",
      fontWeight: "700",
      shape: "rounded",
      backgroundType: "gradient",
      gradientStart: "#ff6b6b",
      gradientEnd: "#4ecdc4",
      gradientDirection: "45deg",
    },
    tags: ["creative", "colorful", "agency", "design"],
  },
  {
    id: "creative-artistic-brush",
    name: "Artistic Brush",
    category: "creative",
    description: "Artistic design perfect for portfolios and art studios",
    config: {
      text: "ART",
      backgroundColor: "#2d1b69",
      textColor: "#f7df1e",
      fontSize: 24,
      fontFamily: "Montserrat",
      fontWeight: "800",
      shape: "rounded",
      backgroundType: "gradient",
      gradientStart: "#667eea",
      gradientEnd: "#764ba2",
      gradientDirection: "135deg",
    },
    tags: ["artistic", "portfolio", "studio", "creative"],
  },

  // Business & Corporate Templates
  {
    id: "business-professional-blue",
    name: "Professional Blue",
    category: "business",
    description:
      "Corporate blue design for professional services and consulting",
    config: {
      text: "PRO",
      backgroundColor: "#1e40af",
      textColor: "#ffffff",
      fontSize: 24,
      fontFamily: "Roboto",
      fontWeight: "700",
      shape: "square",
      backgroundType: "solid",
    },
    tags: ["corporate", "professional", "consulting", "business"],
  },
  {
    id: "business-elegant-gold",
    name: "Elegant Gold",
    category: "business",
    description: "Luxury gold design for premium brands and high-end services",
    config: {
      text: "LUX",
      backgroundColor: "#111827",
      textColor: "#fbbf24",
      fontSize: 28,
      fontFamily: "Playfair Display",
      fontWeight: "600",
      shape: "rounded",
      backgroundType: "gradient",
      gradientStart: "#111827",
      gradientEnd: "#374151",
      gradientDirection: "135deg",
    },
    tags: ["luxury", "premium", "gold", "elegant"],
  },
  {
    id: "business-corporate-minimal",
    name: "Corporate Minimal",
    category: "business",
    description: "Clean corporate design for enterprises and B2B companies",
    config: {
      text: "CORP",
      backgroundColor: "#f9fafb",
      textColor: "#374151",
      fontSize: 20,
      fontFamily: "system-ui",
      fontWeight: "600",
      shape: "square",
      backgroundType: "solid",
    },
    tags: ["corporate", "minimal", "enterprise", "b2b"],
  },

  // E-commerce Templates
  {
    id: "ecommerce-shopping-gradient",
    name: "Shopping Gradient",
    category: "ecommerce",
    description: "Vibrant gradient perfect for online stores and marketplaces",
    config: {
      text: "SHOP",
      backgroundColor: "#ffffff",
      textColor: "#ffffff",
      fontSize: 22,
      fontFamily: "Nunito",
      fontWeight: "800",
      shape: "rounded",
      backgroundType: "gradient",
      gradientStart: "#f093fb",
      gradientEnd: "#f5576c",
      gradientDirection: "135deg",
    },
    tags: ["shopping", "store", "marketplace", "retail"],
  },
  {
    id: "ecommerce-product-focus",
    name: "Product Focus",
    category: "ecommerce",
    description: "Product-focused design for brand stores and boutiques",
    config: {
      text: "PROD",
      backgroundColor: "#fef3c7",
      textColor: "#92400e",
      fontSize: 20,
      fontFamily: "Lato",
      fontWeight: "700",
      shape: "circle",
      backgroundType: "solid",
    },
    tags: ["product", "boutique", "brand", "store"],
  },

  // Personal Brand Templates
  {
    id: "personal-initials-modern",
    name: "Personal Initials",
    category: "personal",
    description: "Modern design perfect for personal brands and portfolios",
    config: {
      text: "JD",
      backgroundColor: "#0f172a",
      textColor: "#38bdf8",
      fontSize: 32,
      fontFamily: "Inter",
      fontWeight: "600",
      shape: "circle",
      backgroundType: "gradient",
      gradientStart: "#0f172a",
      gradientEnd: "#1e293b",
      gradientDirection: "135deg",
    },
    tags: ["personal", "initials", "portfolio", "individual"],
  },
  {
    id: "personal-blogger-warm",
    name: "Blogger Warm",
    category: "personal",
    description: "Warm, approachable design for bloggers and content creators",
    config: {
      text: "BLOG",
      backgroundColor: "#fbbf24",
      textColor: "#78350f",
      fontSize: 22,
      fontFamily: "Lora",
      fontWeight: "600",
      shape: "rounded",
      backgroundType: "gradient",
      gradientStart: "#fbbf24",
      gradientEnd: "#f59e0b",
      gradientDirection: "45deg",
    },
    tags: ["blog", "content", "creator", "personal"],
  },

  // Medical & Healthcare Templates
  {
    id: "medical-cross-clean",
    name: "Medical Cross",
    category: "medical",
    description: "Clean medical design for healthcare and wellness brands",
    config: {
      text: "+",
      backgroundColor: "#ffffff",
      textColor: "#dc2626",
      fontSize: 40,
      fontFamily: "Open Sans",
      fontWeight: "700",
      shape: "circle",
      backgroundType: "solid",
    },
    tags: ["medical", "healthcare", "wellness", "clean"],
  },
  {
    id: "medical-wellness-gradient",
    name: "Wellness Gradient",
    category: "medical",
    description: "Calming gradient for wellness and mental health services",
    config: {
      text: "WELL",
      backgroundColor: "#f0f9ff",
      textColor: "#075985",
      fontSize: 20,
      fontFamily: "Nunito",
      fontWeight: "600",
      shape: "rounded",
      backgroundType: "gradient",
      gradientStart: "#e0f2fe",
      gradientEnd: "#bae6fd",
      gradientDirection: "135deg",
    },
    tags: ["wellness", "mental health", "calm", "healthcare"],
  },

  // Education Templates
  {
    id: "education-book-academic",
    name: "Academic Book",
    category: "education",
    description: "Academic design for educational institutions and courses",
    config: {
      text: "EDU",
      backgroundColor: "#1e3a8a",
      textColor: "#fbbf24",
      fontSize: 24,
      fontFamily: "Merriweather",
      fontWeight: "700",
      shape: "square",
      backgroundType: "solid",
    },
    tags: ["education", "academic", "school", "learning"],
  },
  {
    id: "education-modern-learn",
    name: "Modern Learning",
    category: "education",
    description: "Modern design for online courses and e-learning platforms",
    config: {
      text: "LEARN",
      backgroundColor: "#581c87",
      textColor: "#d8b4fe",
      fontSize: 18,
      fontFamily: "Poppins",
      fontWeight: "600",
      shape: "rounded",
      backgroundType: "gradient",
      gradientStart: "#581c87",
      gradientEnd: "#7c3aed",
      gradientDirection: "45deg",
    },
    tags: ["online", "courses", "e-learning", "modern"],
  },

  // Gaming Templates
  {
    id: "gaming-neon-electric",
    name: "Gaming Neon",
    category: "gaming",
    description: "Electric neon design perfect for gaming and esports brands",
    config: {
      text: "GAME",
      backgroundColor: "#000000",
      textColor: "#ff0080",
      fontSize: 20,
      fontFamily: "Oswald",
      fontWeight: "600",
      shape: "square",
      backgroundType: "gradient",
      gradientStart: "#000000",
      gradientEnd: "#1a0033",
      gradientDirection: "135deg",
    },
    tags: ["gaming", "esports", "neon", "electric"],
  },
  {
    id: "gaming-retro-pixel",
    name: "Retro Pixel",
    category: "gaming",
    description: "Retro pixel art style for indie games and gaming communities",
    config: {
      text: "RETRO",
      backgroundColor: "#065f46",
      textColor: "#34d399",
      fontSize: 16,
      fontFamily: "Source Code Pro",
      fontWeight: "700",
      shape: "square",
      backgroundType: "solid",
    },
    tags: ["retro", "pixel", "indie", "gaming"],
  },
];

const CATEGORIES = [
  { id: "all", name: "All Templates", icon: Sparkles },
  { id: "tech", name: "Tech & Startup", icon: Zap },
  { id: "creative", name: "Creative & Design", icon: Palette },
  { id: "business", name: "Business & Corporate", icon: Crown },
  { id: "ecommerce", name: "E-commerce", icon: Crown },
  { id: "personal", name: "Personal Brand", icon: Crown },
  { id: "medical", name: "Medical & Healthcare", icon: Crown },
  { id: "education", name: "Education", icon: Crown },
  { id: "gaming", name: "Gaming & Entertainment", icon: Crown },
];

export default function TemplateCard({ onSelectTemplate }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

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
      return "transparent";
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
            template.config.shape === "transparent"
              ? "transparent"
              : getBackgroundStyle(template.config),
          borderRadius:
            template.config.shape === "circle"
              ? "50%"
              : template.config.shape === "rounded"
                ? "20%"
                : template.config.shape === "square"
                  ? "8%"
                  : "0", // No border radius for "none"
        }}
      >
        {config.text}
      </div>
    );
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              Template Gallery
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              Professional templates to get started quickly
            </p>
          </div>
          <div className="text-sm text-blue-400 font-semibold">
            {filteredTemplates.length} templates
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === category.id
                  ? "bg-blue-500 text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="p-6 max-h-96 overflow-y-auto custom-scroll">
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="group bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 hover:bg-white/10 transition-all duration-200 cursor-pointer"
                onClick={() => onSelectTemplate(template)}
              >
                <div className="flex items-center gap-4">
                  {/* Template Preview */}
                  <div className="flex-shrink-0">
                    {renderTemplatePreview(template)}
                  </div>

                  {/* Template Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {template.name}
                      </h4>
                      {template.premium && (
                        <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs font-bold rounded">
                          PRO
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mb-2 line-clamp-1">
                      {template.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {template.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-white/10 text-gray-300 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {template.tags.length > 3 && (
                        <span className="text-gray-500 text-xs">
                          +{template.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Use Button */}
                  <div className="flex-shrink-0">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Use Template
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Sparkles className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No templates found</p>
            <p className="text-gray-500 text-sm">
              Try a different search or category
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 bg-white/5">
        <div className="text-center text-sm text-gray-400">
          <span className="font-medium text-blue-400">
            {FAVICON_TEMPLATES.length}
          </span>{" "}
          professional templates •
          <span className="ml-1">More templates added weekly</span>
        </div>
      </div>
    </div>
  );
}

export { FAVICON_TEMPLATES };
