# 📈 Stock Dashboard Web App

> **A real-time, low-latency stock tracking platform engineered for scalability.**

[Live Demo](https://stocks-web-dashboard.vercel.app/) · [Report Bug](https://github.com/baddianuj/stock-web-dashboard/issues) · [Request Feature](https://github.com/baddianuj/stock-web-dashboard/issues)

---

## 🚀 About The Project

The **Stock Dashboard** is a full-stack application designed to bridge the gap between secure user management and high-frequency data updates. Unlike standard CRUD apps, this project handles persistent connections for live data streaming.

**Key Features:**
* 🔐 **Multi-Strategy Auth:** Secure login via Email/Password (Bcrypt hashing), GitHub, or Google.
* ⚡ **Real-Time Engine:** Dedicated WebSocket server decoupling the frontend from the streaming logic.
* 📊 **Dynamic Subscriptions:** Users can subscribe/unsubscribe to ticker streams instantly without page reloads.
* 🛡️ **Type Safety:** Full TypeScript integration from database schema to frontend components.

---

## 🛠️ Tech Stack

**Frontend & Core (stock-web-dashboard)**
- Next.js (TypeScript)
- React
- TailwindCSS
- Prisma ORM

**Backend & Data**
- Node.js (JavaScript)
- PostgreSQL
- Supabase

**Real-Time & Auth**
- Socket.io
- NextAuth

**Deployment**
- Vercel (Frontend)
- Render (Socket Server)

---

## 🧱 Architecture

This project is split into **two separate repositories** to handle Vercel's serverless limitations regarding WebSockets.

```
┌─────────────────────────────────────────────────────────────┐
│                     User Browser                            │
└─────────────────────────────────────────────────────────────┘
           │                                    │
           │ HTTP/REST                          │ WebSocket
           ↓                                    ↓
┌──────────────────────────┐      ┌────────────────────────────┐
│  stock-web-dashboard     │      │  stock-dashboard-server    │
│  (Next.js + TypeScript)  │      │  (Node.js + JavaScript)    │
│  Port: 3000              │      │  Port: 3001                │
│  Deployed: Vercel        │      │  Deployed: Render          │
└──────────────────────────┘      └────────────────────────────┘
           │                                    │
           │                                    │
           └────────────┬───────────────────────┘
                        ↓
              ┌─────────────────────┐
              │   PostgreSQL DB     │
              │   (Supabase)        │
              └─────────────────────┘
```

**Repositories:**
- **Frontend:** [stock-web-dashboard](https://github.com/baddianuj/stock-web-dashboard)
- **Socket Server:** [stock-dashboard-server](https://github.com/baddianuj/stock-dashboard-server)

---

## ⚙️ Local Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database (or Supabase account)

---

### 1️⃣ Setup Frontend (stock-web-dashboard)

**Clone the repository:**
```bash
git clone https://github.com/baddianuj/stock-web-dashboard.git
cd stock-web-dashboard
```

**Install dependencies:**
```bash
npm install
```

**Configure environment variables:**
```bash
# Copy the example file
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials (refer to `.env.local.example` for all required variables)

**Setup database:**
```bash
npx prisma generate
npx prisma db push
```

**Run the development server:**
```bash
npm run dev
```
Frontend will run on `http://localhost:3000`

---

### 2️⃣ Setup Socket Server (stock-dashboard-server)

**Clone the repository:**
```bash
git clone https://github.com/baddianuj/stock-dashboard-server.git
cd stock-dashboard-server
```

**Install dependencies:**
```bash
npm install
```

**Configure environment variables:**
```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` with your credentials (refer to `.env.example` for all required variables)

**Run the socket server:**
```bash
node server.js
```

Socket server will run on `http://localhost:3001`

---

## 🚀 Running Both Servers

You need **two terminal windows** running simultaneously:

**Terminal 1 - Frontend:**
```bash
cd stock-web-dashboard
npm run dev
```

**Terminal 2 - Socket Server:**
```bash
cd stock-dashboard-server
node server.js
```

Visit `http://localhost:3000` in your browser.

---

## 🔐 Authentication Flow

* **Credential Login:** Email/Password are salted and hashed using bcrypt before storage.
* **OAuth:** Handled via NextAuth (GitHub/Google).
* **Session:** Secure, HTTP-only cookies are used to manage session state via JWTs.

---

## 📡 Deployment Strategy

Since Vercel Serverless functions cannot maintain long-running WebSocket connections, the app is deployed in two separate repositories:

| Repository | Tech Stack | Host | Purpose |
|------------|------------|------|---------|
| stock-web-dashboard | Next.js (TypeScript) | Vercel | Frontend, API routes, Auth |
| stock-dashboard-server | Node.js (JavaScript) | Render / Railway | WebSocket server for real-time updates |
| Database | PostgreSQL | Supabase | Data persistence |

**Production Environment Variables:**

For **stock-web-dashboard** on Vercel:
- Set `NEXT_PUBLIC_SOCKET_URL` to your Render server URL (e.g., `https://your-app.onrender.com`)

For **stock-dashboard-server** on Render:
- Set `CORS_ORIGIN` to your Vercel domain (e.g., `https://stocks-web-dashboard.vercel.app`)

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn. Any contributions you make are greatly appreciated.

1. Fork the Project (either repository)
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---



## 🔗 Related Repositories

- **Frontend:** [stock-web-dashboard](https://github.com/baddianuj/stock-web-dashboard)
- **Socket Server:** [stock-dashboard-server](https://github.com/baddianuj/stock-dashboard-server)

---

<p align="center">
Built with ❤️ by <a href="https://github.com/baddianuj">Anuj Baddi</a>
</p>
