// src/app/page.tsx

import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="bg-white p-10 rounded-xl shadow-xl w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold mb-6">Stock Dashboard</h1>

        <p className="text-gray-600 mb-6">
          Login or create an account to access your real-time stock dashboard.
        </p>

        <div className="space-x-4">
          <Link
            href="/login"
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="px-5 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-900"
          >
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}
