// Shared in-memory store for stock prices
// In production with multiple Vercel instances, consider using Redis or a shared cache
// For now, this works within a single instance

const stockPrices: { [ticker: string]: number } = {};

// Initialize a ticker with a random price if it doesn't exist
export function initializeTicker(ticker: string): void {
  if (!stockPrices[ticker]) {
    stockPrices[ticker] = Math.random() * 450 + 50;
    console.log(`Initialized ${ticker} at $${stockPrices[ticker].toFixed(1)}`);
  }
}

// Get current price for a ticker 
export function getPrice(ticker: string): number | undefined {
  return stockPrices[ticker];
}

// Get all tickers
export function getAllTickers(): string[] {
  return Object.keys(stockPrices);
}

// Update price for a ticker
export function updatePrice(ticker: string, newPrice: number): void {
  stockPrices[ticker] = newPrice;
}

// Update all stock prices periodically
export function updateAllPrices(): void {
  const tickers = Object.keys(stockPrices);
  
  if (tickers.length === 0) {
    return;
  }
  
  tickers.forEach((ticker) => {
    // Random price fluctuation (-2% to +2%)
    const change = (Math.random() - 0.5) * 0.04;
    stockPrices[ticker] *= 1 + change;
  });
}

// Start price update interval (runs every 2 seconds)
// This will run in each serverless function instance
if (typeof globalThis !== 'undefined') {
  setInterval(updateAllPrices, 1000);
}
