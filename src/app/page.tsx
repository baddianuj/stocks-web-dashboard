"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  // 1. STATE MANAGEMENT (Local Only)
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 2. INITIAL LOAD: Check LocalStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
    }
    setMounted(true);
  }, []);

  // 3. TOGGLE FUNCTION: Updates State & LocalStorage
  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  // Mock Data for the UI Visualization
  const stockTickerData = [
    { symbol: "GOOG", name: "Alphabet Inc.", price: "173.45", change: "+1.24%", isUp: true },
    { symbol: "TSLA", name: "Tesla, Inc.", price: "248.50", change: "-0.85%", isUp: false },
    { symbol: "AMZN", name: "Amazon.com", price: "185.10", change: "+0.45%", isUp: true },
    { symbol: "META", name: "Meta Platforms", price: "502.30", change: "+2.10%", isUp: true },
    { symbol: "NVDA", name: "NVIDIA Corp", price: "124.60", change: "-1.15%", isUp: false },
  ];

  // Prevent Hydration Mismatch (Don't render until client loads)
  if (!mounted) return null;

  return (
    <main className={`min-h-screen transition-colors duration-500 relative overflow-hidden font-sans selection:bg-opacity-30 ${
      darkMode ? "bg-[#0a0a0a] text-gray-100 selection:bg-orange-500" : "bg-[#ffffff] text-gray-900 selection:bg-blue-600"
    }`}>
      
      {/* BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className={`absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] ${darkMode ? 'opacity-20' : 'opacity-40'}`}></div>
        <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse ${
          darkMode ? "bg-orange-600" : "bg-blue-400"
        }`}></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 backdrop-blur-md border-b ${
        darkMode ? "bg-black/70 border-gray-800" : "bg-white/70 border-gray-200"
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className={`p-2 rounded-lg transition-colors duration-300 ${
              darkMode ? "bg-orange-500/10" : "bg-blue-50"
            }`}>
              <svg className={`w-6 h-6 transition-transform duration-300 group-hover:rotate-12 ${darkMode ? "text-orange-500" : "text-blue-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              Stock<span className={darkMode ? "text-orange-500" : "text-blue-600"}>Dash</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}  
              className={`p-2 rounded-full transition-all duration-300 border ${
                darkMode 
                  ? "bg-gray-900 border-gray-700 hover:border-orange-500/50 text-orange-500" 
                  : "bg-gray-50 border-gray-200 hover:border-blue-400 text-gray-600"
              }`}
              aria-label="Toggle Theme"
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 pt-32 pb-20 px-6">
        
        {/* HERO SECTION */}
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16 mb-32">
          
          {/* Left Text */}
          <div className="flex-1 text-center lg:text-left">
            <div className={`inline-flex items-center gap-2 py-1 px-3 rounded-full text-xs font-semibold tracking-wider mb-6 border ${
               darkMode ? "border-orange-500/30 text-orange-400 bg-orange-500/10" : "border-blue-200 text-blue-600 bg-blue-50"
            }`}>
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${darkMode ? "bg-orange-400" : "bg-blue-400"}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${darkMode ? "bg-orange-500" : "bg-blue-500"}`}></span>
              </span>
              SOCKETS CONNECTED
            </div>
            
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
              Real-Time <br />
              <span className={`bg-clip-text text-transparent bg-gradient-to-r ${
                darkMode ? "from-white via-orange-200 to-orange-500" : "from-gray-900 via-blue-600 to-blue-400"
              }`}>
                Stock Intelligence.
              </span>
            </h2>
            
            <p className={`text-lg md:text-xl mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}>
              A powerful multi-user trading dashboard powered by <span className="font-semibold text-current">Supabase</span> and <span className="font-semibold text-current">WebSockets</span>. Subscribe to GOOG, TSLA, and more with zero-refresh updates.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/register"
                className={`px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${
                  darkMode 
                    ? "bg-orange-600 text-white shadow-orange-900/20 hover:bg-orange-500" 
                    : "bg-blue-600 text-white shadow-blue-900/20 hover:bg-blue-700"
                }`}
              >
                Sign Up via Magic Link
              </Link>
              <Link
                href="/login"
                className={`px-8 py-4 rounded-lg font-bold text-lg border transition-all duration-300 hover:bg-opacity-50 ${
                  darkMode 
                    ? "border-gray-700 text-gray-300 hover:bg-gray-800" 
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Login
              </Link>
            </div>
          </div>

          {/* Right Visual: The Live Dashboard Preview */}
          <div className="flex-1 w-full max-w-lg">
            <div className={`relative rounded-2xl border p-1 shadow-2xl backdrop-blur-sm ${
               darkMode ? "bg-gray-900/60 border-gray-800" : "bg-white/60 border-gray-200"
            }`}>
              {/* Header of the mock card */}
              <div className={`flex justify-between items-center px-4 py-3 border-b ${
                darkMode ? "border-gray-800 bg-gray-900/50" : "border-gray-100 bg-gray-50/50"
              } rounded-t-xl`}>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Watchlist</span>
                <span className={`text-xs px-2 py-0.5 rounded ${darkMode ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-700"}`}>● Live</span>
              </div>
              
              {/* Stock List */}
              <div className="p-2 space-y-2">
                {stockTickerData.map((stock) => (
                  <div key={stock.symbol} className={`flex justify-between items-center p-3 rounded-lg border transition-all hover:scale-[1.02] cursor-pointer ${
                    darkMode 
                      ? "bg-black/40 border-gray-800 hover:border-gray-700" 
                      : "bg-white border-gray-100 hover:border-blue-200 shadow-sm"
                  }`}>
                    <div className="flex flex-col">
                      <span className={`font-bold ${darkMode ? "text-gray-200" : "text-gray-900"}`}>{stock.symbol}</span>
                      <span className="text-xs text-gray-500">{stock.name}</span>
                    </div>
                    <div className="text-right">
                      <div className={`font-mono font-medium ${darkMode ? "text-gray-300" : "text-gray-800"}`}>${stock.price}</div>
                      <div className={`text-xs font-bold ${stock.isUp ? "text-green-500" : "text-red-500"}`}>
                        {stock.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Fake Chart Area */}
              <div className={`mt-2 h-32 w-full rounded-lg relative overflow-hidden ${darkMode ? "bg-gradient-to-t from-orange-500/10 to-transparent" : "bg-gradient-to-t from-blue-500/10 to-transparent"}`}>
                  <svg className={`absolute bottom-0 w-full h-full ${darkMode ? "text-orange-500" : "text-blue-500"}`} preserveAspectRatio="none" viewBox="0 0 100 100">
                     <path fill="url(#grad)" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" d="M0 100 V 50 Q 25 30 50 60 T 100 20 V 100 Z" opacity="0.4" />
                     <path fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" d="M0 50 Q 25 30 50 60 T 100 20" />
                  </svg>
              </div>
            </div>
          </div>
        </div>

        {/* TECHNICAL FEATURES (Bento Grid) */}
        <div className="max-w-6xl mx-auto mb-32">
          <div className="text-center mb-12">
            <h3 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Built for Speed & Scale</h3>
            <p className={darkMode ? "text-gray-500" : "text-gray-500"}>Core architecture designed for high-frequency updates.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Feature 1: Auth */}
            <div className={`p-8 rounded-2xl border transition-all hover:shadow-xl ${
              darkMode ? "bg-gray-900/50 border-gray-800" : "bg-white border-gray-100 shadow-sm"
            }`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                darkMode ? "bg-orange-500/20 text-orange-500" : "bg-blue-100 text-blue-600"
              }`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <h4 className="text-xl font-bold mb-2">Secure Auth</h4>
              <p className={`text-sm leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                NextAuth implementation using <strong>Bcrypt</strong> hashing and <strong>JWT</strong> sessions. Supports passwordless Magic Link login for instant access.
              </p>
            </div>

            {/* Feature 2: Sockets */}
            <div className={`p-8 rounded-2xl border transition-all hover:shadow-xl ${
              darkMode ? "bg-gray-900/50 border-gray-800" : "bg-white border-gray-100 shadow-sm"
            }`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                darkMode ? "bg-orange-500/20 text-orange-500" : "bg-blue-100 text-blue-600"
              }`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h4 className="text-xl font-bold mb-2">Real-Time Sockets</h4>
              <p className={`text-sm leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Price feeds update asynchronously via <strong>WebSockets</strong>. Multiple users can view different subscriptions simultaneously without conflicts.
              </p>
            </div>

            {/* Feature 3: Database */}
            <div className={`p-8 rounded-2xl border transition-all hover:shadow-xl ${
              darkMode ? "bg-gray-900/50 border-gray-800" : "bg-white border-gray-100 shadow-sm"
            }`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                darkMode ? "bg-orange-500/20 text-orange-500" : "bg-blue-100 text-blue-600"
              }`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
              </div>
              <h4 className="text-xl font-bold mb-2">Supabase & Postgres</h4>
              <p className={`text-sm leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Persistent user data and stock subscriptions stored in a robust <strong>PostgreSQL</strong> instance managed by Supabase.
              </p>
            </div>

          </div>
        </div>

        {/* DEVELOPER SPOTLIGHT (Requested Feature) */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className={`relative rounded-3xl p-1 overflow-hidden ${darkMode ? "bg-gradient-to-r from-gray-800 via-orange-900/40 to-gray-800" : "bg-gradient-to-r from-blue-100 via-white to-blue-100"}`}>
            <div className={`relative rounded-[22px] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 ${
              darkMode ? "bg-[#0c0c0c]" : "bg-white"
            }`}>
              
              {/* Dev Avatar Placeholder */}
              <div className={`relative w-24 h-24 rounded-full overflow-hidden border-4 shadow-lg flex-shrink-0 ${
                darkMode ? "border-gray-700" : "border-white"
              }`}>
                <Image 
                  src="/photo2.png" 
                  alt="Anuj Baddi"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="text-center md:text-left">
                <h3 className={`text-2xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Architected by Anuj Baddi
                </h3>
                <p className={`mb-6 max-w-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Passionate Full Stack Developer specializing in real-time financial applications. 
                  This project demonstrates the capability to handle high-concurrency socket connections using modern web standards.
                </p>
                
                <div className="flex gap-4 justify-center md:justify-start">
                   <a href="https://github.com/baddianuj" target="_blank" className={`flex items-center gap-2 text-sm font-semibold hover:underline ${
                     darkMode ? "text-orange-500" : "text-blue-600"
                   }`}>
                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                     GitHub Profile
                   </a>
                   <a href="https://www.linkedin.com/in/anuj-baddi/" target="_blank" className={`flex items-center gap-2 text-sm font-semibold hover:underline ${
                     darkMode ? "text-orange-500" : "text-blue-600"
                   }`}>
                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                     Connect on LinkedIn
                   </a>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className={`border-t py-8 text-center text-sm ${
        darkMode ? "border-gray-800 bg-black text-gray-600" : "border-gray-200 bg-gray-50 text-gray-500"
      }`}>
        <div className="max-w-6xl mx-auto px-6">
          <p>© 202% StockDash. Real-time data provided for educational purposes. BY ANUJ BADDI</p>
          <div className="mt-2 flex justify-center gap-4">
            <span>Next.js 14</span>
            <span>•</span>
            <span>Supabase</span>
            <span>•</span>
            <span>Socket.io</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
