import RestaurantCard from "./RestaurantCard";
import restaurants from "./restaurantsData";

interface Props {
    search: string;
    selectedTab: string;
}

const RestaurantList = ({ search, selectedTab }: Props) => (
    <div className="restaurant-list">
        {restaurants
            .filter(r =>
                    (selectedTab === "" || r.category === selectedTab) &&
                    r.name.toLowerCase().includes(search.toLowerCase())
            )
            .map(r => <RestaurantCard key={r.name} restaurant={r} />)
        }
    </div>
);

export default RestaurantList;
