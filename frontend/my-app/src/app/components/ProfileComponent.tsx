'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Upload, ChevronDown, Check } from 'lucide-react';

interface Restaurant {
    id: number;
    name: string;
    slug: string;
    address: string;
    description: string;
    image: string;
    category: string;
    averagePrice: number;
    ownerId: number;
}

const CATEGORIES = [
    "Italian", "Pizza", "Sushi", "Burgers & Fast Food", "Indian", "Chinese", "Mexican", "Vegetarian"
];

const ProfileComponent = () => {
    const { user, token } = useAuth();
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        description: '',
        image: '',
        category: '',
        averagePrice: 0
    });

    useEffect(() => {
        if (user?.id) {
            fetch(`http://localhost:8083/api/restaurants/owner/${user.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(res => res.json())
            .then((data: Restaurant[]) => {
                if (data && data.length > 0) {
                    const r = data[0];
                    setRestaurant(r);
                    setFormData({
                        name: r.name,
                        address: r.address,
                        description: r.description || '',
                        image: r.image || '',
                        category: r.category || '',
                        averagePrice: r.averagePrice || 0
                    });
                }
            })
            .catch(err => {
                console.error(err);
                setError('Impossibile caricare i dati del ristorante');
            })
            .finally(() => setLoading(false));
        }
    }, [user, token]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'averagePrice' ? parseFloat(value) : value
        }));
    };

    const handleImageUpload = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({ ...prev, image: reader.result as string }));
        };
        reader.readAsDataURL(file);
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => setIsDragging(false);

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleImageUpload(e.dataTransfer.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!restaurant) return;

        try {
            const res = await fetch(`http://localhost:8083/api/restaurants/${restaurant.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ...restaurant, ...formData })
            });

            if (!res.ok) throw new Error('Errore durante l\'aggiornamento');

            const updatedRestaurant = await res.json();
            setRestaurant(updatedRestaurant);
            setSuccessMessage('Profilo aggiornato con successo!');
        } catch (err) {
            console.error(err);
            setError('Si è verificato un errore durante il salvataggio.');
        }
    };

    if (loading) return <div className="text-center p-10">Caricamento profilo...</div>;
    if (!restaurant) return <div className="text-center p-10">Nessun ristorante trovato.</div>;

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Profilo Ristorante</h2>
            
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
            {successMessage && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{successMessage}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nome */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome Ristorante</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                            required
                        />
                    </div>

                    {/* Categoria Custom Dropdown Style */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                        <div className="relative">
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full p-3 pr-10 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white transition-all cursor-pointer"
                            >
                                <option value="">Seleziona categoria</option>
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none h-5 w-5" />
                        </div>
                    </div>

                    {/* Prezzo Medio */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Prezzo Medio (€)</label>
                        <input
                            type="number"
                            name="averagePrice"
                            value={formData.averagePrice}
                            onChange={handleChange}
                            min="0"
                            step="0.50"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                        />
                    </div>

                    {/* Indirizzo */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Indirizzo</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                            required
                        />
                    </div>

                    {/* Descrizione */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descrizione</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                        />
                    </div>

                    {/* Image Drag & Drop */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Foto Profilo</label>
                        <div 
                            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                                isDragging ? 'border-orange-500 bg-orange-50' : 'border-gray-300 hover:border-orange-400'
                            }`}
                            onDragOver={onDragOver}
                            onDragLeave={onDragLeave}
                            onDrop={onDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*"
                                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                            />
                            
                            {formData.image ? (
                                <div className="relative inline-block group">
                                    <img src={formData.image} alt="Preview" className="h-48 w-full object-cover rounded-lg shadow-md" />
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                        <p className="text-white font-medium">Clicca o trascina per cambiare</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center text-gray-500">
                                    <Upload className="h-12 w-12 mb-3 text-gray-400" />
                                    <p className="font-medium">Clicca per caricare o trascina un'immagine qui</p>
                                    <p className="text-sm text-gray-400 mt-1">PNG, JPG fino a 5MB</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-6">
                    <button
                        type="submit"
                        className="w-full md:w-auto px-8 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg"
                    >
                        Salva Modifiche
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileComponent;
