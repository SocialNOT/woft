import React, { useState } from 'react';
import { UserProgress } from '../types';
import { WORLD_OF_TEXTS_KB, executeWorkflowStep } from '../services/geminiService';
import { Plus, ArrowDown, Play, Trash2, Cpu, Settings2, Sparkles, Layers, Box, Terminal, RefreshCw, CheckCircle2, AlertCircle, Copy, Check, ArrowRight } from 'lucide-react';

export const WorkflowView: React.FC<{ progress?: UserProgress }> = ({ progress }) => {
  const [steps, setSteps] = useState([
    { id: '1', persona: 'Systems Architect', task: 'Audit the baseline constraints for a PWA architecture.', status: 'idle' }
  ]);
  const [isExecuting, setIsExecuting] = useState(false);
  const level = progress?.level || 0;

  return (
    <div className="h-full flex flex-col space-y-4 animate-in fade-in duration-500 overflow-hidden pb-4">
      
      {/* Header */}
      <div className="shrink-0 flex justify-between items-end px-1">
        <div>
           <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Sequence Forge</h2>
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-success">Workflow Architect</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-brand-success/10 flex items-center justify-center text-brand-success border border-brand-success/20">
           <Cpu size={24} />
        </div>
      </div>

      {level < 3 ? (
        <div className="flex-1 glass-effect rounded-[3rem] p-12 flex flex-col items-center justify-center text-center space-y-4 border border-white/5">
           <Layers className="text-slate-700" size={64} />
           <h3 className="text-xl font-black text-white uppercase italic">Neural Access Denied</h3>
           <p className="text-xs text-slate-500 max-w-[240px]">Sequence architecture requires Alchemist (Phase III) certification.</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto no-scrollbar pb-32 space-y-6">
           {/* Steps Bento */}
           <div className="space-y-4">
              {steps.map((step, idx) => (
                <div key={step.id} className="relative">
                   <div className="glass-effect rounded-[2.5rem] p-8 border border-white/5 space-y-6">
                      <div className="flex justify-between items-center">
                         <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-xl bg-brand-success/10 text-brand-success border border-brand-success/20 flex items-center justify-center font-black text-xs">{idx + 1}</span>
                            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Execution Node</span>
                         </div>
                         <button className="p-2 text-slate-700 hover:text-brand-error"><Trash2 size={16} /></button>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                           <label className="text-[8px] font-black uppercase text-slate-500 ml-1">Persona Driver</label>
                           <div className="p-4 rounded-2xl glass-effect text-xs font-bold text-white uppercase border-white/5">Systems Architect</div>
                        </div>
                        <textarea className="w-full glass-effect bg-black/20 border border-white/5 rounded-[1.5rem] p-4 text-[11px] text-slate-300 h-24 outline-none" placeholder="Instruction set..." />
                      </div>
                   </div>
                   {idx < steps.length - 1 && (
                     <div className="flex justify-center py-2">
                        <ArrowDown size={20} className="text-brand-success/40" />
                     </div>
                   )}
                </div>
              ))}
           </div>

           {/* Controls Bento */}
           <div className="grid grid-cols-2 gap-4">
              <button className="py-5 glass-effect rounded-[2rem] border border-white/5 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-white active:scale-95 transition-all">
                 <Plus size={16} /> Add Step
              </button>
              <button className="py-5 bg-brand-success text-brand-bg rounded-[2rem] flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                 <Play size={16} fill="currentColor" /> Ignite Sequence
              </button>
           </div>
        </div>
      )}

    </div>
  );
};