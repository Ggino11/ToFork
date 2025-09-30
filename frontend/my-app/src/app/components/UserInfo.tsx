import ProfileAvatar from "@/app/components/ProfileAvatar"; // Assicurati che il percorso sia corretto!

// Tipo per l'oggetto utente
interface User {
  name: string;
  lastName: string;
  email: string;
}

interface UserInfoProps {
  user: User;
}

export default function UserInfo({ user }: UserInfoProps) {
  return (
    
    <div >

      {/* 1. Header con Avatar e Informazioni Principali */}
      <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-200">
        <ProfileAvatar userName={user.name} userLastName={user.lastName} size={90} />
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-900">{user.name} {user.lastName}</h1>
          <p className="text-gray-500 mt-1">{user.email}</p>
        </div>
      </div>

      {/* 2. Sezione Dati Personali */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">Dati Personali</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Campo Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Nome</label>
            <p className="w-full px-4 py-3 bg-gray-100 text-gray-700 border border-gray-200 rounded-lg">
              {user.name}
            </p>
          </div>
          
          {/* Campo Cognome */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Cognome</label>
            <p className="w-full px-4 py-3 bg-gray-100 text-gray-700 border border-gray-200 rounded-lg">
              {user.lastName}
            </p>
          </div>
        </div>

        {/* Campo Email */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Indirizzo Email</label>
          <p className="w-full px-4 py-3 bg-gray-100 text-gray-700 border border-gray-200 rounded-lg">
            {user.email}
          </p>
        </div>
      </div>

      {/* 3. Spazio per Pulsanti Azione (esempio) */}
      <div className="pt-6 border-t border-gray-200 flex justify-end gap-4">
        <button type="button" className="px-6 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition">
          Cambia Password
        </button>
        <button type="button" className="px-6 py-2 rounded-lg text-white bg-orange-500 hover:bg-orange-600 transition">
          Modifica Dati
        </button>
      </div>

    </div>
  );
}