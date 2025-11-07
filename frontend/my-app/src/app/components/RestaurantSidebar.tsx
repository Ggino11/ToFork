'use client';
import React, { FC } from 'react';
import Image from 'next/image';
// Importo le icone
import { ClipboardList, CalendarDays, BookOpen, LogOut } from 'lucide-react';

// Definisco il tipo View qui in modo che possa essere esportato
// e usato anche dalla pagina principale (page.tsx)
export type View = 'ordini' | 'tavoli' | 'menu';

interface RestaurantSidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

/**
 * Sidebar di navigazione della dashboard.
 */
const RestaurantSidebar: FC<RestaurantSidebarProps> = ({ activeView, setActiveView }) => {
  // Definisco le voci del menu
  const navItems = [
    { id: 'ordini', label: 'Ordini', icon: ClipboardList },
    { id: 'tavoli', label: 'Tavoli', icon: CalendarDays },
    { id: 'menu', label: 'Menu', icon: BookOpen },
  ];

  return (
    // Sidebar: sfondo bianco, testo scuro, bordo a destra
    <div className="w-64 bg-white text-gray-900 flex flex-col h-screen fixed top-0 left-0 border-r border-gray-200">
      
      {/* Logo in alto a sinistra (rimossa la classe 'invert') */}
      <div className="flex items-center justify-center h-20 shadow-sm">
        <Image
          src="/Logo.svg"
          width={150}
          height={50}
          alt="ToFork Logo"
          priority
        />
      </div>

      {/* Menu di navigazione principale */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id as View)}
            className={`
              flex items-center space-x-3 w-full px-4 py-3 rounded-lg font-medium 
              transition-colors duration-200
              ${
                activeView === item.id
                  ? 'bg-orange-100 text-orange-600' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900' 
              }
            `}
          >
          
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Pulsante di Logout in fondo */}
      <div className="p-4 border-t border-gray-200">
        <button
          className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
          onClick={() => alert('Logout...')} 
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default RestaurantSidebar;