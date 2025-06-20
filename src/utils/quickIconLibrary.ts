// src/utils/quickIconLibrary.ts - SAFE VERSION (Only Verified Libraries)
// Install first: npm install react-icons

import * as FA from "react-icons/fa"; // Font Awesome - 2000+ icons
import * as MD from "react-icons/md"; // Material Design - 1000+ icons
import * as HI from "react-icons/hi"; // Heroicons - 300+ icons
import * as BS from "react-icons/bs"; // Bootstrap - 1500+ icons
import * as AI from "react-icons/ai"; // Ant Design - 1000+ icons
import * as BI from "react-icons/bi"; // BoxIcons - 1500+ icons
import * as FI from "react-icons/fi"; // Feather - 300+ icons
import * as GO from "react-icons/go"; // GitHub Octicons - 200+ icons
import * as GR from "react-icons/gr"; // Grommet - 600+ icons
import * as IM from "react-icons/im"; // IcoMoon - 400+ icons
import * as IO from "react-icons/io"; // Ionicons - 1200+ icons
import * as LU from "react-icons/lu"; // Lucide - 1000+ icons
import * as TB from "react-icons/tb"; // Tabler - 3000+ icons
import * as TI from "react-icons/ti"; // Typicons - 300+ icons
import * as GI from "react-icons/gi"; // Game Icons - 4000+ icons!

// Massive icon library - only verified, working libraries
export const MEGA_ICON_LIBRARY = {
  fa: { name: "Font Awesome", icons: FA, total: Object.keys(FA).length },
  md: { name: "Material Design", icons: MD, total: Object.keys(MD).length },
  hi: { name: "Heroicons", icons: HI, total: Object.keys(HI).length },
  bs: { name: "Bootstrap", icons: BS, total: Object.keys(BS).length },
  ai: { name: "Ant Design", icons: AI, total: Object.keys(AI).length },
  bi: { name: "BoxIcons", icons: BI, total: Object.keys(BI).length },
  fi: { name: "Feather", icons: FI, total: Object.keys(FI).length },
  go: { name: "GitHub Octicons", icons: GO, total: Object.keys(GO).length },
  gr: { name: "Grommet", icons: GR, total: Object.keys(GR).length },
  im: { name: "IcoMoon", icons: IM, total: Object.keys(IM).length },
  io: { name: "Ionicons", icons: IO, total: Object.keys(IO).length },
  lu: { name: "Lucide", icons: LU, total: Object.keys(LU).length },
  tb: { name: "Tabler", icons: TB, total: Object.keys(TB).length },
  ti: { name: "Typicons", icons: TI, total: Object.keys(TI).length },
  gi: { name: "Game Icons", icons: GI, total: Object.keys(GI).length },
};

// Get total icon count
export const TOTAL_ICONS = Object.values(MEGA_ICON_LIBRARY).reduce(
  (sum, lib) => sum + lib.total,
  0,
);

// Icon data interface
export interface IconData {
  name: string;
  displayName: string;
  component: React.ComponentType<any>;
  library: string;
  libraryName: string;
}

// Search across ALL libraries
export function searchAllIcons(query: string, limit = 100): IconData[] {
  const results: IconData[] = [];
  const searchQuery = query.toLowerCase();

  Object.entries(MEGA_ICON_LIBRARY).forEach(([libKey, library]) => {
    Object.entries(library.icons).forEach(([iconKey, IconComponent]) => {
      // Clean up icon name for display
      const cleanName = iconKey
        .replace(/^(Fa|Md|Hi|Bs|Ai|Bi|Fi|Go|Gr|Im|Io|Lu|Tb|Ti|Gi)/, "")
        .replace(/([A-Z])/g, " $1")
        .trim()
        .toLowerCase();

      if (
        cleanName.includes(searchQuery) ||
        iconKey.toLowerCase().includes(searchQuery)
      ) {
        results.push({
          name: iconKey,
          displayName: cleanName,
          component: IconComponent as React.ComponentType<any>,
          library: libKey,
          libraryName: library.name,
        });
      }
    });
  });

  return results.slice(0, limit);
}

