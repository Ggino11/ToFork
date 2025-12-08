'use client';
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

interface Restaurant {
    id: number;
    lat: number;
    lon: number;
    name?: string;
    address?: string;
    opening_hours?: string;
    phone?: string;
    cuisine?: string;
    website?: string;
}

const fixLeafletIcon = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete ((L.Icon.Default.prototype as unknown) as { _getIconUrl?: unknown })._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
};

export default function MapComponent() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

    useEffect(() => {
        fixLeafletIcon();
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';
        fetch(`${baseUrl}/api/restaurants`)
            .then(res => res.json())
            .then(async (data: any[]) => {
                // 1. Map initial data
                const initialPlaces: Restaurant[] = data.map((r: any) => ({
                    id: r.id,
                    lat: r.lat,
                    lon: r.lon,
                    name: r.name,
                    cuisine: r.category,
                    address: r.address // Store address for geocoding
                }));

                // 2. Identify places needing geocoding
                const placesToGeocode = initialPlaces.filter(p => !p.lat || !p.lon);
                const placesWithCoords = initialPlaces.filter(p => p.lat && p.lon);

                // 3. Geocode missing ones
                const geocodedPlaces = await Promise.all(
                    placesToGeocode.map(async (p) => {
                        if (!p.address) return p;
                        try {
                            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(p.address)}`);
                            const geoData = await response.json();
                            if (geoData && geoData.length > 0) {
                                return {
                                    ...p,
                                    lat: parseFloat(geoData[0].lat),
                                    lon: parseFloat(geoData[0].lon)
                                };
                            }
                        } catch (error) {
                            console.error(`Failed to geocode ${p.name}:`, error);
                        }
                        return p;
                    })
                );

                // 4. Combine and set state (filtering out those that still failed)
                const allPlaces = [...placesWithCoords, ...geocodedPlaces].filter(p => p.lat && p.lon);
                setRestaurants(allPlaces);
            })
            .catch(console.error);
    }, []);

    const torinoCenter: [number, number] = [45.0703, 7.6869];

    return (
        <MapContainer
            className="mappa-centro"
            center={torinoCenter}
            zoom={13}
            style={{ height: '600px', width: '80%', margin: '0 auto' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png}"
                attribution="&copy; OpenStreetMap contributors"
            />
            {restaurants.map(r => (
                <Marker key={r.id} position={[r.lat, r.lon]}>
                    <Popup>
                        <strong>{r.name}</strong><br />
                        {r.cuisine && <>🍽 {r.cuisine}<br /></>}
                        {r.opening_hours && <>🕒 {r.opening_hours}<br /></>}
                        {r.phone && <>📞 {r.phone}<br /></>}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}