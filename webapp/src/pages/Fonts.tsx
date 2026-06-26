import FadeIn from '../components/FadeIn';
import { Type } from 'lucide-react';

const fonts = [
  { name: 'Montserrat', class: 'Sans-serif', use: 'Headings, presentations', sample: 'The quick brown fox jumps over the lazy dog.' },
  { name: 'Inter', class: 'Sans-serif', use: 'UI, labels, slides', sample: 'The quick brown fox jumps over the lazy dog.' },
  { name: 'Merriweather', class: 'Serif', use: 'Main text, articles', sample: 'The quick brown fox jumps over the lazy dog.' },
  { name: 'Crimson Text', class: 'Serif', use: 'Quotes, emphasis', sample: 'The quick brown fox jumps over the lazy dog.' },
  { name: 'Literata', class: 'Serif', use: 'Long forms, books', sample: 'The quick brown fox jumps over the lazy dog.' },
  { name: 'Source Sans 3', class: 'Sans-serif', use: 'Tables, diagrams', sample: 'The quick brown fox jumps over the lazy dog.' },
  { name: 'Source Code Pro', class: 'Monospace', use: 'Code, data', sample: 'const x = 42; // The quick brown fox' },
  { name: 'Playfair Display', class: 'Serif', use: 'Title slides', sample: 'The quick brown fox jumps over the lazy dog.' },
  { name: 'Lora', class: 'Serif', use: 'Alternative body text', sample: 'The quick brown fox jumps over the lazy dog.' },
];

const classColors: Record<string, string> = {
  'Sans-serif': 'bg-blue-100 text-blue-700',
  'Serif': 'bg-emerald-100 text-emerald-700',
  'Monospace': 'bg-purple-100 text-purple-700',
};

export default function Fonts() {
  return (
    <div className="space-y-8">
      <FadeIn>
        <h1 className="text-3xl font-bold text-[#1A236E] mb-2">Fonts</h1>
        <p className="text-slate-500">9 professional font families for academic publishing</p>
      </FadeIn>

      {/* Font Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fonts.map((font, index) => (
          <FadeIn key={font.name} delay={index * 0.05}>
            <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-800">{font.name}</h3>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${classColors[font.class]}`}>
                  {font.class}
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-3">{font.use}</p>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-sm text-slate-600 italic">{font.sample}</p>
              </div>
              <div className="mt-3 text-xs text-slate-400">
                <code>@import url('https://fonts.googleapis.com/css2?family={font.name.replace(' ', '+')}@display=swap');</code>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      {/* Summary Table */}
      <FadeIn>
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-semibold text-slate-800">Font Reference Table</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-600">
                  <th className="text-left px-6 py-3 font-medium">Font</th>
                  <th className="text-left px-6 py-3 font-medium">Class</th>
                  <th className="text-left px-6 py-3 font-medium">Use Case</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fonts.map((font) => (
                  <tr key={font.name} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3 font-medium text-slate-800">{font.name}</td>
                    <td className="px-6 py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${classColors[font.class]}`}>
                        {font.class}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-500">{font.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </FadeIn>

      {/* CSS Import */}
      <FadeIn>
        <div className="bg-slate-900 rounded-2xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Type size={18} className="text-amber-400" />
            <h3 className="text-white font-semibold">CSS Import</h3>
          </div>
          <pre className="bg-slate-800 rounded-xl p-4 text-sm overflow-x-auto">
            <code>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&family=Merriweather:ital,wght@0,400;0,700;1,400&family=Crimson+Text:ital,wght@0,400;0,700;1,400&family=Source+Code+Pro:wght@400;500&family=Playfair+Display:wght@400;700&display=swap');`}</code>
          </pre>
        </div>
      </FadeIn>
    </div>
  );
}
