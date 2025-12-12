// EventSource-based socket client for Server-Sent Events
// Compatible interface with the original Socket.io implementation

type StockUpdate = {
  ticker: string;
  price: string;
  time: string;
};

type EventSourceSocket = {
  on: (event: string, callback: (data: StockUpdate) => void) => void;
  off: (event: string, callback?: (data: StockUpdate) => void) => void;
  emit: (event: string, data?: any) => void;
  close: () => void;
};

let eventSource: EventSource | null = null;
let currentTickers: string[] = [];
let eventHandlers: Map<string, Set<(data: StockUpdate) => void>> = new Map();

// Create a socket-like interface using EventSource
function createEventSourceSocket(tickers: string[]): EventSourceSocket {
  const tickersKey = JSON.stringify(tickers.sort());
  const currentKey = JSON.stringify(currentTickers.sort());
  
  // Close existing connection if tickers changed
  if (eventSource && tickersKey !== currentKey) {
    eventSource.close();
    eventSource = null;
    currentTickers = [];
  }

  if (!eventSource && tickers.length > 0) {
    console.log("Creating new EventSource connection...", tickers);
    const tickersParam = tickers.join(",");
    const url = `/api/stocks/stream?tickers=${encodeURIComponent(tickersParam)}`;
    
    eventSource = new EventSource(url);
    currentTickers = [...tickers];

    eventSource.onopen = () => {
      console.log("✅ Connected to stock stream");
    };

    eventSource.onerror = (error) => {
      console.error("❌ Connection error:", error);
      // EventSource will automatically attempt to reconnect
    };

    eventSource.onmessage = (event) => {
      try {
        const data: StockUpdate = JSON.parse(event.data);
        
        // Trigger all handlers for 'stock-update' event
        const handlers = eventHandlers.get("stock-update");
        if (handlers) {
          handlers.forEach(handler => handler(data));
        }
      } catch (error) {
        console.error("Error parsing stock update:", error);
      }
    };
  }

  return {
    on: (event: string, callback: (data: StockUpdate) => void) => {
      if (!eventHandlers.has(event)) {
        eventHandlers.set(event, new Set());
      }
      eventHandlers.get(event)!.add(callback);
    },
    off: (event: string, callback?: (data: StockUpdate) => void) => {
      const handlers = eventHandlers.get(event);
      if (handlers && callback) {
        handlers.delete(callback);
      } else if (handlers) {
        handlers.clear();
      }
    },
    emit: (event: string, data?: any) => {
      // For unsubscribe, we'll close and recreate the connection with new tickers
      if (event === "unsubscribe" && eventSource) {
        const tickersToRemove = Array.isArray(data) ? data : [data];
        const newTickers = currentTickers.filter(t => !tickersToRemove.includes(t));
        
        if (newTickers.length === 0) {
          disconnectSocket();
        } else {
          // Close current connection
          eventSource.close();
          eventSource = null;
          const oldTickers = [...currentTickers];
          currentTickers = [];
          
          // Recreate with new tickers (handlers are preserved)
          createEventSourceSocket(newTickers);
        }
      }
    },
    close: () => {
      disconnectSocket();
    },
  };
}

// Maintain compatibility with original Socket.io interface
export const connectSocket = (tickers: string[]): EventSourceSocket => {
  if (tickers.length === 0) {
    // Return a no-op socket if no tickers
    return {
      on: () => {},
      off: () => {},
      emit: () => {},
      close: () => {},
    };
  }

  return createEventSourceSocket(tickers);
};

export const disconnectSocket = () => {
  if (eventSource) {
    eventSource.close();
    eventSource = null;
    currentTickers = [];
    eventHandlers.clear();
    console.log("Disconnected from stock stream");
  }
};