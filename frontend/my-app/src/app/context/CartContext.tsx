'use client';
import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';

export interface CartItem {
    id: number;
    title: string;
    price: number;
    quantity: number;
    restaurantId: number;
    restaurantName: string;
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: number) => void;
    clearCart: () => void;
    total: number;
    checkout: () => Promise<void>;
    loadOrderToEdit: (orderId: number, items: any[], restaurantId: number, restaurantName: string) => void;
    isEditing: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [editingOrderId, setEditingOrderId] = useState<number | null>(null);

    const { user, token } = useAuth();
    const router = useRouter();
    const prevTokenRef = useRef<string | null>(token);

    // Clear cart on logout
    useEffect(() => {
        if (prevTokenRef.current && !token) {
            setItems([]);
            setEditingOrderId(null);
            localStorage.removeItem('cart');
        }
        prevTokenRef.current = token;
    }, [token]);

    // Load cart from localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setItems(JSON.parse(savedCart));
        }
    }, []);

    // Save cart to localStorage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
        if (items.length === 0) setEditingOrderId(null);
    }, [items]);

    const addItem = (newItem: CartItem) => {
        setItems(prev => {
            const existing = prev.find(i => i.id === newItem.id);
            if (existing) {
                return prev.map(i => i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            if (prev.length > 0 && prev[0].restaurantId !== newItem.restaurantId) {
                if (confirm("Aggiungendo un piatto di un altro ristorante il carrello attuale verrà svuotato. Procedere?")) {
                    setEditingOrderId(null);
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

    const clearCart = () => {
        setItems([]);
        setEditingOrderId(null);
    };

    // --- MODIFICA QUI: Fetch dello SLUG per il redirect corretto ---
    const loadOrderToEdit = async (orderId: number, orderItems: any[], restaurantId: number, restaurantName: string) => {
        // 1. Prepara il carrello
        const cartItems: CartItem[] = orderItems.map((i: any) => ({
            id: i.menuItemId || i.id, // Adatta in base al tuo DTO backend
            title: i.name, // o i.foodItemName
            price: i.unitPrice,
            quantity: i.quantity,
            restaurantId: restaurantId,
            restaurantName: restaurantName
        }));

        setItems(cartItems);
        setEditingOrderId(orderId);

        // 2. Recupera lo slug del ristorante per il redirect
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';
            const res = await fetch(`${baseUrl}/api/restaurants/${restaurantId}`);
            if (res.ok) {
                const restaurantData = await res.json();
                if (restaurantData.slug) {
                    router.push(`/ristoranti/${restaurantData.slug}`);
                    alert(`Ordine #${orderId} caricato. Sei stato reindirizzato al menu per le modifiche.`);
                    return;
                }
            }
            // Fallback se non troviamo lo slug
            router.push('/ristoranti');
        } catch (e) {
            console.error("Errore recupero slug ristorante:", e);
            router.push('/ristoranti');
        }
    };

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const checkout = async () => {
        if (!user || !token) {
            alert("Devi essere loggato per ordinare.");
            return;
        }
        if (items.length === 0) return;
        setShowModal(true);
    };

    const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

    const processOrder = async (type: 'TAKEAWAY' | 'DINE_IN', bookingId: number | null, action: 'SAVE' | 'PAY') => {
        if (!user || !token || items.length === 0) return;

        try {
            const restaurantId = items[0].restaurantId;
            const restaurantName = items[0].restaurantName || "Ristorante";
            const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';

            const payload = {
                bookingId: bookingId,
                orderType: type,
                userId: user.id,
                userEmail: user.email || "user@example.com",
                userName: `${user.firstName} ${user.lastName}`,
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
            };

            let response;
            let orderData;

            if (editingOrderId) {
                response = await fetch(`${apiBase}/api/orders/${editingOrderId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(payload)
                });
            } else {
                response = await fetch(`${apiBase}/api/orders`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(payload)
                });
            }

            if (response.ok) {
                const resJson = await response.json();
                orderData = resJson.data;

                if (action === 'PAY') {
                    const returnUrl = window.location.origin + '/profile?tab=orders';

                    const payRes = await fetch(`${apiBase}/api/payments/checkout`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify({
                            orderId: orderData.id,
                            amount: total,
                            successUrl: returnUrl + '&session_id={CHECKOUT_SESSION_ID}',
                            cancelUrl: returnUrl + '&canceled=1'
                        })
                    });

                    if (payRes.ok) {
                        const payData = await payRes.json();
                        clearCart();
                        window.location.href = payData.checkoutUrl;
                        return;
                    } else {
                        alert("Ordine salvato, ma errore nell'avvio del pagamento.");
                    }
                } else {
                    setNotification({
                        type: 'success',
                        message: "Ordine salvato correttamente! Lo trovi nel tuo profilo."
                    });
                    clearCart();
                    setShowModal(false);
                }

            } else {
                const errorData = await response.json();
                alert(`Errore: ${errorData.message || 'Riprova più tardi'}`);
            }
        } catch (error) {
            console.error("Order error:", error);
            alert("Errore di connessione.");
        }
    };

    const [showModal, setShowModal] = useState(false);
    const [bookingsList, setBookingsList] = useState<any[]>([]);
    const [loadingBookings, setLoadingBookings] = useState(false);

    const fetchUserBookings = async () => {
        if(!user || !token || items.length === 0) return;
        setLoadingBookings(true);
        try {
            const restaurantId = items[0].restaurantId;
            const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';
            const res = await fetch(`${apiBase}/api/bookings/user/${user.id}?status=CONFIRMED`, {
                 headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                const allBookings = Array.isArray(data.data) ? data.data : [];
                const now = new Date();
                now.setHours(0,0,0,0);
                const valid = allBookings.filter((b: any) => {
                    const bDate = new Date(b.bookingDate);
                    return b.restaurantId === restaurantId && b.status === 'CONFIRMED' && bDate >= now;
                });
                setBookingsList(valid);
            }
        } catch(e) { console.error(e); }
        finally { setLoadingBookings(false); }
    };

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total, checkout, loadOrderToEdit, isEditing: !!editingOrderId }}>
            {notification && (
                <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[10000] w-full max-w-lg px-4">
                    <div className="bg-green-100 text-green-800 border-green-200 border p-4 rounded-lg shadow-lg flex justify-between items-center">
                        <span className="font-semibold">{notification.message}</span>
                        <button onClick={() => setNotification(null)} className="font-bold">&times;</button>
                    </div>
                </div>
            )}

            {children}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
                        <h3 className="text-2xl font-bold mb-2 text-center text-gray-800">
                            {editingOrderId ? `Modifica Ordine #${editingOrderId}` : 'Completa Ordine'}
                        </h3>
                        <p className="text-center text-gray-500 mb-6">Come vuoi procedere?</p>

                        {!loadingBookings && bookingsList.length === 0 ? (
                            <div className="space-y-4">
                                <button
                                    onClick={() => fetchUserBookings()}
                                    className="w-full p-4 border border-gray-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition flex items-center gap-4 group text-left"
                                >
                                    <span className="text-2xl">🍽️</span>
                                    <div>
                                        <div className="font-bold text-gray-800 group-hover:text-orange-600">Mangio al Ristorante</div>
                                        <div className="text-xs text-gray-500">Collega a una prenotazione esistente</div>
                                    </div>
                                </button>

                                <div className="border border-gray-200 rounded-xl p-4 hover:border-orange-500 transition bg-white">
                                    <div className="flex items-center gap-4 mb-3">
                                        <span className="text-2xl">🥡</span>
                                        <div>
                                            <div className="font-bold text-gray-800">Asporto</div>
                                            <div className="text-xs text-gray-500">Passo a ritirarlo</div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 mt-2">
                                        <button
                                            onClick={() => processOrder('TAKEAWAY', null, 'SAVE')}
                                            className="py-2 px-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 text-sm"
                                        >
                                            Salva Ordine
                                        </button>
                                        <button
                                            onClick={() => processOrder('TAKEAWAY', null, 'PAY')}
                                            className="py-2 px-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 text-sm"
                                        >
                                            Paga Ora
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <h4 className="font-semibold text-gray-700">Seleziona prenotazione:</h4>
                                <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                                    {bookingsList.map((b: any) => (
                                        <div key={b.id} className="border border-gray-200 rounded-xl p-4 hover:border-orange-500 transition bg-white">
                                            <div className="flex justify-between items-center mb-3">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl">🗓️</span>
                                                    <div>
                                                        <div className="font-bold text-gray-800">
                                                            {new Date(b.bookingDate).toLocaleDateString()}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {new Date(b.bookingDate).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} • {b.peopleCount} persone
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 mt-2">
                                                <button
                                                    onClick={() => processOrder('DINE_IN', b.id, 'SAVE')}
                                                    className="py-2 px-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 text-sm"
                                                >
                                                    Salva Ordine
                                                </button>
                                                <button
                                                    onClick={() => processOrder('DINE_IN', b.id, 'PAY')}
                                                    className="py-2 px-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 text-sm"
                                                >
                                                    Paga Ora
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setBookingsList([])}
                                    className="w-full py-2 text-gray-500 text-sm hover:underline"
                                >
                                    Indietro
                                </button>
                            </div>
                        )}

                        <button
                            onClick={() => { setShowModal(false); setBookingsList([]); }}
                            className="mt-6 w-full py-3 rounded-xl text-gray-500 hover:bg-gray-50 font-medium transition"
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
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};