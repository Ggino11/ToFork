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
        <div className="bg-gray-50 p-6 rounded-xl min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Gestione Ordini</h2>
                <span className="text-sm font-medium px-4 py-2 bg-white rounded-full shadow-sm text-gray-500 border border-gray-100">
                    Sincronizzazione automatica
                </span>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* PENDING COLUMN */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 h-fit">
                    <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                            In Attesa
                        </h3>
                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-xs font-bold">{pendingOrders.length}</span>
                    </div>
                    
                    <div className="space-y-4">
                        {pendingOrders.length === 0 ? <p className="text-gray-400 text-sm text-center py-4">Nessun ordine.</p> : 
                             pendingOrders.map(order => (
                                <OrderCard key={order.id} order={order} 
                                    actionLabel="Prepara"
                                    onAction={() => updateStatus(order.id, 'PREPARING')}
                                    variant="pending"
                                />
                            ))
                        }
                    </div>
                </div>

                {/* PREPARING COLUMN */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 h-fit">
                    <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                            In Cucina
                        </h3>
                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-xs font-bold">{activeOrders.length}</span>
                    </div>

                    <div className="space-y-4">
                        {activeOrders.length === 0 ? <p className="text-gray-400 text-sm text-center py-4">Nessun ordine in cucina.</p> : 
                             activeOrders.map(order => (
                                <OrderCard key={order.id} order={order} 
                                    actionLabel="Completa"
                                    onAction={() => updateStatus(order.id, 'COMPLETED')}
                                    variant="preparing"
                                />
                            ))
                        }
                    </div>
                </div>

                {/* PAST COLUMN */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 h-fit">
                    <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
                         <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            Completati
                        </h3>
                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-xs font-bold">{pastOrders.length}</span>
                    </div>

                    <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
                        {pastOrders.length === 0 ? <p className="text-gray-400 text-sm text-center py-4">Cronologia vuota.</p> : 
                             pastOrders.map(order => (
                                <OrderCard key={order.id} order={order} variant="completed" />
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

const OrderCard = ({ order, actionLabel, onAction, variant }: { order: Order, actionLabel?: string, onAction?: () => void, variant: 'pending' | 'preparing' | 'completed' }) => {
    
    // Status Styles
    const isPaid = order.paid;

    return (
        <div className={`
            relative p-4 rounded-xl border border-gray-100 bg-white transition-all duration-200
            ${variant !== 'completed' ? 'hover:shadow-md hover:border-orange-200' : 'opacity-75 hover:opacity-100'}
        `}>
            {/* Header: ID + Time */}
            <div className="flex justify-between items-start mb-3">
                <div>
                     <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">#{order.id}</span>
                     <h4 className="font-bold text-gray-900 leading-tight">{order.userName}</h4>
                </div>
                <div className="text-right">
                     <span className="block text-xs font-medium text-gray-500">{new Date(order.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                     {order.bookingId && <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">Tavolo</span>}
                </div>
            </div>

            {/* Type Badge */}
            <div className="flex items-center gap-2 mb-3">
                 <span className={`
                    text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1.5
                    ${order.orderType === 'TAKEAWAY' ? 'bg-orange-50 text-orange-700' : 'bg-purple-50 text-purple-700'}
                 `}>
                    {order.orderType === 'TAKEAWAY' ? (
                        <>
                             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                             Asporto
                        </>
                    ) : (
                         <>
                             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                             Al Tavolo
                        </>
                    )}
                 </span>

                 <span className={`
                    text-xs font-bold px-2 py-1 rounded-md border
                    ${isPaid ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}
                 `}>
                    {isPaid ? 'PAGATO' : 'NON PAGATO'}
                 </span>
            </div>
            
            {/* Divider */}
            <div className="h-px bg-gray-100 my-3"></div>

            {/* Items */}
            <ul className="space-y-1.5 mb-4">
                {order.items.map(i => (
                    <li key={i.id} className="text-sm text-gray-700 flex justify-between items-start">
                        <span className="font-medium">
                            <span className="text-gray-400 mr-1">{i.quantity}x</span>
                            {i.name}
                        </span>
                        {/* <span className="text-gray-400 text-xs">€{i.unitPrice}</span> */}
                    </li>
                ))}
            </ul>

            {/* Footer & Action */}
            <div className="flex items-center justify-between mt-4 md:mt-auto pt-2">
                <div className="text-lg font-bold text-gray-900">€{order.totalAmount.toFixed(2)}</div>
                
                {onAction && (
                    <button 
                        onClick={onAction}
                        className={`
                            px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-sm transition-all transform active:scale-95
                            ${variant === 'pending' ? 'bg-orange-600 hover:bg-orange-700 hover:shadow-orange-200 hover:shadow-md' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200 hover:shadow-md'}
                        `}
                    >
                        {actionLabel}
                    </button>
                )}
            </div>
        </div>
    );
};

export default RestaurantOrders;
