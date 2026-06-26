import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Github, ExternalLink } from 'lucide-react';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/templates', label: 'Templates' },
  { path: '/fonts', label: 'Fonts' },
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/workflow', label: 'Workflow' },
];

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#1A236E] to-[#536DFE] flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-[#1A236E] to-[#536DFE] bg-clip-text text-transparent">
                MS 365 Design
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === link.path
                      ? 'bg-[#1A236E]/10 text-[#1A236E]'
                      : 'text-slate-600 hover:text-[#1A236E] hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-slate-200 overflow-hidden"
            >
              <div className="px-4 py-3 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === link.path
                        ? 'bg-[#1A236E]/10 text-[#1A236E]'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#1A236E] to-[#536DFE] flex items-center justify-center">
                  <span className="text-white font-bold text-xs">M</span>
                </div>
                <span className="font-bold text-slate-800">MS 365 Design</span>
              </div>
              <p className="text-sm text-slate-500">
                Professional templates, fonts & automation for academic publishing.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold text-slate-800 mb-3">Resources</h4>
              <div className="space-y-2">
                <a href="https://github.com/Serg2206/workspace-config" target="_blank" rel="noopener noreferrer"
                   className="flex items-center text-sm text-slate-500 hover:text-[#1A236E] transition-colors">
                  <Github size={14} className="mr-2" /> GitHub Repository
                </a>
                <a href="https://iusigf6hsqxqy.kimi.page" target="_blank" rel="noopener noreferrer"
                   className="flex items-center text-sm text-slate-500 hover:text-[#1A236E] transition-colors">
                  <ExternalLink size={14} className="mr-2" /> Live Dashboard
                </a>
              </div>
            </div>

            {/* Tools */}
            <div>
              <h4 className="font-semibold text-slate-800 mb-3">Tools</h4>
              <div className="space-y-2 text-sm text-slate-500">
                <p>Word Academic-Modern.dotx</p>
                <p>PowerPoint Conference-Pro.potx</p>
                <p>9 Professional Fonts</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 mt-8 pt-6 text-center text-sm text-slate-400">
            &copy; 2026 MS 365 Workspace Design System. Built for academic publishing.
          </div>
        </div>
      </footer>
    </div>
  );
}
