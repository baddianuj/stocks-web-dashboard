"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  // 1. SYNC THEME WITH LOCALSTORAGE
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
    }
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  async function handleRegister() {
    setError("");
    
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      if (res.ok) {
        window.location.href = "/login";
      } else {
        const data = await res.json();
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("Registration failed");
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) return null;

  return (
    <div className={`min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-500 font-sans selection:bg-opacity-30 ${
      darkMode ? "bg-[#0a0a0a] text-gray-100 selection:bg-orange-500" : "bg-[#ffffff] text-gray-900 selection:bg-blue-600"
    }`}>
      
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className={`absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] ${darkMode ? 'opacity-20' : 'opacity-40'}`}></div>
        <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse ${
          darkMode ? "bg-orange-600" : "bg-blue-400"
        }`}></div>
        <div className={`absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full mix-blend-screen filter blur-[100px] opacity-20 ${
          darkMode ? "bg-orange-900" : "bg-blue-200"
        }`}></div>
      </div>

      {/* --- REGISTER CARD --- */}
      <div className={`relative z-10 w-full max-w-md p-8 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all duration-300 ${
        darkMode 
          ? "bg-black/60 border-gray-800 shadow-orange-900/10" 
          : "bg-white/80 border-gray-200 shadow-blue-900/5"
      }`}>
        
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Create Account
            </h1>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Join StockDash to start trading.
            </p>
          </div>
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-all duration-300 border ${
              darkMode 
                ? "bg-gray-900 border-gray-700 hover:border-orange-500/50 text-orange-500" 
                : "bg-gray-50 border-gray-200 hover:border-blue-400 text-gray-600"
            }`}
          >
            {darkMode ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className={`mb-6 p-3 rounded-lg text-sm font-medium border ${
            darkMode 
              ? "bg-red-500/10 border-red-900 text-red-400" 
              : "bg-red-50 border-red-200 text-red-600"
          }`}>
            ⚠️ {error}
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${darkMode ? "text-gray-500" : "text-gray-500"}`}>Email</label>
            <input
              className={`w-full p-3 rounded-lg border bg-transparent transition-all duration-200 outline-none ${
                darkMode 
                  ? "border-gray-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 placeholder-gray-600" 
                  : "border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400"
              }`}
              placeholder="name@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${darkMode ? "text-gray-500" : "text-gray-500"}`}>Password</label>
            <input
              className={`w-full p-3 rounded-lg border bg-transparent transition-all duration-200 outline-none ${
                darkMode 
                  ? "border-gray-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 placeholder-gray-600" 
                  : "border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400"
              }`}
              placeholder="At least 6 characters"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${darkMode ? "text-gray-500" : "text-gray-500"}`}>Confirm Password</label>
            <input
              className={`w-full p-3 rounded-lg border bg-transparent transition-all duration-200 outline-none ${
                darkMode 
                  ? "border-gray-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 placeholder-gray-600" 
                  : "border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400"
              }`}
              placeholder="Re-enter password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            onClick={handleRegister}
            className={`w-full py-3.5 rounded-lg font-bold text-sm tracking-wide transition-all duration-300 transform hover:-translate-y-0.5 ${
              darkMode 
                ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg shadow-orange-900/20 hover:shadow-orange-900/40" 
                : "bg-blue-600 text-white shadow-lg shadow-blue-900/20 hover:bg-blue-700"
            } ${loading ? "opacity-70 cursor-not-allowed transform-none" : ""}`}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Creating Account...
              </span>
            ) : "SIGN UP"}
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className={`w-full border-t ${darkMode ? "border-gray-800" : "border-gray-200"}`}></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className={`px-2 ${darkMode ? "bg-[#0a0a0a] text-gray-500" : "bg-white text-gray-500"}`}>
              Or register with
            </span>
          </div>
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => window.location.href = "/api/auth/signin/github"}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border transition-all duration-300 text-sm font-medium ${
              darkMode 
                ? "border-gray-800 bg-gray-900/50 hover:bg-gray-800 text-gray-300" 
                : "border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700"
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
            GitHub
          </button>

          <button
            onClick={() => window.location.href = "/api/auth/signin/google"}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border transition-all duration-300 text-sm font-medium ${
              darkMode 
                ? "border-gray-800 bg-gray-900/50 hover:bg-gray-800 text-gray-300" 
                : "border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700"
            }`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Google
          </button>
        </div>

        {/* Footer */}
        <p className={`text-center mt-8 text-sm ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
          Already have an account?{" "}
          <Link 
            href="/login" 
            className={`font-semibold hover:underline transition-colors ${
              darkMode ? "text-orange-500 hover:text-orange-400" : "text-blue-600 hover:text-blue-700"
            }`}
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}