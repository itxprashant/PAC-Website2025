import teamdata2425 from '../../TeamsData2024-25.json'
import teamdata2526 from '../../TeamsData2025-26.json'
import { motion } from 'framer-motion';
import { ChevronDown, Mail } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { TeamBackground } from '../components/TeamBackground'

// Custom hook to get number of cards per row based on container width
function useCardsPerRow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardsPerRow, setCardsPerRow] = useState(3);

  useEffect(() => {
    const updateCardsPerRow = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const cardWidth = 350; // Increased width for better spacing
        const gap = 32;
        const maxCards = Math.floor((containerWidth + gap) / (cardWidth + gap));
        setCardsPerRow(Math.max(1, maxCards));
      }
    };

    updateCardsPerRow();
    window.addEventListener('resize', updateCardsPerRow);
    return () => window.removeEventListener('resize', updateCardsPerRow);
  }, []);

  return { containerRef, cardsPerRow };
}

function TeamSection({ title, positions, teamData, selectedYear }: { title: string, positions: string | string[], teamData: any[], selectedYear: string }) {
  const [visibleContacts, setVisibleContacts] = useState<number[]>([]);
  const { containerRef, cardsPerRow } = useCardsPerRow();

  const toggleContact = (index: number) => {
    setVisibleContacts(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // Generate image path based on selected year and member img path
  const getImagePath = (memberImg: string, year: string) => {
    if (memberImg.includes('team-photos-')) {
      return memberImg;
    }
    if (memberImg.startsWith('/team-photos/')) {
      return memberImg.replace('/team-photos/', `/team-photos-${year}/`);
    }
    return `/team-photos-${year}/${memberImg}`;
  };

  return (
    <>
      {title && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative mt-24 mb-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white relative z-10 inline-block">
            {title}
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-nebula-blue to-transparent" />
          </h2>
        </motion.div>
      )}
      <div className="flex justify-center">
        <div ref={containerRef} className="flex flex-wrap gap-8 justify-center max-w-[1400px]">
          {teamData.filter((member) =>
            typeof positions === 'string'
              ? member.Position === positions
              : positions.includes(member.Position)
          ).map((member, index) => {
            const rowPosition = index % cardsPerRow * 0.1;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: rowPosition }}
                className="w-[300px] md:w-[350px] relative group"
              >
                <div className="glass-panel p-3 rounded-2xl overflow-hidden transition-all duration-300 group-hover:bg-white/10 group-hover:scale-[1.02] group-hover:shadow-[0_0_30px_rgba(124,58,237,0.2)]">
                  <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-4">
                    <img
                      src={getImagePath(member.img, selectedYear)}
                      alt={member.Name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-space-black/90 via-space-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  </div>

                  <div className="text-center px-2 pb-2">
                    <h3 className="text-xl font-bold text-white mb-1 font-display tracking-wide">{member.Name}</h3>
                    <p className="text-nebula-blue font-medium text-sm mb-3 uppercase tracking-wider">{member.Field} {member.Position}</p>

                    <div className={`overflow-hidden transition-all duration-300 ${visibleContacts.includes(index) ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="pt-2 border-t border-white/10 text-sm text-gray-300 space-y-1">
                        <p className="flex items-center justify-center gap-2"><Mail size={14} /> {member.Email}</p>
                        {['Overall Coordinator', 'CTM'].includes(member.Position) && member['Mobile Number'] && (
                          <p>{member['Mobile Number']}</p>
                        )}
                      </div>
                    </div>

                    {member.Email && (
                      <button
                        onClick={() => toggleContact(index)}
                        className={`mt-2 p-2 rounded-full transition-all duration-300 ${visibleContacts.includes(index)
                          ? 'bg-nebula-purple text-white rotate-180'
                          : 'bg-white/5 text-gray-400 hover:bg-white/20 hover:text-white'
                          }`}
                      >
                        <ChevronDown size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export function Teams() {
  const [selectedYear, setSelectedYear] = useState('2025-26');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const yearOptions = [
    { value: '2025-26', label: '2025-26', data: teamdata2526 },
    { value: '2024-25', label: '2024-25', data: teamdata2425 }
  ];

  const currentTeamData = yearOptions.find(option => option.value === selectedYear)?.data || teamdata2526;

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 bg-space-black z-0">
        <TeamBackground />
        <div className="absolute inset-0 bg-space-black/80 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-6xl font-bold font-display text-white mb-2"
              >
                Our Team
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-gray-400"
              >
                Meet the passionate individuals behind PAC
              </motion.p>
            </div>

            {/* Year Selector */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 px-6 py-3 glass-panel rounded-xl text-white hover:bg-white/10 transition-all min-w-[160px] justify-between"
              >
                <span className="font-medium">{selectedYear}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full right-0 mt-2 w-full glass-panel rounded-xl overflow-hidden z-30"
                >
                  {yearOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSelectedYear(option.value);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full px-6 py-3 text-left transition-colors text-sm font-medium ${selectedYear === option.value
                        ? 'bg-nebula-blue/20 text-nebula-blue'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <TeamSection positions={['Faculty President', 'Overall Coordinator']} title="Leadership" teamData={currentTeamData} selectedYear={selectedYear} />
            {selectedYear === '2024-25' && (
              <>
                <TeamSection positions="Panel Member" title="Panel Members" teamData={currentTeamData} selectedYear={selectedYear} />
                <TeamSection positions="CTM" title="Core Team Members" teamData={currentTeamData} selectedYear={selectedYear} />
              </>
            )}
            <TeamSection positions="Coordinator" title="Coordinators" teamData={currentTeamData} selectedYear={selectedYear} />
            <TeamSection positions="Executive" title="Executives" teamData={currentTeamData} selectedYear={selectedYear} />
          </div>
        </div>
      </div>
    </div>
  );
}
