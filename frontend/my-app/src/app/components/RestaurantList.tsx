import { useEffect, useState } from "react";
import RestaurantCard from "./RestaurantCard";

interface Props {
    search: string;
    selectedTab: string;
}

const RestaurantList = ({ search, selectedTab }: Props) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [restaurants, setRestaurants] = useState<any[]>([]);

    useEffect(() => {
        fetch("http://localhost:8083/api/restaurants")
            .then(res => res.json())
            .then(data => setRestaurants(data))
            .catch(err => console.error("Error fetching restaurants:", err));
    }, []);

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
