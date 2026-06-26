import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FadeIn from '../components/FadeIn';
import { FileText, Presentation, Check, Download } from 'lucide-react';

const wordStyles = [
  { name: 'Title', font: 'Montserrat 28pt Bold', color: '#111', align: 'Center' },
  { name: 'Heading 1', font: 'Montserrat 22pt Bold', color: '#1A236E', align: 'Left' },
  { name: 'Heading 2', font: 'Montserrat 16pt Bold', color: '#1A236E', align: 'Left' },
  { name: 'Heading 3', font: 'Montserrat 13pt Bold', color: '#2D2D2D', align: 'Left' },
  { name: 'Normal', font: 'Merriweather 11pt', color: '#2D2D2D', align: 'Justify' },
  { name: 'Quote', font: 'Crimson Text 11pt Italic', color: '#666', align: 'Left' },
  { name: 'Caption', font: 'Montserrat 9pt Italic', color: '#666', align: 'Left' },
  { name: 'Reference', font: 'Merriweather 10pt', color: '#2D2D2D', align: 'Left' },
  { name: 'Abstract', font: 'Merriweather 10.5pt Italic', color: '#666', align: 'Justify' },
];

const pptSlides = [
  'Title — Dark background, Montserrat 44pt, accent bar',
  'Section Divider — Big number + section name',
  'Content — Light bg, bullet points Inter 18pt',
  'Two-Column — Comparison layout',
  'Data/Chart — Chart area + key numbers',
  'Image+Text — Picture + description',
  'References — Formatted bibliography',
  'Thank You / Q&A — Dark bg, contacts',
];

export default function Templates() {
  const [activeTab, setActiveTab] = useState<'word' | 'ppt'>('word');

  return (
    <div className="space-y-8">
      <FadeIn>
        <h1 className="text-3xl font-bold text-[#1A236E] mb-2">Templates</h1>
        <p className="text-slate-500">Professional templates for academic publishing</p>
      </FadeIn>

      {/* Tabs */}
      <FadeIn delay={0.1}>
        <div className="flex space-x-1 bg-slate-100 rounded-xl p-1 w-fit">
          <button
            onClick={() => setActiveTab('word')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'word'
                ? 'bg-white text-[#1A236E] shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileText size={16} />
            <span>Word</span>
          </button>
          <button
            onClick={() => setActiveTab('ppt')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'ppt'
                ? 'bg-white text-[#1A236E] shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Presentation size={16} />
            <span>PowerPoint</span>
          </button>
        </div>
      </FadeIn>

      <AnimatePresence mode="wait">
        {activeTab === 'word' ? (
          <motion.div
            key="word"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* Word Previews */}
            <FadeIn>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <img src="/images/word-page-1.png" alt="Word Template Page 1" className="w-full" />
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <img src="/images/word-page-2.png" alt="Word Template Page 2" className="w-full" />
                </div>
              </div>
            </FadeIn>

            {/* Styles Table */}
            <FadeIn delay={0.1}>
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                  <h3 className="font-semibold text-slate-800">Academic-Modern.dotx — Style Reference</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600">
                        <th className="text-left px-6 py-3 font-medium">Style Name</th>
                        <th className="text-left px-6 py-3 font-medium">Font</th>
                        <th className="text-left px-6 py-3 font-medium">Color</th>
                        <th className="text-left px-6 py-3 font-medium">Align</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {wordStyles.map((style) => (
                        <tr key={style.name} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-3 font-medium text-slate-800">{style.name}</td>
                          <td className="px-6 py-3 text-slate-600">{style.font}</td>
                          <td className="px-6 py-3">
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 rounded-full border border-slate-200" style={{ backgroundColor: style.color }}></div>
                              <span className="text-slate-500">{style.color}</span>
                            </div>
                          </td>
                          <td className="px-6 py-3 text-slate-500">{style.align}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </FadeIn>
          </motion.div>
        ) : (
          <motion.div
            key="ppt"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* PPT Previews */}
            <FadeIn>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <img src={`/images/ppt-slide-${n}.png`} alt={`Slide ${n}`} className="w-full" />
                  </div>
                ))}
              </div>
            </FadeIn>

            {/* Slide Types */}
            <FadeIn delay={0.1}>
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-800 mb-4">Conference-Pro.potx — 8 Slide Types</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {pptSlides.map((slide, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50">
                      <div className="w-6 h-6 rounded-full bg-[#1A236E] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <span className="text-sm text-slate-700">{slide}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
