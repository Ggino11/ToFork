'use client';
import dynamic from 'next/dynamic';

// Importa il componente mappa solo lato client (disabilita SSR)
const MapComponent = dynamic(() => import('./MapComponent'), {
    ssr: false,
    loading: () => (
        <div style={{
            height: '600px',
            width: '80%',
            margin: '50px auto 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f0f0f0',
            borderRadius: '8px'
        }}>
            <p>Caricamento mappa...</p>
        </div>
    )
});

export default function OsmPage() {
    return (
        <main>
            <h1 className="mappa-centro" style={{ color: 'black', marginTop: '50px', marginBottom:'10px' }}>
                I nostri ristoranti a Torino
            </h1>
            <MapComponent />
        </main>
    );
}