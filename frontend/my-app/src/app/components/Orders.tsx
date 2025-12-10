import React, { FC, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';

interface OrderItem {
    id: number;
    name: string;
    quantity: number;
    unitPrice: number;
}

interface Order {
    id: number;
    bookingId: number;
    restaurantId: number;
    status: string;
    totalAmount: number;
    createdAt: string;
    items: OrderItem[];
    paid: boolean;
    orderType: 'DINE_IN' | 'TAKEAWAY';
}

const Orders: FC = () => {
    const { token } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    // Fetch ordini
    const fetchOrders = async () => {
        if (!token) return;
        try {
            const res = await fetch('http://localhost/api/orders/user/me', {
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

    // Gestione redirect da Stripe
    useEffect(() => {
        if (!token) return;

        const sessionId = searchParams.get('session_id');
        const canceled = searchParams.get('canceled');

        if (canceled) {
            setPaymentStatus({ type: 'error', message: 'Pagamento annullato.' });
            // Rimuovi query param
            router.replace(window.location.pathname);
        }
        else if (sessionId) {
            verifyPayment(sessionId);
        }
    }, [searchParams, token]);

    const verifyPayment = async (sessionId: string) => {
        setPaymentStatus({ type: 'info', message: 'Verifica pagamento in corso...' });
        try {
            const res = await fetch(`http://localhost/api/payments/success?session_id=${sessionId}`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (res.ok) {
                const payment = await res.json();
                setPaymentStatus({ type: 'success', message: 'Pagamento completato con successo!' });
                fetchOrders(); // Ricarica ordini
            } else {
                setPaymentStatus({ type: 'error', message: 'Errore durante la verifica del pagamento.' });
            }
        } catch (e) {
            setPaymentStatus({ type: 'error', message: 'Errore di connessione.' });
        } finally {
            // Pulisci URL
            router.replace(window.location.pathname);
        }
    };

    const handlePay = async (orderId: number, amount: number) => {
        if (!token) return;

        // URL corrente per ritorno
        const returnUrl = window.location.href.split('?')[0]; 

        try {
            const res = await fetch('http://localhost/api/payments/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    orderId,
                    amount,
                    successUrl: returnUrl + '?success=1', // Stripe aggiungerà &session_id=...
                    cancelUrl: returnUrl + '?canceled=1'
                })
            });

            if (res.ok) {
                const data = await res.json();
                if (data.checkoutUrl) {
                    window.location.href = data.checkoutUrl;
                }
            } else {
                alert("Errore inizializzazione pagamento");
            }
        } catch (e) {
            alert("Errore di rete");
        }
    };

    if (loading) return <div className="p-4">Caricamento ordini...</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">I miei Ordini</h3>
            
            {paymentStatus && (
                <div className={`mb-4 p-4 rounded ${
                    paymentStatus.type === 'success' ? 'bg-green-100 text-green-700' :
                    paymentStatus.type === 'error' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                }`}>
                    {paymentStatus.message}
                </div>
            )}

            {orders.length === 0 ? (
                <p className="text-gray-500">Nessun ordine effettuato.</p>
            ) : (
                <div className="grid gap-4">
                    {orders.map(order => (
                        <div key={order.id} className="border p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50">
                            <div>
                                <div className="font-bold text-lg">
                                    Ordine #{order.id}
                                    <span className={`ml-2 text-sm px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                    <span className="ml-2 text-sm px-2 py-1 rounded-full bg-gray-200 text-gray-800 flex items-center gap-1">
                                        {order.orderType === 'DINE_IN' ? (
                                            <>
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                                                Tavolo
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                                                Asporto
                                            </>
                                        )}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-600">
                                    {new Date(order.createdAt).toLocaleDateString()} alle {new Date(order.createdAt).toLocaleTimeString()}
                                </div>
                                <div className="mt-2 text-sm">
                                    {order.items.length} articoli - Totale: <span className="font-bold">€{order.totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                            
                            <div className="mt-4 md:mt-0 flex flex-col items-end gap-2">
                                {!order.paid && order.status !== 'CANCELLED' ? (
                                    <button 
                                        onClick={() => handlePay(order.id, order.totalAmount)}
                                        className="bg-orange-500 text-white px-4 py-2 rounded text-sm hover:bg-orange-600 font-semibold shadow-sm"
                                    >
                                        Paga Ora
                                    </button>
                                ) : (
                                    <span className={`font-bold text-sm ${order.status === 'CANCELLED' ? 'text-red-600' : 'text-green-600'}`}>
                                        {order.status === 'CANCELLED' ? 'ANNULLATO' : 'PAGATO'}
                                    </span>
                                )}
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
        'PENDING': 'bg-yellow-100 text-yellow-800',
        'PREPARING': 'bg-blue-100 text-blue-800',
        'COMPLETED': 'bg-green-100 text-green-800',
        'CANCELLED': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
}

export default Orders;