// src/App.tsx
import { useState } from "react";
import LandingPage from "./components/LandingPage";
import FaviconGenerator from "./components/FaviconGenerator";
import { ToastProvider } from "./components/common";

function App() {
  const [currentPage, setCurrentPage] = useState<"landing" | "generator">(
    "landing",
  );

  const goToGenerator = () => {
    setCurrentPage("generator");
  };

  const goToLanding = () => {
    setCurrentPage("landing");
  };

  if (currentPage === "landing") {
    return (
      <ToastProvider>
        <LandingPage onGetStarted={goToGenerator} />
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        {/* Generator Content */}
        <div className="relative z-10">
          <FaviconGenerator onBackToHome={goToLanding} />
        </div>

        {/* Background Effects */}
        <div className="fixed inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5 pointer-events-none"></div>
        <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>
    </ToastProvider>
  );
}

export default App;
