'use client';

import { FaUser, FaCreditCard, FaReceipt, FaSignOutAlt } from 'react-icons/fa';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

// Definisci i tipi per le props
type ActiveView = 'profile' | 'payments' | 'orders';

interface ProfileSidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}

const navItems = [
  { id: 'profile', label: 'Profilo Utente', icon: FaUser },
  { id: 'payments', label: 'Pagamenti', icon: FaCreditCard },
  { id: 'orders', label: 'I Miei Ordini', icon: FaReceipt },
];

export default function ProfileSidebar({ activeView, setActiveView }: ProfileSidebarProps) {
  
  const { logout } = useAuth();
  const handleLogout = () => {
   
    logout();
    console.log("Logout clicked");
   
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm flex flex-col justify-between min-h-[400px]">
      <div className='flex flex-col gap-1'>
        <h2 className="text-xl font-bold text-gray-800 mb-4 px-4">Il Tuo Profilo</h2>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id as ActiveView)}
            className={`flex items-center text-left gap-3 w-full px-4 py-3 rounded-lg transition-colors duration-200 ${
              activeView === item.id
                ? 'bg-orange-500 text-white font-semibold'
                : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Bottone di Logout */}
      <div>
        <hr className="my-4 border-gray-200" />
        <Link  href="/">
        <button
           onClick={handleLogout}
           className="flex items-center gap-3 w-full px-4 py-3 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors duration-200"
        >
            <FaSignOutAlt className="h-5 w-5" />
            <span className="font-semibold">Logout</span>
        </button>
        </Link>
      </div>
    </div>
  );
}