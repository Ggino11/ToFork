import { ReactNode } from "react";
import '../globals.css';
import Navbar from "../components/Navbar";


//da rimuovere 
const dummyUser = {
  name: "Mario",
  lastName: "Rossi",
  email: "mario.rossi@email.com",
};

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="it">
      <body>
          <Navbar user={dummyUser} />
        <div className="bg-gray-50 min-h-screen pt-24">
          <div className="container mx-auto px-4 py-8">{children}
          </div>
        </div>
      </body>
    </html>
  );
}
