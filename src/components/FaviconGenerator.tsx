// src/components/FaviconGenerator.tsx - UPDATED LAYOUT
import { useState } from "react";
import { useFavicon } from "../hooks/useFavicon";
import InputTypeSelector from "./InputTypeSelector";
import ImageUploader from "./ImageUploader";
import TextInput from "./TextInput";
import IconSelector from "./IconSelector";
import TemplatesPanel from "./TemplatesPanel";
import SettingsPanel from "./SettingsPanel";
import BrandInfo from "./BrandInfo";
import BrowserPreview from "./BrowserPreview";
import GenerateButton from "./GenerateButton";
import IconSelectorModal from "./IconSelectorModal";
import TemplateModal from "./TemplateModal";
import FontModal from "./FontModal"; // Keep font modal import
import AnimatedBackButton from "./AnimatedBackButton";
import { useToastHelpers } from "./common";
import type { FaviconConfig } from "../types/favicon";
import type { IconData } from "../utils/quickIconLibrary";
import type { FaviconTemplate } from "./TemplateCard";

export type InputType = "text" | "icon" | "image" | "template";

interface Props {
  onBackToHome: () => void;
}

export default function FaviconGenerator({ onBackToHome }: Props) {
  const { config, updateConfig, resetConfig } = useFavicon();
  const [inputType, setInputType] = useState<InputType>("template");
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showFontModal, setShowFontModal] = useState(false); // Keep font modal state
  const [selectedIconData, setSelectedIconData] = useState<IconData | null>(
    null,
  );
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageScale, setImageScale] = useState(1);
  const [brandName, setBrandName] = useState("");
  const [brandDescription, setBrandDescription] = useState("");
  const [browserTheme, setBrowserTheme] = useState<"light" | "dark">("dark");
  const [hasSelectedTemplate, setHasSelectedTemplate] = useState(false);
  const { info, success } = useToastHelpers();

  // Helper function to render favicon content properly with scaling
  const renderFaviconContent = (size: number = 12) => {
    if (inputType === "icon" && selectedIconData) {
      const IconComponent = selectedIconData.component;
      const scaledSize = Math.floor(size * imageScale);
      return (
        <div className="flex items-center justify-center w-full h-full">
          <IconComponent size={scaledSize} className="text-current" />
        </div>
      );
    }

    if (inputType === "image" && uploadedImage) {
      return (
        <img
          src={uploadedImage}
          alt="Favicon"
          className="w-full h-full object-contain"
          style={{
            transform: `scale(${imageScale})`,
            transformOrigin: "center",
            borderRadius:
              config.shape === "circle"
                ? "50%"
                : config.shape === "rounded"
                  ? "20%"
                  : config.shape === "square"
                    ? "8%"
                    : "0",
          }}
        />
      );
    }

    if ((inputType === "text" || inputType === "template") && config.text) {
      const scaledFontSize = Math.floor(
        config.fontSize * imageScale * (size / 32),
      );
      return (
        <span
          style={{
            fontSize: `${scaledFontSize}px`,
            fontFamily: config.fontFamily || "Inter",
            fontWeight: config.fontWeight || "bold",
            lineHeight: 1,
          }}
        >
          {config.text}
        </span>
      );
    }

    // Show placeholder when no text
    if ((inputType === "text" || inputType === "template") && !config.text) {
      const scaledFontSize = Math.floor(
        config.fontSize * imageScale * (size / 32),
      );
      return (
        <span
          style={{
            fontSize: `${scaledFontSize}px`,
            fontFamily: config.fontFamily || "Inter",
            fontWeight: config.fontWeight || "bold",
            lineHeight: 1,
            opacity: 0.5,
          }}
        >
          ?
        </span>
      );
    }

    return config.text;
  };

  // Helper function to get background style based on config
  const getBackgroundStyle = (config: FaviconConfig) => {
    if (config.shape === "transparent") {
      return "transparent";
    }

    if (config.backgroundType === "transparent") {
      return `repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 
              50% / 10px 10px`;
    }

    if (config.backgroundType === "gradient") {
      return `linear-gradient(${config.gradientDirection || "45deg"}, ${
        config.gradientStart
      }, ${config.gradientEnd})`;
    }

    return config.backgroundColor;
  };

  const handleReset = () => {
    resetConfig();
    setSelectedIconData(null);
    setUploadedImage(null);
    setInputType("template");
    setBrandName("");
    setBrandDescription("");
    setImageScale(1);
    setBrowserTheme("dark");
    setHasSelectedTemplate(false);
    setShowTemplateModal(false);
    setShowFontModal(false);
    info("Settings reset to defaults", {
      title: "Reset Complete",
      duration: 2000,
    });
  };

  const handleIconSelect = (iconData: IconData) => {
    setSelectedIconData(iconData);
    updateConfig({ text: iconData.displayName });
    setShowIconSelector(false);
  };

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImage(imageUrl);
    updateConfig({ text: "IMG" });
  };

  const handleTemplateSelect = (template: FaviconTemplate) => {
    // Apply the template configuration
    updateConfig(template.config);
    setHasSelectedTemplate(true);
    setShowTemplateModal(false);
    success(`Applied "${template.name}" template!`, {
      title: "Template Applied",
      duration: 3000,
    });
  };

  // Keep font select handler for modal
  const handleFontSelect = (fontFamily: string, fontWeight: string) => {
    updateConfig({ fontFamily, fontWeight });
    setShowFontModal(false);
    success(`Font changed to ${fontFamily} ${fontWeight}!`, {
      title: "Font Applied",
      duration: 2000,
    });
  };

  // Handler for applying colors from the integrated image uploader
  const handleApplyColorPalette = (paletteConfig: Partial<FaviconConfig>) => {
    updateConfig(paletteConfig);
    success("Applied extracted colors to your favicon!", {
      title: "Colors Applied",
      duration: 2000,
    });
  };

  const handleInputTypeChange = (newInputType: InputType) => {
    setInputType(newInputType);

    // Clear other inputs when switching types
    if (newInputType === "text") {
      setSelectedIconData(null);
      setUploadedImage(null);
      setHasSelectedTemplate(false);
      updateConfig({ text: "" });
    } else if (newInputType === "icon") {
      setUploadedImage(null);
      setHasSelectedTemplate(false);
      updateConfig({ text: selectedIconData?.displayName || "" });
    } else if (newInputType === "image") {
      setSelectedIconData(null);
      setHasSelectedTemplate(false);
      updateConfig({ text: uploadedImage ? "IMG" : "" });
    } else if (newInputType === "template") {
      setSelectedIconData(null);
      setUploadedImage(null);
      // Don't reset hasSelectedTemplate here - keep current template if any
    }
  };

  return (
    <div className="min-h-screen py-8">
      {/* Animated Back Button */}
      <AnimatedBackButton onBackToHome={onBackToHome} />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Panel - Input */}
          <div className="space-y-3.5">
            {/* Input Type Selector with Conditional Previews */}
            <InputTypeSelector
              inputType={inputType}
              onInputTypeChange={handleInputTypeChange}
              config={config}
              uploadedImage={uploadedImage}
              selectedIconData={selectedIconData}
              imageScale={imageScale}
              renderFaviconContent={renderFaviconContent}
              getBackgroundStyle={getBackgroundStyle}
              hasSelectedTemplate={hasSelectedTemplate}
            />

            {/* Dynamic Input Components */}
            <div className="transition-all duration-300 ease-in-out">
              {inputType === "template" && (
                <div className="animate-fade-in-up">
                  <TemplatesPanel
                    onOpenTemplateModal={() => setShowTemplateModal(true)}
                    onTemplateSelect={handleTemplateSelect}
                    currentConfig={config}
                  />
                </div>
              )}

              {inputType === "image" && (
                <div className="animate-fade-in-up">
                  <ImageUploader
                    uploadedImage={uploadedImage}
                    onImageUpload={handleImageUpload}
                    onApplyColors={handleApplyColorPalette}
                  />
                </div>
              )}

              {inputType === "text" && (
                <div className="animate-fade-in-up">
                  <TextInput
                    config={config}
                    onConfigUpdate={updateConfig}
                    onClearOthers={() => {
                      setSelectedIconData(null);
                      setUploadedImage(null);
                    }}
                  />
                </div>
              )}

              {inputType === "icon" && (
                <div className="animate-fade-in-up">
                  <IconSelector
                    selectedIconData={selectedIconData}
                    onSelectIcon={() => setShowIconSelector(true)}
                  />
                </div>
              )}
            </div>

            {/* Brand Information - Moved here under templates */}
            <BrandInfo
              brandName={brandName}
              brandDescription={brandDescription}
              onBrandNameChange={setBrandName}
              onBrandDescriptionChange={setBrandDescription}
            />
          </div>

          {/* Right Panel - Settings & Generate */}
          <div className="space-y-4">
            {/* Settings Panel */}
            <SettingsPanel
              config={config}
              onConfigUpdate={updateConfig}
              imageScale={imageScale}
              onScaleChange={setImageScale}
              onReset={handleReset}
              onOpenFontModal={() => setShowFontModal(true)}
              inputType={inputType === "template" ? "text" : inputType}
              selectedIconData={selectedIconData}
              uploadedImage={uploadedImage}
              renderFaviconContent={renderFaviconContent}
              getBackgroundStyle={getBackgroundStyle}
            />

            {/* Generate Button - Moved here under settings */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-white mb-2">
                  Generate Favicon
                </h3>
                <p className="text-gray-400 text-sm">
                  Create your complete favicon package with all sizes
                </p>
              </div>
              <GenerateButton
                config={config}
                selectedIconData={selectedIconData}
                uploadedImage={uploadedImage}
                imageScale={imageScale}
                inputType={inputType === "template" ? "text" : inputType}
                brandName={brandName}
                brandDescription={brandDescription}
              />
            </div>
          </div>
        </div>

        {/* Browser Preview Section - Full Width */}
        <BrowserPreview
          config={config}
          brandName={brandName}
          brandDescription={brandDescription}
          browserTheme={browserTheme}
          onThemeChange={setBrowserTheme}
          inputType={inputType === "template" ? "text" : inputType}
          selectedIconData={selectedIconData}
          uploadedImage={uploadedImage}
          imageScale={imageScale}
        />
      </div>

      {/* Font Modal - Keep modal approach with @fontsource fonts */}
      <FontModal
        isOpen={showFontModal}
        onClose={() => setShowFontModal(false)}
        onSelect={handleFontSelect}
        currentFont={config.fontFamily || "Inter"}
        currentWeight={config.fontWeight || "bold"}
        previewText={config.text || "Sample"}
        config={config}
      />

      {/* Template Modal */}
      <TemplateModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onSelect={handleTemplateSelect}
      />

      {/* Icon Selector Modal */}
      <IconSelectorModal
        isOpen={showIconSelector}
        onClose={() => setShowIconSelector(false)}
        onSelect={handleIconSelect}
      />
    </div>
  );
}
