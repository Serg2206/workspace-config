import FadeIn from '../components/FadeIn';
import { motion } from 'framer-motion';
import { Cloud, BookOpen, Database, Github, Check, AlertTriangle, X, Clock, Activity } from 'lucide-react';

const services = [
  {
    name: 'OneDrive',
    icon: Cloud,
    status: 'Synced',
    color: 'bg-emerald-500',
    lightColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    details: [
      { label: 'Process', value: 'Running' },
      { label: 'Sync Folder', value: 'C:\\Users\\User\\OneDrive' },
      { label: 'Data Size', value: '12.4 GB' },
      { label: 'Last Sync', value: '2026-06-27 10:30' },
    ]
  },
  {
    name: 'Obsidian Vault',
    icon: BookOpen,
    status: '142 notes',
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    details: [
      { label: 'Vault Path', value: 'C:\\Obsidian' },
      { label: 'Is Junction', value: 'Yes' },
      { label: 'MD Files', value: '142' },
      { label: 'Vault Size', value: '86.3 MB' },
    ]
  },
  {
    name: 'Notion',
    icon: Database,
    status: '8 projects',
    color: 'bg-slate-800',
    lightColor: 'bg-slate-100',
    textColor: 'text-slate-700',
    details: [
      { label: 'API Status', value: 'Connected' },
      { label: 'Databases', value: '2' },
      { label: 'Pages', value: '18' },
      { label: 'Last Sync', value: '2 hours ago' },
    ]
  },
  {
    name: 'GitHub',
    icon: Github,
    status: 'Last backup 2h ago',
    color: 'bg-purple-500',
    lightColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    details: [
      { label: 'Repository', value: 'Initialized' },
      { label: 'Sync Status', value: 'Synced' },
      { label: 'Commits (7d)', value: '12' },
      { label: 'Branch', value: 'main' },
    ]
  },
];

const timeline = [
  { time: '07:00', event: 'Daily Note created', status: 'success' },
  { time: '07:30', event: 'OneDrive sync check', status: 'success' },
  { time: '09:15', event: 'New note: Meeting Notes', status: 'info' },
  { time: '12:00', event: 'Obsidian → Notion sync', status: 'success' },
  { time: '14:30', event: 'Word document edited', status: 'info' },
  { time: '18:00', event: 'GitHub backup', status: 'success' },
];

const tasks = [
  { name: 'MS365_DailyNotes', time: '07:00 daily', status: 'Ready', enabled: true },
  { name: 'MS365_OneDriveAutostart', time: 'At logon', status: 'Ready', enabled: true },
  { name: 'MS365_GitHubBackup', time: '18:00 daily', status: 'Ready', enabled: true },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <FadeIn>
        <h1 className="text-3xl font-bold text-[#1A236E] mb-2">Workspace Dashboard</h1>
        <p className="text-slate-500">Real-time status of your integrated workspace</p>
      </FadeIn>

      {/* Service Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((service, index) => (
          <FadeIn key={service.name} delay={index * 0.05}>
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-lg ${service.lightColor}`}>
                  <service.icon size={20} className={service.textColor} />
                </div>
                <div className={`w-2.5 h-2.5 rounded-full ${service.color}`}></div>
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">{service.name}</h3>
              <p className="text-sm text-slate-500 mb-3">{service.status}</p>
              <div className="space-y-1.5">
                {service.details.map((d) => (
                  <div key={d.label} className="flex justify-between text-xs">
                    <span className="text-slate-400">{d.label}</span>
                    <span className="text-slate-600 font-medium">{d.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </FadeIn>
        ))}
      </div>

      {/* Progress Bars */}
      <FadeIn>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-4">Storage & Progress</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">OneDrive Sync</span>
                <span className="text-slate-500">87%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-emerald-500 h-2.5 rounded-full transition-all" style={{ width: '87%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">Obsidian Vault Size</span>
                <span className="text-slate-500">86 MB</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full transition-all" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">Git Backup Frequency</span>
                <span className="text-slate-500">Daily</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-purple-500 h-2.5 rounded-full transition-all" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Timeline */}
        <FadeIn delay={0.1}>
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Activity Timeline</h3>
            <div className="space-y-3">
              {timeline.map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    item.status === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
                  }`}></div>
                  <div>
                    <p className="text-xs text-slate-400">{item.time}</p>
                    <p className="text-sm text-slate-700">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Task Scheduler */}
        <FadeIn delay={0.15}>
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Task Scheduler</h3>
            <div className="space-y-3">
              {tasks.map((task, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${task.enabled ? 'bg-emerald-500' : 'bg-red-400'}`}></div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">{task.name}</p>
                      <p className="text-xs text-slate-400">{task.time}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    task.status === 'Ready' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
