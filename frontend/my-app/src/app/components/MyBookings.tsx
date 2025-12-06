import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, Users, MapPin, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface Booking {
    id: number;
    restaurantName: string;
    bookingDate: string;
    peopleCount: number;
    status: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';
    specialRequests?: string;
}

const MyBookings = () => {
    const { user, token } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            fetchMyBookings();
        }
    }, [user]);

    const fetchMyBookings = async () => {
        try {
            // Using Port 80 (Gateway)
            const res = await fetch(`http://localhost/api/bookings/user/${user?.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await res.json();
            if (data.success) {
                setBookings(data.data);
            } else {
                setError(data.message || 'Errore nle caricamento prenotazioni');
            }
        } catch (err) {
            console.error(err);
            setError('Errore di connessione');
        } finally {
            setLoading(false);
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

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PENDING': return <Clock className="w-4 h-4 mr-1" />;
            case 'CONFIRMED': return <CheckCircle className="w-4 h-4 mr-1" />;
            case 'REJECTED': return <XCircle className="w-4 h-4 mr-1" />;
            default: return null;
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

    if (loading) return <div className="text-center py-10 text-gray-500">Caricamento prenotazioni...</div>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                <Calendar className="w-6 h-6 mr-2 text-orange-500" />
                Le Mie Prenotazioni
            </h2>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    {error}
                </div>
            )}

            {bookings.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                    <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">Non hai ancora effettuato prenotazioni.</p>
                    <a href="/" className="text-orange-600 font-semibold mt-2 inline-block hover:underline">
                        Trova un ristorante
                    </a>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 mb-1">{booking.restaurantName}</h3>
                                    <div className="text-sm text-gray-500 flex items-center mb-1">
                                        <Calendar className="w-4 h-4 mr-1" />
                                        {new Date(booking.bookingDate).toLocaleDateString('it-IT', { 
                                            weekday: 'long', 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}
                                    </div>
                                    <div className="text-sm text-gray-500 flex items-center">
                                        <Clock className="w-4 h-4 mr-1" />
                                        {new Date(booking.bookingDate).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                                        <span className="mx-2">•</span>
                                        <Users className="w-4 h-4 mr-1" />
                                        {booking.peopleCount} persone
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center ${getStatusColor(booking.status)}`}>
                                    {getStatusIcon(booking.status)}
                                    {getStatusLabel(booking.status)}
                                </div>
                            </div>
                            {booking.specialRequests && (
                                <div className="mt-3 text-sm bg-gray-50 p-3 rounded-lg text-gray-600 italic">
                                    "{booking.specialRequests}"
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
