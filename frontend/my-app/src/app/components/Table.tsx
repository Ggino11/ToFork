'use client';
import React, { FC, useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, Users } from 'lucide-react';

interface RestaurantTable {
  id: number;
  tableNumber: number;
  capacity: number;
  status: 'AVAILABLE' | 'RESERVED' | 'OCCUPIED';
}

const TavoliComponent: FC = () => {
  const { user, token } = useAuth();
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [restaurantId, setRestaurantId] = useState<number | null>(null);

  // Add Table Form State
  const [isAdding, setIsAdding] = useState(false);
  const [newTable, setNewTable] = useState({
    tableNumber: '',
    capacity: ''
  });

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';
  useEffect(() => {
    if (user?.id) {
        fetch(`${baseUrl}/api/restaurants/owner/${user.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            if (data && data.length > 0) {
                setRestaurantId(data[0].id);
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
      fetch(`${baseUrl}/api/tables/restaurant/${restaurantId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setTables(data.sort((a: RestaurantTable, b: RestaurantTable) => a.tableNumber - b.tableNumber)))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
    }
  }, [restaurantId, token]);

  const handleAddTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurantId) return;

    try {
      const res = await fetch(`${baseUrl}/api/tables/restaurant/${restaurantId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tableNumber: parseInt(newTable.tableNumber),
          capacity: parseInt(newTable.capacity),
          status: 'AVAILABLE'
        })
      });

      if (res.ok) {
        const savedTable = await res.json();
        setTables(prev => [...prev, savedTable].sort((a, b) => a.tableNumber - b.tableNumber));
        setIsAdding(false);
        setNewTable({ tableNumber: '', capacity: '' });
      } else {
        alert("Errore salvataggio tavolo");
      }
    } catch (error) {
      console.error(error);
      alert("Errore salvataggio tavolo");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${baseUrl}/api/tables/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setTables(prev => prev.filter(t => t.id !== id));
      } else {
        alert("Errore eliminazione tavolo");
      }
    } catch (error) {
      console.error(error);
      alert("Errore eliminazione tavolo");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-white border-green-500 text-green-700 shadow-green-100';
      case 'RESERVED': return 'bg-white border-yellow-500 text-yellow-700 shadow-yellow-100';
      case 'OCCUPIED': return 'bg-white border-red-500 text-red-700 shadow-red-100';
      default: return 'bg-white border-gray-300 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h3 className="text-2xl font-bold mb-6 text-gray-800">Tavoli del Ristorante</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!restaurantId) return <div className="p-8 text-center text-gray-500">Nessun ristorante trovato.</div>;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Gestione Tavoli</h3>
          <p className="text-gray-500 text-sm mt-1">Gestisci la disposizione e lo stato dei tuoi tavoli</p>
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
          <span>{isAdding ? 'Chiudi' : 'Nuovo Tavolo'}</span>
        </button>
      </div>

      {isAdding && (
        <div className="mb-10 bg-gray-50 p-6 rounded-2xl border border-gray-200 animate-in fade-in slide-in-from-top-4 duration-300">
          <h4 className="font-semibold mb-4 text-lg text-gray-800">Aggiungi Nuovo Tavolo</h4>
          <form onSubmit={handleAddTable} className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Numero Tavolo</label>
              <input 
                type="number"
                value={newTable.tableNumber}
                onChange={e => setNewTable({...newTable, tableNumber: e.target.value})}
                className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none"
                placeholder="Es. 10"
                required
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Coperti</label>
              <input 
                type="number"
                value={newTable.capacity}
                onChange={e => setNewTable({...newTable, capacity: e.target.value})}
                className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none"
                placeholder="Es. 4"
                required
              />
            </div>
            <button 
              type="submit" 
              className="px-6 py-3 bg-orange-600 text-white font-medium rounded-xl hover:bg-orange-700 focus:ring-4 focus:ring-orange-200 transition-all shadow-md hover:shadow-lg"
            >
              Salva Tavolo
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {tables.map(table => (
          <div 
            key={table.id} 
            className={`relative group p-5 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${getStatusColor(table.status)}`}
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-3xl font-bold opacity-90">{table.tableNumber}</span>
              <div className={`h-3 w-3 rounded-full ${
                table.status === 'AVAILABLE' ? 'bg-green-500' : 
                table.status === 'RESERVED' ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
            </div>
            
            <div className="flex items-center text-sm font-medium opacity-70 mb-4">
              <Users className="h-4 w-4 mr-2" />
              <span>{table.capacity} Posti</span>
            </div>

            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">{table.status}</span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(table.id);
                }}
                className="p-2 bg-red-50 text-red-500 rounded-lg transition-all hover:bg-red-100 hover:text-red-600 z-10 relative"
                title="Elimina tavolo"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        
        {tables.length === 0 && !loading && (
          <div className="col-span-full py-12 text-center text-gray-400 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>Non ci sono ancora tavoli.</p>
            <button onClick={() => setIsAdding(true)} className="text-orange-600 font-medium hover:underline mt-2">Aggiungine uno ora</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TavoliComponent;