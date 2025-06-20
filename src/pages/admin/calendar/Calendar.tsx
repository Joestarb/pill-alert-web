import React, { useState, useCallback } from 'react';
import { Calendar as BigCalendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';


const localizer = momentLocalizer(moment);

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource?: any;
}

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Reunión de equipo',
      start: new Date(2024, 11, 20, 10, 0),
      end: new Date(2024, 11, 20, 11, 0),
    },
    {
      id: '2',
      title: 'Presentación proyecto',
      start: new Date(2024, 11, 22, 14, 0),
      end: new Date(2024, 11, 22, 15, 30),
    },
    {
      id: '3',
      title: 'Cita médica',
      start: new Date(2024, 11, 25, 9, 0),
      end: new Date(2024, 11, 25, 10, 0),
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [newEventTitle, setNewEventTitle] = useState('');

  const handleSelectSlot = useCallback(({ start, end }: { start: Date; end: Date }) => {
    setSelectedSlot({ start, end });
    setShowModal(true);
  }, []);

  const handleCreateEvent = () => {
    if (newEventTitle && selectedSlot) {
      const newEvent: Event = {
        id: Date.now().toString(),
        title: newEventTitle,
        start: selectedSlot.start,
        end: selectedSlot.end,
      };
      setEvents([...events, newEvent]);
      setShowModal(false);
      setNewEventTitle('');
      setSelectedSlot(null);
    }
  };

  const handleSelectEvent = useCallback((event: Event) => {
    if (window.confirm(`¿Quieres eliminar el evento "${event.title}"?`)) {
      setEvents(events.filter(e => e.id !== event.id));
    }
  }, [events]);

  const eventStyleGetter = (event: Event) => {
    const backgroundColor = '#33CCFF'; // Indigo-500
    const style = {
      backgroundColor,
      borderRadius: '8px',
      opacity: 0.95,
      color: 'white',
      padding: '4px 8px',
      border: 'none',
      fontWeight: '500',
      fontSize: '0.875rem',
    };
    return { style };
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      <div className="max-w-7xl mx-auto">
      
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Mi Calendario</h1>

        <div className="bg-white rounded-xl shadow-2xl p-6 border border-gray-200">
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            selectable
            eventPropGetter={eventStyleGetter}
            views={['month', 'week', 'day']}
            defaultView={'month'}
            popup
            messages={{
              next: 'Siguiente',
              previous: 'Anterior',
              today: 'Hoy',
              month: 'Mes',
              week: 'Semana',
              day: 'Día',
              agenda: 'Agenda',
              date: 'Fecha',
              time: 'Hora',
              event: 'Evento',
              noEventsInRange: 'No hay eventos en este rango',
              showMore: (total) => `+ Ver más (${total})`,
            }}
          />
        </div>

        {showModal && (
  <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
    <div className="bg-white/90 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl border border-gray-200 backdrop-blur-lg transition-all duration-300">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Crear Nuevo Evento</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Título del evento
        </label>
        <input
          type="text"
          value={newEventTitle}
          onChange={(e) => setNewEventTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ingresa el título del evento"
          autoFocus
        />
      </div>

      {selectedSlot && (
        <div className="mb-4 text-sm text-gray-600 space-y-1">
          <p><strong>Fecha:</strong> {selectedSlot.start.toLocaleDateString()}</p>
          <p><strong>Hora:</strong> {selectedSlot.start.toLocaleTimeString()} - {selectedSlot.end.toLocaleTimeString()}</p>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          onClick={() => {
            setShowModal(false);
            setNewEventTitle('');
            setSelectedSlot(null);
          }}
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
        >
          Cancelar
        </button>
        <button
          onClick={handleCreateEvent}
          disabled={!newEventTitle}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          Crear Evento
        </button>
      </div>
    </div>
  </div>
)}


        {/* Instrucciones */}
        <div className="mt-6 bg-white border border-indigo-100 rounded-lg p-5 shadow-sm">
          <h3 className="font-semibold text-blue-800 mb-3 text-lg">ℹ️ Instrucciones:</h3>
          <ul className="text-gray-700 text-sm space-y-2 list-disc list-inside">
            <li>Haz clic en una fecha para crear un nuevo evento.</li>
            <li>Haz clic en un evento para eliminarlo.</li>
            <li>Usa las vistas para cambiar entre mes, semana o día.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
