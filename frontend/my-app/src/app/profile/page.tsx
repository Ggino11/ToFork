'use client';

import { useState } from 'react';
import ProfileSidebar from '../components/ProfileSidebar';
import UserInfo from '../components/UserInfo';
import Payments from '../components/Payments';
import Orders from '../components/Orders';

// tipo per le viste possibili nella dashboard
type ActiveView = 'profile' | 'payments' | 'orders';

export default function ProfilePage() {
  const [activeView, setActiveView] = useState<ActiveView>('profile');

  // Dati utente d'esempio (in futuro arriveranno da una chiamata API)
  const dummyUser = {
    name: "Mario",
    lastName: "Rossi",
    email: "mario.rossi@example.com",
  };

  const renderContent = () => {
    switch (activeView) {
      case 'profile':
        return <UserInfo user={dummyUser} />;
      case 'payments':
        return <Payments />;
      case 'orders':
        return <Orders />;
      default:
        return <UserInfo user={dummyUser} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar per cambiare la vista */}
      <aside className="w-full md:w-1/4 lg:w-1/5">
        <ProfileSidebar activeView={activeView} setActiveView={setActiveView} />
      </aside>

      {/* Area dei contenuti dinamici */}
      <main className="w-full md:w-3/4 lg:w-4/5">
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm min-h-[400px]">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}