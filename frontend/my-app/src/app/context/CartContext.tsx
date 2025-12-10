'use client';
import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface CartItem {
    id: number;
    title: string;
    price: number;
    quantity: number;
    restaurantId: number;
    restaurantName: string; // Added
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: number) => void;
    clearCart: () => void;
    total: number;
    checkout: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const { user, token } = useAuth();
    const prevTokenRef = useRef<string | null>(token);

    // Clear cart on logout
    useEffect(() => {
        // If we had a token before, and now we don't, it means we logged out.
        if (prevTokenRef.current && !token) {
            setItems([]);
            localStorage.removeItem('cart');
        }
        prevTokenRef.current = token;
    }, [token]);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setItems(JSON.parse(savedCart));
        }
    }, []);

    // Save cart to localStorage on change
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const addItem = (newItem: CartItem) => {
        setItems(prev => {
            // Check if item exists
            const existing = prev.find(i => i.id === newItem.id);
            if (existing) {
                return prev.map(i => i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            // Check if adding item from different restaurant
            if (prev.length > 0 && prev[0].restaurantId !== newItem.restaurantId) {
                if (confirm("Aggiungendo un piatto di un altro ristorante il carrello attuale verrà svuotato. Procedere?")) {
                    return [{ ...newItem, quantity: 1 }];
                }
                return prev;
            }
            return [...prev, { ...newItem, quantity: 1 }];
        });
    };

    const removeItem = (id: number) => {
        setItems(prev => prev.filter(i => i.id !== id));
    };

    const clearCart = () => setItems([]);

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const checkout = async () => {
        if (!user || !token) {
            alert("Devi essere loggato per ordinare.");
            return;
        }

        if (items.length === 0) return;

        const restaurantId = items[0].restaurantId;
        const restaurantName = items[0].restaurantName || "Ristorante";
        
        // 1. Popup Choice

        setShowModal(true);
    };

    const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

    const processOrder = async (type: 'TAKEAWAY' | 'DINE_IN', bookingId: number | null) => {
        if (!user || !token || items.length === 0) return;

        try {
            const restaurantId = items[0].restaurantId;
            const restaurantName = items[0].restaurantName || "Ristorante";
            const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';

            const response = await fetch(`${apiBase}/api/orders`, {
                method: 'POST',
                headers: {
                   'Content-Type': 'application/json',
                   'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                   bookingId: bookingId,
                   orderType: type,
                   userId: user.id,
                   userEmail: user.email || "user@example.com",
                   userName: (user.firstName && user.lastName) ? `${user.firstName} ${user.lastName}` : "Cliente",
                   restaurantId: restaurantId,
                   restaurantName: restaurantName,
                   items: items.map(i => ({
                       foodItemId: i.id,
                       foodItemName: i.title,
                       quantity: i.quantity,
                       unitPrice: i.price,
                       specialRequests: ""
                   })),
                   totalAmount: total
                })
            });

            if (response.ok) {
                 setNotification({
                    type: 'success',
                    message: "Ordine inviato con successo! Vai nella sezione 'I miei ordini' per completare il pagamento."
                 });
                 clearCart();
                 setShowModal(false);
            } else {
                 const errorData = await response.json();
                 alert(`Errore durante l'ordine: ${errorData.message || 'Riprova più tardi'}`);
            }
        } catch (error) {
             console.error("Order error:", error);
             alert("Errore di connessione durante l'invio dell'ordine.");
        }
    };

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [bookingsList, setBookingsList] = useState<any[]>([]);
    const [loadingBookings, setLoadingBookings] = useState(false);

    // Fetch bookings when modal opens or on demand
    const fetchUserBookings = async () => {
        if(!user || !token || items.length === 0) return;
        setLoadingBookings(true);
        try {
            const restaurantId = items[0].restaurantId;
            const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';
            
            // To ensure we get only future/today bookings, manual filter after fetch might be needed if API doesn't filter perfectly
            const res = await fetch(`${apiBase}/api/bookings/user/${user.id}?status=CONFIRMED`, {
                 headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (res.ok) {
                 const data = await res.json();
                 const allBookings = Array.isArray(data.data) ? data.data : [];
                 
                 // Filter for this restaurant + Date >= Today
                 const now = new Date();
                 now.setHours(0,0,0,0);
                 
                 const valid = allBookings.filter((b: any) => {
                      const bDate = new Date(b.bookingDate);
                      return b.restaurantId === restaurantId && b.status === 'CONFIRMED' && bDate >= now;
                 });
                 
                 setBookingsList(valid);
                 
                 if (valid.length === 0) {
                      alert("Non hai prenotazioni future CONFERMATE per questo ristorante.");
                 } else if (valid.length === 1) {
                      // Auto select? Maybe better let user confirm.
                      // Let's just show the list of 1.
                 }
            } else {
                 console.error("Failed to fetch bookings");
                 alert("Impossibile recuperare le prenotazioni.");
            }
        } catch(e) {
            console.error(e);
            alert("Errore di rete recupero prenotazioni");
        } finally {
            setLoadingBookings(false);
        }
    };


    return (
        <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total, checkout }}>
            {notification && (
                <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[10000] w-full max-w-4xl px-4 animate-in slide-in-from-top-4 fade-in duration-300">
                   <div className={`p-4 rounded-lg shadow-md flex justify-between items-center border ${
                       notification.type === 'success' 
                       ? 'bg-green-100 text-green-800 border-green-200' 
                       : 'bg-red-100 text-red-800 border-red-200'
                   }`}>
                      <div className="flex items-center gap-3">
                         {notification.type === 'success' ? (
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                         ) : (
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                         )}
                         <span className="font-semibold">{notification.message}</span>
                      </div>
                      <button onClick={() => setNotification(null)} className="p-1 hover:bg-black/5 rounded-full transition">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                   </div>
                </div>
            )}
            {children}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-xl font-bold mb-4 text-center">Come vuoi ordinare?</h3>
                        
                        {!loadingBookings && bookingsList.length === 0 ? (
                            <div className="space-y-3">
                                <button 
                                    onClick={() => fetchUserBookings()}
                                    className="w-full flex items-center justify-between p-4 border rounded-xl hover:bg-orange-50 hover:border-orange-500 transition group"
                                >
                                    <div className="text-left">
                                        <div className="font-bold group-hover:text-orange-600">Collega a una prenotazione</div>
                                        <div className="text-sm text-gray-500">Mangerai al ristorante</div>
                                    </div>
                                    <span>🍽️</span>
                                </button>

                                <button 
                                    onClick={() => processOrder('TAKEAWAY', null)}
                                    className="w-full flex items-center justify-between p-4 border rounded-xl hover:bg-orange-50 hover:border-orange-500 transition group"
                                >
                                    <div className="text-left">
                                        <div className="font-bold group-hover:text-orange-600">Ordina da asporto</div>
                                        <div className="text-sm text-gray-500">Passerai a ritirarlo</div>
                                    </div>
                                    <span>🥡</span>
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <h4 className="font-semibold text-gray-700">Seleziona la tua prenotazione:</h4>
                                {bookingsList.map((b: any) => (
                                    <button
                                        key={b.id}
                                        onClick={() => processOrder('DINE_IN', b.id)}
                                        className="w-full p-3 border rounded-lg hover:bg-green-50 hover:border-green-500 flex justify-between items-center"
                                    >
                                        <div>
                                            <div className="font-bold">{new Date(b.bookingDate).toLocaleDateString()}</div>
                                            <div className="text-sm">{new Date(b.bookingDate).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} - {b.peopleCount} persone</div>
                                        </div>
                                        <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">Seleziona</div>
                                    </button>
                                ))}
                                <button 
                                    onClick={() => setBookingsList([])}
                                    className="w-full py-2 text-gray-500 text-sm underline hover:text-gray-800"
                                >
                                    Indietro
                                </button>
                            </div>
                        )}

                        <button 
                            onClick={() => { setShowModal(false); setBookingsList([]); }}
                            className="mt-6 w-full py-2 rounded-lg bg-gray-100 font-semibold hover:bg-gray-200 transition"
                        >
                            Annulla
                        </button>
                    </div>
                </div>
            )}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
