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

import { CartProvider } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import CartSummary from '../../components/CartSummary';

const RistoranteDettaglioContent = () => {
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
    }, [slug]);

    const handleBookingSubmit = async (details: { date: Date; time: string; guests: number }) => {
        if (!restaurant || !user) return;

        try {
            console.log("-----------------------------------------");
            console.log("DEBUG: Inizio procedura prenotazione");
            console.log("DEBUG: Dettagli ricevuti:", details);

            // Combine date and time
            const [hours, minutes] = details.time.split(':').map(Number);
            const bookingDateTime = new Date(details.date);
            bookingDateTime.setHours(hours, minutes, 0, 0);

            // Adjust for timezone offset
            const isoDate = new Date(bookingDateTime.getTime() - (bookingDateTime.getTimezoneOffset() * 60000)).toISOString();
            console.log("DEBUG: Data ISO calcolata:", isoDate);

            // Prepare payload
            const payload = {
                userId: user.id,
                restaurantId: restaurant.id,
                restaurantName: restaurant.name,
                bookingDate: isoDate,
                peopleCount: details.guests,

            };
            console.log("DEBUG: Payload richiesta:", payload);

            // Create Booking directly
            console.log("DEBUG: Invio richiesta POST a /api/bookings...");
            const res = await fetch(`${baseUrl}/api/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            console.log("DEBUG: Risposta status:", res.status);
            const data = await res.json();
            console.log("DEBUG: Risposta body:", data);

            if (data.success) {
                console.log("DEBUG: Prenotazione riuscita!");
                setSuccessMessage("Richiesta di prenotazione inviata con successo! Attendi la conferma del ristoratore.");
                // Scroll to top to see message
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                console.error("DEBUG: Errore API:", data.message);
                alert(`Errore prenotazione: ${data.message}`);
            }
        } catch (error) {
            console.error("DEBUG: Booking failed (Exception)", error);
            alert("Errore durante la creazione della prenotazione.");
        }
    };

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

    return (
        <main className="px-8 sm:px-20 py-20 bg-gray-50">
            <section className="relative h-[300px] rounded-2xl overflow-hidden mb-12 flex items-center justify-center"
                     style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${restaurant.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <h1 className="text-4xl md:text-5xl font-bold text-white">{restaurant.name}</h1>
            </section>

            {successMessage && (
                <div className="mb-8 p-6 bg-green-100 border border-green-400 text-green-700 rounded-xl shadow-md flex items-center justify-between animate-in slide-in-from-top-4">
                    <div className="flex items-center">
                        <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        <span className="font-bold text-lg">{successMessage}</span>
                    </div>
                    <button onClick={() => setSuccessMessage('')} className="text-green-800 font-bold text-xl hover:text-green-600">&times;</button>
                </div>
            )}

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
                    <CalendarBooking restaurantId={restaurant.id} onBookingSubmit={handleBookingSubmit} />
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
            <CartSummary />
        </main>
    );
};

const RistoranteDettaglioPage = () => {
    return (
        <CartProvider>
            <RistoranteDettaglioContent />
        </CartProvider>
    );
};

export default RistoranteDettaglioPage;
