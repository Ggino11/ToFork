import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { it } from "date-fns/locale";
import { useAuth } from "../context/AuthContext";

const timeSlots = ["19:00", "19:30", "20:00", "20:30", "21:00", "21:30"];

interface CalendarBookingProps {
    restaurantId: number;
    onBookingSubmit: (bookingDetails: { date: Date; time: string; guests: number }) => void;
}

const CalendarBooking: React.FC<CalendarBookingProps> = ({ restaurantId, onBookingSubmit }) => {
    const { user } = useAuth();
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [guests, setGuests] = useState(2);

    const handleBooking = () => {
        if (!user) {
            alert("Devi effettuare il login per prenotare.");
            return;
        }

        if (!selectedDate || !selectedTime) {
            alert("Per favore, seleziona una data e un orario.");
            return;
        }

        onBookingSubmit({ date: selectedDate, time: selectedTime, guests });
    };

    if (!user) {
        return (
            <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-8 border border-gray-200 text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Prenota un tavolo</h3>
                <p className="text-gray-500 mb-6">Accedi per verificare la disponibilità e prenotare.</p>
                <a href="/auth" className="inline-block bg-orange-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-orange-700 transition-colors">
                    Accedi
                </a>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Prenota un tavolo</h3>

            {/* Calendario */}
            <div className="border rounded-xl p-4 mb-6 bg-gray-50">
                <div className="w-full flex justify-center overflow-x-auto min-w-[280px] sm:min-w-0 ">
                    <DayPicker
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        locale={it}
                        fromDate={new Date()}
                        styles={{
                            caption: { color: "#000", fontWeight: "bold" },
                            head_cell: { color: "#000", fontWeight: 600 },
                            cell: { color: "#000" },
                            month: { width: "100%", maxWidth: "100%" },
                            table: { width: "100%", tableLayout: "fixed" },
                        }}
                        modifiersClassNames={{
                            selected: "bg-orange-500 text-white rounded-md",
                            today: "font-bold text-orange-600",
                        }}
                        className="w-full text-black"
                    />
                </div>
            </div>


            {/* Selettore orario */}
            <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-2">Orario</h4>
                <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                        <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`p-2 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                                selectedTime === time
                                    ? "bg-orange-500 text-white shadow-md"
                                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            }`}
                        >
                            {time}
                        </button>
                    ))}
                </div>
            </div>

            {/* Selettore persone */}
            <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-2">Persone</h4>
                <div className="flex items-center justify-between bg-gray-100 rounded-lg p-3">
                    <button
                        onClick={() => setGuests((g) => Math.max(1, g - 1))}
                        className="w-10 h-10 bg-orange-500 text-white rounded-full text-xl font-bold flex items-center justify-center hover:bg-orange-600 transition-all"
                    >
                        −
                    </button>
                    <span className="text-gray-900 font-semibold text-lg">
            {guests} {guests > 1 ? "persone" : "persona"}
          </span>
                    <button
                        onClick={() => setGuests((g) => g + 1)}
                        className="w-10 h-10 bg-orange-500 text-white rounded-full text-xl font-bold flex items-center justify-center hover:bg-orange-600 transition-all"
                    >
                        +
                    </button>
                </div>
            </div>

            {/* Pulsante prenotazione */}
            <button
                onClick={handleBooking}
                className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg shadow-md hover:bg-orange-600 transition-all duration-300 transform hover:-translate-y-1"
            >
                Prenota Tavolo
            </button>
        </div>
    );
};

export default CalendarBooking;
