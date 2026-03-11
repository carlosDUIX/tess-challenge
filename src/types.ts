export type AgentStatus = 'thinking' | 'executing' | 'done' | 'idle';

export interface Agent {
  id: string;
  name: string;
  model: string;
  status: AgentStatus;
  progress: number;
  lastAction: string;
  color: string;
  iconName: string;
}

export interface LogEntry {
  id: string;
  agentId: string;
  agentName: string;
  message: string;
  timestamp: Date;
  type: 'info' | 'success' | 'warning' | 'error' | 'system';
}
