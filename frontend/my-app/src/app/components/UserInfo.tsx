import ProfileAvatar from "@/app/components/ProfileAvatar"; // Assicurati che il percorso sia corretto!

// Tipo per l'oggetto utente, utile per la type safety
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Informazioni Utente</h1>
        <p className="text-gray-500 mt-1">Visualizza e aggiorna i tuoi dati personali.</p>
      </div>

      <hr className="border-gray-200" />

      {/* Sezione Foto Profilo */}
      <div className="flex items-center gap-6">
        <ProfileAvatar userName={user.name} userLastName={user.lastName} size={80} />
        <div>
          <h3 className="text-lg font-bold text-gray-800">Foto Profilo</h3>
          <p className="text-sm text-gray-500 mb-3">Carica una nuova immagine.</p>
          <button className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition">
            Cambia Foto
          </button>
        </div>
      </div>

      <hr className="border-gray-200" />
      
      {/* Form Dati Utente */}
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input id="firstName" type="text" defaultValue={user.name} className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition" />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Cognome</label>
            <input id="lastName" type="text" defaultValue={user.lastName} className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition" />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input id="email" type="email" defaultValue={user.email} className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition" />
        </div>
        
        {/* Pulsante di Salvataggio */}
        <div className="flex justify-end pt-4">
          <button type="submit" className="px-8 py-2.5 font-bold text-white bg-orange-600 rounded-lg hover:bg-orange-700 focus:ring-4 focus:ring-orange-300 transition">
            Salva Modifiche
          </button>
        </div>
      </form>
    </div>
  );
}