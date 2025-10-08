import React from 'react';
import Navbar from '../components/Navbar';
import '../globals.css';
import Footer from '../components/Footer';
// import FoodCard from '../components/FoodCard';
// import CalendarBooking from '../components/CalendarBooking';

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
    <>
        <Navbar user={null} />
        {children}
        {/* <FoodCard imageUrl='/pizza.png' title='ciao' description='cioao' price={15} />
        <CalendarBooking/> */}
        <Footer/>
      </>
  )
}