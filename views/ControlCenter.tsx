
import React from 'react';
import { View, UserProgress } from '../types';
import { Activity, Zap, ArrowUpRight, Brain, Terminal, Cpu, Sparkles, TrendingUp, BarChart3, Globe } from 'lucide-react';

interface Props {
  progress: UserProgress;
  setView: (v: View) => void;
}

export const ControlView: React.FC<Props> = ({ progress, setView }) => {
  return (
    <div className="space-y-6">
      
      {/* Hero Card - Real Neural Data */}
      <div className="prismatic-border rounded-[2.5rem] overflow-hidden">
        <div className="glass-effect p-8 relative overflow-hidden bg-gradient-to-br from-brand-primary/10 via-transparent to-brand-accent/5">
          <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
            <Brain size={140} />
          </div>
          <div className="space-y-4 relative z-10">
            <div className="flex justify-between items-center">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary">Neural Core Status</span>
               <div className="flex items-center gap-1.5 px-3 py-1 bg-brand-primary/10 rounded-full border border-brand-primary/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse shadow-[0_0_5px_#22D3EE]" />
                  <span className="text-[8px] font-black text-brand-primary uppercase">Active Link</span>
               </div>
            </div>
            <div className="space-y-1">
              <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white leading-none">Architect</h2>
              <p className="text-xs font-medium text-slate-400">Intelligence Level {progress.level} • {progress.phase}</p>
            </div>
            <div className="flex gap-3 pt-2">
              <div className="flex-1 bg-white/5 rounded-2xl p-3 border border-white/5">
                 <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest mb-1">XP Points</p>
                 <p className="text-sm font-black text-white">{progress.points}</p>
              </div>
              <div className="flex-1 bg-white/5 rounded-2xl p-3 border border-white/5">
                 <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest mb-1">Weekly Streak</p>
                 <p className="text-sm font-black text-brand-accent">{progress.streak} Days</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logic Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
         <div className="glass-effect rounded-4xl p-5 border border-white/5 space-y-3">
            <div className="flex justify-between items-center">
               <div className="w-8 h-8 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                  <TrendingUp size={16} />
               </div>
               <span className="text-xs font-black text-white">{progress.skills.logic}%</span>
            </div>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Logical Depth</p>
         </div>
         <div className="glass-effect rounded-4xl p-5 border border-white/5 space-y-3">
            <div className="flex justify-between items-center">
               <div className="w-8 h-8 rounded-xl bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                  <Activity size={16} />
               </div>
               <span className="text-xs font-black text-white">{progress.skills.control}%</span>
            </div>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Constraint Accuracy</p>
         </div>
      </div>

      {/* Action Hub */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 flex items-center gap-2">
             <Zap size={10} /> Fast Access
          </h3>
        </div>
        
        <button 
          onClick={() => setView(View.CONSOLE)}
          className="w-full glass-effect rounded-5xl p-6 flex items-center justify-between border border-white/5 hover:border-brand-primary/20 transition-all group active:scale-95"
        >
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 rounded-3xl bg-brand-primary/5 flex items-center justify-center text-brand-primary border border-brand-primary/10">
                <Terminal size={24} />
             </div>
             <div className="text-left">
                <p className="text-sm font-black text-white italic uppercase tracking-tight">Neural Console</p>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Sandbox Simulation</p>
             </div>
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 text-slate-700 group-hover:text-brand-primary group-hover:bg-brand-primary/10 transition-all">
            <ArrowUpRight size={18} />
          </div>
        </button>

        <button 
          // Fix: Changed View.ARCHITECT to View.WORKFLOW as ARCHITECT is not a valid View enum member
          onClick={() => setView(View.WORKFLOW)}
          className="w-full glass-effect rounded-5xl p-6 flex items-center justify-between border border-white/5 hover:border-brand-accent/20 transition-all group active:scale-95"
        >
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 rounded-3xl bg-brand-accent/5 flex items-center justify-center text-brand-accent border border-brand-accent/10">
                <Cpu size={24} />
             </div>
             <div className="text-left">
                <p className="text-sm font-black text-white italic uppercase tracking-tight">GPT Architect</p>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Build Custom Engines</p>
             </div>
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 text-slate-700 group-hover:text-brand-accent group-hover:bg-brand-accent/10 transition-all">
            <ArrowUpRight size={18} />
          </div>
        </button>
      </div>

    </div>
  );
};
