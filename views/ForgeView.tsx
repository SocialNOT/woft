
import React, { useState, useEffect } from 'react';
import { UserProgress } from '../types';
import { generateMarketplaceBlueprints, verifyForgeBlueprint } from '../services/geminiService';
import { Zap, Sparkles, ShoppingBag, Search, Filter, ShieldCheck, ArrowRight, RefreshCw, Star, Info, X, Terminal, Cpu } from 'lucide-react';

interface Blueprint {
  id: string;
  title: string;
  description: string;
  category: string;
  fidelity: number;
  price: number;
}

interface Props {
  progress?: UserProgress;
}

export const ForgeView: React.FC<Props> = ({ progress }) => {
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(null);
  const [auditResult, setAuditResult] = useState<any>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const level = progress?.level || 0;

  useEffect(() => {
    const fetchBlueprints = async () => {
      setIsLoading(true);
      try {
        const data = await generateMarketplaceBlueprints(level);
        setBlueprints(data);
      } catch (e) { console.error(e); }
      finally { setIsLoading(false); }
    };
    if (level >= 5) fetchBlueprints();
  }, [level]);

  const handleAudit = async () => {
    if (!selectedBlueprint) return;
    setIsAuditing(true);
    try {
      const result = await verifyForgeBlueprint(selectedBlueprint.title + ": " + selectedBlueprint.description);
      setAuditResult(result);
    } catch (e) { console.error(e); }
    finally { setIsAuditing(false); }
  };

  return (
    <div className="space-y-6 pb-48 animate-in fade-in duration-700">
      <div className="px-1 space-y-1">
        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">The Prompt Forge</h2>
        <p className="text-brand-warning text-[10px] font-black uppercase tracking-[0.2em]">Phase V: Marketplace Access</p>
      </div>

      {level < 5 ? (
        <div className="glass-effect rounded-[2.5rem] p-12 text-center space-y-4 border border-white/5 bg-brand-slate-900/40">
           <ShoppingBag className="mx-auto text-slate-700" size={48} />
           <h3 className="text-xl font-black text-white uppercase italic">Marketplace Locked</h3>
           <p className="text-xs text-slate-500 leading-relaxed max-w-[240px] mx-auto">
             Reach Phase IV (Mastery) to unlock elite neural blueprints from the global architect community.
           </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {['All Blueprints', 'Agents', 'RAG', 'Logic'].map(cat => (
              <button key={cat} className="px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest bg-white/5 border border-white/5 text-slate-400 whitespace-nowrap">{cat}</button>
            ))}
          </div>

          {isLoading ? (
            <div className="py-20 flex flex-col items-center gap-4">
              <RefreshCw className="animate-spin text-brand-warning" size={32} />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Scanning Forge Registry...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {blueprints.map(bp => (
                <button 
                  key={bp.id} 
                  onClick={() => setSelectedBlueprint(bp)}
                  className="glass-effect rounded-[2rem] p-6 border border-white/5 bg-brand-slate-900/40 text-left hover:border-brand-warning/30 transition-all group active:scale-[0.98]"
                >
                   <div className="flex justify-between items-start mb-4">
                      <div className="space-y-1">
                        <span className="text-[8px] font-black uppercase text-brand-warning tracking-widest">{bp.category}</span>
                        <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">{bp.title}</h4>
                      </div>
                      <div className="bg-brand-warning/10 border border-brand-warning/20 px-3 py-1.5 rounded-xl flex items-center gap-2">
                         <Star size={10} className="text-brand-warning fill-brand-warning" />
                         <span className="text-[10px] font-black text-brand-warning">{bp.fidelity}%</span>
                      </div>
                   </div>
                   <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">{bp.description}</p>
                   <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                         <div className="w-5 h-5 rounded-full bg-slate-800 border border-white/10" />
                         <span className="text-[9px] font-bold text-slate-500">Architect v{bp.id.slice(0, 1)}</span>
                      </div>
                      <span className="text-[10px] font-black text-white">{bp.price} PTS</span>
                   </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedBlueprint && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-bg/95 backdrop-blur-3xl animate-in fade-in duration-300">
           <div className="glass-effect w-full max-w-sm rounded-[3rem] p-8 border border-brand-warning/20 shadow-2xl relative overflow-hidden">
              <button onClick={() => { setSelectedBlueprint(null); setAuditResult(null); }} className="absolute top-6 right-6 text-slate-500 hover:text-white"><X size={20} /></button>
              
              <div className="space-y-6">
                <div className="space-y-1">
                   <span className="text-[10px] font-black uppercase text-brand-warning tracking-widest">Blueprint Terminal</span>
                   <h3 className="text-2xl font-black uppercase italic text-white tracking-tighter leading-none">{selectedBlueprint.title}</h3>
                </div>

                <div className="bg-black/40 p-6 rounded-[2rem] border border-white/5 space-y-4">
                   <p className="text-xs text-slate-300 leading-relaxed font-medium">{selectedBlueprint.description}</p>
                   
                   {auditResult ? (
                     <div className="space-y-4 animate-in slide-in-from-top-4">
                        <div className="flex justify-between items-center p-3 bg-brand-warning/5 border border-brand-warning/20 rounded-xl">
                           <span className="text-[9px] font-black text-brand-warning uppercase">Integrity Scan</span>
                           <span className="text-xs font-black text-white">{auditResult.integrity}%</span>
                        </div>
                        <div className="space-y-2">
                           <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Critical Vulnerability</p>
                           <p className="text-[10px] text-brand-error font-bold leading-none">{auditResult.weakness}</p>
                        </div>
                        <div className="p-3 bg-black/20 rounded-xl text-[10px] text-slate-400 italic">
                           Fix: {auditResult.fix}
                        </div>
                     </div>
                   ) : (
                     <button 
                        onClick={handleAudit} 
                        disabled={isAuditing}
                        className="w-full bg-brand-warning text-brand-bg py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2"
                      >
                        {isAuditing ? <RefreshCw className="animate-spin" size={14} /> : <ShieldCheck size={14} />} 
                        Run Architectural Audit
                      </button>
                   )}
                </div>

                <div className="flex gap-4">
                   <button className="flex-1 bg-white text-brand-bg py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all">
                      Acquire Blueprint
                   </button>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
