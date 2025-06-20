// src/components/LandingPage.tsx
import {
  Palette,
  Eye,
  Download,
  Zap,
  Star,
  ArrowRight,
  Sparkles,
  Play,
  Github,
  Linkedin,
  Globe,
} from "lucide-react";
import { Button } from "./common";

interface Props {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>

      {/* Dotted Textures */}
      <div className="absolute top-0 right-0 w-96 h-96 opacity-70">
        <div className="dotted-pattern-tr"></div>
      </div>
      <div className="absolute bottom-0 left-0 w-96 h-96 opacity-70">
        <div className="dotted-pattern-bl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 py-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
            {/* Left Side - Content */}
            <div className="order-1 lg:order-1">
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 
              rounded-full px-4 py-2 mb-6"
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium">Favicon Generator</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Craft Perfect
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Brand Icons
                </span>
              </h1>

              {/* Description */}
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Design stunning favicons that capture your brand essence.
                Professional-grade tools with real-time preview, advanced
                customization, and instant high-quality downloads.
              </p>

              {/* CTA Button - Updated to use Button component */}
              <div className="mb-8">
                <Button
                  variant="primary"
                  size="lg"
                  icon={Zap}
                  iconPosition="left"
                  onClick={onGetStarted}
                  className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 
                  hover:from-blue-500 hover:to-purple-500 text-white px-8 py-4 rounded-2xl text-lg font-semibold 
                  transform hover:scale-105 transition-all duration-300 shadow-2xl shadow-blue-600/25 
                  hover:shadow-blue-600/40 border border-white/10"
                >
                  Start Creating
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">Free</div>
                  <div className="text-sm text-gray-400">
                    No signup required
                  </div>
                </div>
                <div className="w-px h-12 bg-white/20"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    Instant
                  </div>
                  <div className="text-sm text-gray-400">
                    Generate in seconds
                  </div>
                </div>
                <div className="w-px h-12 bg-white/20"></div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray-400">Professional</div>
                </div>
              </div>
            </div>

            {/* Right Side - Preview Module */}
            <div className="order-2 lg:order-2">
              <div className="relative perspective-tilt">
                {/* Preview Container */}
                <div
                  className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-4 
                shadow-2xl hover:shadow-3xl transition-all duration-500 group tilt-right"
                >
                  {/* Header */}
                  <div className="flex items-center justify-end mb-3">
                    <div className="text-xs text-gray-400 font-mono">
                      favicon-generator.app
                    </div>
                  </div>

                  {/* GIF Placeholder - Better Fit */}
                  <div
                    className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl 
                  border border-white/10 overflow-hidden group-hover:border-white/20 transition-all duration-300 h-96"
                  >
                    {/* Placeholder Content */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div
                          className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl 
                        flex items-center justify-center mb-6 mx-auto shadow-lg shadow-blue-500/25 animate-pulse"
                        >
                          <Play className="w-10 h-10 text-white" />
                        </div>
                        <p className="text-gray-300 text-lg font-medium">
                          Preview Demo
                        </p>
                        <p className="text-gray-500 text-sm mt-2">
                          Coming Soon
                        </p>
                      </div>
                    </div>

                    {/* Animated Border */}
                    <div
                      className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    ></div>
                  </div>

                  {/* Preview Footer */}
                  <div className="mt-3 flex items-center justify-center">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Sparkles className="w-4 h-4" />
                      <span>Interactive Demo</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features - Full Width Row Below */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 h-full flex flex-col">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/25">
                  <Palette className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Advanced Customization
                </h3>
                <p className="text-gray-400 leading-relaxed flex-grow">
                  Intuitive controls for colors, typography, shapes, and
                  effects. Create exactly what you envision with
                  professional-grade tools.
                </p>
              </div>
            </div>

            <div className="group relative h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-green-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 h-full flex flex-col">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/25">
                  <Eye className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Real-Time Preview
                </h3>
                <p className="text-gray-400 leading-relaxed flex-grow">
                  See your favicon come to life instantly. Preview across
                  multiple sizes and contexts to ensure perfect results.
                </p>
              </div>
            </div>

            <div className="group relative h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 h-full flex flex-col">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/25">
                  <Download className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Production Ready
                </h3>
                <p className="text-gray-400 leading-relaxed flex-grow">
                  Export high-resolution PNG files optimized for web. Multiple
                  formats and sizes included for complete compatibility.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-20 pt-8 border-t border-white/10">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-6">
                <a
                  href="https://mpdevelopment.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center w-10 h-10 bg-white/5 hover:bg-white/10 
                  border border-white/10 hover:border-white/20 rounded-lg transition-all duration-300 
                  hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25"
                  title="Portfolio"
                >
                  <Globe className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>

                <a
                  href="https://github.com/MikePea1993"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center w-10 h-10 bg-white/5 hover:bg-white/10 
                  border border-white/10 hover:border-white/20 rounded-lg transition-all duration-300 
                  hover:scale-110 hover:shadow-lg hover:shadow-gray-500/25"
                  title="GitHub"
                >
                  <Github className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>

                <a
                  href="https://www.linkedin.com/in/mikepea1993/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center w-10 h-10 bg-white/5 hover:bg-white/10 
                  border border-white/10 hover:border-white/20 rounded-lg transition-all duration-300 
                  hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25"
                  title="LinkedIn"
                >
                  <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              </div>

              <p className="text-sm text-gray-500 text-center">
                FrskDevelopment -{" "}
                <span className="text-gray-300 font-medium">
                  Michael Peacock
                </span>
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
