'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import CalendarBooking from '../../components/CalendarBooking';
import FoodCard from '../../components/FoodCard';

interface MenuItem {
    id: string | number;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
}

interface Restaurant {
    id: number;
    name: string;
    slug: string;
    address: string;
    description: string;
    image: string;
    category: string;
    averagePrice: number;
    lat: number;
    lon: number;
    highlights: string[];
    menu: { [category: string]: MenuItem[] };
}

const RistoranteDettaglioPage = () => {
    const { slug } = useParams();
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState('');

    useEffect(() => {
        if (slug) {
            fetch(`http://localhost:8083/api/restaurants/slug/${slug}`)
                .then(res => {
                    if (!res.ok) throw new Error('Restaurant not found');
                    return res.json();
                })
                .then(data => {
                    setRestaurant(data);
                    const categories = data.menu ? Object.keys(data.menu) : [];
                    if (categories.length > 0) {
                        setSelectedTab(categories[0]);
                    }
                })
                .catch(err => {
                    console.error(err);
                    setRestaurant(null);
                })
                .finally(() => setLoading(false));
        }
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl">Caricamento...</p>
            </div>
        );
    }

    if (!restaurant) {
        return (
            <div className="px-8 py-20 text-center">
                <h1 className="text-3xl font-bold text-gray-700">Ristorante non trovato</h1>
            </div>
        );
    }

    const categories = restaurant.menu ? Object.keys(restaurant.menu) : [];
    const menuData = restaurant.menu ?? {};

    const handleBookingSubmit = (details: { date: Date; time: string; guests: number }) => {
        alert(`Prenotazione per ${restaurant.name} il ${details.date.toLocaleDateString()} alle ${details.time} per ${details.guests} persone.`);
    };

    return (
        <main className="px-8 sm:px-20 py-20 bg-gray-50">
            <section className="relative h-[300px] rounded-2xl overflow-hidden mb-12 flex items-center justify-center"
                     style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${restaurant.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <h1 className="text-4xl md:text-5xl font-bold text-white">{restaurant.name}</h1>
            </section>
            <div className="flex flex-col lg:flex-row gap-10">
                <div className="lg:w-2/3">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900">In breve</h2>
                    <p className="text-gray-700 mb-6">{restaurant.description}</p>
                    
                    {restaurant.highlights && restaurant.highlights.length > 0 && (
                        <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-6">
                            {restaurant.highlights.map((h, i) => (
                                <li key={i}>{h}</li>
                            ))}
                        </ul>
                    )}
                    
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Info</h3>
                    <p className="text-gray-700 mb-1"><strong>Indirizzo:</strong> {restaurant.address}</p>
                    <p className="text-gray-700 mb-1"><strong>Prezzo medio:</strong> {restaurant.averagePrice ?? 12}€</p>
                    <p className="text-gray-700 mb-1"><strong>Categoria:</strong> {restaurant.category}</p>
                </div>
                <div className="lg:w-1/3">
                    <CalendarBooking onBookingSubmit={handleBookingSubmit} />
                </div>
            </div>
            
            {categories.length > 0 && (
                <section className="mt-16">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900">Se vuoi puoi già preordinare i tuoi piatti!</h2>
                    <div className="my-6 p-3 bg-orange-500 rounded-xl shadow-lg flex items-center justify-center gap-4 overflow-x-auto">
                        {categories.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setSelectedTab(tab)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ease-in-out ${selectedTab === tab ? 'bg-white text-orange-600 shadow-md scale-105' : 'bg-transparent text-white hover:bg-white/20'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="space-y-10">
                        {menuData && Object.entries(menuData)
                            .filter(([category]) => category === selectedTab)
                            .map(([category, items]) => (
                                <div key={category}>
                                    <h3 className="text-2xl font-bold mb-6 text-orange-500">{category}</h3>
                                    <div className="flex flex-wrap justify-center gap-4">
                                        {(items as MenuItem[]).map(item => (
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
            )}
        </main>
    );
};

export default RistoranteDettaglioPage;
