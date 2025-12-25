import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, FileText } from 'lucide-react';

const backend_url = import.meta.env.VITE_BACKEND_URL;

interface Section {
  heading: string;
  body: string;
  image?: string;
}

interface Issue {
  issue_number: string;
  title: string;
  cover_image: string;
  issue_date: string;
  sections: Section[];
}

export function PACTimesPage() {
  const { issueNumber } = useParams();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const response = await fetch(`${backend_url}/get_pac_times`);
        if (!response.ok) {
          throw new Error('Failed to fetch issue');
        }
        const data = await response.json();
        const foundIssue = data.issues.find(
          (i: Issue) => i.issue_number === issueNumber
        );
        if (!foundIssue) {
          throw new Error('Issue not found');
        }
        setIssue(foundIssue);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIssue();
  }, [issueNumber]);

  const linkify = (text: string) => {
    return text.split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
      part.match(/^https?:\/\//)
        ? <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-nebula-blue hover:text-nebula-purple underline decoration-dotted underline-offset-4 transition-colors">{part}</a>
        : part
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-nebula-purple" />
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="glass-panel p-6 text-red-400">
          Error: {error || 'Issue not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 relative">
      <div className="max-w-5xl mx-auto">
        <Link to="/pac-times" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors group">
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to PAC Times
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
              src={`${backend_url}${issue.cover_image}`}
              alt={issue.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-space-black via-space-black/50 to-transparent" />

            <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="px-4 py-2 rounded-full bg-nebula-blue/20 backdrop-blur-md border border-nebula-blue/30 text-nebula-blue font-bold text-sm">
                  ISSUE #{issue.issue_number}
                </div>
                <div className="flex items-center text-gray-300 text-sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{issue.issue_date}</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold font-display leading-tight text-white mb-2">{issue.title}</h1>
            </div>
          </div>

          <div className="p-8 md:p-12 space-y-16">
            {/* Sections */}
            {issue.sections && issue.sections.map((section, index) => (
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
                  <div className="rounded-2xl overflow-hidden glass-panel p-2 mt-8">
                    <img
                      src={`${backend_url}${section.image}`}
                      alt={section.heading}
                      className="w-full h-auto rounded-xl max-h-[600px] object-contain bg-black/20"
                    />
                  </div>
                )}
              </motion.div>
            ))}

            {(!issue.sections || issue.sections.length === 0) && (
              <div className="text-center py-12 text-gray-400">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No article content available for this issue.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
