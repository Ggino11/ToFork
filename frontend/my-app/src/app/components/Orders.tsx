import React, { FC } from 'react';

/**
 * Componente per visualizzare la gestione degli ordini nel restaurant dashboard
 */
const Orders: FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-xl font-semibold mb-4 text-gray-900">Ordini Recenti</h3>
    <p className="text-gray-600">Qui verranno visualizzati gli ordini in tempo reale...</p>
    {/* Esempio di griglia placeholder con animazione pulse per dare l'idea del caricamento */}
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 border border-gray-200 rounded-lg animate-pulse bg-gray-50">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-full mt-1"></div>
        </div>
      ))}
    </div>
  </div>
);

export default Orders;