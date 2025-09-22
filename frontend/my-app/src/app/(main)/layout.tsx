
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
//da rimuovere 
const dummyUser = {
  name: "Mario",
  lastName: "Rossi",
  email: "mario.rossi@email.com",
};
export const metadata: Metadata = {
  title: "ToFork",
  description: "Booking and reservation platform for restaurants located in Turin, Italy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="it">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar user={dummyUser} />
        {children}
         <Footer />
      </body>
    </html>
  );
}
