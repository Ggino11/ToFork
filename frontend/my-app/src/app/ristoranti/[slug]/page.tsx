'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import CalendarBooking from '../../components/CalendarBooking';
import FoodCard from '../../components/FoodCard';
import { useAuth } from '../../context/AuthContext';
import CartSummary from '../../components/CartSummary';

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
    const { user, token } = useAuth();
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';

    useEffect(() => {
        if (slug) {
            fetch(`${baseUrl}/api/restaurants/slug/${slug}`)
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
    }, [slug, baseUrl]);

    const handleBookingSubmit = async (details: { date: Date; time: string; guests: number }) => {
        if (!restaurant || !user) return;

        try {
            const [hours, minutes] = details.time.split(':').map(Number);
            const bookingDateTime = new Date(details.date);
            bookingDateTime.setHours(hours, minutes, 0, 0);
            const isoDate = new Date(bookingDateTime.getTime() - (bookingDateTime.getTimezoneOffset() * 60000)).toISOString();

            const payload = {
                userId: user.id,
                restaurantId: restaurant.id,
                restaurantName: restaurant.name,
                bookingDate: isoDate,
                peopleCount: details.guests,
            };

            const res = await fetch(`${baseUrl}/api/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (data.success) {
                setSuccessMessage("Richiesta di prenotazione inviata con successo!");
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                alert(`Errore prenotazione: ${data.message}`);
            }
        } catch (error) {
            console.error("Booking failed", error);
            alert("Errore durante la creazione della prenotazione.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl text-gray-500 animate-pulse">Caricamento ristorante...</p>
            </div>
        );
    }

    if (!restaurant) {
        return (
            <div className="px-8 py-20 text-center">
                <h1 className="text-3xl font-bold text-gray-700">Ristorante non trovato</h1>
                <a href="/ristoranti" className="text-orange-600 hover:underline mt-4 block">Torna alla lista</a>
            </div>
        );
    }

    const categories = restaurant.menu ? Object.keys(restaurant.menu) : [];
    const menuData = restaurant.menu ?? {};

    return (
        <main className="px-4 sm:px-8 md:px-20 py-10 bg-gray-50 min-h-screen">
            {/* Header */}
            <section className="relative h-[250px] md:h-[400px] rounded-2xl overflow-hidden mb-8 shadow-xl flex items-end p-8"
                     style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.1)), url(${restaurant.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="text-white z-10">
                    <span className="bg-orange-600 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider mb-2 inline-block">{restaurant.category}</span>
                    <h1 className="text-3xl md:text-5xl font-bold">{restaurant.name}</h1>
                    <p className="text-gray-200 mt-2 flex items-center gap-2">
                        {restaurant.address}
                    </p>
                </div>
            </section>

            {successMessage && (
                <div className="mb-8 p-6 bg-green-100 border border-green-400 text-green-700 rounded-xl shadow-md flex items-center justify-between animate-in slide-in-from-top-4">
                    <span className="font-bold text-lg">{successMessage}</span>
                    <button onClick={() => setSuccessMessage('')} className="text-green-800 font-bold text-xl hover:text-green-600">&times;</button>
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-10">
                <div className="lg:w-2/3">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900">Chi siamo</h2>
                        <p className="text-gray-700 leading-relaxed mb-6">{restaurant.description}</p>

                        {restaurant.highlights && restaurant.highlights.length > 0 && (
                            <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                                <h4 className="font-bold text-orange-800 mb-3">Caratteristiche</h4>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {restaurant.highlights.map((h, i) => (
                                        <li key={i} className="flex items-start text-gray-700 text-sm">
                                            <span className="mr-2 text-orange-500">•</span> {h}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {categories.length > 0 && (
                        <section id="menu-section">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Il Nostro Menu</h2>
                            </div>

                            <div className="sticky top-20 z-30 bg-gray-50/95 backdrop-blur py-4 mb-6 -mx-4 px-4 overflow-x-auto flex gap-3 no-scrollbar">
                                {categories.map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setSelectedTab(tab)}
                                        className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 shadow-sm ${
                                            selectedTab === tab
                                                ? 'bg-orange-600 text-white shadow-orange-200 transform scale-105'
                                                : 'bg-white text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-12">
                                {menuData && Object.entries(menuData)
                                    .filter(([category]) => category === selectedTab)
                                    .map(([category, items]) => (
                                        <div key={category} className="animate-in fade-in duration-500">
                                            <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">{category}</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {(items as MenuItem[]).map(item => (
                                                    <FoodCard
                                                        key={item.id}
                                                        id={item.id as number}
                                                        title={item.title}
                                                        description={item.description}
                                                        price={item.price}
                                                        imageUrl={item.imageUrl}
                                                        restaurantId={restaurant.id}
                                                        restaurantName={restaurant.name}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="lg:w-1/3">
                    <div className="sticky top-24">
                        <CalendarBooking restaurantId={restaurant.id} onBookingSubmit={handleBookingSubmit} />
                    </div>
                </div>
            </div>

            <CartSummary />
        </main>
    );
};

export default RistoranteDettaglioPage;