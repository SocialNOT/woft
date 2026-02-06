import React, { useState } from 'react';
import { View, UserProgress } from '../types';
import { CheckCircle2, Lock, ChevronRight, Zap, Star, Target, Layers, BookOpen, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export const JourneyView: React.FC<{ progress: UserProgress, onNavigate?: (v: View) => void }> = ({ progress, onNavigate }) => {
  const phases = [
    { id: '1', title: 'Phase I: Spark', level: 1, color: 'brand-primary', desc: 'Orientation & Cognitive Activation' },
    { id: '2', title: 'Phase II: Swiss Knife', level: 2, color: 'brand-accent', desc: 'Framework Engineering' },
    { id: '3', title: 'Phase III: Alchemist', level: 3, color: 'brand-warning', desc: 'System & Workflow Build' },
    { id: '4', title: 'Phase IV: Master', level: 4, color: 'brand-error', desc: 'Professional Certification' },
  ];

  return (
    <div className="h-full flex flex-col space-y-4 animate-in fade-in duration-500 overflow-hidden pb-4">
      
      {/* Header */}
      <div className="shrink-0 flex justify-between items-end px-1">
        <div>
           <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Neural Path</h2>
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary">Curriculum Map</p>
        </div>
        <div className="px-4 py-2 glass-effect rounded-2xl border border-white/5 flex items-center gap-2">
           <ShieldCheck size={14} className="text-brand-success" />
           <span className="text-[9px] font-black uppercase text-white">Lvl {progress.level} Active</span>
        </div>
      </div>

      {/* Grid Path Bento */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        <div className="space-y-4">
           {phases.map((phase, i) => {
             const isLocked = progress.level < phase.level;
             const isCurrent = progress.level === phase.level;
             const isComplete = progress.level > phase.level;

             return (
               <div 
                 key={phase.id} 
                 className={`module-entry glass-effect rounded-[2.5rem] p-8 border transition-all duration-500 relative overflow-hidden ${
                   isLocked ? 'opacity-40 border-white/5 grayscale' : isCurrent ? `border-${phase.color}/40 shadow-lg shadow-${phase.color}/5` : 'border-white/5'
                 }`}
               >
                 {isCurrent && (
                   <div className={`absolute top-0 right-0 p-8 opacity-5 text-${phase.color}`}>
                      <Target size={120} />
                   </div>
                 )}
                 <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-5">
                       <div className={`w-14 h-14 rounded-3xl flex items-center justify-center font-black text-xl shadow-xl transition-all ${
                         isLocked ? 'bg-slate-900 text-slate-700' : isCurrent ? `bg-${phase.color} text-brand-bg` : `bg-${phase.color}/10 text-${phase.color}`
                       }`}>
                          {isLocked ? <Lock size={22} /> : phase.id}
                       </div>
                       <div>
                          <h3 className="text-lg font-black text-white uppercase italic tracking-tight">{phase.title}</h3>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{phase.desc}</p>
                       </div>
                    </div>
                    {isComplete && <CheckCircle2 className="text-brand-success" size={28} />}
                 </div>

                 {isCurrent && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                       <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5">
                          <p className="text-[11px] text-slate-300 leading-relaxed italic">Currently optimizing neural logic layers and framework precision in this sector.</p>
                       </div>
                       <button onClick={() => onNavigate?.(View.LAB)} className={`w-full py-5 bg-${phase.color} text-brand-bg rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all`}>
                          Continue Mastery <ArrowRight size={16} />
                       </button>
                    </div>
                 )}
               </div>
             );
           })}
        </div>
      </div>

    </div>
  );
};