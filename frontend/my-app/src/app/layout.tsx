import { ReactNode } from 'react';
import './globals.css'; // Assicurati di avere questo file per gli stili globali
import { AuthProvider } from './context/AuthContext'; 
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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

// Questo è il layout principale che avvolge OGNI pagina della tua applicazione.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="it">
      <body  className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/*
          Mettendo AuthProvider qui, diventa disponibile per TUTTI i "children",
          incluse le pagine dentro (main), auth, profile, ecc.
        */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

