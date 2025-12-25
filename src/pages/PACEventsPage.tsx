import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Calendar, Image } from 'lucide-react';

const backend_url = import.meta.env.VITE_BACKEND_URL;

export function PACEventsPage() {
  const { eventNumber } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  interface Section {
    image?: string;
    heading: string;
    body: string;
    image_gallery_album_id?: string;
  }

  interface Event {
    event_number: string;
    title: string;
    event_date: string;
    cover_image: string;
    sections: Section[];
    heading?: string;
    body?: string;
    image_gallery_album_id?: string;
  }

  const linkify = (text: string) => {
    return text.split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
      part.match(/^https?:\/\//)
        ? <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-nebula-blue hover:text-nebula-purple underline decoration-dotted underline-offset-4 transition-colors">{part}</a>
        : part
    );
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`${backend_url}/get_pac_events`);
        if (!response.ok) {
          throw new Error('Failed to fetch PAC Events');
        }
        const data = await response.json();
        const foundEvent = data.events.find(
          (e: Event) => e.event_number === eventNumber
        );
        if (!foundEvent) {
          throw new Error(`Event #${eventNumber} not found`);
        }
        setEvent(foundEvent);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventNumber]);

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-nebula-purple" />
    </div>
  );

  const ErrorDisplay = () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="glass-panel p-6 text-red-400">
        Error: {error || 'Event not found'}
      </div>
    </div>
  );

  if (loading) return <LoadingSpinner />;
  if (error || !event) return <ErrorDisplay />;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 relative">
      <div className="max-w-5xl mx-auto">
        <Link to="/pac-events" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors group">
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Events
        </Link>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-panel rounded-3xl overflow-hidden"
        >
          {/* Hero Image */}
          <div className="relative h-[40vh] md:h-[50vh]">
            <img
              src={`${backend_url}${event.cover_image}`}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-space-black via-space-black/50 to-transparent" />

            <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-nebula-purple/20 backdrop-blur-md border border-nebula-purple/30 text-nebula-purple mb-4">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="font-medium text-sm">{event.event_date}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold font-display leading-tight text-white mb-2">{event.title}</h1>
            </div>
          </div>

          <div className="p-8 md:p-12 space-y-12">
            {/* Sections */}
            {event.sections ? (
              [...event.sections].reverse().map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-6"
                >
                  {section.heading && (
                    <h2 className="text-3xl font-bold font-display text-white relative inline-block">
                      {section.heading}
                      <div className="absolute -bottom-2 left-0 w-1/3 h-1 bg-nebula-blue rounded-full" />
                    </h2>
                  )}

                  {section.body && (
                    <div className="prose prose-invert prose-lg max-w-none text-gray-300">
                      <p className="whitespace-pre-wrap leading-relaxed">
                        {linkify(section.body)}
                      </p>
                    </div>
                  )}

                  {section.image && (
                    <div className="rounded-2xl overflow-hidden glass-panel p-2">
                      <img
                        src={`${backend_url}${section.image}`}
                        alt={section.heading}
                        className="w-full h-auto rounded-xl max-h-[600px] object-contain bg-black/20"
                      />
                    </div>
                  )}

                  {/* Image Gallery Link (Section Level) */}
                  {section.image_gallery_album_id && (
                    <div className="pt-4">
                      <Button to={`/gallery/${section.image_gallery_album_id}`} variant="secondary">
                        <Image className="h-4 w-4 mr-2" /> View Gallery Album
                      </Button>
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {event.heading && <h2 className="text-3xl font-bold font-display">{event.heading}</h2>}
                {event.body && (
                  <div className="prose prose-invert prose-lg max-w-none text-gray-300">
                    <p className="whitespace-pre-wrap leading-relaxed">{linkify(event.body)}</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Main Event Gallery Link */}
            {event.image_gallery_album_id && (
              <div className="border-t border-white/10 pt-8 mt-12">
                <div className="bg-gradient-to-r from-nebula-blue/10 to-transparent p-6 rounded-2xl border border-nebula-blue/20 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">View Event Photos</h3>
                    <p className="text-gray-400">Check out the complete photo album from this event</p>
                  </div>
                  <Button to={`/gallery/${event.image_gallery_album_id}`} variant="primary">
                    <Image className="h-4 w-4 mr-2" /> Open Gallery
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}