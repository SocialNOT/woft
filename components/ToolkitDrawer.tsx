
import React, { useState } from 'react';
import { X, BookOpen, UserPlus, Compass, Languages, Map, ChevronRight, Zap, Target } from 'lucide-react';
import { WORLD_OF_TEXTS_KB } from '../services/geminiService';
import { FRAMEWORKS, CURRICULUM_LEVELS } from '../constants';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ToolkitDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'frameworks' | 'personas' | 'tech'>('roadmap');

  const personas = WORLD_OF_TEXTS_KB.filter(i => i.category === 'Persona');
  const linguistic = WORLD_OF_TEXTS_KB.filter(i => i.category === 'Linguistic');

  const tabs = [
    { id: 'roadmap', label: 'Roadmap', icon: Map },
    { id: 'frameworks', label: 'Frameworks', icon: BookOpen },
    { id: 'personas', label: 'Vault', icon: UserPlus },
    { id: 'tech', label: 'Compass', icon: Compass },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className={`toolkit-drawer w-full max-w-md h-[85vh] glass-effect rounded-t-[3rem] border-t border-brand-primary/30 flex flex-col overflow-hidden shadow-2xl transition-transform ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        
        {/* Header */}
        <div className="p-6 flex justify-between items-center border-b border-white/5">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-brand-primary/20 flex items-center justify-center border border-brand-primary/40">
                <Zap size={16} className="text-brand-primary" fill="currentColor" />
             </div>
             <h2 className="text-sm font-black uppercase tracking-widest text-white italic">Architect's Toolkit</h2>
          </div>
          <button onClick={onClose} className="p-2.5 bg-white/5 rounded-full text-slate-400 hover:text-white"><X size={20} /></button>
        </div>

        {/* Tab Navigation */}
        <div className="flex p-2 bg-black/20 gap-1">
          {tabs.map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all ${activeTab === tab.id ? 'bg-brand-primary text-brand-bg shadow-lg' : 'text-slate-500 hover:text-white'}`}
            >
              <tab.icon size={16} />
              <span className="text-[7px] font-black uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar custom-scrollbar pb-24">
          
          {activeTab === 'roadmap' && (
            <div className="space-y-4">
               {CURRICULUM_LEVELS.map((level, i) => (
                 <div key={i} className="flex gap-4 group">
                    <div className="flex flex-col items-center gap-1">
                       <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-black ${i === 0 ? 'bg-brand-primary border-brand-primary text-brand-bg' : 'border-white/10 text-slate-500'}`}>
                          {i + 1}
                       </div>
                       {i < CURRICULUM_LEVELS.length - 1 && <div className="w-px flex-1 bg-white/10" />}
                    </div>
                    <div className="flex-1 pb-6">
                       <h4 className="text-xs font-black uppercase text-white mb-1 group-hover:text-brand-primary transition-colors">{level.title}</h4>
                       <p className="text-[10px] text-slate-500 font-medium">Unlocks: {level.unlock}</p>
                    </div>
                 </div>
               ))}
            </div>
          )}

          {activeTab === 'frameworks' && (
            <div className="grid grid-cols-2 gap-3">
               {FRAMEWORKS.map(fw => (
                 <div key={fw.id} className="glass-effect p-4 rounded-2xl border border-white/5 bg-brand-slate-800/40">
                    <h5 className="text-[10px] font-black uppercase text-brand-primary mb-1">{fw.name}</h5>
                    <p className="text-[8px] text-slate-400 line-clamp-2 leading-relaxed">{fw.description}</p>
                 </div>
               ))}
            </div>
          )}

          {activeTab === 'personas' && (
            <div className="space-y-3">
               {personas.map(p => (
                 <div key={p.id} className="glass-effect p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                    <div className="space-y-1">
                       <h5 className="text-[10px] font-black uppercase text-white italic">{p.title}</h5>
                       <p className="text-[8px] text-slate-500 uppercase tracking-widest">{p.description}</p>
                    </div>
                    <ChevronRight size={14} className="text-slate-700" />
                 </div>
               ))}
            </div>
          )}

          {activeTab === 'tech' && (
            <div className="space-y-6">
               <div className="glass-effect p-6 rounded-[2rem] border border-brand-primary/20 space-y-4">
                  <div className="flex items-center gap-3">
                     <Target className="text-brand-primary" size={16} />
                     <h5 className="text-[10px] font-black uppercase tracking-widest text-white">Temp: 0.15 (Precision)</h5>
                  </div>
                  <p className="text-[9px] text-slate-400 leading-relaxed italic">Engineered for architectural stability. Zero-hallucination threshold active.</p>
               </div>
               <div className="space-y-4">
                  <h6 className="text-[8px] font-black uppercase tracking-widest text-slate-500 px-2">Linguistic Controls</h6>
                  {linguistic.map(l => (
                    <div key={l.id} className="glass-effect p-4 rounded-2xl border border-white/5 flex items-center gap-3">
                       <Languages size={14} className="text-brand-primary" />
                       <div className="space-y-0.5">
                          <p className="text-[10px] font-black text-white uppercase italic">{l.title}</p>
                          <p className="text-[8px] text-slate-500">{l.description}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
