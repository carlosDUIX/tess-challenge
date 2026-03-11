import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Users, 
  Zap, 
  Settings, 
  Search, 
  Bell, 
  Command,
  Send,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { Agent, LogEntry, AgentStatus } from '../types';
import { AgentCard } from './AgentCard';
import { ActivityLog } from './ActivityLog';

const INITIAL_AGENTS: Agent[] = [
  {
    id: '1',
    name: 'Research Analyst',
    model: 'Gemini 3.1 Pro',
    status: 'executing',
    progress: 45,
    lastAction: 'Analyzing market trends for Q3 2024...',
    color: 'bg-blue-500',
    iconName: 'Search'
  },
  {
    id: '2',
    name: 'Code Architect',
    model: 'Claude 3.5 Sonnet',
    status: 'thinking',
    progress: 12,
    lastAction: 'Optimizing database schema for scalability...',
    color: 'bg-purple-500',
    iconName: 'Code'
  },
  {
    id: '3',
    name: 'Content Strategist',
    model: 'GPT-4o',
    status: 'done',
    progress: 100,
    lastAction: 'Campaign brief generated successfully.',
    color: 'bg-emerald-500',
    iconName: 'PenTool'
  },
  {
    id: '4',
    name: 'Data Scientist',
    model: 'Llama 3.1 405B',
    status: 'idle',
    progress: 0,
    lastAction: 'Ready for next batch processing.',
    color: 'bg-amber-500',
    iconName: 'Database'
  }
];

const INITIAL_LOGS: LogEntry[] = [
  {
    id: 'l1',
    agentId: '3',
    agentName: 'Content Strategist',
    message: 'Analyzing target audience demographics...',
    timestamp: new Date(Date.now() - 500000),
    type: 'info'
  },
  {
    id: 'l2',
    agentId: '3',
    agentName: 'Content Strategist',
    message: 'SEO keywords identified and prioritized.',
    timestamp: new Date(Date.now() - 400000),
    type: 'success'
  },
  {
    id: 'l3',
    agentId: '3',
    agentName: 'Content Strategist',
    message: 'Drafting social media content calendar...',
    timestamp: new Date(Date.now() - 300000),
    type: 'info'
  },
  {
    id: 'l4',
    agentId: '3',
    agentName: 'Content Strategist',
    message: 'Campaign brief generated successfully.',
    timestamp: new Date(Date.now() - 200000),
    type: 'success'
  }
];

