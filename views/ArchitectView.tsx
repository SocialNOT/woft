
import React, { useState } from 'react';
import { UserProgress } from '../types';
import { Database, Link, Key, ShieldCheck, Box, RefreshCw, Cpu, Globe, Cloud, Terminal, HardDrive, Plus } from 'lucide-react';

interface Props {
  progress: UserProgress;
}

export const ArchitectView: React.FC<Props> = ({ progress }) => {
  const [activeBuilderTab, setActiveBuilderTab] = useState<'config' | 'knowledge' | 'api'>('config');

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col pb-4">
      
      <div className="px-1 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Architect</h2>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-accent mt-1">RAG Engine Builder</p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-brand-accent/10 flex items-center justify-center text-brand-accent border border-brand-accent/20">
           <Cpu size={20} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-black/20 rounded-3xl shrink-0">
        {['config', 'knowledge', 'api'].map(t => (
          <button 
            key={t}
            onClick={() => setActiveBuilderTab(t as any)}
            className={`flex-1 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${
              activeBuilderTab === t ? 'bg-white/10 text-brand-accent shadow-lg' : 'text-slate-500'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 glass-effect rounded-6xl p-8 border border-brand-accent/10 relative flex flex-col overflow-hidden bg-slate-950/20">
        
        {activeBuilderTab === 'config' && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
             <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1">Base Model Selection</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white outline-none">
                   <option>Gemini 2.5 Flash-Latest</option>
                   <option>Gemini 3 Pro-Preview</option>
                   <option>Llama 3.3 70B (via Groq)</option>
                   <option>Claude 3.5 Sonnet</option>
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1">System Instruction Core</label>
                <textarea 
                  className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-[11px] text-slate-300 outline-none resize-none"
                  placeholder="Define the identity and behavioral boundaries of your custom GPT..."
                  defaultValue="Act as a specialized RAG orchestrator for architectural documentation. Prioritize precision..."
                />
             </div>
             <button className="w-full py-4 bg-brand-accent text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-brand-accent/20 active:scale-95 transition-all">
               Initialize Architect
             </button>
          </div>
        )}

        {activeBuilderTab === 'knowledge' && (
          <div className="space-y-5 animate-in slide-in-from-right-4 duration-300 h-full flex flex-col">
             <div className="flex justify-between items-center px-1">
                <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-500">Active Data Clusters</h4>
                <button className="p-2 bg-brand-accent/10 text-brand-accent rounded-lg border border-brand-accent/20">
                   <Plus size={14} />
                </button>
             </div>
             <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar">
                {[
                  { icon: Database, name: 'Knowledge_Base_V2.json', size: '2.4mb', status: 'Indexed' },
                  { icon: Box, name: 'Linguistic_Tactics.md', size: '128kb', status: 'Syncing' },
                  { icon: Cloud, name: 'External_API_Docs.pdf', size: '4.1mb', status: 'Idle' },
                ].map(node => (
                  <div key={node.name} className="glass-effect rounded-4xl p-5 flex items-center justify-between border border-white/5">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500">
                           <node.icon size={20} />
                        </div>
                        <div>
                           <p className="text-[11px] font-black text-white italic truncate max-w-[120px]">{node.name}</p>
                           <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{node.size}</p>
                        </div>
                     </div>
                     <span className={`text-[8px] font-black uppercase px-2.5 py-1 rounded-full border ${node.status === 'Indexed' ? 'bg-brand-success/10 border-brand-success/20 text-brand-success' : 'bg-brand-warning/10 border-brand-warning/20 text-brand-warning'}`}>
                        {node.status}
                     </span>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeBuilderTab === 'api' && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
             <div className="glass-effect rounded-4xl p-6 border border-brand-accent/10 space-y-4">
                <div className="flex items-center gap-3 text-brand-accent">
                   <Key size={20} />
                   <h4 className="text-[10px] font-black uppercase italic tracking-widest">Secure Credentials</h4>
                </div>
                <div className="space-y-3">
                   <div className="space-y-1.5">
                      <label className="text-[8px] font-black uppercase text-slate-500 tracking-widest ml-1">API Key Endpoint</label>
                      <input readOnly value="************************" className="w-full bg-white/5 border border-white/5 rounded-xl p-3 text-xs text-slate-500 outline-none" />
                   </div>
                   <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-300 hover:bg-white/10 transition-all">
                      Rotate Access Token
                   </button>
                </div>
             </div>
             <div className="p-4 bg-brand-accent/5 rounded-3xl border border-brand-accent/20 flex gap-4">
                <ShieldCheck size={24} className="text-brand-accent shrink-0" />
                <p className="text-[10px] text-slate-400 italic leading-relaxed">System using Hardware-Level Encryption (AES-256) for all cross-model API requests.</p>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};
