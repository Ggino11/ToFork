import { FaReceipt } from 'react-icons/fa';

export default function Orders() {
  return (
    <div className="text-center flex flex-col items-center justify-center h-full">
        <FaReceipt className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">I Miei Ordini</h2>
        <p className="text-gray-500 mt-2">Questa sezione è in fase di sviluppo.</p>
    </div>
  );
}