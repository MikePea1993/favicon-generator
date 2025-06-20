// src/components/BrandInfo.tsx
import { Input } from "./common";

interface Props {
  brandName: string;
  brandDescription: string;
  onBrandNameChange: (value: string) => void;
  onBrandDescriptionChange: (value: string) => void;
}

export default function BrandInfo({
  brandName,
  brandDescription,
  onBrandNameChange,
  onBrandDescriptionChange,
}: Props) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-white mb-2">
            Brand Information
          </h3>
          <p className="text-gray-400 text-sm">
            Optional details for browser preview customization
          </p>
        </div>

        <div className="space-y-4">
          <Input
            label="Brand Name"
            placeholder="Enter Brand's Name"
            value={brandName}
            onChange={(e) => onBrandNameChange(e.target.value)}
          />
          <Input
            label="Brand Description"
            placeholder="What is your brand about?"
            value={brandDescription}
            onChange={(e) => onBrandDescriptionChange(e.target.value)}
          />
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <p className="text-blue-300 text-xs">
            💡 This information is only used for preview purposes and won't be
            included in your favicon files.
          </p>
        </div>
      </div>
    </div>
  );
}
