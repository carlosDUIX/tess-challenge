import { motion, AnimatePresence } from 'motion/react';
import { Terminal, ChevronRight, Info, AlertTriangle, CheckCircle, XCircle, Activity } from 'lucide-react';
import { LogEntry } from '../types';
import { useEffect, useRef, useState } from 'react';

const Typewriter = ({ text, speed = 10 }: { text: string, speed?: number }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isDone, setIsDone] = useState(false);
  
  useEffect(() => {
    let i = 0;
    setIsDone(false);
    const timer = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(timer);
        setIsDone(true);
      }
    }, speed);
    
    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span>
      {displayedText}
      {!isDone && <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-tess-accent animate-pulse align-middle" />}
    </span>
  );
};

interface ActivityLogProps {
  logs: LogEntry[];
}

export const ActivityLog = ({ logs }: ActivityLogProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'info': return <Info className="w-3 h-3 text-blue-400" strokeWidth={1.5} />;
      case 'success': return <CheckCircle className="w-3 h-3 text-emerald-400" strokeWidth={1.5} />;
      case 'warning': return <AlertTriangle className="w-3 h-3 text-amber-400" strokeWidth={1.5} />;
      case 'error': return <XCircle className="w-3 h-3 text-rose-400" strokeWidth={1.5} />;
      case 'system': return <Terminal className="w-3 h-3 text-blue-500" strokeWidth={1.5} />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border border-tess-border rounded-xl overflow-hidden font-mono shadow-sm">
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-tess-border">
        <Terminal className="w-4 h-4 text-tess-text-dim" strokeWidth={1.5} />
        <span className="text-[11px] font-bold text-tess-text-dim tracking-widest uppercase">Agent Activity Log</span>
        <div className="flex gap-1.5 ml-auto">
          <div className="w-2 h-2 rounded-full bg-gray-200" />
          <div className="w-2 h-2 rounded-full bg-gray-200" />
          <div className="w-2 h-2 rounded-full bg-gray-200" />
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto terminal-scrollbar space-y-2 text-[12px] relative"
      >
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex gap-3 group p-1 rounded-md transition-colors ${
                log.type === 'system' 
                  ? 'bg-blue-50/50 border border-blue-100/50 -mx-1 px-2 py-1.5' 
                  : ''
              }`}
            >
              <span className={`shrink-0 select-none w-16 ${log.type === 'system' ? 'text-blue-400 font-bold' : 'text-gray-400'}`}>
                {log.timestamp.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <div className="flex gap-2 items-start">
                <span className="mt-0.5 shrink-0">{getLogIcon(log.type)}</span>
                <div className="flex flex-wrap gap-x-2">
                  <span className={`font-bold ${log.type === 'system' ? 'text-blue-600' : 'text-tess-accent'}`}>
                    [{log.agentName}]
                  </span>
                  <span className={`leading-relaxed ${log.type === 'system' ? 'text-blue-900 font-medium' : 'text-gray-700'}`}>
                    <Typewriter text={log.message} />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {logs.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-300 space-y-3">
            <Activity className="w-10 h-10 opacity-20" strokeWidth={1.5} />
            <p className="text-[11px] uppercase tracking-widest font-bold">Awaiting agent logs...</p>
          </div>
        )}
      </div>

      <div className="px-4 py-2 bg-gray-50 border-t border-tess-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">System Online</span>
        </div>
        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{logs.length} Events</span>
      </div>
    </div>
  );
};
