
import type { Metadata } from "next";
import "../globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

//da rimuovere 

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
    
      <>
        <Navbar />
          {children}
        <Footer />
      </>
  );
}
