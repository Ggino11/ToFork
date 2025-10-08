"use client";
import { useState } from "react";
import Image from "next/image";
// import Herosearch from "../components/Herosearch";
import Carousel from "../components/Carousel";
import Link from "next/link";


const POPULAR = [
  { src: "/crostone.png", name: "Crostone", slug: "crostone", bg: "bg-[#ff9100]" },
  { src: "/piola.png", name: "Piola 1706", slug: "piola-1706", bg: "bg-[#ff9100]" },
  { src: "/mollica.png", name: "Mollica", slug: "mollica", bg: "bg-[#ff9100]" },
  { src: "/scannabue.png", name: "Scannabue", slug: "scannabue", bg: "bg-[#ff9100]" },
  { src: "/rockburger.png", name: "Rock Burger", slug: "rock-burger", bg: "bg-[#ff9100]" },
  { src: "/felicin.png", name: "Felicin alla consolata", slug: "felicin-alla-consolata", bg: "bg-[#ff9100]" },
];


const FAQS = [
  {
    question: "Come funziona ToFork?",
    type: "main",
    answer: (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Step 1 */}
          <div className="bg-white rounded-lg p-6 flex flex-col items-center text-center">
            <div className="mb-3">
              <Image src="/book-table.png" alt="Prenota il tavolo" width={60} height={60} />
            </div>
            <h3 className="text-lg font-bold mb-2 text-black">Prenota il tuo tavolo</h3>
            <p className="text-gray-900 text-sm">Effettua la prenotazione tramite il nostro sito web</p>
          </div>
          {/* Step 2 */}
          <div className="bg-white rounded-lg p-6 flex flex-col items-center text-center">
            <div className="mb-3">
              <Image src="/preorder.png" alt="Preordina" width={60} height={60} />
            </div>
            <h3 className="text-lg font-bold mb-2 text-black">Se vuoi preordina i tuoi piatti</h3>
            <p className="text-gray-900 text-sm">Insieme alla prenotazione puoi già scegliere cosa mangerai</p>
          </div>
          {/* Step 3 */}
          <div className="bg-white rounded-lg p-6 flex flex-col items-center text-center">
            <div className="mb-3">
              <Image src="/confirmation.png" alt="Conferma" width={60} height={60} />
            </div>
            <h3 className="text-lg font-bold mb-2 text-black">Conferma prenotazione</h3>
            <p className="text-gray-900 text-sm">Riceverai una conferma di prenotazione con i tuoi ordini</p>
          </div>
        </div>
    ),
  },
  {
    question: "Quali metodi di pagamento sono accettati?",
    type: "faq",
    answer: (
        <div className="bg-white rounded-lg p-8 flex flex-col items-center justify-center text-center min-h-[220px]">
          <h3 className="text-lg font-bold mb-3 text-black">Metodi di pagamento accettati</h3>
          <ul className="text-gray-900 text-base space-y-2">
            <li>Carta di credito/debito (Visa, MasterCard)</li>
            <li>Contanti presso ristoranti abilitati</li>
          </ul>
          <p className="text-sm mt-2 text-[#ff9100]">Scegli il metodo al momento della conferma prenotazione.</p>
        </div>
    ),
  },
  {
    question: "Posso prenotare senza preordinare il cibo?",
    type: "faq",
    answer: (
        <div className="bg-white rounded-lg p-8 flex flex-col items-center justify-center text-center min-h-[220px]">
          <h3 className="text-lg font-bold mb-3 text-black">Prenotazione senza preordine</h3>
          <p className="text-gray-900 text-base">
            Puoi prenotare il tavolo senza scegliere subito i piatti.<br />
            Il preordine è facoltativo e disponibile per ristoranti che lo supportano.<br />
            In alternativa puoi ordinare direttamente quando arrivi.
          </p>
        </div>
    ),
  },
  {
    question: "Sono disponibili sconti o promozioni speciali?",
    type: "faq",
    answer: (
        <div className="bg-white rounded-lg p-8 flex flex-col items-center justify-center text-center min-h-[220px]">
          <h3 className="text-lg font-bold mb-3 text-black">Sconti e Promozioni</h3>
          <p className="text-gray-900 text-base">
            Ogni mese offriamo promozioni dedicate, coupon e sconti esclusivi.<br />
            Registrati o iscriviti alla newsletter per riceverli direttamente nella tua casella email!
          </p>
        </div>
    ),
  },
];

const TABS = [
  { id: "faq", label: "Domande frequenti" },
  { id: "about", label: "Chi siamo?" },
  { id: "support", label: "Help & Support" },
];


