// src/components/GenerateButton.tsx - UPDATED WITH 20,000+ ICONS
import { useState } from "react";
import { Package } from "lucide-react";
import { Button, useToastHelpers } from "./common";
import { downloadFaviconPackage } from "../utils/faviconGenerator";
import type { FaviconConfig } from "../types/favicon";
import type { InputType } from "./FaviconGenerator";
import type { IconData } from "../utils/quickIconLibrary";

interface Props {
  config: FaviconConfig;
  selectedIconData: IconData | null;
  uploadedImage: string | null;
  imageScale: number;
  inputType: "text" | "icon" | "image";
  brandName?: string; // Add brand name
  brandDescription?: string; // Add brand description
}

export default function GenerateButton({
  config,
  selectedIconData,
  uploadedImage,
  imageScale,
  inputType,
  brandName,
  brandDescription,
}: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { success } = useToastHelpers();

  // Define the getContentDescription function
  const getContentDescription = () => {
    if (inputType === "text") {
      return `Text "${config.text || ""}" with ${config.fontFamily || "default"} font`;
    } else if (inputType === "icon") {
      return selectedIconData
        ? `Icon: ${selectedIconData.displayName} from ${selectedIconData.libraryName}`
        : "No icon selected";
    } else if (inputType === "image") {
      return uploadedImage ? "Custom uploaded image" : "No image uploaded";
    }
    return "No content selected";
  };

  // Define hasContent variable
  const hasContent =
    (inputType === "text" && config.text?.trim()) ||
    (inputType === "icon" && selectedIconData) ||
    (inputType === "image" && uploadedImage);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await downloadFaviconPackage(
        config,
        uploadedImage || undefined,
        imageScale,
        inputType,
        selectedIconData,
        { name: brandName, description: brandDescription }, // Pass brand info
      );
      success("Your favicon package has been generated!", {
        title: "Generation Complete",
        duration: 5000,
      });
    } catch (error) {
      console.error("Error generating favicon:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Content Summary */}
      <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
        <p className="text-sm text-gray-300">
          <span className="font-medium">Content:</span>{" "}
          {getContentDescription()}
        </p>
        {imageScale !== 1 && (
          <p className="text-xs text-blue-400 mt-1">
            Scale: {imageScale.toFixed(1)}x • Shape: {config.shape} •{" "}
            {config.backgroundType || "solid"} background
          </p>
        )}
      </div>

      {/* Generate Button */}
      <Button
        variant="primary"
        size="lg"
        icon={Package}
        onClick={handleGenerate}
        loading={isGenerating}
        disabled={!hasContent}
        fullWidth
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 h-14 text-lg font-bold shadow-2xl shadow-blue-600/25 hover:shadow-blue-600/40 transform hover:scale-105"
      >
        {isGenerating ? "Generating..." : "🚀 Generate Package"}
      </Button>

      {/* Help Text */}
      {!hasContent && (
        <p className="text-xs text-gray-500 text-center">
          {inputType === "text" && "Enter text above to enable generation"}
          {inputType === "icon" && "Select an icon above to enable generation"}
          {inputType === "image" &&
            "Upload an image above to enable generation"}
        </p>
      )}
    </div>
  );
}
