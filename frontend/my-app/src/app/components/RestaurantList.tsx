import { useEffect, useState } from "react";
import RestaurantCard from "./RestaurantCard";

interface Props {
    search: string;
    selectedTab: string;
}

const RestaurantList = ({ search, selectedTab }: Props) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [restaurants, setRestaurants] = useState<any[]>([]);

    // MODIFICA: Usiamo la variabile d'ambiente o il dominio dell'Ingress
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://tofork.local';

    useEffect(() => {
        // MODIFICA: Fetch dinamica attraverso il Gateway
        fetch(`${baseUrl}/api/restaurants`)
            .then(res => res.json())
            .then(data => {
                // Gestione sicurezza: se data non è un array (es. errore server), metti array vuoto
                const list = Array.isArray(data) ? data : [];
                setRestaurants(list);
            })
            .catch(err => console.error("Error fetching restaurants:", err));
    }, [baseUrl]);

    return (
        <div className="restaurant-list">
            {restaurants
                .filter(r =>
                    (selectedTab === "" || r.category === selectedTab) &&
                    r.name.toLowerCase().includes(search.toLowerCase())
                )
                .map(r => <RestaurantCard key={r.id} restaurant={r} />)
            }
        </div>
    );
};

export default RestaurantList;