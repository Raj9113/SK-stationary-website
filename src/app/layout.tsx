import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
  title: "S K Stationary & Janseva Kendr",
  description: "Shop stationery and access trusted online services at S K Stationary & Janseva Kendr.",
  viewport: { width: "device-width", initialScale: 1, maximumScale: 5 },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><CartProvider><ThemeProvider>{children}</ThemeProvider></CartProvider></body></html>;
}