// Get popular icons from each library
export function getPopularIcons(limit = 50): IconData[] {
  const popular = [
    // Font Awesome favorites
    "FaHeart",
    "FaStar",
    "FaHome",
    "FaUser",
    "FaSearch",
    "FaEnvelope",
    "FaPhone",
    "FaCog",
    "FaPlay",
    "FaPause",
    "FaStop",
    "FaEdit",
    "FaTrash",
    "FaPlus",
    "FaMinus",
    "FaCheck",
    "FaTimes",
    "FaArrowUp",
    "FaArrowDown",
    "FaArrowLeft",
    "FaArrowRight",
    "FaDownload",
    "FaUpload",
    "FaShare",
    "FaLock",
    "FaUnlock",
    "FaEye",
    "FaEyeSlash",
    "FaBell",
    "FaFacebook",
    "FaTwitter",
    "FaInstagram",
    "FaLinkedin",
    "FaGithub",
    "FaYoutube",
    // Material Design favorites
    "MdFavorite",
    "MdStar",
    "MdHome",
    "MdPerson",
    "MdEmail",
    "MdPhone",
    "MdSettings",
    "MdMenu",
    "MdSearch",
    "MdAdd",
    "MdRemove",
    "MdEdit",
    "MdDelete",
    "MdShare",
    "MdDownload",
    "MdUpload",
    "MdPlayArrow",
    "MdPause",
    "MdStop",
    "MdSkipNext",
    "MdSkipPrevious",
    "MdVolumeUp",
    // Heroicons favorites
    "HiHeart",
    "HiStar",
    "HiHome",
    "HiUser",
    "HiMail",
    "HiPhone",
    "HiCog",
    "HiSearch",
    "HiPlay",
    "HiPause",
    "HiStop",
    "HiPencil",
    "HiTrash",
    "HiPlus",
    "HiMinus",
    // Bootstrap favorites
    "BsHeart",
    "BsStar",
    "BsHouse",
    "BsPerson",
    "BsEnvelope",
    "BsTelephone",
    "BsGear",
    "BsSearch",
    "BsPlay",
    "BsPause",
    "BsStop",
    "BsPencil",
    "BsTrash",
    "BsPlus",
    "BsDash",
    // BoxIcons favorites
    "BiHeart",
    "BiStar",
    "BiHome",
    "BiUser",
    "BiEnvelope",
    "BiPhone",
    "BiCog",
    "BiSearch",
    // Ionicons favorites
    "IoHeart",
    "IoStar",
    "IoHome",
    "IoPerson",
    "IoMail",
    "IoCall",
    "IoSettings",
    "IoSearch",
    // Feather favorites
    "FiHeart",
    "FiStar",
    "FiHome",
    "FiUser",
    "FiMail",
    "FiPhone",
    "FiSettings",
    "FiSearch",
  ];

  const results: IconData[] = [];

  popular.forEach((iconName) => {
    // Find the icon in our libraries
    for (const [libKey, library] of Object.entries(MEGA_ICON_LIBRARY)) {
      if (library.icons[iconName as keyof typeof library.icons]) {
        results.push({
          name: iconName,
          displayName: iconName
            .replace(/^(Fa|Md|Hi|Bs|Ai|Bi|Fi|Go|Gr|Im|Io|Lu|Tb|Ti|Gi)/, "")
            .replace(/([A-Z])/g, " $1")
            .trim(),
          component: library.icons[
            iconName as keyof typeof library.icons
          ] as React.ComponentType<any>,
          library: libKey,
          libraryName: library.name,
        });
        break;
      }
    }
  });

  return results.slice(0, limit);
}