export default function Home() {
  const [activeTab, setActiveTab] = useState("faq");
  const [activeFaq, setActiveFaq] = useState(0);

  const faqSidebar = FAQS.map((faq, idx) => (
      <button
          key={faq.question}
          className={`px-5 py-2 rounded-full font-semibold mb-3 text-left transition w-fit ${
              activeFaq === idx && activeTab === "faq"
                  ? "bg-[#ff9100] text-black shadow"
                  : "bg-transparent text-white hover:bg-[#ff9100]/80 hover:text-black"
          }`}
          onClick={() => {
            setActiveTab("faq");
            setActiveFaq(idx);
          }}
      >
        {faq.question}
      </button>
  ));
  return (
    // vediamo cosa tenere, se guardi in component c'è quello che hos critto io per la ricerca 
    // <div className="pt-20">
    //  <Herosearch backgroundImageUrl={""} title={""} subtitle={""}></Herosearch>
    // </div>
     <main className="px-8 sm:px-20 py-32 space-y-16">
      {/* Hero Section */}
       <section className="relative w-full flex justify-center items-center max-w-[1800px] mx-auto py-24 overflow-hidden rounded-[35px]">
         {/* Sfondo blu principale */}
         <div className="absolute inset-0 bg-[#080c1c]" />

         {/* Blob arancione a destra */}
         <div
             className="absolute right-0 top-0 w-[60%] h-full bg-[#ff9100] rounded-l-[350px]"
             style={{ zIndex: 0 }}
         />

         {/* Contenuto principale */}
         <div className="relative z-10 flex flex-col lg:flex-row w-full max-w-7xl items-center justify-between px-8 sm:px-16 lg:px-20">
           {/* Testo e barra di ricerca */}
           <div className="flex flex-col justify-center items-start text-left max-w-[550px] space-y-6 mb-10 lg:mb-0">
             <p className="text-white text-lg font-light">
               Scopri, prenota e ordina in anticipo i tuoi piatti
             </p>
             <h1 className="text-white text-5xl md:text-6xl font-extrabold leading-tight">
               Prenota i migliori<br />ristoranti di Torino
             </h1>

             {/* Search bar */}
             <form className="flex items-center bg-white rounded-full shadow-md px-5 py-3 w-full max-w-[420px] mt-3">
               <span className="text-gray-400 mr-2 text-xl">🔍</span>
               <input
                   type="text"
                   placeholder="tipo di cucina, nome del ristorante..."
                   className="flex-1 bg-transparent outline-none text-gray-800 text-base font-medium"
               />
               <button
                   type="submit"
                   className="ml-3 bg-[#ff9100] text-white font-semibold rounded-full px-6 py-2 hover:bg-[#ff7a00] transition shadow"
               >
                 Search
               </button>
             </form>
           </div>

           {/* Immagine e notifiche */}
           <div className="relative flex items-center w-full lg:w-[60%]">
             {/* Immagine della ragazza */}
             <Image
                 src="/foto_1.png"
                 alt="Ragazza con pizza"
                 width={400}
                 height={440}
                 className="object-contain z-10 drop-shadow-lg"
             />

             {/* Card notifiche a destra */}
             <div className="absolute left-[50%] top-[10%] flex flex-col gap-5 w-[360px]">
               {/* Step 1 */}
               <div className="relative bg-white rounded-2xl shadow-lg p-4 pl-8 border border-gray-100">
                 <span className="absolute -left-6 top-2 text-3xl font-bold text-[#ff9100]">1</span>
                 <p className="font-semibold text-black">Abbiamo ricevuto la tua prenotazione!</p>
                 <p className="text-gray-500 text-sm mt-1">In attesa dell'accettazione del ristorante</p>
               </div>

               {/* Step 2 */}
               <div className="relative bg-white rounded-2xl shadow-lg p-4 pl-8 border border-gray-100">
                 <span className="absolute -left-6 top-2 text-3xl font-bold text-[#ff9100]">2</span>
                 <p className="font-semibold text-black">
                   Prenotazione accettata! <span className="text-2xl">✅</span>
                 </p>
                 <p className="text-gray-500 text-sm mt-1">Abbiamo prenotato il tuo posto</p>
               </div>

               {/* Step 3 */}
               <div className="relative bg-white rounded-2xl shadow-lg p-4 pl-8 border border-gray-100">
                 <span className="absolute -left-6 top-2 text-3xl font-bold text-[#ff9100]">3</span>
                 <p className="font-semibold text-black">Ti aspettiamo! 🎉</p>
                 <p className="text-gray-500 text-sm mt-1">Grazie per aver scelto ToFork</p>
               </div>
             </div>
           </div>
         </div>
       </section>


       {/* Offerte Esclusive */}
      <section>
        <Carousel />
      </section>

      {/* Categorie Popolari*/}
       <section>
         <h2 className="text-2xl font-semibold mb-6 text-black flex items-center gap-2">
           Categorie Popolari 🍕
         </h2>
         <div className="grid grid-cols-2 sm:grid-cols-6 gap-6 items-center">
           <Link href="/ristoranti?tab=Burgers%20%26%20Fast%20Food"
                 className="flex flex-col rounded-xl overflow-hidden shadow h-[240px] w-full transition hover:scale-105">
             <div className="flex-1 relative w-full h-full bg-[#fff9e6]">
               <Image
                   src="/burger.png"
                   alt="Burger"
                   fill
                   style={{ objectFit: "cover" }}
                   className="object-cover"
               />
             </div>
             <div className="bg-[#171c2b] py-3 px-4 text-left">
               <span className="text-[#ffb81e] font-bold text-base">Burgers & Fast food</span>
               <div className="text-xs text-white">12 Ristoranti</div>
             </div>
           </Link>

           <Link href="/ristoranti?tab=Insalate"
                 className="flex flex-col rounded-xl overflow-hidden shadow h-[240px] w-full transition hover:scale-105">
             <div className="flex-1 relative w-full h-full bg-[#f5f5f5]">
               <Image
                   src="/insalata.png"
                   alt="Insalate"
                   fill
                   style={{ objectFit: "cover" }}
                   className="object-cover"
               />
             </div>
             <div className="bg-[#262a3b] py-3 px-4 text-left">
               <span className="text-[#ffb81e] font-bold text-base">Insalate</span>
               <div className="text-xs text-white">14 Ristoranti</div>
             </div>
           </Link>

           <Link href="/ristoranti?tab=Pasta"
                 className="flex flex-col rounded-xl overflow-hidden shadow h-[240px] w-full transition hover:scale-105">
             <div className="flex-1 relative w-full h-full bg-[#f9f7f2]">
               <Image
                   src="/pasta.png"
                   alt="Pasta"
                   fill
                   style={{ objectFit: "cover" }}
                   className="object-cover"
               />
             </div>
             <div className="bg-[#1a1e2d] py-3 px-4 text-left">
               <span className="text-[#ffb81e] font-bold text-base">Pasta</span>
               <div className="text-xs text-white">18 Ristoranti</div>
             </div>
           </Link>

           <Link href="/ristoranti?tab=Pizza"
                 className="flex flex-col rounded-xl overflow-hidden shadow h-[240px] w-full transition hover:scale-105">
             <div className="flex-1 relative w-full h-full bg-[#f7f7f7]">
               <Image
                   src="/pizza.png"
                   alt="Pizza"
                   fill
                   style={{ objectFit: "cover" }}
                   className="object-cover"
               />
             </div>
             <div className="bg-[#181828] py-3 px-4 text-left">
               <span className="text-[#ffb81e] font-bold text-base">Pizza</span>
               <div className="text-xs text-white">22 Ristoranti</div>
             </div>
           </Link>

           <Link href="/ristoranti?tab=Breakfast"
                 className="flex flex-col rounded-xl overflow-hidden shadow h-[240px] w-full transition hover:scale-105">
             <div className="flex-1 relative w-full h-full bg-[#f8f9fa]">
               <Image
                   src="/breakfast.png"
                   alt="Breakfast"
                   fill
                   style={{ objectFit: "cover" }}
                   className="object-cover"
               />
             </div>
             <div className="bg-[#262b32] py-3 px-4 text-left">
               <span className="text-[#ffb81e] font-bold text-base">Breakfast</span>
               <div className="text-xs text-white">4 Ristoranti</div>
             </div>
           </Link>

           <Link href="/ristoranti?tab=Sushi"
                 className="flex flex-col rounded-xl overflow-hidden shadow h-[240px] w-full transition hover:scale-105">
             <div className="flex-1 relative w-full h-full bg-[#f0f3f7]">
               <Image
                   src="/sushi.png"
                   alt="Sushi"
                   fill
                   style={{ objectFit: "cover" }}
                   className="object-cover"
               />
             </div>
             <div className="bg-[#151f2e] py-3 px-4 text-left">
               <span className="text-[#ffb81e] font-bold text-base">Sushi</span>
               <div className="text-xs text-white">10 Ristoranti</div>
             </div>
           </Link>
         </div>
       </section>



       {/* Popular Restaurants */}

       <section>
         <h2 className="text-2xl font-semibold mb-6 text-black">Ristoranti Popolari</h2>
         <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 items-center">
           {POPULAR.map((rest, idx) => (
               <Link
                   key={rest.slug}
                   href={`/ristoranti/${rest.slug}`}
                   className="flex flex-col h-[220px] w-full rounded-xl overflow-hidden shadow group transition hover:scale-105"
               >
                 <div className="flex-1 flex items-center justify-center bg-white">
                   <Image src={rest.src} alt={rest.name} width={140} height={100} className="object-contain max-h-[110px]" />
                 </div>
                 <div className={`py-3 text-center text-white font-bold text-base ${rest.bg}`}>
                   {rest.name}
                 </div>
               </Link>
           ))}
         </div>
       </section>



       {/* Contattaci */}
       <section className="bg-[#172118] text-white rounded-xl p-8 flex flex-col sm:flex-row items-center gap-6">
         <div className="sm:w-1/2">
           <h2 className="text-2xl font-bold mb-4">CONTATTACI PER COLLABORARE</h2>
           <p className="mb-4">Vuoi collaborare con noi? Scrivici!</p>
           <a
               href="mailto:support@tofork.com">
               <button className="bg-orange-500 px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors text-white block text-center">Contattaci</button>
           </a>
         </div>
         <div className="sm:w-1/2 flex justify-center">
           <Image src="/contact-image.png" alt="Illustrazione contatti" width={300} height={200} />
         </div>
       </section>


       {/* Scopri di più */}
       <section className="bg-gray-100 rounded-xl p-6 sm:p-12">
         {/* Header e tab */}
         <div className="flex items-center justify-between mb-10">
           <h2 className="text-3xl font-bold text-black">Scopri di più su di noi!</h2>
           <div className="flex gap-4">
             {TABS.map(tab => (
                 <button
                     key={tab.id}
                     className={`px-4 py-2 rounded-full font-semibold bg-white transition shadow-sm border-2 
                  ${activeTab === tab.id ? "border-[#ff9100] text-[#ff9100]" : "border-gray-200 text-black hover:border-[#ff9100] hover:text-[#ff9100]"}`}
                     onClick={() => setActiveTab(tab.id)}
                 >
                   {tab.label}
                 </button>
             ))}
           </div>
         </div>

         <div className="flex flex-col sm:flex-row bg-[#080c1c] rounded-xl shadow-lg overflow-hidden min-h-[280px]">
           {/* Sidebar FAQ/buttons */}
           {activeTab === "faq" && (
               <div className="min-w-[280px] bg-[#080c1c] flex flex-col justify-center items-start p-7 gap-1 space-y-1">
                 {faqSidebar}
               </div>
           )}

           {/* Risposta attiva/tab info */}
           <div className="flex-1 flex flex-col justify-center p-6">
             {activeTab === "faq"
                 ? FAQS[activeFaq].answer
                 : activeTab === "about"
                     ? (
                         <div className="bg-white rounded-lg p-8 flex flex-col items-start justify-center min-h-[220px]">
                           <h3 className="text-xl font-bold mb-3 text-black">Chi siamo?</h3>
                           <p className="text-gray-900 text-base">
                             ToFork è una piattaforma digitale nata per rivoluzionare il mondo delle prenotazioni in ristorante a Torino, mettendo in contatto clienti e locali in pochi clic. Il nostro team unisce la passione per la tecnologia all’amore per il buon cibo!
                           </p>
                         </div>
                     )
                     : (
                         <div className="bg-white rounded-lg p-8 flex flex-col items-start justify-center min-h-[220px]">
                           <h3 className="text-xl font-bold mb-3 text-black">Help & Support</h3>
                           <p className="text-gray-900 text-base">
                             Hai bisogno di aiuto? Visita le nostre FAQ o scrivici una mail a support@tofork.com. Il nostro servizio clienti risponde ogni giorno dalle 9 alle 22.
                           </p>
                         </div>
                     )
             }
           </div>
         </div>
         {/* Descrizione finale */}
         <div className="w-full mt-4 flex justify-center">
           <div className="bg-[#080c1c] text-white py-4 px-7 rounded-xl text-base text-center shadow-sm max-w-3xl">
             ToFork semplifica il processo di prenotazione e ordinazione del cibo. Sfoglia la lista di ristoranti che collaborano con noi, seleziona i tuoi piatti preferiti e procedi al pagamento.
           </div>
         </div>
       </section>
     </main>
    
  );
}
