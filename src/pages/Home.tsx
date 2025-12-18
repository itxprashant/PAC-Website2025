import { motion } from 'framer-motion';
import { Rocket, Users, BookOpen, Calendar, Telescope, Book, Star, School } from 'lucide-react';
import Logo from '/logo.svg';
import { MoonCanvas } from '../components/Moon';
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

interface ReadingCircle {
  event_number: string;
  title: string;
  cover_image: string;
  event_date: string;
}

interface PACTimesIssue {
  issue_number: string;
  title: string;
  cover_image: string;
  issue_date: string;
}

interface Album {
  album_number: string;
  title: string;
  cover_image: string;
  album_date: string;
}

export function Home() {
  const [recentEvents, setRecentEvents] = useState<Event[]>([]);
  const [recentReadingCircles, setRecentReadingCircles] = useState<ReadingCircle[]>([]);
  const [recentPACTimes, setRecentPACTimes] = useState<PACTimesIssue[]>([]);
  const [recentAlbums, setRecentAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [eventsRes, readingRes, timesRes, albumsRes] = await Promise.all([
          fetch(`${backend_url}/get_pac_events?limit=3`),
          fetch(`${backend_url}/get_reading_circle?limit=3`),
          fetch(`${backend_url}/get_pac_times?limit=3`),
          fetch(`${backend_url}/get_photo_albums?limit=3`)
        ]);

        const [eventsData, readingData, timesData, albumsData] = await Promise.all([
          eventsRes.json(),
          readingRes.json(),
          timesRes.json(),
          albumsRes.json()
        ]);

        setRecentEvents(eventsData.events);
        setRecentReadingCircles(readingData.events);
        setRecentPACTimes(timesData.issues);
        setRecentAlbums(albumsData.albums);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleViewEvent = (eventNumber: string) => {
    navigate(`/pac-events/${eventNumber}`);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-space-black">
        <MoonCanvas />
        <div className="absolute inset-0 bg-gradient-radial from-transparent to-space-black pointer-events-none" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-space-black/50 to-space-black pointer-events-none" />
          <div className="relative z-10 text-center px-4 -mt-16 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="mb-12 relative"
            >
              <div className="absolute inset-0 blur-[100px] bg-nebula-blue/20 rounded-full" />
              <img
                src={Logo}
                alt="PAC Logo"
                className="w-48 h-48 md:w-64 md:h-64 mx-auto relative z-10 drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]"
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tight"
            >
              <span className="text-white">Physics & Astronomy</span>
              <br />
              <span className="text-gradient">Club, IIT Delhi</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
            >
              Exploring the mysteries of the universe, one discovery at a time.
              Join a community of stargazers, thinkers, and innovators.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex justify-center gap-4"
            >
              <Button to="/pac-events" variant="primary">Explore Events</Button>
              <Button to="/teams" variant="outline">Meet the Team</Button>
            </motion.div>
          </div>
        </section>

        {/* Activities Section */}
        <section className="py-24 px-4 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display">What We Do</h2>
              <div className="h-1 w-24 bg-gradient-to-r from-nebula-blue to-nebula-purple mx-auto rounded-full" />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <Telescope className="h-8 w-8 text-nebula-blue" />,
                  title: "Observatory",
                  description: "Access to our observatory for celestial observations"
                },
                {
                  icon: <Rocket className="h-8 w-8 text-nebula-purple" />,
                  title: "Rocketry",
                  description: "Design and launch model rockets"
                },
                {
                  icon: <Book className="h-8 w-8 text-star-gold" />,
                  title: "Reading Circle",
                  description: "Weekly discussions on physics and astronomy papers"
                },
                {
                  icon: <Star className="h-8 w-8 text-nebula-blue" />,
                  title: "Research",
                  description: "Engage in cutting-edge physics and astronomy research"
                },
                {
                  icon: <Calendar className="h-8 w-8 text-nebula-purple" />,
                  title: "Observation Sessions",
                  description: "Regular stargazing and astronomical observations"
                },
                {
                  icon: <School className="h-8 w-8 text-star-gold" />,
                  title: "Events",
                  description: "Workshops, talks, and educational sessions"
                },
                {
                  icon: <BookOpen className="h-8 w-8 text-nebula-blue" />,
                  title: "PAC Times",
                  description: "Our weekly astronomy and physics magazine"
                },
                {
                  icon: <Users className="h-8 w-8 text-nebula-purple" />,
                  title: "Community",
                  description: "Join a vibrant community of space enthusiasts"
                }
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-panel p-8 rounded-2xl hover:border-nebula-blue/30 transition-all duration-300 group"
                >
                  <div className="mb-6 p-4 bg-white/5 rounded-xl w-fit group-hover:bg-white/10 transition-colors">
                    {activity.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 font-display">{activity.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{activity.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <section className="py-20 px-4 space-y-32">
          {/* Recent Events Panel */}
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold font-display mb-2">Recent Events</h2>
                <div className="h-1 w-20 bg-nebula-purple rounded-full" />
              </div>
              <Button to="/pac-events" variant="ghost" className="mt-4 md:mt-0">View All Events →</Button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-nebula-purple"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-400 py-12 glass-panel rounded-xl">
                Error loading events: {error}
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-8">
                {recentEvents.map((event, index) => (
                  <motion.div
                    key={event.event_number}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-panel rounded-2xl overflow-hidden group hover:-translate-y-2 transition-transform duration-300"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={`${backend_url}${event.cover_image}`}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-space-black/80 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <span className="px-3 py-1 bg-nebula-purple/80 backdrop-blur-sm rounded-full text-xs font-bold text-white shadow-lg">
                          EVENT
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="text-sm text-nebula-blue mb-2 font-medium">
                        {event.event_date || 'No Event Date'}
                      </div>
                      <h3 className="text-xl font-bold mb-4 line-clamp-2 min-h-[3.5rem]">{event.title}</h3>
                      <Button
                        onClick={() => handleViewEvent(event.event_number)}
                        variant="outline"
                        className="w-full"
                      >
                        View Details
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Reading Circle & PAC Times Split */}
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
            {/* Reading Circle Panel */}
            <div>
              <div className="flex justify-between items-end mb-8">
                <h2 className="text-3xl font-bold font-display">Reading Circle</h2>
                <Button to="/reading-circle" variant="ghost">View All →</Button>
              </div>

              <div className="space-y-6">
                {!loading && recentReadingCircles.map((event, index) => (
                  <motion.div
                    key={event.event_number}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-panel p-4 rounded-xl flex gap-4 hover:bg-white/5 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/reading-circle/${event.event_number}`)}
                  >
                    <div className="h-24 w-24 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={`${backend_url}${event.cover_image}`} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div>
                      <div className="text-xs text-star-gold mb-1">{event.event_date}</div>
                      <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-nebula-blue transition-colors">{event.title}</h3>
                      <span className="text-xs text-gray-400">Read More →</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* PAC Times Panel */}
            <div>
              <div className="flex justify-between items-end mb-8">
                <h2 className="text-3xl font-bold font-display">PAC Times</h2>
                <Button to="/pac-times" variant="ghost">View All →</Button>
              </div>

              <div className="space-y-6">
                {!loading && recentPACTimes.map((issue, index) => (
                  <motion.div
                    key={issue.issue_number}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-panel p-4 rounded-xl flex gap-4 hover:bg-white/5 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/pac-times/${issue.issue_number}`)}
                  >
                    <div className="h-24 w-24 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={`${backend_url}${issue.cover_image}`} alt={issue.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div>
                      <div className="text-xs text-nebula-blue mb-1">{issue.issue_date}</div>
                      <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-nebula-purple transition-colors">{issue.title}</h3>
                      <span className="text-xs text-gray-400">Read Issue →</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Photo Albums Panel */}
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Captured Moments</h2>
              <p className="text-gray-400">Glimpses from our recent observations and events</p>
            </div>

            {/* ... (existing albums logic adapted to grid images) ... */}
            {!loading && (
              <div className="grid md:grid-cols-3 gap-6">
                {recentAlbums.map((album, index) => (
                  <motion.div
                    key={album.album_number}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-panel rounded-2xl p-2 cursor-pointer group"
                    onClick={() => navigate(`/gallery/${album.album_number}`)}
                  >
                    <div className="aspect-video rounded-xl overflow-hidden relative">
                      <img src={`${backend_url}${album.cover_image}`} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="text-white font-medium border border-white/30 px-4 py-2 rounded-full backdrop-blur-md">View Album</span>
                      </div>
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="font-bold text-lg">{album.title}</h3>
                      <p className="text-sm text-gray-400">{album.album_date}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            <div className="mt-12 text-center">
              <Button to="/gallery" variant="secondary">Visit Full Gallery</Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}