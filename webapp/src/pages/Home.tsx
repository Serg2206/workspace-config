import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import FadeIn from '../components/FadeIn';
import { FileText, Presentation, Type, ArrowRight, Sparkles, Zap, Palette } from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'Word Template',
    description: 'Academic-Modern.dotx — 10 professional styles with Montserrat headings and Merriweather body text.',
    image: '/images/word-page-1.png',
    link: '/templates',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    icon: Presentation,
    title: 'PowerPoint Template',
    description: 'Conference-Pro.potx — 8 slide types for professional academic presentations.',
    image: '/images/ppt-slide-1.png',
    link: '/templates',
    color: 'from-orange-500 to-red-500'
  },
  {
    icon: Type,
    title: '9 Modern Fonts',
    description: 'Montserrat, Inter, Merriweather, Crimson Text, Source Code Pro, and more.',
    image: null,
    link: '/fonts',
    color: 'from-emerald-500 to-teal-600'
  }
];

const quickInstall = @`
# Quick Install (PowerShell as Administrator)
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force
cd "C:\Users\$env:USERNAME\Downloads\workspace-complete-v2"
.\Setup-Everything.ps1
`;

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1A236E] via-[#2d3a8c] to-[#536DFE] text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYyaC0xMnYtMmgxMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        <div className="relative px-8 py-16 md:py-24 text-center">
          <FadeIn>
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
              <Sparkles size={14} className="text-amber-300" />
              <span className="text-sm font-medium">v2.0 — Complete Workspace System</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              MS 365 Design System
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              Professional templates, fonts & automation for academic publishing. 
              Word, PowerPoint, and seamless workspace integration.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/templates"
                className="inline-flex items-center space-x-2 bg-white text-[#1A236E] px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg"
              >
                <span>Browse Templates</span>
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-colors border border-white/20"
              >
                <span>View Dashboard</span>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Feature Cards */}
      <section>
        <FadeIn>
          <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">
            What's Inside
          </h2>
        </FadeIn>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FadeIn key={feature.title} delay={index * 0.1}>
              <Link
                to={feature.link}
                className="group block bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300"
              >
                {feature.image && (
                  <div className="h-48 overflow-hidden bg-slate-100">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                {!feature.image && (
                  <div className={`h-48 bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                    <feature.icon size={48} className="text-white" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${feature.color}`}>
                      <feature.icon size={16} className="text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">{feature.title}</h3>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Quick Install */}
      <section>
        <FadeIn>
          <div className="bg-slate-900 rounded-2xl p-6 md:p-8">
            <div className="flex items-center space-x-3 mb-4">
              <Zap size={20} className="text-amber-400" />
              <h2 className="text-xl font-bold text-white">Quick Install</h2>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Run this in PowerShell (as Administrator) to install everything:
            </p>
            <pre className="bg-slate-800 rounded-xl p-4 text-sm overflow-x-auto">
              <code>{quickInstall}</code>
            </pre>
          </div>
        </FadeIn>
      </section>

      {/* Stats */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Fonts', value: '9', icon: Type },
            { label: 'Templates', value: '2', icon: FileText },
            { label: 'PowerShell Scripts', value: '7', icon: Zap },
            { label: 'Lines of Code', value: '3,200+', icon: Palette },
          ].map((stat, index) => (
            <FadeIn key={stat.label} delay={index * 0.05}>
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center hover:shadow-md transition-shadow">
                <stat.icon size={20} className="mx-auto text-[#536DFE] mb-2" />
                <div className="text-2xl font-bold text-[#1A236E]">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>
    </div>
  );
}
