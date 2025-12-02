'use client';
import  { useState, useEffect } from 'react';
import RestaurantSidebar, { View } from '../components/RestaurantSidebar';
import Orders from '../components/Orders';
import TavoliComponent from '../components/Table';
import MenuComponent from '../components/MenuComponent';
import ProfileComponent from '../components/ProfileComponent';

import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

const Page = () => {
  const [activeView, setActiveView] = useState<View>('ordini');
  const { user, isAuthenticated, isLoading, token } = useAuth();
  const router = useRouter();
  // Protezione Rotta
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/auth');
      } else if (user?.role !== 'RESTAURANT_OWNER') {
        // Se è un utente normale ma prova ad accedere qui, lo mandiamo al profilo normale
        router.push('/profile');
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center text-orange-500">Caricamento Dashboard...</div>;
  }

  if (!isAuthenticated || user?.role !== 'RESTAURANT_OWNER') {
    return null; // Il redirect scatterà a breve
  }

  const renderView = () => {
    switch (activeView) {
      case 'ordini':
        return <Orders />;
      case 'tavoli':
        return <TavoliComponent />;
      case 'menu':
        return <MenuComponent />;
      case 'profile':
        return <ProfileComponent />;
      default:
        return <Orders />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <RestaurantSidebar activeView={activeView} setActiveView={setActiveView} />

      {/* Contenuto principale */}
      {/* Contenuto principale */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 mt-16 md:mt-0">
        {renderView()}
      </main>
    </div>
  );
};

export default Page;
