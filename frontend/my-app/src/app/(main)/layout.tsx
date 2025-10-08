
import type { Metadata } from "next";
import "../globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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
    
      <>
        <Navbar user={dummyUser} />
          {children}
         <Footer />
      </>
  );
}
