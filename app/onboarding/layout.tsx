"use client";

import Image from "next/image";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-hero-gradient relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-[20%] w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-20 left-[10%] w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-[40%] left-[60%] w-64 h-64 bg-primary/5 rounded-full blur-2xl animate-float" />
      </div>

      {/* Premium header with glassmorphism */}
      <header className="relative z-20 glass border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo with gradient background */}
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">
                Fast Shop
              </h1>
              <p className="text-xs text-muted-foreground font-medium">Setup Wizard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Auto-saving</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Need help?{" "}
              <a href="#" className="text-primary font-medium hover:underline transition-colors">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main content with proper spacing */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-card/80 backdrop-blur-sm rounded-3xl border border-border/50 shadow-xl overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
