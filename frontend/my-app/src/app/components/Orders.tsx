import React, { FC, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { Trash2, Edit2, CreditCard, ShoppingBag, Utensils } from 'lucide-react'; // Assicurati di avere lucide-react installato

interface OrderItem {
    menuItemId: number;
    name: string;
    quantity: number;
    unitPrice: number;
}

interface Order {
    id: number;
    restaurantId: number;
    restaurantName: string;
    status: string;
    totalAmount: number;
    createdAt: string;
    items: OrderItem[];
    paid: boolean;
    orderType: 'DINE_IN' | 'TAKEAWAY';
}

const Orders: FC = () => {
    const { token } = useAuth();
    const { loadOrderToEdit } = useCart();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    // Fetch ordini
    const fetchOrders = async () => {
        if (!token) return;
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';
            const res = await fetch(`${baseUrl}/api/orders/user/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setOrders(data.data);
            }
        } catch (err) {
            console.error("Error fetching orders", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [token]);

    // Gestione redirect Stripe
    useEffect(() => {
        if (!token) return;
        const sessionId = searchParams.get('session_id');
        const canceled = searchParams.get('canceled');

        if (canceled) {
            setPaymentStatus({ type: 'error', message: 'Pagamento annullato.' });
            router.replace('/profile?tab=orders');
        } else if (sessionId) {
            verifyPayment(sessionId);
        }
    }, [searchParams, token]);

    const verifyPayment = async (sessionId: string) => {
        setPaymentStatus({ type: 'info', message: 'Verifica pagamento in corso...' });
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';
            const res = await fetch(`${baseUrl}/api/payments/success?session_id=${sessionId}`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setPaymentStatus({ type: 'success', message: 'Pagamento completato con successo!' });
                fetchOrders();
            } else {
                setPaymentStatus({ type: 'error', message: 'Errore durante la verifica.' });
            }
        } catch (e) {
            setPaymentStatus({ type: 'error', message: 'Errore di connessione.' });
        } finally {
            router.replace('/profile?tab=orders');
        }
    };

    const handlePay = async (orderId: number, amount: number) => {
        if (!token) return;
        const returnUrl = window.location.origin + '/profile?tab=orders';
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';

        try {
            const res = await fetch(`${baseUrl}/api/payments/checkout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    orderId,
                    amount,
                    successUrl: returnUrl + '&session_id={CHECKOUT_SESSION_ID}',
                    cancelUrl: returnUrl + '&canceled=1'
                })
            });

            if (res.ok) {
                const data = await res.json();
                if (data.checkoutUrl) window.location.href = data.checkoutUrl;
            } else {
                alert("Errore inizializzazione pagamento");
            }
        } catch (e) {
            alert("Errore di rete");
        }
    };

    const handleEdit = (order: Order) => {
        if (confirm(`Vuoi modificare l'ordine #${order.id}? Verrà caricato nel carrello.`)) {
            loadOrderToEdit(order.id, order.items, order.restaurantId, order.restaurantName);
        }
    };

    // --- NUOVA FUNZIONE ELIMINA ---
    const handleDelete = async (orderId: number) => {
        if (!confirm("Sei sicuro di voler eliminare questo ordine?")) return;

        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';
            const res = await fetch(`${baseUrl}/api/orders/${orderId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();

            if (data.success) {
                // Rimuovi localmente l'ordine eliminato
                setOrders(prev => prev.filter(o => o.id !== orderId));
            } else {
                alert("Errore eliminazione: " + data.message);
            }
        } catch (e) {
            console.error(e);
            alert("Errore di connessione");
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Caricamento ordini...</div>;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[400px]">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-800">I miei Ordini</h3>
                <span className="text-sm text-gray-500">{orders.length} ordini totali</span>
            </div>

            {paymentStatus && (
                <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2 ${
                    paymentStatus.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
                        paymentStatus.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
                            'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                    {paymentStatus.message}
                </div>
            )}

            {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl">
                    <ShoppingBag className="w-12 h-12 mb-3 opacity-20" />
                    <p>Nessun ordine effettuato.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => (
                        <div key={order.id} className="group border border-gray-100 p-5 rounded-2xl bg-white hover:border-orange-200 hover:shadow-md transition-all duration-300">
                            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">

                                {/* Info Ordine */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                        <span className="font-bold text-lg text-gray-900">Ordine #{order.id}</span>

                                        {/* Badge Stato */}
                                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-extrabold uppercase tracking-wide ${getStatusColor(order.status)}`}>
                                            {order.status === 'PENDING' ? 'PENDING' : order.status}
                                        </span>

                                        {/* Badge Tipo Ordine (Stile Uniforme) */}
                                        <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 font-bold border border-gray-200">
                                            {order.orderType === 'DINE_IN' ? (
                                                <><Utensils className="w-3 h-3" /> Tavolo</>
                                            ) : (
                                                <><ShoppingBag className="w-3 h-3" /> Asporto</>
                                            )}
                                        </span>
                                    </div>

                                    <div className="text-sm text-gray-500 mb-3 flex items-center gap-2">
                                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                        <span className="font-medium text-gray-700">{order.restaurantName || "Ristorante"}</span>
                                    </div>

                                    <div className="text-sm text-gray-700">
                                        <span className="font-medium">{order.items.length} articoli</span>
                                        <span className="mx-2 text-gray-300">|</span>
                                        Totale: <span className="font-bold text-orange-600 text-lg">€{order.totalAmount.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Bottoni Azione */}
                                <div className="flex items-center gap-2 w-full lg:w-auto mt-2 lg:mt-0">
                                    {!order.paid && order.status === 'PENDING' && (
                                        <>
                                            {/* Elimina */}
                                            <button
                                                onClick={() => handleDelete(order.id)}
                                                className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                                title="Elimina Ordine"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>

                                            {/* Modifica */}
                                            <button
                                                onClick={() => handleEdit(order)}
                                                className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 font-semibold transition-all text-sm"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                                Modifica
                                            </button>

                                            {/* Paga Ora */}
                                            <button
                                                onClick={() => handlePay(order.id, order.totalAmount)}
                                                className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 font-bold shadow-lg shadow-orange-200 hover:shadow-xl transition-all text-sm transform hover:-translate-y-0.5"
                                            >
                                                <CreditCard className="w-4 h-4" />
                                                Paga Ora
                                            </button>
                                        </>
                                    )}

                                    {(order.paid || order.status !== 'PENDING') && (
                                        <div className="px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
                                            <span className={`font-bold text-sm ${order.status === 'CANCELLED' ? 'text-red-500' : 'text-green-600'}`}>
                                                {order.status === 'CANCELLED' ? 'ANNULLATO' : 'PAGAMENTO OK'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const getStatusColor = (status: string) => {
    const colors: {[key: string]: string} = {
        'PENDING': 'bg-yellow-100 text-yellow-700 border border-yellow-200',
        'PREPARING': 'bg-blue-100 text-blue-700 border border-blue-200',
        'COMPLETED': 'bg-green-100 text-green-700 border border-green-200',
        'CANCELLED': 'bg-red-100 text-red-700 border border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
}

export default Orders;