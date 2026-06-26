import FadeIn from '../components/FadeIn';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Check, BookOpen, Cloud, Database, FileText, Github } from 'lucide-react';

const tools = [
  { id: 'obsidian', name: 'Obsidian', icon: BookOpen, color: 'bg-blue-500', desc: 'Local notes & daily journaling' },
  { id: 'onedrive', name: 'OneDrive', icon: Cloud, color: 'bg-sky-500', desc: 'Cloud sync for vault' },
  { id: 'notion', name: 'Notion', icon: Database, color: 'bg-slate-800', desc: 'Team projects & tasks' },
  { id: 'github', name: 'GitHub', icon: Github, color: 'bg-purple-600', desc: 'Version control & backup' },
  { id: 'ms365', name: 'MS 365', icon: FileText, color: 'bg-orange-500', desc: 'Word, PowerPoint, Excel' },
];

const connections = [
  { from: 'obsidian', to: 'onedrive', label: 'Vault sync', items: ['.md files', 'Templates', 'Daily notes'] },
  { from: 'onedrive', to: 'notion', label: '#publish notes', items: ['Project pages', 'Research data'] },
  { from: 'onedrive', to: 'github', label: 'Daily backup', items: ['Git commits', 'Version history'] },
  { from: 'github', to: 'ms365', label: 'Templates', items: ['VBA macros', 'Academic styles'] },
  { from: 'ms365', to: 'notion', label: 'CRediT/COI', items: ['Author statements', 'Journal formats'] },
];

const schedulerTasks = [
  { time: '07:00', task: 'Create Daily Note', tool: 'Obsidian', status: 'active' },
  { time: '07:30', task: 'OneDrive sync check', tool: 'OneDrive', status: 'active' },
  { time: '09:00', task: 'Project work', tool: 'Notion', status: 'manual' },
  { time: '13:00', task: 'Obsidian → Notion sync', tool: 'Sync script', status: 'manual' },
  { time: '18:00', task: 'GitHub backup', tool: 'Git', status: 'active' },
  { time: '20:00', task: 'Weekly review', tool: 'Obsidian', status: 'manual' },
  { time: '23:00', task: 'Analytics sync', tool: 'Neon DB', status: 'optional' },
];

export default function Workflow() {
  return (
    <div className="space-y-8">
      <FadeIn>
        <h1 className="text-3xl font-bold text-[#1A236E] mb-2">Workflow</h1>
        <p className="text-slate-500">Data flow between your workspace tools</p>
      </FadeIn>

      {/* Data Flow Diagram */}
      <FadeIn>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
          <h3 className="font-semibold text-slate-800 mb-6">Data Flow Diagram</h3>

          {/* Tools Row */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {tools.map((tool) => (
              <motion.div
                key={tool.id}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center p-4 rounded-xl border border-slate-200 bg-slate-50 w-28"
              >
                <div className={`w-10 h-10 rounded-lg ${tool.color} flex items-center justify-center mb-2`}>
                  <tool.icon size={18} className="text-white" />
                </div>
                <span className="text-sm font-medium text-slate-700">{tool.name}</span>
                <span className="text-xs text-slate-400 text-center mt-1">{tool.desc}</span>
              </motion.div>
            ))}
          </div>

          {/* Connections */}
          <div className="space-y-3">
            {connections.map((conn, index) => {
              const fromTool = tools.find(t => t.id === conn.from)!;
              const toTool = tools.find(t => t.id === conn.to)!;
              return (
                <FadeIn key={index} delay={index * 0.05}>
                  <div className="flex items-center bg-slate-50 rounded-lg p-3">
                    <div className={`w-8 h-8 rounded-md ${fromTool.color} flex items-center justify-center flex-shrink-0`}>
                      <fromTool.icon size={14} className="text-white" />
                    </div>
                    <div className="flex-1 mx-3">
                      <div className="flex items-center space-x-2">
                        <ArrowRight size={14} className="text-slate-400" />
                        <span className="text-sm font-medium text-slate-600">{conn.label}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {conn.items.map((item) => (
                          <span key={item} className="text-xs bg-white px-2 py-0.5 rounded text-slate-500 border border-slate-200">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className={`w-8 h-8 rounded-md ${toTool.color} flex items-center justify-center flex-shrink-0`}>
                      <toTool.icon size={14} className="text-white" />
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </FadeIn>

      {/* Task Scheduler */}
      <FadeIn delay={0.1}>
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-semibold text-slate-800">Daily Schedule</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-600">
                  <th className="text-left px-6 py-3 font-medium">Time</th>
                  <th className="text-left px-6 py-3 font-medium">Task</th>
                  <th className="text-left px-6 py-3 font-medium">Tool</th>
                  <th className="text-left px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {schedulerTasks.map((task, index) => (
                  <tr key={index} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3 font-mono text-slate-500">{task.time}</td>
                    <td className="px-6 py-3 text-slate-800">{task.task}</td>
                    <td className="px-6 py-3 text-slate-600">{task.tool}</td>
                    <td className="px-6 py-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        task.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                        task.status === 'optional' ? 'bg-slate-100 text-slate-600' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {task.status === 'active' ? 'Auto' : task.status === 'optional' ? 'Optional' : 'Manual'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </FadeIn>

      {/* Legend */}
      <FadeIn delay={0.15}>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-4">Connection Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Auto sync', color: 'bg-emerald-500', desc: 'Task Scheduler' },
              { label: 'Manual sync', color: 'bg-blue-500', desc: 'Run on demand' },
              { label: 'File sync', color: 'bg-sky-500', desc: 'OneDrive/Cloud' },
              { label: 'Optional', color: 'bg-slate-400', desc: 'Configure if needed' },
            ].map((item) => (
              <div key={item.label} className="flex items-center space-x-2 p-3 rounded-lg bg-slate-50">
                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                <div>
                  <p className="text-xs font-medium text-slate-700">{item.label}</p>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
