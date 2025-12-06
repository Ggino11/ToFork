'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

        try {
            const response = await fetch('http://localhost/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId: user.id,
                    userEmail: user.email || "user@example.com", // Fallback
                    userName: (user.firstName && user.lastName) ? `${user.firstName} ${user.lastName}` : "Cliente", // Fallback
                    restaurantId: restaurantId,
                    restaurantName: restaurantName,
                    deliveryAddress: "Tavolo / Asporto", // Simplified for now
                    phoneNumber: "0000000000", // Simplified
                    items: items.map(i => ({
                        foodItemId: i.id,
                        foodItemName: i.title,
                        quantity: i.quantity,
                        unitPrice: i.price,
                        specialRequests: ""
                    })),
                    deliveryFee: 0,
                    taxAmount: 0
                })
            });

            if (response.ok) {
                const orderData = await response.json();
                // Check if response is wrapped in ApiResponse
                const orderId = orderData.data ? orderData.data.id : orderData.id;
                
                alert("Ordine creato! Reindirizzamento al pagamento...");
                clearCart();
                
                // Redirect to payment page
                window.location.href = `/checkout/payment?orderId=${orderId}&amount=${total}`;
            } else {
                const errorData = await response.json();
                alert(`Errore durante l'ordine: ${errorData.message || 'Riprova più tardi'}`);
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Errore di connessione durante il checkout.");
        }
    };

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total, checkout }}>
            {children}
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
