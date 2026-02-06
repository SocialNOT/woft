import React from 'react';
import { UserProgress } from '../types';
import { User, Shield, Fingerprint, Activity, Clock, FileText, Database, ShieldCheck, Zap, Globe, Cpu } from 'lucide-react';

export const ProfileView: React.FC<{ progress: UserProgress }> = ({ progress }) => {
  return (
    <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* Citizen ID Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Identity Card */}
        <div className="lg:col-span-2 border border-terminal-border bg-black relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 text-terminal-primary group-hover:rotate-12 transition-transform duration-1000">
             <Fingerprint size={160} />
          </div>
          <div className="p-8 space-y-8 relative z-10">
             <div className="flex justify-between items-start">
                <div className="space-y-1">
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-terminal-primary">Citizen Intelligence Card</p>
                   <h2 className="text-4xl font-black italic uppercase text-white tracking-tighter leading-none">ARCHITECT_01</h2>
                </div>
                <div className="p-3 border border-terminal-primary/40 bg-terminal-primary/10 text-terminal-primary rounded-lg">
                   <ShieldCheck size={24} />
                </div>
             </div>

             <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                   <div className="space-y-1">
                      <p className="text-[8px] font-black text-terminal-dim uppercase tracking-widest">Neural Hash</p>
                      <p className="text-[11px] font-mono font-bold text-white uppercase truncate">TXS-B72-91-ARCH-42</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[8px] font-black text-terminal-dim uppercase tracking-widest">Issue Date</p>
                      <p className="text-[11px] font-mono font-bold text-white">2025.Q1.REL</p>
                   </div>
                </div>
                <div className="space-y-4 text-right">
                   <div className="space-y-1">
                      <p className="text-[8px] font-black text-terminal-dim uppercase tracking-widest">Authority Level</p>
                      <p className="text-[11px] font-mono font-bold text-terminal-primary uppercase">LEVEL_{progress.level}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[8px] font-black text-terminal-dim uppercase tracking-widest">Phase Status</p>
                      <p className="text-[11px] font-mono font-bold text-terminal-success uppercase">{progress.phase}</p>
                   </div>
                </div>
             </div>

             <div className="pt-4 flex items-center gap-4">
                <div className="flex-1 h-px bg-terminal-border" />
                <span className="text-[8px] font-mono text-terminal-dim uppercase">Verified by TEXT-OS RAG Core</span>
                <div className="flex-1 h-px bg-terminal-border" />
             </div>
          </div>
        </div>

        {/* Quick Stats Column */}
        <div className="border border-terminal-border bg-slate-900/40 p-6 flex flex-col justify-between">
           <div className="space-y-6">
              <div className="flex items-center gap-3">
                 <Activity size={16} className="text-terminal-primary" />
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Neural Loadout</h4>
              </div>
              <div className="space-y-4">
                 {[
                   { icon: Database, label: 'Vault_Blocks', val: '142' },
                   { icon: Cpu, label: 'Sim_Threads', val: '04' },
                   { icon: Zap, label: 'XP_Density', val: progress.points },
                   { icon: Globe, label: 'Net_Fidelity', val: '99%' }
                 ].map(stat => (
                   <div key={stat.label} className="flex justify-between items-center border-b border-terminal-border pb-2">
                      <div className="flex items-center gap-2">
                        <stat.icon size={12} className="text-terminal-dim" />
                        <span className="text-[9px] font-bold text-terminal-dim uppercase tracking-widest">{stat.label}</span>
                      </div>
                      <span className="text-[11px] font-black text-white">{stat.val}</span>
                   </div>
                 ))}
              </div>
           </div>
           <button className="w-full py-3 bg-white/5 border border-white/10 text-[9px] font-black uppercase text-terminal-dim hover:text-white transition-colors tracking-widest mt-6">
              Export ID Backup
           </button>
        </div>

      </div>

      {/* Logic Timeline / Log Feed */}
      <div className="border border-terminal-border flex-1 flex flex-col bg-black overflow-hidden">
         <div className="bg-slate-900 px-4 py-2 border-b border-terminal-border flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
               <FileText size={14} className="text-terminal-primary" />
               <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Activity_Audit_Log</h4>
            </div>
            <Clock size={14} className="text-terminal-dim" />
         </div>
         <div className="flex-1 overflow-y-auto p-6 font-mono text-[10px] space-y-2 no-scrollbar">
            <p className="text-terminal-success opacity-80">[OK] 2025-05-12T14:22:04 - RAG Cluster Mounted Successfully.</p>
            <p className="text-terminal-primary opacity-80">[INFO] Phase II Roadmap Initiated: Swiss Knife Mastery.</p>
            <p className="text-terminal-dim opacity-60">[LOG] 2025-05-12T15:10:42 - Logic Synthesis Block Created: {progress.completedLessons.length} units.</p>
            <p className="text-terminal-warning opacity-80">[WARN] Level 5 Restricted Areas Detected - Access Denied.</p>
            <p className="text-terminal-dim opacity-60">[LOG] 2025-05-12T16:05:11 - Citizen Record Synced with Neural Cloud.</p>
            <p className="text-terminal-success animate-pulse mt-4">// END OF LOG FILE_</p>
         </div>
      </div>

    </div>
  );
};