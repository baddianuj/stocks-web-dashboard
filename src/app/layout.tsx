import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// 👇 IMPORT THIS (Adjust path if your context folder is named differently)
import { ThemeProvider } from "./context/ThemeContext"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StockDash",
  description: "Real-time trading platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* 👇 WRAP YOUR CHILDREN HERE */}
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}