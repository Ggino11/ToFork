import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

// Dati di esempio per gli orari. In un'app reale, questi potrebbero arrivare da un'API.
const timeSlots = ['19:00', '19:30', '20:00', '20:30', '21:00', '21:30'];

// Definiamo le props che il componente si aspetta di ricevere.
interface CalendarBookingProps {
  onBookingSubmit: (bookingDetails: { date: Date; time: string; guests: number }) => void;
}

const CalendarBooking: React.FC<CalendarBookingProps> = ({ onBookingSubmit }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [guests, setGuests] = useState(2);

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      alert('Per favore, seleziona una data e un orario.');
      return;
    }
    onBookingSubmit({ date: selectedDate, time: selectedTime, guests });
    console.log('Prenotazione inviata:', { date: format(selectedDate, 'PPP', { locale: it }), time: selectedTime, guests });
  };

  // Stili custom per react-day-picker usando le classi di Tailwind
  const dayPickerClassNames = {
    months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
    month: 'space-y-4',
    nav: 'space-x-1 flex items-center',
    nav_button: 'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
    caption: 'flex justify-center pt-1 relative items-center',
    caption_label: 'text-sm font-medium',
    head_row: 'flex',
    head_cell: 'text-gray-500 rounded-md w-9 font-normal text-[0.8rem]',
    row: 'flex w-full mt-2',
    cell: 'text-center text-sm p-0 relative [&:has([aria-selected])]:bg-gray-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
    day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100',
    day_selected: 'bg-gray-900 text-white hover:bg-gray-900 hover:text-white focus:bg-gray-900 focus:text-white rounded-md',
    day_today: 'bg-gray-200 text-gray-900 rounded-md',
    day_disabled: 'text-gray-400 opacity-50',
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Prenota un tavolo</h3>
      
      {/* Calendario */}
      <div className="border rounded-lg p-2">
         <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            locale={it} // Imposta la lingua italiana
            fromDate={new Date()} // Disabilita le date passate
            classNames={dayPickerClassNames}
         />
      </div>

      {/* Selettore Orario */}
      <div className="my-4">
        <h4 className="font-semibold mb-2 text-gray-700">Orario</h4>
        <div className="grid grid-cols-3 gap-2">
          {timeSlots.map(time => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`p-2 rounded-lg text-sm transition-colors duration-200 ${selectedTime === time ? 'bg-gray-800 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {/* Selettore Persone */}
      <div className="my-4">
        <h4 className="font-semibold mb-2 text-gray-700">Persone</h4>
        <div className="flex items-center justify-between bg-gray-100 rounded-lg p-2">
          <button onClick={() => setGuests(g => Math.max(1, g - 1))} className="w-8 h-8 rounded-md bg-gray-200 text-lg font-bold">-</button>
          <span>{guests} {guests > 1 ? 'persone' : 'persona'}</span>
          <button onClick={() => setGuests(g => g + 1)} className="w-8 h-8 rounded-md bg-gray-200 text-lg font-bold">+</button>
        </div>
      </div>

      {/* Pulsante di Prenotazione */}
      <button 
        onClick={handleBooking}
        className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
      >
        Verifica disponibilità
      </button>
    </div>
  );
};

export default CalendarBooking;