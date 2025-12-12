// EventSource-based client for Server-Sent Events
// Compatible with your previous socket structure

export type StockUpdate = {
  ticker: string;
  price: string;
  time: string;
};

export type EventSourceSocket = {
  on: (event: string, callback: (data: StockUpdate) => void) => void;
  off: (event: string, callback?: (data: StockUpdate) => void) => void;
  emit: (event: string, data?: any) => void;
  close: () => void;
};

let eventSource: EventSource | null = null;
let currentTickers: string[] = [];
const eventHandlers = new Map<string, Set<(data: StockUpdate) => void>>();

// ---------------------------------------------
// INTERNAL: Connect or reconnect EventSource
// ---------------------------------------------
function createEventSourceSocket(tickers: string[]): EventSourceSocket {
  const nextKey = JSON.stringify(tickers.sort());
  const currentKey = JSON.stringify(currentTickers.sort());

  // If tickers changed → rebuild connection
  if (eventSource && nextKey !== currentKey) {
    eventSource.close();
    eventSource = null;
    currentTickers = [];
  }

  if (!eventSource && tickers.length > 0) {
    const tickersParam = tickers.join(",");
    const url = `/api/stocks/stream?tickers=${encodeURIComponent(tickersParam)}`;

    console.log("🔌 Creating new SSE connection:", tickers);

    eventSource = new EventSource(url);
    currentTickers = [...tickers];

    eventSource.onopen = () => {
      console.log("🟢 SSE connected");
    };

    eventSource.onerror = (err) => {
      console.error("🔴 SSE error (auto-reconnect):", err);
      // No manual reconnect needed – EventSource auto-reconnects
    };

    eventSource.onmessage = (event) => {
      try {
        const data: StockUpdate = JSON.parse(event.data);
        const handlers = eventHandlers.get("stock-update");

        if (handlers) {
          handlers.forEach((cb) => cb(data));
        }
      } catch {
        console.error("Invalid SSE data:", event.data);
      }
    };
  }

  return {
    on: (event, callback) => {
      if (!eventHandlers.has(event)) {
        eventHandlers.set(event, new Set());
      }
      eventHandlers.get(event)!.add(callback);
    },

    off: (event, callback) => {
      const handlers = eventHandlers.get(event);
      if (!handlers) return;

      if (callback) handlers.delete(callback);
      else handlers.clear();
    },

    emit: (event, data) => {
      if (event === "unsubscribe" && eventSource) {
        const remove = Array.isArray(data) ? data : [data];
        const newTickers = currentTickers.filter(
          (t) => !remove.includes(t)
        );

        if (newTickers.length === 0) {
          disconnectSocket();
        } else {
          console.log("🔄 Rebuilding SSE connection after unsubscribe");
          eventSource.close();
          eventSource = null;
          currentTickers = [];
          createEventSourceSocket(newTickers);
        }
      }
    },

    close: () => disconnectSocket(),
  };
}

// ---------------------------------------------
// PUBLIC API
// ---------------------------------------------
export const connectSocket = (tickers: string[]): EventSourceSocket => {
  if (tickers.length === 0) {
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
    console.log("🛑 SSE disconnected");
    eventSource.close();
    eventSource = null;
  }
  currentTickers = [];
  eventHandlers.clear();
};