// Render React icon to canvas (bulletproof method)
export async function renderReactIconToCanvas(
  IconComponent: React.ComponentType<any>,
  size: number,
  color: string,
): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.style.top = "-9999px";
    container.style.width = `${size}px`;
    container.style.height = `${size}px`;
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.justifyContent = "center";
    document.body.appendChild(container);

    Promise.all([import("react-dom/client"), import("react")])
      .then(([{ createRoot }, React]) => {
        const root = createRoot(container);

        root.render(
          React.createElement(IconComponent, {
            size: Math.floor(size * 0.75), // Slightly smaller for padding
            color: color,
            style: { display: "block" },
          }),
        );

        setTimeout(() => {
          try {
            const svgElement = container.querySelector("svg");
            if (!svgElement) {
              document.body.removeChild(container);
              reject(new Error("SVG element not found"));
              return;
            }

            // Convert SVG to canvas
            const svgData = new XMLSerializer().serializeToString(svgElement);
            const svgBlob = new Blob([svgData], { type: "image/svg+xml" });
            const url = URL.createObjectURL(svgBlob);

            const canvas = document.createElement("canvas");
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext("2d");

            if (!ctx) {
              URL.revokeObjectURL(url);
              document.body.removeChild(container);
              reject(new Error("Canvas context unavailable"));
              return;
            }

            const img = new Image();
            img.onload = () => {
              // Center the icon
              const iconSize = Math.floor(size * 0.75);
              const x = (size - iconSize) / 2;
              const y = (size - iconSize) / 2;
              ctx.drawImage(img, x, y, iconSize, iconSize);

              URL.revokeObjectURL(url);
              document.body.removeChild(container);
              resolve(canvas);
            };

            img.onerror = () => {
              URL.revokeObjectURL(url);
              document.body.removeChild(container);
              reject(new Error("Image loading failed"));
            };

            img.src = url;
          } catch (error) {
            document.body.removeChild(container);
            reject(error);
          }
        }, 150); // Give React time to render
      })
      .catch((error) => {
        document.body.removeChild(container);
        reject(error);
      });
  });
}

// Get icons by category
export function getIconsByCategory(category: string, limit = 50): IconData[] {
  const categoryKeywords: Record<string, string[]> = {
    social: [
      "facebook",
      "twitter",
      "instagram",
      "linkedin",
      "youtube",
      "github",
      "discord",
      "slack",
      "whatsapp",
      "telegram",
      "pinterest",
      "reddit",
    ],
    business: [
      "briefcase",
      "chart",
      "graph",
      "money",
      "dollar",
      "bank",
      "office",
      "building",
      "presentation",
      "meeting",
      "handshake",
      "target",
    ],
    tech: [
      "code",
      "computer",
      "laptop",
      "mobile",
      "database",
      "server",
      "cloud",
      "wifi",
      "network",
      "terminal",
      "bug",
      "cpu",
    ],
    communication: [
      "phone",
      "email",
      "message",
      "chat",
      "call",
      "mail",
      "envelope",
      "comment",
      "notification",
      "bell",
      "megaphone",
      "broadcast",
    ],
    media: [
      "play",
      "pause",
      "music",
      "video",
      "camera",
      "image",
      "photo",
      "film",
      "audio",
      "microphone",
      "speaker",
      "volume",
    ],
    navigation: [
      "home",
      "menu",
      "arrow",
      "direction",
      "map",
      "location",
      "compass",
      "navigation",
      "route",
      "gps",
      "marker",
      "pin",
    ],
    action: [
      "edit",
      "delete",
      "add",
      "save",
      "download",
      "upload",
      "copy",
      "paste",
      "cut",
      "undo",
      "redo",
      "refresh",
    ],
    emotion: [
      "heart",
      "star",
      "like",
      "love",
      "happy",
      "sad",
      "smile",
      "face",
      "emoji",
      "mood",
      "thumbs",
      "favorite",
    ],
  };

  const keywords = categoryKeywords[category.toLowerCase()] || [];
  const results: IconData[] = [];

  keywords.forEach((keyword) => {
    const icons = searchAllIcons(keyword, 10);
    results.push(...icons);
  });

  // Remove duplicates and limit
  const unique = results.filter(
    (icon, index, self) =>
      index ===
      self.findIndex((t) => t.name === icon.name && t.library === icon.library),
  );

  return unique.slice(0, limit);
}
