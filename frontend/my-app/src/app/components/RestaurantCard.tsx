import Link from "next/link";
import Image from "next/image";

interface Restaurant {
    name: string;
    slug: string;
    address: string;
    description: string;
    image: string;
    averagePrice?: number;
    discount?: number;
}

const RestaurantCard = ({ restaurant }: { restaurant: Restaurant }) => (
    <Link href={`/ristoranti/${restaurant.slug}`} className="block">
        <div className="flex bg-orange-500 rounded-2xl shadow-lg overflow-hidden border border-orange-400 transition-transform duration-300 hover:scale-[1.02] hover:shadow-orange-400/20 cursor-pointer">
            {/* Immagine */}
            <div className="flex-shrink-0 w-40 sm:w-48 relative">
                <Image
                    width={100}
                    height={100}
                    src={restaurant.image}
                    className="w-full h-full object-cover"
                    alt={restaurant.name}
                />
                {restaurant.discount && (
                    <span className="absolute top-3 left-3 bg-black text-white px-2 py-1 rounded-md text-sm font-bold">
            -{restaurant.discount}%
          </span>
                )}
            </div>

            {/* Contenuto */}
            <div className="p-4 sm:p-5 flex flex-col">
                <h3 className="text-xl sm:text-2xl font-bold text-black mb-1">{restaurant.name}</h3>
                <p className="text-xs sm:text-sm text-gray-800 font-medium mb-2">{restaurant.address}</p>
                {restaurant.averagePrice && (
                    <p className="text-sm font-semibold text-black mb-3">Prezzo medio: {restaurant.averagePrice}€</p>
                )}
                <p className="text-sm sm:text-base text-gray-900 leading-relaxed">{restaurant.description}</p>
            </div>
        </div>
    </Link>
);

export default RestaurantCard;
