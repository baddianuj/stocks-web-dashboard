"use client";

import { useEffect, useState } from "react";
import { connectSocket } from "@/lib/sockets";
import axios from "axios";

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
  const [newTicker, setNewTicker] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user subscriptions
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

  useEffect(() => {
    if (subscriptions.length === 0) return;

    const tickers = subscriptions.map((s) => s.ticker);
    console.log("Setting up socket for tickers:", tickers);
    
    const socket = connectSocket(tickers);

    const handleStockUpdate = (data: StockUpdate) => {
      console.log("📈 Received update:", data);
      setPrices((prev) => ({ ...prev, [data.ticker]: data }));
    };

    socket.on("stock-update", handleStockUpdate);

    return () => {
      console.log("Cleaning up socket listeners");
      socket.off("stock-update", handleStockUpdate);
      socket.emit("unsubscribe", tickers);
    };
  }, [subscriptions]);

  const handleAddSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicker.trim()) return;

    try {
      const res = await axios.post("/api/subscriptions", {
        ticker: newTicker.toUpperCase(),
      });
      setSubscriptions([...subscriptions, res.data]);
      setNewTicker("");
    } catch (error: any) {
      alert(error.response?.data?.error || "Failed to add subscription");
    }
  };

  const handleRemoveSubscription = async (id: string, ticker: string) => {
    try {
      await axios.delete(`/api/subscriptions?id=${id}`);
      setSubscriptions(subscriptions.filter((s) => s.id !== id));
      
      const socket = connectSocket([]);
      socket.emit("unsubscribe", [ticker]);
      
      setPrices((prev) => {
        const newPrices = { ...prev };
        delete newPrices[ticker];
        return newPrices;
      });
    } catch (error) {
      alert("Failed to remove subscription");
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Stock Dashboard</h1>

      <form onSubmit={handleAddSubscription} className="mb-8 flex gap-2">
        <input
          type="text"
          value={newTicker}
          onChange={(e) => setNewTicker(e.target.value)}
          placeholder="Enter ticker (e.g., AAPL, TSLA, GOOGL)"
          className="border px-4 py-2 rounded flex-1 max-w-xs"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Add Stock
        </button>
      </form>

      {subscriptions.length === 0 ? (
        <p className="text-gray-500">No subscriptions yet. Add a ticker above!</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {subscriptions.map((sub) => {
            const priceData = prices[sub.ticker];
            return (
              <div
                key={sub.id}
                className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow bg-white"
              >
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-2xl font-bold text-gray-800">{sub.ticker}</h2>
                  <button
                    onClick={() => handleRemoveSubscription(sub.id, sub.ticker)}
                    className="text-red-500 hover:text-red-700 text-xl"
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
                <div className="text-3xl font-semibold text-green-600">
                  ${priceData?.price || "Loading..."}
                </div>
                {priceData?.time && (
                  <div className="text-xs text-gray-500 mt-3">
                    Updated: {new Date(priceData.time).toLocaleTimeString()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}