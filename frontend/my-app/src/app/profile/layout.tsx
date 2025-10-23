import { ReactNode } from "react";
import '../globals.css';
import Navbar from "../components/Navbar";

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <>
       <Navbar />
        <div className="bg-gray-50 min-h-screen pt-24">
          <div className="container mx-auto px-4 py-8">{children}
          </div>
        </div>
    </>
  );
}
