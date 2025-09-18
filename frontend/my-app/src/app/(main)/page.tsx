import Image from "next/image";
// import Herosearch from "../components/Herosearch";

export default function Home() {
  return (
    // vediamo cosa tenere, se guardi in component c'è quello che hos critto io per la ricerca 
    // <div className="pt-20">
    //  <Herosearch backgroundImageUrl={""} title={""} subtitle={""}></Herosearch>
    // </div>
     <main className="px-8 sm:px-20 py-32 space-y-16">
      {/* Hero Section */}
      <section className="relative z-0 bg-orange-600 rounded-xl p-8 sm:p-16 flex flex-col sm:flex-row items-center gap-8 text-white">
        <div className="sm:w-1/2">
          <h1 className="text-3xl sm:text-5xl font-bold mb-4">
            Prenota i migliori ristoranti di Torino
          </h1>
          <p className="mb-6 text-lg">
            Scopri, prenota e gusta le migliori esperienze culinarie
          </p>
          <input
            type="text"
            placeholder="Cerca ristorante..."
            className="w-full sm:w-auto px-4 py-2 rounded-lg text-black bg-white border border-black-300"
          />
        </div>
        <div className="sm:w-1/2 flex justify-center">
          <Image
            src="/foto_1.png"
            alt="Ragazza con pizza"
            width={400}
            height={400}
            className="rounded-lg"
          />
        </div>
      </section>

      {/* Offerte Esclusive */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-black">Offerte Esclusive</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="relative rounded-lg overflow-hidden">
            <Image src="/mollica.jpg" alt="Mollica" width={400} height={250} />
            <span className="absolute top-2 left-2 bg-black text-white px-2 py-1 text-xs rounded">-40%</span>
          </div>
          <div className="relative rounded-lg overflow-hidden">
            <Image src="/mcbun.jpg" alt="Mr Bun" width={400} height={250} />
            <span className="absolute top-2 left-2 bg-black text-white px-2 py-1 text-xs rounded">-35%</span>
          </div>
          <div className="relative rounded-lg overflow-hidden">
            <Image src="/pizzeria.jpg" alt="Da Zero" width={400} height={250} />
            <span className="absolute top-2 left-2 bg-black text-white px-2 py-1 text-xs rounded">-20%</span>
          </div>
        </div>
      </section>

      {/* Categorie Popolari */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-black">Categorie Popolari 🍕</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="flex flex-col items-center gap-2">
            <Image src="/burger.jpg" alt="Burger" width={80} height={80} className="rounded-full"/>
            <span>Burger & Fastfood</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Image src="/insalate.jpg" alt="Insalate" width={80} height={80} className="rounded-full"/>
            <span>Insalate</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Image src="/pasta.jpg" alt="Pasta" width={80} height={80} className="rounded-full"/>
            <span>Pasta</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Image src="/pizza.jpg" alt="Pizza" width={80} height={80} className="rounded-full"/>
            <span>Pizza</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Image src="/cibo-asiatico.jpg" alt="Cibo Asiatico" width={80} height={80} className="rounded-full"/>
            <span>Cibo Asiatico</span>
          </div>
        </div>
      </section>

      {/* Popular Restaurants */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-black">Popular Restaurants</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <Image src="/streetfood.jpg" alt="Street Food" width={150} height={100} className="rounded-lg"/>
          <Image src="/pasta.jpg" alt="Pasta" width={150} height={100} className="rounded-lg"/>
          <Image src="/mollica.jpg" alt="Mollica" width={150} height={100} className="rounded-lg"/>
          <Image src="/scannabue.jpg" alt="Scannabue" width={150} height={100} className="rounded-lg"/>
          <Image src="/bestburger.jpg" alt="Best Burger" width={150} height={100} className="rounded-lg"/>
        </div>
      </section>

      {/* Contattaci */}
      <section className="bg-[#172118] text-white rounded-xl p-8 flex flex-col sm:flex-row items-center gap-6">
        <div className="sm:w-1/2">
          <h2 className="text-2xl font-bold mb-4">CONTATTACI PER COLLABORARE</h2>
          <p className="mb-4">Vuoi collaborare con noi? Scrivici!</p>
          <button className="bg-orange-500 px-6 py-3 rounded-full font-semibold hover:bg-orange-600">Contattaci</button>
        </div>
        <div className="sm:w-1/2 flex justify-center">
          <Image src="/contact-image.png" alt="Illustrazione contatti" width={300} height={200} />
        </div>
      </section>

      {/* Scopri di più */}
      <section className="bg-gray-100 dark:bg-gray-800 rounded-xl p-8 space-y-6">
        <h2 className="text-2xl font-semibold">Scopri di più su di noi!</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-700 rounded-lg p-4 text-center">
            <h3 className="font-semibold mb-2">Come funziona ToFork?</h3>
            <p>Scopri come prenotare e gustare i migliori ristoranti della città.</p>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-lg p-4 text-center">
            <h3 className="font-semibold mb-2">Promozioni Esclusive</h3>
            <p>Accedi a sconti e offerte speciali per i nostri utenti registrati.</p>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-lg p-4 text-center">
            <h3 className="font-semibold mb-2">Gestione prenotazioni</h3>
            <p>Controlla e gestisci facilmente le tue prenotazioni direttamente online.</p>
          </div>
        </div>
      </section>
    </main>
    
  );
}
