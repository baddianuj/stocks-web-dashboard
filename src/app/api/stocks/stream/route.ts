import { NextRequest } from "next/server";
import { initializeTicker, getPrice } from "@/lib/stock-prices";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tickersParam = searchParams.get("tickers");
  
  if (!tickersParam) {
    return new Response("tickers parameter required", { status: 400 });
  }

  const tickers = tickersParam.split(",").map(t => t.trim().toUpperCase()).filter(Boolean);
  
  if (tickers.length === 0) {
    return new Response("At least one ticker required", { status: 400 });
  }

  // Initialize all requested tickers
  tickers.forEach(initializeTicker);

  // Create a ReadableStream for Server-Sent Events
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      
      // Send initial prices for all tickers
      tickers.forEach((ticker) => {
        const price = getPrice(ticker);
        if (price !== undefined) {
          const data = JSON.stringify({
            ticker,
            price: price.toFixed(1),
            time: new Date().toISOString(),
          });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        }
      });

      // Set up interval to send updates
      const interval = setInterval(() => {
        tickers.forEach((ticker) => {
          const price = getPrice(ticker);
          if (price !== undefined) {
            const data = JSON.stringify({
              ticker,
              price: price.toFixed(1),
              time: new Date().toISOString(),
            });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
        });
      }, 1000);

      // Clean up on client disconnect
      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no", // Disable buffering in nginx
    },
  });
}
