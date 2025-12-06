import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, Users, CheckCircle, XCircle, AlertCircle, Phone, MessageSquare } from 'lucide-react';

interface Booking {
    id: number;
    userId: number;
    userName: string;
    userEmail: string;
    bookingDate: string;
    peopleCount: number;
    status: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';
    specialRequests?: string;
    phoneNumber?: string;
}

const RestaurantBookings = () => {
    const { user, token } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [restaurantId, setRestaurantId] = useState<number | null>(null);

    useEffect(() => {
        // First get restaurant ID owned by user
        if (user) {
            fetchRestaurantId();
        }
    }, [user]);

    const fetchRestaurantId = async () => {
        try {
            // Assuming endpoint to get owner's restaurant
            const res = await fetch(`http://localhost:8083/api/restaurants/owner/${user?.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data && data.length > 0) {
                const rId = data[0].id;
                setRestaurantId(rId);
                fetchBookings(rId);
            } else {
                setLoading(false);
                setError("Nessun ristorante associato a questo account.");
            }
        } catch (err) {
            console.error(err);
            setLoading(false);
            setError("Errore nel recupero del ristorante.");
        }
    };

    const fetchBookings = async (rId: number) => {
        try {
            // Fetch bookings for this restaurant
            // Using Port 80
            const res = await fetch(`http://localhost/api/bookings/restaurant/${rId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setBookings(data.data);
            } else {
                setError(data.message || "Errore caricamento prenotazioni");
            }
        } catch (err) {
            console.error(err);
            setError("Errore di connessione API");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (bookingId: number, newStatus: 'CONFIRMED' | 'REJECTED') => {
        try {
            const res = await fetch(`http://localhost/api/bookings/${bookingId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            
            if (data.success) {
                // Update local state
                setBookings(prev => prev.map(b => 
                    b.id === bookingId ? { ...b, status: newStatus } : b
                ));
            } else {
                alert(`Errore: ${data.message}`);
            }
        } catch (err) {
            console.error(err);
            alert("Errore di connessione durante l'aggiornamento.");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'CONFIRMED': return 'bg-green-100 text-green-800 border-green-200';
            case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
            case 'CANCELLED': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'PENDING': return 'In Attesa';
            case 'CONFIRMED': return 'Confermata';
            case 'REJECTED': return 'Rifiutata';
            case 'CANCELLED': return 'Cancellata';
            case 'COMPLETED': return 'Completata';
            default: return status;
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Caricamento prenotazioni...</div>;

    // Group bookings by status sort of, or just list pending first
    const pendingBookings = bookings.filter(b => b.status === 'PENDING').sort((a,b) => new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime());
    const otherBookings = bookings.filter(b => b.status !== 'PENDING').sort((a,b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestione Prenotazioni</h1>

            {error && (
                <div className="bg-red-50 p-4 rounded-lg text-red-700 flex items-center mb-6">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    {error}
                </div>
            )}

            {/* PENDING SECTION */}
            <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
                <div className="bg-orange-50 px-6 py-4 border-b border-orange-100 flex justify-between items-center">
                    <h2 className="font-bold text-lg text-orange-800 flex items-center">
                        <Clock className="w-5 h-5 mr-2" />
                        Richieste in Attesa ({pendingBookings.length})
                    </h2>
                </div>
                
                {pendingBookings.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        Nessuna richiesta in attesa al momento.
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {pendingBookings.map(booking => (
                            <div key={booking.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-orange-50/30 transition-colors">
                                <div className="space-y-2 mb-4 md:mb-0">
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-lg text-gray-900">{booking.userName}</span>
                                        <span className="text-sm text-gray-500">{booking.userEmail}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-gray-600 text-sm">
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-1 text-orange-500" />
                                            {new Date(booking.bookingDate).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}
                                        </div>
                                        <div className="flex items-center">
                                            <Clock className="w-4 h-4 mr-1 text-orange-500" />
                                            {new Date(booking.bookingDate).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <div className="flex items-center">
                                            <Users className="w-4 h-4 mr-1 text-orange-500" />
                                            {booking.peopleCount} persone
                                        </div>
                                    </div>
                                    {booking.specialRequests && (
                                        <div className="bg-yellow-50 text-yellow-800 text-sm p-2 rounded-lg flex items-start border border-yellow-200 mt-2">
                                            <MessageSquare className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                                            "{booking.specialRequests}"
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleStatusUpdate(booking.id, 'REJECTED')}
                                        className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium transition-colors flex items-center"
                                    >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Rifiuta
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(booking.id, 'CONFIRMED')}
                                        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-bold shadow-md hover:shadow-lg transition-all flex items-center"
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Accetta
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* HISTORY SECTION */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="font-bold text-lg text-gray-800">Storico Prenotazioni</h2>
                </div>
                {otherBookings.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                         Nessuna prenotazione passata.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-gray-700 font-semibold uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3">Cliente</th>
                                    <th className="px-6 py-3">Data e Ora</th>
                                    <th className="px-6 py-3">Persone</th>
                                    <th className="px-6 py-3">Stato</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {otherBookings.map(booking => (
                                    <tr key={booking.id} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{booking.userName}</td>
                                        <td className="px-6 py-4">
                                            {new Date(booking.bookingDate).toLocaleString('it-IT')}
                                        </td>
                                        <td className="px-6 py-4">{booking.peopleCount}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getStatusColor(booking.status)}`}>
                                                {getStatusLabel(booking.status)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RestaurantBookings;
