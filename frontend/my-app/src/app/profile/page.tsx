'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProfileSidebar from '../components/ProfileSidebar';
import UserInfo from '../components/UserInfo';
import Payments from '../components/Payments';
import Orders from '../components/Orders';
import { useAuth } from '../context/AuthContext';

// tipo per le viste possibili nella dashboard
type ActiveView = 'profile' | 'payments' | 'orders';

export default function ProfilePage() {
  const [activeView, setActiveView] = useState<ActiveView>('profile');
  // prendo i dati veri dal Context 
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Se l'utente non è loggato, manda a registrazione login
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isLoading, isAuthenticated, router]);

  // Loading state 
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-gray-500 text-lg">Caricamento profilo...</p>
      </div>
    );
  }

  // Se non c'è utente, non mostriamo nulla (il redirect sopra ci penserà)
  if (!user) {
    return null;
  }

  // mappo dati del backend (firstName) nel formato che UserInfo vuole (name)
  const userDataForDisplay = {
    name: user.firstName,
    lastName: user.lastName, 
    email: user.email, 
  };

  const renderContent = () => {
    switch (activeView) {
      case 'profile':
        // passo i dati veri al componente
        return <UserInfo user={userDataForDisplay} />;
      case 'payments':
        return <Payments />;
      case 'orders':
        return <Orders />;
      default:
        return <UserInfo user={userDataForDisplay} />;
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