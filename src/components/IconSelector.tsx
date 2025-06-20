// src/components/IconSelector.tsx - COMPACT VERSION
import { Grid3X3 } from "lucide-react";
import { Button } from "./common";
import type { IconData } from "../utils/quickIconLibrary";

interface Props {
  selectedIconData: IconData | null;
  onSelectIcon: () => void;
}

export default function IconSelector({
  selectedIconData,
  onSelectIcon,
}: Props) {
  return (
    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
      {selectedIconData ? (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-2">
              Selected Icon
            </h3>
            <p className="text-gray-400 text-sm">
              {selectedIconData.displayName} from {selectedIconData.libraryName}
            </p>
          </div>

          <div className="bg-white/5 rounded-lg p-6 border border-white/10 flex flex-col items-center gap-3">
            <div className="w-16 h-16 text-white flex items-center justify-center">
              <selectedIconData.component size={64} />
            </div>
            <div className="text-center">
              <span className="text-white font-medium text-lg block">
                {selectedIconData.displayName}
              </span>
              <span className="text-gray-400 text-sm">
                {selectedIconData.libraryName}
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <Button variant="secondary" onClick={onSelectIcon} size="sm">
              Change Icon
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <div>
            <Grid3X3 className="w-16 h-16 text-gray-500 mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Choose an Icon
            </h3>
            <p className="text-gray-400">
              Select from{" "}
              <span className="text-blue-400 font-semibold">20,000+</span>{" "}
              professional icons
            </p>
          </div>
          <Button variant="primary" onClick={onSelectIcon} size="sm">
            Browse Icons
          </Button>
        </div>
      )}
    </div>
  );
}
