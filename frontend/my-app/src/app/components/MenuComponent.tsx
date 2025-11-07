import React, { FC } from 'react';

/**
 * Componente per visualizzare la gestione del menu nel restaurant dashboard
 */
const MenuComponent: FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-xl font-semibold mb-4 text-gray-900">Il Tuo Menu</h3>
    <p className="text-gray-600">Qui verranno visualizzati gli elementi del tuo menu (antipasti, primi, ecc.)...</p>
    <div className="mt-6 space-y-4">
      {[1, 2].map((i) => (
        <div key={i} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg animate-pulse bg-gray-50">
          <div className="h-16 w-16 bg-gray-300 rounded-lg"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
          </div>
          <div className="h-5 bg-gray-300 rounded w-1/6"></div>
        </div>
      ))}
    </div>
  </div>
);

export default MenuComponent;