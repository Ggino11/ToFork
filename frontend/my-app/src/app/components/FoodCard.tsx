import React from 'react';
import Image from 'next/image';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface FoodCardProps {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  price: number;
  restaurantId: number;
  restaurantName?: string;
  showAddButton?: boolean;
}

const FoodCard: React.FC<FoodCardProps> = ({ id, imageUrl, title, description, price, restaurantId, restaurantName, showAddButton = true }) => {
  const { addItem } = useCart();
  const { user } = useAuth();

  const handleAdd = () => {
    addItem({
      id,
      title,
      price,
      quantity: 1,
      restaurantId,
      restaurantName: restaurantName || "Ristorante"
    });
    // Optional: visual feedback
  };

  return (
    <div className="bg-white rounded-xl shadow-lg flex justify-between items-center p-4 m-2 w-full max-w-sm font-sans hover:shadow-xl transition-shadow duration-300 relative group">
      
      <div className="flex flex-col flex-1 mr-4">
        <h3 className="text-gray-800 text-sm font-bold uppercase mb-1 tracking-wide">
          {title}
        </h3>
        <p className="text-gray-500 text-xs flex-grow leading-snug mb-2">
          {description}
        </p>
        <p className="text-black text-base font-bold">
          € {price.toFixed(2).replace('.', ',')}
        </p>
      </div>

      <div className="relative flex-shrink-0 w-24 h-24">
        <Image
          src={imageUrl || "https://placehold.co/100x100?text=No+Image"}
          alt={title}
          className="rounded-lg h-full w-full object-cover"
          width={98}
          height={98}
        />
        
        {user && showAddButton && (
          <button 
            onClick={handleAdd}
            className="absolute -bottom-2 -right-2 bg-gray-800 text-white rounded-full w-9 h-9 flex items-center justify-center shadow-md cursor-pointer hover:bg-gray-900 transition-all duration-200 transform hover:scale-110 active:scale-95"
            aria-label={`Aggiungi ${title} al carrello`}
          >
            <span className="text-2xl font-semibold leading-none pb-1">+</span>
          </button>
        )}
      </div>
    </div>
  );
};

/* ESEMPIO DI UTILIZZO:
  Puoi usare questo componente in un'altra pagina, come Menu.tsx, 
  per visualizzare una lista di piatti.

  import React from 'react';
  import FoodCard from './FoodCard';

  const menuItems = [
    {
      id: 'b1',
      title: 'CHEL',
      description: 'Hamburger di manzo, insalata, pomodoro, maionese',
      price: 8.70,
      imageUrl: 'https://placehold.co/100x100/f97316/white?text=Burger', 
    },
    {
      id: 'b2',
      title: 'M** VEGETARIAN',
      description: 'Con verdure fresche dell\'orto, salsa di pomodoro e cetrioli',
      price: 9.90,
      imageUrl: 'https://placehold.co/100x100/22c55e/white?text=Veggie',
    },
    {
      id: 'p1',
      title: 'PATATE RUFE',
      description: 'Patate al forno belle calde con salsa (maionese e extra)',
      price: 5.90,
      imageUrl: 'https://placehold.co/100x100/eab308/white?text=Fries',
    }
  ];

  const MenuPage = () => {
    return (
      <div className="bg-gray-100 p-8">
        <h2 className="text-3xl font-bold mb-6 text-orange-500">Burgers</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {menuItems.map(item => (
            <FoodCard
              key={item.id}
              title={item.title}
              description={item.description}
              price={item.price}
              imageUrl={item.imageUrl}
            />
          ))}
        </div>
      </div>
    );
  };

  export default MenuPage;
*/


export default FoodCard;
