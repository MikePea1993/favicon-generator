// src/components/BrowserPreview.tsx - UPDATED WITH FONT SUPPORT
import type { FaviconConfig } from "../types/favicon";
import type { InputType } from "./FaviconGenerator";
import type { IconData } from "../utils/quickIconLibrary";

interface Props {
  config: FaviconConfig;
  brandName: string;
  brandDescription: string;
  browserTheme: "light" | "dark";
  onThemeChange: (theme: "light" | "dark") => void;
  inputType: InputType;
  selectedIconData: IconData | null;
  uploadedImage: string | null;
  imageScale: number; // Add this prop
}

export default function BrowserPreview({
  config,
  brandName,
  brandDescription,
  browserTheme,
  onThemeChange,
  inputType,
  selectedIconData,
  uploadedImage,
  imageScale, // Add this prop
}: Props) {
  // Helper function to get background style
  const getBackgroundStyle = (config: FaviconConfig) => {
    if (config.backgroundType === "transparent") {
      return "transparent";
    } else if (config.backgroundType === "gradient") {
      const startColor = config.gradientStartTransparent
        ? "rgba(0,0,0,0)"
        : config.gradientStart || "#3b82f6";

      const endColor = config.gradientEndTransparent
        ? "rgba(0,0,0,0)"
        : config.gradientEnd || "#8b5cf6";

      return `linear-gradient(${config.gradientDirection || "45deg"}, ${startColor}, ${endColor})`;
    } else {
      return config.backgroundColor;
    }
  };

  const renderFaviconContent = (
    size: string = "w-4 h-4",
    fontSize?: number,
  ) => {
    if (inputType === "icon" && selectedIconData) {
      const IconComponent = selectedIconData.component;
      return IconComponent ? (
        <div className="flex items-center justify-center w-full h-full">
          <IconComponent
            className={size}
            style={{ transform: `scale(${imageScale})` }}
          />
        </div>
      ) : (
        selectedIconData.displayName.charAt(0)
      );
    }

    if (inputType === "image" && uploadedImage) {
      return (
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url(${uploadedImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: `scale(${imageScale})`,
            borderRadius:
              config.shape === "circle"
                ? "50%"
                : config.shape === "rounded"
                  ? "2px"
                  : config.shape === "square"
                    ? "1px"
                    : "0",
          }}
        />
      );
    }

    // For text, use fontSize if provided
    if (fontSize && inputType === "text") {
      return (
        <span
          style={{
            fontSize: `${fontSize * imageScale}px`,
            fontFamily: config.fontFamily || "Inter",
            fontWeight: config.fontWeight || "bold",
          }}
        >
          {config.text}
        </span>
      );
    }

    return config.text;
  };

  return (
    <div className="mt-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white">Browser Preview</h3>
            <p className="text-gray-400 mt-1">
              See how your favicon looks in real browser tabs
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">Theme:</span>
            <div className="flex bg-white/5 rounded-lg p-1">
              <button
                onClick={() => onThemeChange("light")}
                className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                  browserTheme === "light"
                    ? "bg-white text-gray-900"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                ☀️ Light
              </button>
              <button
                onClick={() => onThemeChange("dark")}
                className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                  browserTheme === "dark"
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                🌙 Dark
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Browser Window Mockup */}
        <div
          className={`rounded-lg overflow-hidden border-2 transition-all duration-300 ${
            browserTheme === "light"
              ? "bg-white border-gray-200"
              : "bg-gray-900 border-gray-700"
          }`}
        >
          {/* Browser Header */}
          <div
            className={`flex items-center justify-between px-4 py-3 border-b ${
              browserTheme === "light"
                ? "bg-gray-50 border-gray-200"
                : "bg-gray-800 border-gray-700"
            }`}
          >
            {/* Traffic Lights */}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>

            {/* URL Bar */}
            <div
              className={`flex-1 mx-6 px-4 py-2 rounded-lg flex items-center gap-3 ${
                browserTheme === "light"
                  ? "bg-white border border-gray-300"
                  : "bg-gray-700 border border-gray-600"
              }`}
            >
              <div
                className={`text-sm ${browserTheme === "light" ? "text-gray-600" : "text-gray-300"}`}
              >
                🔒
              </div>
              <span
                className={`text-sm ${browserTheme === "light" ? "text-gray-700" : "text-gray-200"}`}
              >
                {brandName
                  ? `${brandName.toLowerCase().replace(/\s+/g, "")}.com`
                  : "yourwebsite.com"}
              </span>
            </div>

            {/* Browser Controls */}
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded flex items-center justify-center ${
                  browserTheme === "light"
                    ? "hover:bg-gray-200"
                    : "hover:bg-gray-700"
                }`}
              >
                <span
                  className={`text-sm ${browserTheme === "light" ? "text-gray-600" : "text-gray-400"}`}
                >
                  ⋯
                </span>
              </div>
            </div>
          </div>

          {/* Browser Tabs */}
          <div
            className={`flex items-end px-4 ${
              browserTheme === "light" ? "bg-gray-100" : "bg-gray-800"
            }`}
          >
            {/* Active Tab with Favicon */}
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-t-lg border-t-2 border-l border-r min-w-[200px] max-w-[300px] relative ${
                browserTheme === "light"
                  ? "bg-white border-gray-200 border-t-blue-500"
                  : "bg-gray-900 border-gray-600 border-t-blue-400"
              }`}
            >
              {/* Favicon in Tab */}
              <div
                className="w-4 h-4 rounded flex-shrink-0 flex items-center justify-center relative overflow-hidden"
                style={{
                  background:
                    config.shape === "transparent"
                      ? "transparent"
                      : getBackgroundStyle(config),
                  borderRadius:
                    config.shape === "circle"
                      ? "50%"
                      : config.shape === "rounded"
                        ? "2px"
                        : config.shape === "square"
                          ? "1px"
                          : "0",
                  color: config.textColor,
                  fontSize:
                    inputType === "text"
                      ? `${Math.floor(config.fontSize * 0.25)}px`
                      : "8px",
                  fontFamily: config.fontFamily || "Inter",
                  fontWeight: config.fontWeight || "bold",
                }}
              >
                {renderFaviconContent(
                  "w-3 h-3",
                  Math.floor(config.fontSize * 0.25),
                )}
              </div>

              {/* Tab Title */}
              <span
                className={`text-sm font-medium truncate ${
                  browserTheme === "light" ? "text-gray-800" : "text-gray-200"
                }`}
              >
                {brandName || "Your Website"}
                {brandDescription && ` - ${brandDescription}`}
              </span>

              {/* Close Button */}
              <button
                className={`w-5 h-5 rounded flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                  browserTheme === "light" ? "text-gray-500" : "text-gray-400"
                }`}
              >
                ×
              </button>
            </div>

            {/* Inactive Tabs */}
            <div
              className={`flex items-center gap-3 px-4 py-3 min-w-[180px] ${
                browserTheme === "light"
                  ? "text-gray-600 hover:bg-gray-50"
                  : "text-gray-400 hover:bg-gray-700"
              }`}
            >
              <div className="w-4 h-4 bg-gray-400 rounded"></div>
              <span className="text-sm truncate">Documentation</span>
              <span className="text-xs">×</span>
            </div>

            <div
              className={`flex items-center gap-3 px-4 py-3 min-w-[180px] ${
                browserTheme === "light"
                  ? "text-gray-600 hover:bg-gray-50"
                  : "text-gray-400 hover:bg-gray-700"
              }`}
            >
              <div className="w-4 h-4 bg-gray-400 rounded"></div>
              <span className="text-sm truncate">Settings</span>
              <span className="text-xs">×</span>
            </div>

            {/* New Tab Button */}
            <button
              className={`w-8 h-8 rounded flex items-center justify-center ml-2 ${
                browserTheme === "light"
                  ? "hover:bg-gray-200 text-gray-600"
                  : "hover:bg-gray-700 text-gray-400"
              }`}
            >
              +
            </button>
          </div>

          {/* Browser Content Area */}
          <div
            className={`h-32 flex items-center justify-center ${
              browserTheme === "light"
                ? "bg-white text-gray-400"
                : "bg-gray-900 text-gray-500"
            }`}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">🌐</div>
              <p className="text-sm">Your website content would appear here</p>
            </div>
          </div>
        </div>

        {/* Additional Context Examples */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Bookmarks Bar */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Bookmarks Bar
            </h4>
            <div
              className={`p-3 rounded-lg ${
                browserTheme === "light"
                  ? "bg-gray-100 border border-gray-200"
                  : "bg-gray-800 border border-gray-700"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded flex-shrink-0 flex items-center justify-center relative overflow-hidden"
                    style={{
                      background:
                        config.shape === "transparent"
                          ? "transparent"
                          : getBackgroundStyle(config),
                      borderRadius:
                        config.shape === "circle"
                          ? "50%"
                          : config.shape === "rounded"
                            ? "2px"
                            : config.shape === "square"
                              ? "1px"
                              : "0",
                      color: config.textColor,
                      fontSize:
                        inputType === "text"
                          ? `${Math.floor(config.fontSize * 0.25)}px`
                          : "8px",
                      fontFamily: config.fontFamily || "Inter",
                      fontWeight: config.fontWeight || "bold",
                    }}
                  >
                    {renderFaviconContent(
                      "w-3 h-3",
                      Math.floor(config.fontSize * 0.25),
                    )}
                  </div>
                  <span
                    className={`text-sm ${
                      browserTheme === "light"
                        ? "text-gray-700"
                        : "text-gray-300"
                    }`}
                  >
                    {brandName || "Your Site"}
                  </span>
                </div>
                <div className="flex items-center gap-2 opacity-60">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm">GitHub</span>
                </div>
                <div className="flex items-center gap-2 opacity-60">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm">Gmail</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile App Icon */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Mobile Home Screen
            </h4>
            <div className="bg-gradient-to-br from-blue-900 to-purple-900 p-6 rounded-lg">
              <div className="grid grid-cols-4 gap-4">
                {/* Your App Icon */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-14 h-14 rounded-xl mb-2 flex items-center justify-center shadow-lg border border-white/20 relative overflow-hidden"
                    style={{
                      background:
                        config.shape === "transparent"
                          ? "transparent"
                          : getBackgroundStyle(config),
                      borderRadius:
                        config.shape === "circle"
                          ? "50%"
                          : config.shape === "rounded"
                            ? "2px"
                            : config.shape === "square"
                              ? "1px"
                              : "0",
                      color: config.textColor,
                      fontSize:
                        inputType === "text"
                          ? `${Math.floor(config.fontSize * 0.75)}px`
                          : "20px",
                      fontFamily: config.fontFamily || "Inter",
                      fontWeight: config.fontWeight || "bold",
                    }}
                  >
                    {renderFaviconContent(
                      "w-8 h-8",
                      Math.floor(config.fontSize * 0.75),
                    )}
                  </div>
                  <span className="text-xs text-white font-medium text-center">
                    {brandName || "Your App"}
                  </span>
                </div>

                {/* Other App Icons */}
                <div className="flex flex-col items-center opacity-60">
                  <div className="w-14 h-14 bg-blue-500 rounded-xl mb-2 flex items-center justify-center">
                    <span className="text-white text-xl">📧</span>
                  </div>
                  <span className="text-xs text-white">Mail</span>
                </div>
                <div className="flex flex-col items-center opacity-60">
                  <div className="w-14 h-14 bg-green-500 rounded-xl mb-2 flex items-center justify-center">
                    <span className="text-white text-xl">📱</span>
                  </div>
                  <span className="text-xs text-white">Phone</span>
                </div>
                <div className="flex flex-col items-center opacity-60">
                  <div className="w-14 h-14 bg-purple-500 rounded-xl mb-2 flex items-center justify-center">
                    <span className="text-white text-xl">⚙️</span>
                  </div>
                  <span className="text-xs text-white">Settings</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
