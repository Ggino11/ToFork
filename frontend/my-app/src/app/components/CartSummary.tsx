import React from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Trash2 } from 'lucide-react';

const CartSummary = () => {
    const { items, total, checkout, removeItem } = useCart();

    if (items.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 bg-white p-4 rounded-2xl shadow-2xl border border-orange-100 z-50 w-80 animate-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between mb-3 border-b pb-2">
                <h4 className="font-bold text-gray-800 flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2 text-orange-500" />
                    Il tuo ordine
                </h4>
                <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full">{items.length} piatti</span>
            </div>
            <div className="max-h-40 overflow-y-auto space-y-2 mb-3">
                {items.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-sm group text-gray-900">
                        <div className="flex-1 flex justify-between mr-2">
                            <span className="text-gray-900 truncate">{item.quantity}x {item.title}</span>
                            <span className="font-semibold">€{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                        <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Rimuovi"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
            <div className="flex justify-between items-center font-bold text-lg mb-4 text-gray-900">
                <span>Totale</span>
                <span className="text-orange-600">€{total.toFixed(2)}</span>
            </div>
            <button
                onClick={checkout}
                className="w-full bg-orange-600 text-white font-bold py-2 rounded-xl hover:bg-orange-700 transition-colors shadow-md"
            >
                Completa Ordine
            </button>
        </div>
    );
};

export default CartSummary;
