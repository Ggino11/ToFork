import React, { FC } from 'react';

/**
 * Componente per visualizzare la gestione dei tavoli prenotati nel restaurant dashboard
 */
const TavoliComponent: FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-xl font-semibold mb-4 text-gray-900">Tavoli Prenotati</h3>
    <p className="text-gray-600">Qui verrà visualizzato il calendario delle prenotazioni...</p>
    <div className="mt-6 p-4 border border-gray-200 rounded-lg animate-pulse bg-gray-50 h-64">
      <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
      <div className="flex space-x-2">
        <div className="h-20 w-1/6 bg-gray-200 rounded"></div>
        <div className="h-20 w-1/6 bg-gray-200 rounded"></div>
        <div className="h-20 w-1/6 bg-gray-300 rounded"></div>
        <div className="h-20 w-1/6 bg-gray-200 rounded"></div>
        <div className="h-20 w-1/6 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);

export default TavoliComponent;