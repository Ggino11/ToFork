'use client';

import { useEffect, useState } from 'react';
import './utils/fixLeafletIcon';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import dynamic from 'next/dynamic';

interface Restaurant {
    id: number;
    lat: number;
    lon: number;
    name?: string;
    opening_hours?: string;
    phone?: string;
    cuisine?: string;
}

export default function TorinoRestaurantsMap() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

    useEffect(() => {
        import('./utils/fixLeafletIcon');
        const query = `
      [out:json][timeout:25];
      area["name"="Torino"]["boundary"="administrative"]->.searchArea;
      (
        node["amenity"="restaurant"](area.searchArea);
        way["amenity"="restaurant"](area.searchArea);
        relation["amenity"="restaurant"](area.searchArea);
      );
      out center;
    `;

        fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            body: query,
        })
            .then(res => res.json())
            .then(data => {
                const places: Restaurant[] = data.elements
                    .map((el: any) => {
                        let lat = el.lat;
                        let lon = el.lon;
                        if (!lat && el.center) {
                            lat = el.center.lat;
                            lon = el.center.lon;
                        }
                        return {
                            id: el.id,
                            lat,
                            lon,
                            name: el.tags?.name,
                            opening_hours: el.tags?.opening_hours,
                            phone: el.tags?.phone || el.tags?.['contact:phone'],
                            website: el.tags?.website,
                            cuisine: el.tags?.cuisine,
                        };
                    })
                    .filter((el: any) => el.lat && el.lon && el.name)
                    .slice(0, 50); // prendi solo i primi 50

                setRestaurants(places);
            })
            .catch(console.error);
    }, []);

    const torinoCenter: [number, number] = [45.0703, 7.6869];

    return (
        <main>
            <h1 className="mappa-centro" style={{ color: 'black', marginTop: '50px', marginBottom:'10px' }}>I nostri ristoranti a Torino</h1>
            <MapContainer className="mappa-centro" center={torinoCenter} zoom={13} style={{ height: '600px', width: '80%', position:'center' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
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
        </main>
    );
}

