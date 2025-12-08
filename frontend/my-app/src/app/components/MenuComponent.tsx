'use client';
import React, { FC, useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, Upload } from 'lucide-react';
import FoodCard from './FoodCard';
/**
 * Componente per visualizzare la gestione del menu nel restaurant dashboard
 */
interface MenuItem {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

const CATEGORIES = [
  "Burgers", "Pizza", "Sushi", "Pasta", "Salads", "Desserts", "Cold Drinks", "Hot Drinks", "Alcohol", "Other"
];

const MenuComponent: FC = () => {
  const { user, token } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [restaurantId, setRestaurantId] = useState<number | null>(null);
  const [restaurantName, setRestaurantName] = useState<string>("");
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    price: '',
    imageUrl: '',
    category: 'Other'
  });
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user?.id) {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";
        fetch(`${API_BASE_URL}/api/restaurants/owner/${user.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            if (data && data.length > 0) {
                setRestaurantId(data[0].id);
                setRestaurantName(data[0].name);
            } else {
                setLoading(false);
            }
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
    }
  }, [user, token]);

  useEffect(() => {
    if (restaurantId) {
        fetch(`http://localhost:8083/api/menu-items/restaurant/${restaurantId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => setMenuItems(data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [restaurantId, token]);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
        setNewItem(prev => ({ ...prev, imageUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurantId) return;

    try {
      const res = await fetch(`http://localhost:8083/api/menu-items/restaurant/${restaurantId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newItem,
          price: parseFloat(newItem.price)
        })
      });

      if (res.ok) {
        const savedItem = await res.json();
        setMenuItems(prev => [...prev, savedItem]);
        setIsAdding(false);
        setNewItem({ title: '', description: '', price: '', imageUrl: '', category: 'Other' });
        alert("Piatto aggiunto con successo!");
      } else {
        alert("Errore durante l'aggiunta del piatto.");
      }
    } catch (error) {
      console.error("Failed to add item", error);
    }
  };

  const handleDelete = async (id: number) => {
      // if (!confirm("Sei sicuro di voler eliminare questo piatto?")) return;
      try {
          const res = await fetch(`http://localhost:8083/api/menu-items/${id}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
              setMenuItems(prev => prev.filter(item => item.id !== id));
          } else {
              alert("Errore durante l'eliminazione.");
          }
      } catch (error) {
          console.error("Failed to delete item", error);
      }
  };

  // Group items by category
  const groupedItems = menuItems.reduce((acc, item) => {
    const cat = item.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  if (loading) return <div className="p-8 text-center text-gray-500">Caricamento menu...</div>;
  if (!restaurantId) return <div className="p-8 text-center text-gray-500">Nessun ristorante trovato.</div>;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Gestione Menu</h3>
          <p className="text-gray-500 text-sm mt-1">Organizza i piatti e le categorie del tuo menu</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl transition-all duration-200 shadow-md ${
            isAdding 
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
              : 'bg-orange-600 text-white hover:bg-orange-700 hover:shadow-orange-200'
          }`}
        >
          <Plus className={`h-5 w-5 transition-transform duration-200 ${isAdding ? 'rotate-45' : ''}`} />
          <span>{isAdding ? 'Chiudi' : 'Nuovo Piatto'}</span>
        </button>
      </div>

      {isAdding && (
        <div className="mb-10 bg-gray-50 p-8 rounded-2xl border border-gray-200 animate-in fade-in slide-in-from-top-4 duration-300">
          <h4 className="font-semibold mb-6 text-xl text-gray-800">Crea Nuovo Piatto</h4>
          <form onSubmit={handleAddItem}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Nome Piatto</label>
                    <input 
                      value={newItem.title}
                      onChange={e => setNewItem({...newItem, title: e.target.value})}
                      className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none"
                      placeholder="Es. Carbonara"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Categoria</label>
                    <select 
                      value={newItem.category}
                      onChange={e => setNewItem({...newItem, category: e.target.value})}
                      className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none appearance-none"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Prezzo (€)</label>
                  <input 
                    type="number" 
                    step="0.10"
                    value={newItem.price}
                    onChange={e => setNewItem({...newItem, price: e.target.value})}
                    className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Descrizione</label>
                  <textarea 
                    value={newItem.description}
                    onChange={e => setNewItem({...newItem, description: e.target.value})}
                    className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none"
                    rows={4}
                    placeholder="Descrivi gli ingredienti e la preparazione..."
                  />
                </div>
              </div>

              {/* Image Drag & Drop */}
              <div className="lg:col-span-1">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Foto Piatto</label>
                <div 
                  className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all duration-200 h-[280px] flex flex-col justify-center items-center relative overflow-hidden ${
                    isDragging 
                      ? 'border-orange-500 bg-orange-50 scale-[1.02]' 
                      : 'border-gray-300 hover:border-orange-400 hover:bg-gray-50'
                  }`}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                  />
                  
                  {newItem.imageUrl ? (
                    <>
                      <img src={newItem.imageUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <p className="text-white font-medium text-sm flex items-center">
                          <Upload className="h-4 w-4 mr-2" /> Cambia foto
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                      <div className="p-4 bg-gray-100 rounded-full mb-3">
                        <Upload className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="font-medium text-sm text-gray-600">Clicca o trascina una foto</p>
                      <p className="text-xs mt-1 text-gray-400">PNG, JPG fino a 5MB</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
              <button 
                type="button" 
                onClick={() => setIsAdding(false)}
                className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl mr-3 font-medium transition-colors"
              >
                Annulla
              </button>
              <button 
                type="submit" 
                className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded-xl hover:bg-orange-700 shadow-lg shadow-orange-200 transition-all hover:-translate-y-0.5"
              >
                Salva Piatto
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-10">
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category} className="animate-in fade-in duration-500">
            <div className="flex items-center mb-6">
              <h4 className="text-xl font-bold text-gray-800">{category}</h4>
              <div className="ml-4 h-px bg-gray-200 flex-1"></div>
              <span className="ml-4 text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{items.length} piatti</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {items.map(item => (
                <div key={item.id} className="relative group">
                    <FoodCard
                        id={item.id}
                        title={item.title}
                        description={item.description}
                        price={item.price}
                        imageUrl={item.imageUrl}
                        restaurantId={restaurantId}
                        restaurantName={restaurantName}
                        showAddButton={false}
                    />
                  <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                    }}
                    className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-red-50 text-red-500 rounded-full shadow-sm transition-all z-10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
        {menuItems.length === 0 && !loading && (
          <div className="py-16 text-center text-gray-400 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <div className="bg-white p-4 rounded-full inline-block mb-4 shadow-sm">
              <Plus className="h-8 w-8 text-orange-200" />
            </div>
            <h5 className="text-lg font-medium text-gray-600 mb-1">Il tuo menu è vuoto</h5>
            <p className="text-sm text-gray-400 mb-4">Inizia aggiungendo il tuo primo piatto delizioso!</p>
            <button onClick={() => setIsAdding(true)} className="text-orange-600 font-bold hover:underline">Crea Piatto</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuComponent;