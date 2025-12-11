'use client';
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import Link from 'next/link';

interface Restaurant {
    id: number;
    lat: number;
    lon: number;
    name: string;
    slug: string;
    address: string;
    category?: string;
    image?: string;
}

// Fix per le icone di Leaflet in Next.js
const fixLeafletIcon = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete ((L.Icon.Default.prototype as unknown) as { _getIconUrl?: unknown })._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
};

export default function Map() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fixLeafletIcon();
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';

        fetch(`${baseUrl}/api/restaurants`)
            .then(res => res.json())
            .then(async (data: any[]) => {
                // 1. Mappiamo i dati iniziali
                const initialPlaces: Restaurant[] = data.map((r: any) => ({
                    id: r.id,
                    lat: r.lat,
                    lon: r.lon,
                    name: r.name,
                    slug: r.slug,
                    category: r.category,
                    address: r.address,
                    image: r.image
                }));

                // 2. Identifichiamo quelli senza coordinate (vecchi dati)
                const placesToGeocode = initialPlaces.filter(p => !p.lat || !p.lon);
                const placesWithCoords = initialPlaces.filter(p => p.lat && p.lon);

                // 3. "Piano B": Geocoding lato client per quelli che mancano
                const geocodedPlaces = await Promise.all(
                    placesToGeocode.map(async (p) => {
                        if (!p.address) return p;
                        try {
                            // Aggiungiamo "Torino" per sicurezza se manca
                            const query = p.address.toLowerCase().includes('torino')
                                ? p.address
                                : `${p.address}, Torino`;

                            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
                            const geoData = await response.json();
                            if (geoData && geoData.length > 0) {
                                return {
                                    ...p,
                                    lat: parseFloat(geoData[0].lat),
                                    lon: parseFloat(geoData[0].lon)
                                };
                            }
                        } catch (error) {
                            console.error(`Impossibile geocodificare ${p.name}:`, error);
                        }
                        return p;
                    })
                );

                // 4. Uniamo tutto e filtriamo quelli che ancora non hanno coordinate
                const allPlaces = [...placesWithCoords, ...geocodedPlaces].filter(p => p.lat && p.lon);
                setRestaurants(allPlaces);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const torinoCenter: [number, number] = [45.0703, 7.6869];

    if (loading) return <div className="text-center p-10 bg-gray-50 rounded-xl">Caricamento mappa in corso...</div>;

    return (
        <main>
            <h2 className="text-2xl font-bold text-center text-gray-800 mt-12 mb-6">
                Esplora i Ristoranti a Torino
            </h2>
            <MapContainer
                center={torinoCenter}
                zoom={13}
                style={{ height: '500px', width: '100%', borderRadius: '1rem', zIndex: 10, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />
                {restaurants.map(r => (
                    <Marker key={r.id} position={[r.lat, r.lon]}>
                        <Popup>
                            <div className="text-center min-w-[150px]">
                                <strong className="text-lg block mb-1">{r.name}</strong>
                                <span className="text-orange-600 font-medium text-xs uppercase tracking-wider block mb-2">{r.category || 'Ristorante'}</span>
                                <span className="text-gray-500 text-xs block mb-3">{r.address}</span>
                                <Link
                                    href={`/ristoranti/${r.slug}`}
                                    className="inline-block bg-orange-500 text-white text-sm py-1 px-3 rounded-lg hover:bg-orange-600 transition-colors no-underline"
                                >
                                    Vedi Menu
                                </Link>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </main>
    );
}