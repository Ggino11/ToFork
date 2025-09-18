"use client";

import { useState, FormEvent, FC } from 'react';
import { useRouter } from 'next/navigation';

//  Icona per la barra di ricerca 
const SearchIcon: FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

//  Props del componente 
interface HeroSearchProps {
  backgroundImageUrl: string;
  title: string;
  subtitle: string;
}

const HeroSearch: FC<HeroSearchProps> = ({ backgroundImageUrl, title, subtitle }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  //  Gestisce l'invio del form di ricerca ma ancora da capire se farlo in questo modo 
  const handleSearch = (e: FormEvent) => {
    e.preventDefault(); // Previene il ricaricamento della pagina
    if (searchQuery.trim()) {
      // Reindirizza alla pagina dei risultati con la query come parametro URL
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    
    <div className="p-4 md:p-6 lg:p-8">
      <section className="relative w-full h-[60vh] min-h-[400px] max-h-[600px] text-white rounded-2xl overflow-hidden shadow-2xl">
        
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out hover:scale-105"
          style={{ backgroundImage: `url(${backgroundImageUrl})` }}
        />
        <div className="absolute inset-0 bg-gray-900" />

        {/* Contenuto del componente */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
          <div className="max-w-2xl">
            <p className="text-lg font-light text-gray-200 md:text-xl">
              {subtitle}
            </p>
            <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl mt-2">
              {title}
            </h1>

            {/* Form di ricerca */}
            <form
              onSubmit={handleSearch}
              className="mt-8 w-full max-w-xl mx-auto bg-white rounded-full shadow-lg flex items-center p-2 transition-all duration-300 focus-within:ring-2 focus-within:ring-orange-400"
            >
              <div className="pl-3 pr-2">
                <SearchIcon className="h-6 w-6 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cerca per tipo di cucina, nome del ristorante..."
                className="w-full bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none text-lg border-none"
              />
              <button
                type="submit"
                className="bg-orange-500 text-white font-semibold rounded-full px-6 py-3 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-300"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSearch;
