import React, { FC, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface OrderItem {
    id: number;
    name: string;
    quantity: number;
    unitPrice: number;
    specialRequests?: string;
}

interface Order {
    id: number;
    createdAt: string;
    status: 'PENDING' | 'PREPARING' | 'COMPLETED' | 'CANCELLED';
    totalAmount: number;
    userName: string;
    userEmail: string;
    items: OrderItem[];
    paid: boolean;
    bookingId: number | null;
    orderType: 'DINE_IN' | 'TAKEAWAY';
}

const RestaurantOrders: FC = () => {
    const { token } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await fetch('http://localhost/api/orders/restaurant/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setOrders(data.data);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError("Errore caricamento ordini");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchOrders();
    }, [token]);

    const updateStatus = async (orderId: number, newStatus: string) => {
        try {
            const res = await fetch(`http://localhost/api/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            if (data.success) {
                // Optimistic update or refetch
                fetchOrders();
            } else {
                alert("Errore aggiornamento: " + data.message);
            }
        } catch (err) {
            alert("Errore di connessione");
        }
    };

    if (loading) return <div className="p-6">Caricamento ordini...</div>;
    if (error) return <div className="p-6 text-red-600">{error}</div>;

    const pendingOrders = orders.filter(o => o.status === 'PENDING');
    const activeOrders = orders.filter(o => o.status === 'PREPARING');
    const pastOrders = orders.filter(o => o.status === 'COMPLETED' || o.status === 'CANCELLED');

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Gestione Ordini</h2>

            {/* PENDING */}
            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-yellow-600">Nuovi Ordini (Pending)</h3>
                {pendingOrders.length === 0 ? <p className="text-gray-500">Nessun nuovo ordine.</p> : (
                    <div className="grid gap-4">
                        {pendingOrders.map(order => (
                            <OrderCard key={order.id} order={order} 
                                actionLabel="Inizia Preparazione"
                                onAction={() => updateStatus(order.id, 'PREPARING')}
                                color="yellow"
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* PREPARING */}
            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-blue-600">In Preparazione</h3>
                {activeOrders.length === 0 ? <p className="text-gray-500">Nessun ordine in preparazione.</p> : (
                    <div className="grid gap-4">
                        {activeOrders.map(order => (
                            <OrderCard key={order.id} order={order} 
                                actionLabel="Segna come completato"
                                onAction={() => updateStatus(order.id, 'COMPLETED')}
                                color="blue"
                            />
                        ))}
                    </div>
                )}
            </div>
            
            {/* COMPLETED */}
            <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-600">Storico (Completati)</h3>
                {pastOrders.length === 0 ? <p className="text-gray-500">Nessuno storico.</p> : (
                    <div className="grid gap-4 opacity-75">
                         {pastOrders.map(order => (
                            <OrderCard key={order.id} order={order} color="gray" />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const OrderCard = ({ order, actionLabel, onAction, color }: { order: Order, actionLabel?: string, onAction?: () => void, color: string }) => {
    const borderClass = {
        'yellow': 'border-yellow-200 bg-yellow-50',
        'blue': 'border-blue-200 bg-blue-50',
        'gray': 'border-gray-200 bg-gray-50'
    }[color] || 'border-gray-200 bg-gray-50';

    return (
        <div className={`border p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center ${borderClass}`}>
            <div>
                <div className="font-bold flex items-center gap-2">
                    Ordine #{order.id} - {order.userName} 
                    <span className="text-xs font-normal bg-white border px-2 py-0.5 rounded-full flex items-center gap-1">
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
                    {order.bookingId ? `Prenotazione #${order.bookingId} | ` : ''} 
                    {new Date(order.createdAt).toLocaleString()}
                </div>
                <div className="mt-2 text-sm">
                    {order.items.map(i => (
                        <div key={i.id}>- {i.quantity}x {i.name} {i.specialRequests && `(${i.specialRequests})`}</div>
                    ))}
                </div>
                <div className="mt-2 font-bold">Totale: €{order.totalAmount.toFixed(2)}</div>
                <div className={`mt-1 text-sm ${order.paid ? 'text-green-600 font-bold' : 'text-red-500'}`}>
                    {order.paid ? 'PAGATO' : 'NON PAGATO'}
                </div>
            </div>
            {onAction && (
                <button 
                    onClick={onAction}
                    className="mt-4 md:mt-0 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors font-semibold shadow-sm"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

export default RestaurantOrders;
