"use client";
import { useState } from "react";
import Image from "next/image";
// import Herosearch from "../components/Herosearch";
import Carousel from "../components/Carousel";
import Link from "next/link";


const POPULAR = [
  { src: "/crostone.png", name: "Crostone", bg: "bg-[#ff9100]" },
  { src: "/piola.png", name: "Piola 1706", bg: "bg-[#ff9100]" },
  { src: "/mollica.png", name: "Mollica", bg: "bg-[#ff9100]" },
  { src: "/scannabue.png", name: "Scannabue", bg: "bg-[#ff9100]" },
  { src: "/rockburger.png", name: "Rock Burger", bg: "bg-[#ff9100]" },
  { src: "/felicin.png", name: "Felicin alla consolata", bg: "bg-[#ff9100]" },
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
        <Carousel />
      </section>

      {/* Categorie Popolari*/}
       <section>
         <h2 className="text-2xl font-semibold mb-6 text-black flex items-center gap-2">
           Categorie Popolari 🍕
         </h2>
         <div className="grid grid-cols-2 sm:grid-cols-6 gap-6 items-center">
           <Link href="/ristoranti?tab=Offerte"
                 className="flex flex-col rounded-xl overflow-hidden shadow h-[240px] w-full transition hover:scale-105">
             <div className="flex-1 flex items-center justify-center bg-[#fff9e6]">
               <Image src="/burger.png" alt="Burger" width={120} height={120} className="object-contain" />
             </div>
             <div className="bg-[#171c2b] py-3 px-4 text-left">
               <span className="text-[#ffb81e] font-bold text-base">Burgers & Fast food</span>
               <div className="text-xs text-white">12 Ristoranti</div>
             </div>
           </Link>
           <Link href="/ristoranti?tab=Insalate"
                 className="flex flex-col rounded-xl overflow-hidden shadow h-[240px] w-full transition hover:scale-105">
             <div className="flex-1 flex items-center justify-center bg-[#f5f5f5]">
               <Image src="/insalata.png" alt="Insalate" width={120} height={120} className="object-contain" />
             </div>
             <div className="bg-[#262a3b] py-3 px-4 text-left">
               <span className="text-[#ffb81e] font-bold text-base">Insalate</span>
               <div className="text-xs text-white">14 Ristoranti</div>
             </div>
           </Link>
           <Link href="/ristoranti?tab=Pasta"
                 className="flex flex-col rounded-xl overflow-hidden shadow h-[240px] w-full transition hover:scale-105">
             <div className="flex-1 flex items-center justify-center bg-[#f9f7f2]">
               <Image src="/pasta.png" alt="Pasta" width={120} height={120} className="object-contain" />
             </div>
             <div className="bg-[#1a1e2d] py-3 px-4 text-left">
               <span className="text-[#ffb81e] font-bold text-base">Pasta</span>
               <div className="text-xs text-white">18 Ristoranti</div>
             </div>
           </Link>
           <Link href="/ristoranti?tab=Pizza"
                 className="flex flex-col rounded-xl overflow-hidden shadow h-[240px] w-full transition hover:scale-105">
             <div className="flex-1 flex items-center justify-center bg-[#f7f7f7]">
               <Image src="/pizza.png" alt="Pizza" width={120} height={120} className="object-contain" />
             </div>
             <div className="bg-[#181828] py-3 px-4 text-left">
               <span className="text-[#ffb81e] font-bold text-base">Pizza</span>
               <div className="text-xs text-white">22 Ristoranti</div>
             </div>
           </Link>
           <Link href="/ristoranti?tab=Breakfast"
                 className="flex flex-col rounded-xl overflow-hidden shadow h-[240px] w-full transition hover:scale-105">
             <div className="flex-1 flex items-center justify-center bg-[#f8f9fa]">
               <Image src="/breakfast.png" alt="Breakfast" width={120} height={120} className="object-contain" />
             </div>
             <div className="bg-[#262b32] py-3 px-4 text-left">
               <span className="text-[#ffb81e] font-bold text-base">Breakfast</span>
               <div className="text-xs text-white">4 Ristoranti</div>
             </div>
           </Link>
           <Link href="/ristoranti?tab=Sushi"
                 className="flex flex-col rounded-xl overflow-hidden shadow h-[240px] w-full transition hover:scale-105">
             <div className="flex-1 flex items-center justify-center bg-[#f0f3f7]">
               <Image src="/sushi.png" alt="Sushi" width={120} height={120} className="object-contain" />
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
         <h2 className="text-2xl font-semibold mb-6 text-black">Popular Restaurants</h2>
         <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 items-center">
           {POPULAR.map((rest, idx) => (
               <div
                   key={idx}
                   className="flex flex-col h-[220px] w-full rounded-xl overflow-hidden shadow group transition hover:scale-105"
               >
                 <div className="flex-1 flex items-center justify-center bg-white">
                   <Image src={rest.src} alt={rest.name} width={140} height={100} className="object-contain max-h-[110px]" />
                 </div>
                 <div className={`py-3 text-center text-white font-bold text-base ${rest.bg}`}>
                   {rest.name}
                 </div>
               </div>
           ))}
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
