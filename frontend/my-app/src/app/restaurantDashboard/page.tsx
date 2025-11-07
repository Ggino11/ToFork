'use client';
import React, { useState } from 'react';
import RestaurantSidebar, { View } from '../components/RestaurantSidebar';
import Orders from '../components/Orders';
import TavoliComponent from '../components/Table';
import MenuComponent from '../components/MenuComponent';

const Page = () => {
  const [activeView, setActiveView] = useState<View>('ordini');

  const renderView = () => {
    switch (activeView) {
      case 'ordini':
        return <Orders />;
      case 'tavoli':
        return <TavoliComponent />;
      case 'menu':
        return <MenuComponent />;
      default:
        return <Orders />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <RestaurantSidebar activeView={activeView} setActiveView={setActiveView} />

      {/* Contenuto principale */}
      <main className="flex-1 ml-64 p-8">
        {renderView()}
      </main>
    </div>
  );
};

export default Page;
