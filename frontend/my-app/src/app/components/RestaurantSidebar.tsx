'use client';
import React, { FC, useState } from 'react';
import Image from 'next/image';
import { ClipboardList, CalendarCheck, BookOpen, LogOut, User, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export type View = 'ordini' | 'prenotazioni' | 'menu' | 'profile';

interface RestaurantSidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const RestaurantSidebar: FC<RestaurantSidebarProps> = ({ activeView, setActiveView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();

  const navItems = [
    { id: 'ordini', label: 'Ordini', icon: ClipboardList },
    { id: 'prenotazioni', label: 'Prenotazioni', icon: CalendarCheck },
    { id: 'menu', label: 'Menu', icon: BookOpen },
    { id: 'profile', label: 'Profilo', icon: User },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Errore durante il logout:", error);
    }
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-50">
        <Image src="/logo.svg" width={100} height={30} alt="ToFork Logo" priority />
        <button onClick={toggleSidebar} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:top-0
      `}>
        {/* Logo (Desktop) */}
        <div className="hidden md:flex items-center justify-center h-20 shadow-sm">
          <Image src="/logo.svg" width={150} height={50} alt="ToFork Logo" priority />
        </div>

        {/* Mobile Logo Placeholder (to align nav items) */}
        <div className="md:hidden h-16 flex items-center px-6 border-b border-gray-200">
           <span className="text-lg font-bold text-orange-600">Menu</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id as View);
                setIsOpen(false);
              }}
              className={`
                flex items-center space-x-3 w-full px-4 py-3 rounded-lg font-medium 
                transition-colors duration-200
                ${activeView === item.id
                  ? 'bg-orange-100 text-orange-600' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
              `}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
            onClick={handleLogout} 
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default RestaurantSidebar;