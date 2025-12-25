import { motion } from 'framer-motion';
import { CalendarDays, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

const backend_url = import.meta.env.VITE_BACKEND_URL;

interface Event {
  event_number: string;
  title: string;
  cover_image: string;
  event_date: string;
}

export function PACEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${backend_url}/get_pac_events`);
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        // Sort events by date descending (newest first)
        const sortedEvents = data.events.sort((a: Event, b: Event) => {
          const dateA = new Date(a.event_date).getTime();
          const dateB = new Date(b.event_date).getTime();
          // Handle invalid dates (put them at the end or treat as usually older/newer depending on pref)
          // Here assuming valid dates for sorting, if date is invalid (NaN), treat as 0
          const validDateA = isNaN(dateA) ? 0 : dateA;
          const validDateB = isNaN(dateB) ? 0 : dateB;
          return validDateB - validDateA;
        });
        setEvents(sortedEvents);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleViewEvent = (eventNumber: string) => {
    navigate(`/pac-events/${eventNumber}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-nebula-purple"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="glass-panel p-6 text-red-400">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 relative">
      <div className="absolute inset-0 bg-gradient-radial from-nebula-purple/10 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-block p-4 rounded-full bg-white/5 mb-6 backdrop-blur-sm">
            <CalendarDays className="h-12 w-12 text-nebula-purple" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-display">PAC Events</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Explore our upcoming and past events, workshops, and observation sessions.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <motion.div
              key={event.event_number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel rounded-2xl overflow-hidden group flex flex-col h-full hover:shadow-[0_0_30px_rgba(124,58,237,0.15)] transition-all duration-300"
            >
              <div className="relative h-72 overflow-hidden bg-space-black/50">
                {/* Blurred background for fill */}
                <div
                  className="absolute inset-0 bg-cover bg-center blur-xl opacity-40 scale-110 transition-transform duration-700 group-hover:scale-125"
                  style={{ backgroundImage: `url(${backend_url}${event.cover_image})` }}
                />

                {/* Main image - fully visible */}
                <img
                  src={`${backend_url}${event.cover_image}`}
                  alt={event.title}
                  className="relative w-full h-full object-contain z-10 p-2 transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-space-black/90 to-transparent opacity-0 group-hover:opacity-40 transition-opacity z-20" />
                <div className="absolute bottom-4 left-4 z-30">
                  <span className="px-3 py-1 bg-nebula-purple/80 backdrop-blur-sm rounded-full text-xs font-bold text-white shadow-lg">
                    EVENT
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center text-sm text-nebula-blue mb-3 font-medium">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{event.event_date || 'Date TBA'}</span>
                </div>

                <h3 className="text-xl font-bold mb-4 font-display leading-tight group-hover:text-nebula-purple transition-colors">
                  {event.title}
                </h3>

                <div className="mt-auto pt-4 border-t border-white/10">
                  <Button
                    onClick={() => handleViewEvent(event.event_number)}
                    variant="outline"
                    className="w-full justify-center group-hover:bg-nebula-purple group-hover:border-nebula-purple group-hover:text-white"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}