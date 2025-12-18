import { Link } from 'react-router-dom';
import { Github, Instagram, Mail, MapPin } from 'lucide-react';
import Logo from '/PAC_logo_circle.svg';

export function Footer() {
  const footerSections = [
    {
      title: 'Quick Links',
      links: [
        { name: 'PAC Times', path: '/pac-times' },
        { name: 'Our Team', path: '/teams' },
        { name: 'Admin', path: '/admin' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Reading Circle', path: '/reading-circle' },
        { name: 'Photo Gallery', path: '/gallery' },
        { name: 'Events', path: '/pac-events' },
      ]
    }
  ];

  const socialLinks = [
    { icon: <Github className="h-5 w-5" />, href: 'https://github.com/pac-iitd', label: 'GitHub' },
    { icon: <Instagram className="h-5 w-5" />, href: 'https://instagram.com/pac_iitd', label: 'Instagram' },
    { icon: <Mail className="h-5 w-5" />, href: 'mailto:pac@iitd.ac.in', label: 'Email' },
  ];

  return (
    <footer className="relative mt-20 border-t border-white/10 bg-space-black/50 backdrop-blur-xl overflow-hidden">
      {/* Top Gradient Fade */}
      <div className="absolute inset-x-0 -top-40 h-40 bg-gradient-to-t from-space-black to-transparent pointer-events-none" />

      {/* Planet Glow Effect */}
      <div className="absolute -bottom-[400px] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-nebula-blue/20 blur-[100px] rounded-[100%] pointer-events-none" />
      <div className="absolute -bottom-[450px] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-nebula-purple/20 blur-[80px] rounded-[100%] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-8">
          {/* Logo and About Section */}
          <div className="flex flex-col space-y-6 max-w-sm">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-nebula-blue/30 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <img src={Logo} alt="PAC Logo" className="h-14 w-14 object-contain group-hover:rotate-12 transition-transform duration-500 relative z-10" />
              </div>
              <div>
                <span className="font-display font-bold text-2xl tracking-wider text-white">PAC IITD</span>
                <p className="text-xs text-nebula-blue tracking-widest uppercase">Physics & Astronomy Club</p>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed font-light">
              The Physics and Astronomy Club at IIT Delhi is a community of space enthusiasts,
              researchers, and curious minds exploring the mysteries of the universe together.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-nebula-blue transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8">
            {/* Quick Links and Resources */}
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="font-display font-bold text-white mb-6 uppercase tracking-wider text-sm border-b border-white/10 pb-2 inline-block">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        className="text-gray-400 hover:text-nebula-blue transition-colors text-sm flex items-center group"
                      >
                        <span className="w-0 group-hover:w-3 h-px bg-nebula-blue mr-0 group-hover:mr-2 transition-all duration-300" />
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact Information */}
            <div>
              <h3 className="font-display font-bold text-white mb-6 uppercase tracking-wider text-sm border-b border-white/10 pb-2 inline-block">
                Contact Us
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 group">
                  <MapPin className="h-5 w-5 text-nebula-purple mt-1 group-hover:animate-bounce" />
                  <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                    WS120, Physics and Astronomy<br />
                    Club, Central Workshop, IIT Delhi,<br />
                    Hauz Khas, Delhi, 110016
                  </p>
                </div>
                <div className="flex items-center space-x-3 group">
                  <Mail className="h-5 w-5 text-nebula-purple" />
                  <a
                    href="mailto:pac@iitd.ac.in"
                    className="text-gray-400 hover:text-nebula-purple transition-colors text-sm group-hover:underline decoration-nebula-purple/50 underline-offset-4"
                  >
                    pac@iitd.ac.in
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Physics and Astronomy Club, IIT Delhi.</p>
            <div className="mt-4 md:mt-0 space-x-6">
              <Link to="#privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="#terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;