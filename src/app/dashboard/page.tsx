"use client";

import { useEffect, useState, useRef } from "react";
import { connectSocket } from "@/lib/sockets";
import axios from "axios";
import { signOut } from "next-auth/react";

// --- CONSTANTS ---
const AVAILABLE_STOCKS = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corp." },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "AMZN", name: "Amazon.com" },
  { symbol: "TSLA", name: "Tesla, Inc." },
  { symbol: "NVDA", name: "NVIDIA Corp." },
  { symbol: "META", name: "Meta Platforms" },
  { symbol: "NFLX", name: "Netflix, Inc." },
  { symbol: "AMD", name: "Advanced Micro Devices" },
  { symbol: "INTC", name: "Intel Corp." },
  { symbol: "COIN", name: "Coinbase Global" },
  { symbol: "PLTR", name: "Palantir Technologies" },
];

type Subscription = {
  ticker: string;
  id: string;
};

type StockUpdate = {
  ticker: string;
  price: string;
  time: string;
};

export default function DashboardPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [prices, setPrices] = useState<{ [ticker: string]: StockUpdate }>({});
  
  // Store the "Day's Open" price 
  const [openingPrices, setOpeningPrices] = useState<{ [ticker: string]: number }>({});
  
  // Search State
  const [newTicker, setNewTicker] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredStocks, setFilteredStocks] = useState(AVAILABLE_STOCKS);

  // App State
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Theme Sync
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

  // Autocomplete Logic
  useEffect(() => {
    if (newTicker === "") {
      setFilteredStocks([]);
      setShowDropdown(false);
    } else {
      const matches = AVAILABLE_STOCKS.filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(newTicker.toLowerCase()) ||
          stock.name.toLowerCase().includes(newTicker.toLowerCase())
      );
      setFilteredStocks(matches);
      setShowDropdown(true);
    }
  }, [newTicker]);

  const selectStock = (ticker: string) => {
    setNewTicker(ticker);
    setShowDropdown(false);
  };

  // Fetch Subscriptions
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const res = await axios.get("/api/subscriptions");
        setSubscriptions(res.data || []);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscriptions();
  }, []);

  // --- SOCKET LOGIC ---
  useEffect(() => {
    if (subscriptions.length === 0) return;

    const tickers = subscriptions.map((s) => s.ticker);
    const socket = connectSocket(tickers);

    const handleStockUpdate = (data: StockUpdate) => {
      const currentPrice = parseFloat(data.price);
      
      // LOGIC: Set a synthetic "Open Price" on first data arrival
      setOpeningPrices((prev) => {
        if (!prev[data.ticker]) {
          const variance = currentPrice * 0.01; // 1% variance simulation
          const mockOpen = Math.random() > 0.5 
            ? currentPrice - (Math.random() * variance) 
            : currentPrice + (Math.random() * variance);
          return { ...prev, [data.ticker]: mockOpen };
        }
        return prev;
      });

      setPrices((prev) => ({ ...prev, [data.ticker]: data }));
    };

    socket.on("stock-update", handleStockUpdate);

    return () => {
      socket.off("stock-update", handleStockUpdate);
      socket.emit("unsubscribe", tickers);
    };
  }, [subscriptions]);

  const handleAddSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicker.trim()) return;

    if (subscriptions.some(s => s.ticker === newTicker.toUpperCase())) {
      alert("You are already subscribed to this stock.");
      setNewTicker("");
      return;
    }

    try {
      const res = await axios.post("/api/subscriptions", {
        ticker: newTicker.toUpperCase(),
      });
      setSubscriptions([...subscriptions, res.data]);
      setNewTicker("");
      setShowDropdown(false);
    } catch (error: any) {
      alert(error.response?.data?.error || "Failed to add subscription");
    }
  };

  const handleRemoveSubscription = async (id: string, ticker: string) => {
    try {
      await axios.delete(`/api/subscriptions?id=${id}`);
      setSubscriptions(subscriptions.filter((s) => s.id !== id));
      
      // Cleanup local state
      setPrices((prev) => {
        const newPrices = { ...prev };
        delete newPrices[ticker];
        return newPrices;
      });
      setOpeningPrices((prev) => {
        const newOpens = { ...prev };
        delete newOpens[ticker];
        return newOpens;
      });

      const socket = connectSocket([]);
      socket.emit("unsubscribe", [ticker]);

    } catch (error) {
      alert("Failed to remove subscription");
    }
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center font-mono text-sm ${
        darkMode ? "bg-[#0a0a0a] text-orange-500" : "bg-white text-blue-600"
      }`}>
        INITIALIZING TERMINAL...
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 relative font-sans ${
      darkMode ? "bg-[#0a0a0a] text-gray-100" : "bg-[#f4f6f8] text-gray-900"
    }`}>
      
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className={`absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] ${darkMode ? 'opacity-20' : 'opacity-40'}`}></div>
        <div className={`absolute top-0 right-0 w-[600px] h-[600px] rounded-full mix-blend-screen filter blur-[120px] opacity-10 ${
          darkMode ? "bg-orange-600" : "bg-blue-400"
        }`}></div>
      </div>

      {/* Navbar */}
      <nav className={`relative z-20 border-b backdrop-blur-md ${
        darkMode ? "bg-black/60 border-gray-800" : "bg-white/80 border-gray-200"
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${darkMode ? "bg-green-500" : "bg-green-500"}`}></div>
            <span className={`font-mono text-xs tracking-widest ${darkMode ? "text-gray-400" : "text-gray-500"}`}>MARKET OPEN</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className={`p-2 rounded-md border transition-all ${
              darkMode ? "border-gray-700 text-gray-400 hover:text-orange-500" : "border-gray-300 text-gray-500 hover:text-blue-600"
            }`}>
              {darkMode ? "☀" : "☾"}
            </button>
            <div className={`h-8 w-[1px] ${darkMode ? "bg-gray-800" : "bg-gray-300"}`}></div>
            <button onClick={() => signOut({ callbackUrl: "/login" })} className={`text-sm font-medium hover:underline ${darkMode ? "text-orange-500" : "text-blue-600"}`}>
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Portfolio Watch</h1>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Live pricing via WebSocket.
            </p>
          </div>

          <div className="relative w-full md:w-auto z-50">
            <form onSubmit={handleAddSubscription} className="flex shadow-lg rounded-lg overflow-hidden group">
              <input
                type="text"
                value={newTicker}
                onChange={(e) => setNewTicker(e.target.value)}
                onFocus={() => { if(newTicker) setShowDropdown(true) }}
                placeholder="SEARCH (e.g. AAPL)"
                className={`flex-1 px-5 py-3 w-full md:w-64 outline-none font-medium transition-colors ${
                  darkMode 
                    ? "bg-gray-900 text-white placeholder-gray-600 border border-gray-800 focus:border-orange-500" 
                    : "bg-white text-gray-900 placeholder-gray-400 border border-gray-200 focus:border-blue-500"
                }`}
              />
              <button
                type="submit"
                className={`px-6 font-bold tracking-wide transition-all ${
                  darkMode 
                    ? "bg-orange-600 hover:bg-orange-500 text-white" 
                    : "bg-blue-600 hover:bg-blue-500 text-white"
                }`}
              >
                + ADD
              </button>
            </form>

            {showDropdown && filteredStocks.length > 0 && (
              <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl border backdrop-blur-md shadow-2xl overflow-hidden max-h-60 overflow-y-auto ${
                darkMode ? "bg-gray-900/95 border-gray-700" : "bg-white/95 border-gray-200"
              }`}>
                {filteredStocks.map((stock) => (
                  <div
                    key={stock.symbol}
                    onClick={() => selectStock(stock.symbol)}
                    className={`px-5 py-3 cursor-pointer flex justify-between items-center transition-colors ${
                      darkMode 
                        ? "hover:bg-gray-800 border-b border-gray-800 last:border-0" 
                        : "hover:bg-blue-50 border-b border-gray-100 last:border-0"
                    }`}
                  >
                    <span className={`font-bold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                      {stock.symbol}
                    </span>
                    <span className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
                      {stock.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stock Grid */}
        {subscriptions.length === 0 ? (
          <div className={`flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed ${
            darkMode ? "border-gray-800 bg-gray-900/20" : "border-gray-300 bg-gray-50"
          }`}>
             <div className={`p-4 rounded-full mb-4 ${darkMode ? "bg-gray-800 text-gray-600" : "bg-gray-200 text-gray-400"}`}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <p className="text-lg font-medium text-gray-500">Search for a stock above</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {subscriptions.map((sub) => {
              const priceData = prices[sub.ticker];
              const openPrice = openingPrices[sub.ticker];
              const currentPrice = priceData ? parseFloat(priceData.price) : 0;
              
              // COLOR LOGIC
              const isUp = currentPrice >= (openPrice || currentPrice);
              const percentChange = openPrice 
                ? ((currentPrice - openPrice) / openPrice) * 100 
                : 0.00;

              // Color classes
              const valueColor = isUp 
                ? (darkMode ? "text-green-400" : "text-green-600") 
                : (darkMode ? "text-red-400" : "text-red-600");

              return (
                <div
                  key={sub.id}
                  className={`relative group p-6 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                    darkMode 
                      ? "bg-gray-900/60 border-gray-800 hover:border-orange-500/50 shadow-black/50" 
                      : "bg-white/80 border-gray-200 hover:border-blue-400 shadow-gray-200/50"
                  }`}
                >
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div>
                      <h2 className={`text-xl font-bold tracking-tight ${darkMode ? "text-white" : "text-gray-900"}`}>
                        {sub.ticker}
                      </h2>
                      <span className="text-xs font-semibold text-gray-500 tracking-wider">NASDAQ</span>
                    </div>
                    <button
                      onClick={() => handleRemoveSubscription(sub.id, sub.ticker)}
                      className={`p-1.5 rounded-full transition-colors opacity-0 group-hover:opacity-100 ${
                        darkMode ? "hover:bg-gray-800 text-gray-500 hover:text-red-400" : "hover:bg-gray-100 text-gray-400 hover:text-red-500"
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>

                  <div className="relative z-10">
                     {/* Current Price */}
                     <div className={`text-3xl font-mono font-medium tracking-tight mb-2 flex items-center gap-2 ${valueColor}`}>
                       {priceData?.price ? (
                         <>
                           ${currentPrice.toFixed(2)}
                           <span className="text-lg opacity-80">
                             {isUp ? "↑" : "↓"}
                           </span>
                         </>
                       ) : "---.--"}
                     </div>
                     
                     {/* 3-Column Grid Footer */}
                     <div className="grid grid-cols-3 border-t pt-3 mt-2 border-dashed border-opacity-30 border-gray-500">
                        
                        {/* 1. Day's Change */}
                        <div className="flex flex-col text-left">
                          <span className={`text-[10px] uppercase font-bold tracking-widest ${darkMode ? "text-gray-600" : "text-gray-400"}`}>
                            Change
                          </span>
                          <span className={`text-xs font-mono font-bold ${valueColor}`}>
                            {percentChange > 0 ? "+" : ""}{percentChange.toFixed(2)}%
                          </span>
                        </div>

                        {/* 2. Day's Open (New) */}
                        <div className="flex flex-col text-center border-l border-r border-dashed border-gray-500 border-opacity-20">
                          <span className={`text-[10px] uppercase font-bold tracking-widest ${darkMode ? "text-gray-600" : "text-gray-400"}`}>
                            Open
                          </span>
                          <span className={`text-xs font-mono ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                            {openPrice ? `$${openPrice.toFixed(2)}` : "---"}
                          </span>
                        </div>

                        {/* 3. Last Time */}
                        <div className="flex flex-col text-right">
                          <span className={`text-[10px] uppercase font-bold tracking-widest ${darkMode ? "text-gray-600" : "text-gray-400"}`}>
                            Time
                          </span>
                          <span className={`text-xs font-mono ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                            {priceData?.time ? new Date(priceData.time).toLocaleTimeString([], {hour12: false}) : "--:--:--"}
                          </span>
                        </div>

                     </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}