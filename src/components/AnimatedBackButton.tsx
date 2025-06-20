// src/components/AnimatedBackButton.tsx
import { ArrowLeft, Home } from "lucide-react";

interface Props {
  onBackToHome: () => void;
}

export default function AnimatedBackButton({ onBackToHome }: Props) {
  return (
    <div className="fixed top-6 left-6 z-50">
      <button
        onClick={onBackToHome}
        className="group relative flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 hover:border-white/30 rounded-2xl px-6 py-4 text-white transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20"
      >
        {/* Animated Arrow */}
        <div className="relative overflow-hidden">
          <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded" />
        </div>

        {/* Text with gradient hover effect */}
        <span className="font-semibold text-sm group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
          Back to Home
        </span>

        {/* Home icon that slides in */}
        <div className="w-0 group-hover:w-5 overflow-hidden transition-all duration-300 ease-out">
          <Home className="w-5 h-5 text-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100" />
        </div>

        {/* Glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
      </button>
    </div>
  );
}
