import { ReactNode } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import './globals.css';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ToFork",
  description: "Booking and reservation platform for restaurants located in Turin, Italy.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="it">
        <body  className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <AuthProvider>
        <CartProvider>
          <div>
            {children}
          </div>
        </CartProvider>
      </AuthProvider>
      </body>
      </html>
  )
}