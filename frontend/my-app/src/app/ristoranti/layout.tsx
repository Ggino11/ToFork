import React from 'react';
import Navbar from '../components/Navbar';
import '../globals.css';
import Footer from '../components/Footer';

export const metadata = {
  title: 'ToFork | Ristoranti a Torino',
  description: 'Scopri i migliori ristoranti di Torino',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <body>
        <Navbar user={null} />
        {children}
        <Footer/>
      </body>
    </html>
  )
}