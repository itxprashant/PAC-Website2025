import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, ZoomIn } from 'lucide-react';

const backend_url = import.meta.env.VITE_BACKEND_URL;

interface Album {
  album_number: string;
  title: string;
  album_date: string;
  description: string;
  cover_image: string;
  photos: string[];
}

export function PhotoGalleryAlbum() {
  const { albumNumber } = useParams();
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const response = await fetch(`${backend_url}/get_photo_albums`);
        if (!response.ok) {
          throw new Error('Failed to fetch albums');
        }
        const data = await response.json();
        const foundAlbum = data.albums.find(
          (a: Album) => a.album_number === albumNumber
        );
        if (!foundAlbum) {
          throw new Error(`Album #${albumNumber} not found`);
        }
        setAlbum(foundAlbum);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [albumNumber]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-nebula-purple" />
      </div>
    );
  }

  if (error || !album) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="glass-panel p-6 text-red-400">
          Error: {error || 'Album not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <Link to="/gallery" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors group">
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Gallery
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header with cover image */}
          <div className="mb-12 relative h-[50vh] rounded-3xl overflow-hidden glass-panel">
            <img
              src={`${backend_url}${album.cover_image}`}
              alt={album.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-space-black via-space-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 font-display">{album.title}</h1>
              <p className="text-nebula-purple font-medium text-lg">
                Album #{album.album_number} - {album.album_date}
              </p>
              {album.description && (
                <p className="text-gray-300 mt-4 max-w-3xl text-lg leading-relaxed">{album.description}</p>
              )}
            </div>
          </div>

          {/* Photo grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {album.photos.map((photo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="aspect-square cursor-pointer group relative rounded-xl overflow-hidden"
                onClick={() => setSelectedPhoto(photo)}
              >
                <img
                  src={`${backend_url}${photo}`}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="bg-black/50 backdrop-blur-md p-3 rounded-full text-white">
                    <ZoomIn size={24} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Full-screen photo viewer */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-space-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              onClick={() => setSelectedPhoto(null)}
            >
              <X size={24} />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={`${backend_url}${selectedPhoto}`}
              alt="Selected photo"
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
