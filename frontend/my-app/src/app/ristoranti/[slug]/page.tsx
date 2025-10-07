'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import restaurants from '../../components/restaurantsData';
import CalendarBooking from '../../components/CalendarBooking';
import FoodCard from '../../components/FoodCard';
import Tabs from '../../components/Tabs';

// --- Dati esempio menù (da API o file JSON in futuro) ---
const menuData = {
    Burgers: [
        { id: 'b1', title: 'CHEL', description: 'Hamburger di manzo, insalata, pomodoro, maionese', price: 8.70, imageUrl: '/img/burger1.jpg' },
        { id: 'b2', title: 'BUN CLASSICO', description: 'Con formaggio, cipolla e salsa BBQ', price: 9.90, imageUrl: '/img/burger2.jpg' },
        { id: 'b3', title: 'VEG BURGER', description: 'Burger vegetariano con verdure grigliate', price: 9.20, imageUrl: '/img/burger3.jpg' },
    ],
    Patatine: [
        { id: 'p1', title: 'PATATE CLASSICHE', description: 'Fritte croccanti con sale marino', price: 4.50, imageUrl: '/img/fries1.jpg' },
        { id: 'p2', title: 'PATATE SPECIAL', description: 'Con cheddar fuso e pancetta', price: 6.00, imageUrl: '/img/fries2.jpg' },
    ],
    'Cold Drinks': [
        { id: 'd1', title: 'Coca-Cola', description: '33cl', price: 2.50, imageUrl: '/img/drink1.jpg' },
        { id: 'd2', title: 'Birra Artigianale', description: 'Bionda 50cl', price: 5.00, imageUrl: '/img/drink2.jpg' },
    ],
};

const RistoranteDettaglioPage = () => {
    const { slug } = useParams();
    const restaurant = restaurants.find(r => r.slug === slug);

    const [selectedTab, setSelectedTab] = useState('Burgers');

    if (!restaurant) {
        return (
            <div className="px-8 py-20 text-center">
                <h1 className="text-3xl font-bold text-gray-700">Ristorante non trovato</h1>
            </div>
        );
    }

    const handleBookingSubmit = (details: { date: Date; time: string; guests: number }) => {
        alert(`Prenotazione per ${restaurant.name} il ${details.date.toLocaleDateString()} alle ${details.time} per ${details.guests} persone.`);
    };

    return (
        <main className="px-8 sm:px-20 py-20 bg-gray-50">
            {/* --- Header con immagine --- */}
            <section
                className="relative h-[300px] rounded-2xl overflow-hidden mb-12 flex items-center justify-center"
                style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${restaurant.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <h1 className="text-4xl md:text-5xl font-bold text-white">{restaurant.name}</h1>
            </section>

            {/* --- Info + Prenotazione --- */}
            <div className="flex flex-col lg:flex-row gap-10">
                <div className="lg:w-2/3">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900">In breve</h2>
                    <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-6">
                        {restaurant.highlights?.map((h, i) => (
                            <li key={i}>{h}</li>
                        ))}
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Info</h3>
                    <p className="text-gray-700 mb-1"><strong>Indirizzo:</strong> {restaurant.address}</p>
                    <p className="text-gray-700 mb-1"><strong>Prezzo medio:</strong> {restaurant.averagePrice ?? 12}€</p>
                    <p className="text-gray-700 mb-1"><strong>Categoria:</strong> {restaurant.category}</p>
                </div>

                <div className="lg:w-1/3">
                    <CalendarBooking onBookingSubmit={handleBookingSubmit} />
                </div>
            </div>


            {/* --- Sezione Menù --- */}
            <section className="mt-16">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Se vuoi puoi già preordinare i tuoi piatti!</h2>

                {/* Tabs categorie piatti */}
                <div className="my-6 p-3 bg-orange-500 rounded-xl shadow-lg flex items-center justify-center gap-4">
                    {Object.keys(menuData).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setSelectedTab(tab)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ease-in-out ${
                                selectedTab === tab
                                    ? 'bg-white text-orange-600 shadow-md scale-105'
                                    : 'bg-transparent text-white hover:bg-white/20'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Lista piatti */}
                <div className="space-y-10">
                    {Object.entries(menuData)
                        .filter(([category]) => category === selectedTab)
                        .map(([category, items]) => (
                            <div key={category}>
                                <h3 className="text-2xl font-bold mb-6 text-orange-500">{category}</h3>
                                <div className="flex flex-wrap justify-center gap-4">
                                    {(items as any[]).map(item => (
                                        <FoodCard
                                            key={item.id}
                                            title={item.title}
                                            description={item.description}
                                            price={item.price}
                                            imageUrl={item.imageUrl}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                </div>
            </section>
        </main>
    );
};

export default RistoranteDettaglioPage;