export const CommandCenter = () => {
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [selectedAgentId, setSelectedAgentId] = useState<string>(INITIAL_AGENTS[0].id);
  const [prompt, setPrompt] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addLog = useCallback((agentId: string, message: string, type: LogEntry['type'] = 'info') => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return;

    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      agentId,
      agentName: agent.name,
      message,
      timestamp: new Date(),
      type
    };

    setLogs(prev => [...prev.slice(-99), newLog]); // Keep last 100 logs
  }, [agents]);

  // Simulate agent activity
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => {
        if (agent.status === 'done' || agent.status === 'idle') return agent;

        // If thinking, there's a chance to transition to executing
        if (agent.status === 'thinking') {
          const shouldStartExecuting = Math.random() > 0.7; // 30% chance each second
          if (shouldStartExecuting) {
            const startAction = 'Analysis complete. Starting execution phase...';
            addLog(agent.id, startAction, 'success');
            return { ...agent, status: 'executing', progress: 2, lastAction: startAction };
          }
          return agent; // Stay in thinking
        }

        // Only increment progress if executing
        // Faster progress for better UX
        const increment = Math.floor(Math.random() * 4) + 1; 
        const newProgress = Math.min(100, agent.progress + increment);
        const newStatus: AgentStatus = newProgress === 100 ? 'done' : agent.status;
        
        if (newProgress !== agent.progress) {
          // Log more frequently to show activity
          if (Math.random() > 0.85) {
            const actions = [
              'Processing data chunk...',
              'Refining response parameters...',
              'Validating output against constraints...',
              'Querying internal knowledge base...',
              'Synthesizing multi-modal inputs...',
              'Generating intermediate results...',
              'Optimizing performance bottlenecks...'
            ];
            const action = actions[Math.floor(Math.random() * actions.length)];
            addLog(agent.id, action, 'info');
            return { ...agent, progress: newProgress, status: newStatus, lastAction: action };
          }
        }

        return { ...agent, progress: newProgress, status: newStatus };
      }));
    }, 1000); // Faster interval (1s instead of 3s)

    return () => clearInterval(interval);
  }, [addLog]);

  const handleSendPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const agent = agents.find(a => a.id === selectedAgentId);
    if (agent) {
      addLog(agent.id, `User instruction: ${prompt}`, 'system');
      
      setAgents(prev => prev.map(a => 
        a.id === selectedAgentId 
          ? { ...a, status: 'thinking', progress: 0, lastAction: 'Analyzing command and planning steps...' } 
          : a
      ));

      setTimeout(() => {
        addLog(selectedAgentId, 'Task acknowledged. Starting execution...', 'success');
      }, 1000);
    }

    setPrompt('');
  };

  const selectedAgent = agents.find(a => a.id === selectedAgentId);
  const filteredLogs = logs.filter(log => log.agentId === selectedAgentId);

  const activeAgentsCount = agents.filter(a => a.status === 'executing' || a.status === 'thinking').length;
  const completedTasksCount = agents.filter(a => a.status === 'done').length;
  const idleAgentsCount = agents.filter(a => a.status === 'idle').length;
  const totalAgentsCount = agents.length;

  return (
    <div className="flex h-screen overflow-hidden bg-tess-bg text-tess-text">
      {/* Sidebar */}
      <aside className="w-12 md:w-56 border-r border-tess-border flex flex-col bg-white z-20">
        <div className="p-4 md:p-6 flex justify-center md:justify-start">
          <img src="https://tess.im/assets/img/logo/Tess/tess-light.svg" alt="Tess Logo" className="h-8 w-auto hidden md:block" referrerPolicy="no-referrer" />
          <img src="https://tess.im/assets/img/logo/Tess/tess-light.svg" alt="Tess Logo" className="h-6 w-auto md:hidden" referrerPolicy="no-referrer" />
        </div>

        <nav className="flex-1 px-3 py-2 space-y-1">
          {[
            { icon: LayoutDashboard, label: 'Command Center', active: true, },
            { icon: Users, label: 'Agent Fleet', active: false },
            { icon: Activity, label: 'Analytics', active: false },
            { icon: Zap, label: 'Integrations', active: false },
            { icon: Settings, label: 'Settings', active: false },
          ].map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                item.active 
                  ? 'bg-gray-200 text-gray-800' 
                  : 'text-gray-900 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" strokeWidth={1.5} />
              <span className="font-medium text-sm hidden md:block">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-tess-bg h-full">
        {/* Header */}
        <header className="h-16 border-b border-tess-border flex items-center justify-between px-6 bg-white/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-bold tracking-tight text-gray-900">Command Center</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={1.5} />
              <input 
                type="text" 
                placeholder="Search agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:border-tess-accent w-48 transition-all"
              />
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
              <Bell className="w-5 h-5" strokeWidth={1.5} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
              <span className="text-xs font-bold text-gray-600">CD</span>
            </div>
          </div>
        </header>

        {/* Dashboard Grid - Responsive Layout */}
        <div className="flex-1 p-4 md:p-4 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0 overflow-y-auto lg:overflow-hidden">
          
          {/* Left Column: Agents Feed */}
          <div className="lg:col-span-4 flex flex-col min-h-[300px] lg:min-h-0">
            <div className="flex flex-col gap-3 mb-4 shrink-0">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Users className="w-4 h-4" strokeWidth={1.5} /> Agent Fleet
              </h2>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                  <span className="text-[10px] text-gray-600 font-mono font-bold">{totalAgentsCount} AGENTS</span>
                </div>
                <div className="flex items-center gap-1.5 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                  <span className="text-[10px] text-blue-600 font-mono font-bold">{activeAgentsCount} ACTIVE</span>
                </div>
                <div className="flex items-center gap-1.5 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                  <span className="text-[10px] text-amber-600 font-mono font-bold">{idleAgentsCount} IDLE</span>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  <span className="text-[10px] text-emerald-600 font-mono font-bold">{completedTasksCount} DONE</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto lg:overflow-y-auto px-1 pr-2 terminal-scrollbar space-y-3 py-2 pb-4 max-h-[400px] lg:max-h-none">
              <AnimatePresence mode="popLayout">
                {filteredAgents.length > 0 ? (
                  filteredAgents.map((agent) => (
                    <AgentCard 
                      key={agent.id} 
                      agent={agent} 
                      isActive={selectedAgentId === agent.id}
                      onClick={() => setSelectedAgentId(agent.id)}
                    />
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="p-3 bg-gray-50 rounded-full mb-3">
                      <Search className="w-6 h-6 text-gray-300" />
                    </div>
                    <p className="text-sm text-gray-400 font-medium">No agents found</p>
                    <p className="text-xs text-gray-300">Try a different search term</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Log & Interaction */}
          <div className="lg:col-span-8 flex flex-col min-h-[500px] lg:min-h-0 gap-6">
            {/* Activity Log Section */}
            <div className="flex-1 min-h-[300px] lg:min-h-0">
              <ActivityLog logs={filteredLogs} />
            </div>

            {/* Command Input Section */}
            <div className="bg-white border border-tess-border rounded-2xl p-4 md:p-5 shadow-sm shrink-0 mb-4 lg:mb-0">
              <form onSubmit={handleSendPrompt} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 rounded-lg">
                      <Command className="w-4 h-4 text-tess-accent" strokeWidth={1.5} />
                    </div>
                    <span className="text-xs font-bold text-gray-700">
                      Direct Command to <span className="text-tess-accent">{selectedAgent?.name}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono uppercase tracking-widest font-bold">
                    <span>Model: {selectedAgent?.model}</span>
                  </div>
                </div>

                <div className="relative group">
                  <input 
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={`Dispatch command to ${selectedAgent?.name}...`}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 pl-4 pr-14 text-sm focus:outline-none focus:border-tess-accent/50 transition-all placeholder:text-gray-400 text-gray-900"
                  />
                  <button 
                    type="submit"
                    disabled={!prompt.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-tess-accent text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                  >
                    <Send className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};
