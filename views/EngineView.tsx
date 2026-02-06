
import React from 'react';
import { UserProgress } from '../types';
import { User, Shield, HardDrive, History, LogOut, ChevronRight, Activity, Award, Star, Settings, Fingerprint, Clock, FileText, RefreshCw } from 'lucide-react';

interface Props {
  progress: UserProgress;
  onUpdateProgress: (p: Partial<UserProgress>) => void;
}

export const EngineView: React.FC<Props> = ({ progress, onUpdateProgress }) => {
  
  const resetNeuralCore = () => {
    if (confirm("Initiate Total Neural Format? This will wipe all XP and Mastery data.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* Profile Header */}
      <div className="flex items-center gap-6 px-1">
        <div className="relative group">
           <div className="absolute -inset-1.5 bg-gradient-to-tr from-brand-primary to-brand-accent rounded-5xl blur-md opacity-25" />
           <div className="relative w-24 h-24 rounded-5xl bg-slate-900 border border-white/10 flex items-center justify-center overflow-hidden">
              <img src={`https://picsum.photos/200?grayscale&seed=${progress.points}`} alt="Architect" className="w-full h-full object-cover opacity-60" />
           </div>
           <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-brand-bg border-4 border-brand-bg shadow-xl">
              <Fingerprint size={18} />
           </div>
        </div>
        <div className="flex-1 space-y-1.5">
           <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Architect_01</h2>
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-success shadow-[0_0_8px_#10B981]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Phase: {progress.phase}</span>
           </div>
           <div className="flex gap-1.5 pt-1">
             <div className="px-2.5 py-1 bg-white/5 rounded-lg border border-white/10 text-[8px] font-black uppercase text-brand-primary">Lvl {progress.level}</div>
             <div className="px-2.5 py-1 bg-white/5 rounded-lg border border-white/10 text-[8px] font-black uppercase text-brand-accent">Rank: Neural</div>
           </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="glass-effect rounded-6xl p-8 border border-white/10 relative overflow-hidden bg-gradient-to-br from-brand-primary/5 to-transparent">
         <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-3">
               <Activity size={18} className="text-brand-primary" />
               <h3 className="text-sm font-black uppercase italic tracking-tighter text-white">Neural Metrics</h3>
            </div>
            <Award size={20} className="text-brand-warning animate-pulse" />
         </div>
         
         <div className="grid grid-cols-2 gap-8">
            <div className="space-y-1">
               <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Streak</p>
               <p className="text-3xl font-black text-white italic uppercase tracking-tighter">{progress.streak} <span className="text-xs text-slate-600">Days</span></p>
            </div>
            <div className="space-y-1 text-right">
               <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Experience</p>
               <p className="text-3xl font-black text-brand-primary italic uppercase tracking-tighter">{progress.points} <span className="text-xs text-slate-600">XP</span></p>
            </div>
         </div>
      </div>

      {/* Engine Controls */}
      <div className="space-y-3">
         <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 px-3">System Settings</h4>
         {[
           { icon: History, label: 'Execution Logs', desc: `${progress.completedLessons.length} events recorded`, color: 'text-brand-primary' },
           { icon: Shield, label: 'Security Core', desc: 'Hardware Link: Active', color: 'text-brand-accent' },
           { icon: HardDrive, label: 'Storage Sync', desc: 'Cloud Persistence Enabled', color: 'text-brand-success' },
           { icon: RefreshCw, label: 'Neural Recalibration', desc: 'Sync state with mothership', color: 'text-brand-warning' },
         ].map(item => (
           <button key={item.label} className="w-full glass-effect rounded-4xl p-6 flex items-center justify-between border border-white/5 group active:scale-[0.98] transition-all">
              <div className="flex items-center gap-5">
                 <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                    <item.icon size={22} />
                 </div>
                 <div className="text-left">
                    <p className="text-sm font-black text-white italic uppercase tracking-tight">{item.label}</p>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{item.desc}</p>
                 </div>
              </div>
              <ChevronRight size={18} className="text-slate-700 group-hover:text-white transition-colors" />
           </button>
         ))}
      </div>

      <button 
        onClick={resetNeuralCore}
        className="w-full py-5 rounded-3xl border border-brand-error/20 text-brand-error font-black uppercase text-xs tracking-[0.2em] hover:bg-brand-error/10 active:scale-95 transition-all flex items-center justify-center gap-3"
      >
        <LogOut size={18} /> Reset Neural Link
      </button>

    </div>
  );
};
