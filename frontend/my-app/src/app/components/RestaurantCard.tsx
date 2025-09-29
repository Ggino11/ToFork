interface Restaurant {
    name: string;
    address: string;
    description: string;
    image: string;
}

const RestaurantCard = ({ restaurant }: { restaurant: Restaurant }) => (
    <div className="restaurant-card">
        <img src={restaurant.image} className="card-img" alt={restaurant.name} />
        <div className="card-content">
            <h3>{restaurant.name}</h3>
            <span className="address">{restaurant.address}</span>
            <p className="description">{restaurant.description}</p>
        </div>
    </div>
);

export default RestaurantCard;
