import React from 'react';
import { UserProgress, View } from '../types';
// Import ChevronRight from lucide-react to fix errors on lines 70 and 81
import { Activity, Terminal, Shield, Zap, TrendingUp, Cpu, Server, Target, ChevronRight } from 'lucide-react';

interface Props {
  progress: UserProgress;
  onNavigate: (view: View) => void;
}

export const HomeView: React.FC<Props> = ({ progress, onNavigate }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* Header Info */}
      <div className="flex justify-between items-start border-l-2 border-terminal-primary pl-6 py-2">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-terminal-primary uppercase tracking-[0.3em]">Kernel Information</p>
          <h1 className="text-2xl font-black uppercase tracking-tighter text-white">SYSTEM_ARCHITECT_{progress.userId?.split('_')[1] || '01'}</h1>
          <p className="text-xs text-terminal-dim italic">Current Session: Neural Link Stabilized // Phase {progress.phase}</p>
        </div>
        <div className="text-right">
           <p className="text-[10px] font-bold text-terminal-dim uppercase">Uptime</p>
           <p className="text-sm font-black text-terminal-success tracking-widest">00:42:18:04</p>
        </div>
      </div>

      {/* Stats Table */}
      <div className="border border-terminal-border">
         <div className="bg-slate-900 px-4 py-2 border-b border-terminal-border flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-widest">Core Status Matrix</span>
            <Activity size={14} className="text-terminal-primary" />
         </div>
         <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-terminal-border">
            {[
              { label: 'Logic_Density', val: progress.skills.logic, color: 'text-terminal-primary' },
              { label: 'Control_Fidelity', val: progress.skills.control, color: 'text-terminal-accent' },
              { label: 'Clarity_Index', val: progress.skills.clarity, color: 'text-terminal-success' },
              { label: 'Efficiency_Hz', val: progress.skills.efficiency, color: 'text-terminal-warning' }
            ].map(stat => (
              <div key={stat.label} className="p-6 space-y-2">
                 <p className="text-[8px] font-bold text-terminal-dim uppercase">{stat.label}</p>
                 <div className="flex items-end gap-2">
                   <span className={`text-2xl font-black ${stat.color}`}>{stat.val}</span>
                   <span className="text-[10px] text-terminal-dim mb-1">%</span>
                 </div>
                 <div className="h-1 bg-terminal-border rounded-full overflow-hidden">
                   <div className={`h-full bg-current ${stat.color}`} style={{ width: `${stat.val}%` }}></div>
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* Active Modules */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
           <Server size={14} className="text-terminal-primary" />
           <h3 className="text-[10px] font-black uppercase tracking-widest">Ready Modules</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <button 
             onClick={() => onNavigate(View.CHAT)}
             className="border border-terminal-border p-5 text-left hover:bg-terminal-primary hover:text-black transition-colors group flex justify-between items-center"
           >
              <div className="space-y-1">
                 <p className="text-xs font-black uppercase tracking-widest italic leading-none">MENTOR.EXE</p>
                 <p className="text-[9px] font-bold opacity-60 uppercase">Run Neural Guidance Protocol</p>
              </div>
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
           </button>

           <button 
             onClick={() => onNavigate(View.LAB)}
             className="border border-terminal-border p-5 text-left hover:bg-terminal-accent hover:text-black transition-colors group flex justify-between items-center"
           >
              <div className="space-y-1">
                 <p className="text-xs font-black uppercase tracking-widest italic leading-none">LOGIC.LAB</p>
                 <p className="text-[9px] font-bold opacity-60 uppercase">Initialize Sandbox Debugger</p>
              </div>
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
           </button>
        </div>
      </div>

      {/* System Logs (Placeholder) */}
      <div className="border border-terminal-border bg-black">
         <div className="bg-slate-900/50 px-4 py-1 text-[8px] border-b border-terminal-border text-terminal-dim uppercase font-bold">Terminal Logs</div>
         <div className="p-4 font-mono text-[9px] text-terminal-dim space-y-1">
            <p><span className="text-terminal-success">[OK]</span> Neural Kernel Loaded Successfully.</p>
            <p><span className="text-terminal-primary">[INFO]</span> Knowledge Base v2.4 Mounted at /vault/archive.</p>
            <p><span className="text-terminal-warning">[WARN]</span> Level 4 Modules Require Authentication.</p>
            <p><span className="text-terminal-success">[OK]</span> Architect Link Established. Awaiting user input<span className="cursor-blink">_</span></p>
         </div>
      </div>

    </div>
  );
};