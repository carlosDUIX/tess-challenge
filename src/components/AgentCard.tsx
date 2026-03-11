import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  CheckCircle2, 
  Loader2, 
  Play, 
  AlertCircle,
  Search,
  Code,
  PenTool,
  Database
} from 'lucide-react';
import { Agent } from '../types';

const IconMap: Record<string, any> = {
  Search,
  Code,
  PenTool,
  Database,
  Cpu
};

interface AgentCardProps {
  agent: Agent;
  isActive: boolean;
  onClick: () => void;
  key?: string;
}

export const AgentCard = ({ agent, isActive, onClick }: AgentCardProps) => {
  const getStatusIcon = () => {
    switch (agent.status) {
      case 'thinking':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-400" strokeWidth={1.5} />;
      case 'executing':
        return <Play className="w-4 h-4 animate-pulse text-blue-400" strokeWidth={1.5} />;
      case 'done':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" strokeWidth={1.5} />;
      default:
        return <AlertCircle className="w-4 h-4 text-zinc-500" strokeWidth={1.5} />;
    }
  };

  const getStatusColor = () => {
    switch (agent.status) {
      case 'thinking': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'executing': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'done': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  };

  const getStatusThemeColor = () => {
    switch (agent.status) {
      case 'thinking':
      case 'executing':
        return 'blue';
      case 'done':
        return 'emerald';
      default:
        return 'zinc';
    }
  };

  const themeClasses = {
    blue: {
      border: 'border-blue-500',
      bg: 'bg-blue-500',
      text: 'text-white',
    },
    emerald: {
      border: 'border-emerald-500',
      bg: 'bg-emerald-500',
      text: 'text-white',
    },
    zinc: {
      border: 'border-zinc-500',
      bg: 'bg-zinc-500',
      text: 'text-white',
    },
  };

  const getCardClasses = () => {
    const base = "relative p-4 rounded-xl border cursor-pointer transition-all duration-100 ";
    const themeColor = getStatusThemeColor();
    const theme = themeClasses[themeColor as keyof typeof themeClasses];
    
    if (isActive) {
      return base + `${theme.border} bg-white shadow-md`;
    }
    
    if (agent.status === 'executing' || agent.status === 'thinking') {
      return base + "border-gray-300 bg-white shadow-sm";
    }
    if (agent.status === 'done') {
      return base + "border-gray-200 bg-gray-50/30 opacity-50 grayscale-[0.3]";
    }
    return base + "border-gray-200 bg-white";
  };

  const AgentIcon = IconMap[agent.iconName] || Cpu;
  const themeColor = getStatusThemeColor();
  const theme = themeClasses[themeColor as keyof typeof themeClasses];

  const getLlmIcon = (model: string) => {
    const modelLower = model.toLowerCase();
    let src = '';
    if (modelLower.includes('gemini')) {
      src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Google_Gemini_icon_2025.svg/960px-Google_Gemini_icon_2025.svg.png?_=20250728014952';
    } else if (modelLower.includes('claude')) {
      src = 'https://claude.ai/favicon.ico';
    } else if (modelLower.includes('gpt')) {
      src = 'https://openai.com/favicon.ico';
    } else if (modelLower.includes('llama')) {
      src = 'https://www.meta.ai/favicon.ico';
    }

    if (!src) return null;

    return (
      <img 
        src={src} 
        alt={model} 
        className="w-3 h-3 rounded-sm object-contain" 
        referrerPolicy="no-referrer"
      />
    );
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={getCardClasses()}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${theme.bg} bg-opacity-10`}>
            <AgentIcon className={`w-5 h-5 ${theme.text}`} strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="font-semibold text-sm tracking-tight text-gray-900">{agent.name}</h3>
            <div className="flex items-center gap-1.5">
              {getLlmIcon(agent.model)}
              <p className="text-[10px] uppercase tracking-wider text-tess-text-dim font-mono">
                {agent.model}
              </p>
            </div>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full border text-[10px] font-semibold uppercase tracking-wider ${getStatusColor()}`}>
          {getStatusIcon()}
          {agent.status}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-[10px] text-tess-text-dim font-mono">
          <span className="flex items-center gap-1">
            {agent.status === 'thinking' ? (
              <>
                <span className="w-1 h-1 bg-blue-400 rounded-full animate-ping" />
                ANALYZING
              </>
            ) : (
              'PROGRESS'
            )}
          </span>
          <span>{agent.status === 'thinking' ? 'WAITING' : `${agent.progress}%`}</span>
        </div>
        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden relative">
          <AnimatePresence mode="wait">
            {agent.status === 'thinking' ? (
              <motion.div
                key="thinking-bar"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                <motion.div
                  animate={{ 
                    x: ['-100%', '100%'],
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                  className={`absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-blue-400/40 to-transparent blur-[2px]`}
                />
              </motion.div>
            ) : (
              <motion.div
                key="executing-bar"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: `${agent.progress}%`, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`h-full ${theme.bg} relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <p className="text-[11px] text-gray-500 line-clamp-1 italic">
          {agent.lastAction}
        </p>
      </div>

      {isActive && (
        <motion.div
          layoutId="active-indicator"
          className={`absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 ${theme.bg} rounded-full`}
        />
      )}
    </motion.div>
  );
};
