import { motion } from 'framer-motion';
import { BookOpen, Calendar, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

const backend_url = import.meta.env.VITE_BACKEND_URL;

interface Issue {
  issue_number: string;
  title: string;
  cover_image: string;
  issue_date: string;
}

export function PACTimes() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await fetch(`${backend_url}/get_pac_times`);
        if (!response.ok) {
          throw new Error('Failed to fetch issues');
        }
        const data = await response.json();
        // Sort issues by date descending
        const sortedIssues = data.issues.sort((a: Issue, b: Issue) => {
          const dateA = new Date(a.issue_date).getTime();
          const dateB = new Date(b.issue_date).getTime();
          const validDateA = isNaN(dateA) ? 0 : dateA;
          const validDateB = isNaN(dateB) ? 0 : dateB;
          return validDateB - validDateA;
        });
        setIssues(sortedIssues);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const handleReadIssue = (issueNumber: string) => {
    navigate(`/pac-times/${issueNumber}`);
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
      <div className="absolute inset-0 bg-gradient-radial from-nebula-blue/10 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-block p-4 rounded-full bg-white/5 mb-6 backdrop-blur-sm">
            <BookOpen className="h-12 w-12 text-nebula-blue" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-display">PAC Times</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Our weekly magazine featuring the latest breakthroughs in physics and astronomy.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {issues.map((issue, index) => (
            <motion.div
              key={issue.issue_number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel rounded-2xl overflow-hidden group flex flex-col h-full hover:shadow-[0_0_30px_rgba(56,189,248,0.15)] transition-all duration-300"
            >
              <div className="relative h-72 overflow-hidden bg-space-black/50">
                {/* Blurred background for fill */}
                <div
                  className="absolute inset-0 bg-cover bg-center blur-xl opacity-40 scale-110 transition-transform duration-700 group-hover:scale-125"
                  style={{ backgroundImage: `url(${backend_url}${issue.cover_image})` }}
                />

                {/* Main image - fully visible */}
                <img
                  src={`${backend_url}${issue.cover_image}`}
                  alt={issue.title}
                  className="relative w-full h-full object-contain z-10 p-2 transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-space-black/90 to-transparent opacity-0 group-hover:opacity-40 transition-opacity z-20" />
                <div className="absolute bottom-4 left-4 z-30">
                  <span className="px-3 py-1 bg-nebula-blue/80 backdrop-blur-sm rounded-full text-xs font-bold text-white shadow-lg">
                    ISSUE #{issue.issue_number}
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center text-sm text-nebula-blue mb-3 font-medium">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{issue.issue_date || 'Date TBA'}</span>
                </div>

                <h3 className="text-xl font-bold mb-4 font-display leading-tight group-hover:text-nebula-blue transition-colors">
                  {issue.title}
                </h3>

                <div className="mt-auto pt-4 border-t border-white/10">
                  <Button
                    onClick={() => handleReadIssue(issue.issue_number)}
                    variant="outline"
                    className="w-full justify-center group-hover:bg-nebula-blue group-hover:border-nebula-blue group-hover:text-white"
                  >
                    Read Full Issue <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
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