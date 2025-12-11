const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Dynamic stock prices
const stockPrices = {};

// Initialize a ticker with a random price if it doesn't exist
function initializeTicker(ticker) {
  if (!stockPrices[ticker]) {
    stockPrices[ticker] = Math.random() * 450 + 50;
    console.log(`Initialized ${ticker} at $${stockPrices[ticker].toFixed(2)}`);
  }
}

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("subscribe", (tickers) => {
    console.log("Client subscribed to:", tickers);
    if (!Array.isArray(tickers)) {
      tickers = [tickers];
    }
    
    tickers.forEach((ticker) => {
      socket.join(ticker);
      initializeTicker(ticker);
      
      // Send current price immediately
      socket.emit("stock-update", {
        ticker,
        price: stockPrices[ticker].toFixed(2),
        time: new Date().toISOString(),
      });
    });
  });

  socket.on("unsubscribe", (tickers) => {
    console.log("Client unsubscribed from:", tickers);
    if (!Array.isArray(tickers)) {
      tickers = [tickers];
    }
    
    tickers.forEach((ticker) => {
      socket.leave(ticker);
    });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Update all stock prices periodically
setInterval(() => {
  const tickers = Object.keys(stockPrices);
  
  if (tickers.length === 0) {
    return;
  }
  
  tickers.forEach((ticker) => {
    // Random price fluctuation (-2% to +2%)
    const change = (Math.random() - 0.5) * 0.04;
    stockPrices[ticker] *= 1 + change;

    const update = {
      ticker,
      price: stockPrices[ticker].toFixed(2),
      time: new Date().toISOString(),
    };

    // Emit to all clients subscribed to this ticker
    io.to(ticker).emit("stock-update", update);
    console.log(`Updated ${ticker}: $${update.price}`);
  });
}, 2000); // Update every 2 seconds

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});