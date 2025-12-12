import { NextRequest, NextResponse } from "next/server";
import { initializeTicker, getPrice } from "@/lib/stock-prices";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tickersParam = searchParams.get("tickers");
  
  if (!tickersParam) {
    return NextResponse.json({ error: "tickers parameter required" }, { status: 400 });
  }

  const tickers = tickersParam.split(",").map(t => t.trim().toUpperCase()).filter(Boolean);
  
  if (tickers.length === 0) {
    return NextResponse.json({ error: "At least one ticker required" }, { status: 400 });
  }

  // Initialize all requested tickers
  tickers.forEach(initializeTicker);

  // Return current prices
  const prices = tickers.map(ticker => {
    const price = getPrice(ticker);
    return {
      ticker,
      price: price !== undefined ? price.toFixed(1) : "0.0",
      time: new Date().toISOString(),
    };
  });

  return NextResponse.json(prices);
}
