import React, { useState, useMemo } from 'react';
import { Search, Info, Zap, X, Database, Bookmark, ArrowRight, Combine, Trash2, Sparkles, Copy, Layers } from 'lucide-react';
import { FULL_KNOWLEDGE_BASE } from '../knowledge/data';
import { KnowledgeItem } from '../types';

export const VaultView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
  const [stagedItems, setStagedItems] = useState<KnowledgeItem[]>([]);

  const categories = ['All', 'Framework', 'Persona', 'Linguistic', 'Architecture'];

  const items = useMemo(() => {
    return FULL_KNOWLEDGE_BASE.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = activeTab === 'All' || item.category === activeTab;
      return matchesSearch && matchesCat;
    });
  }, [searchQuery, activeTab]);

  return (
    <div className="h-full flex flex-col space-y-4 animate-in fade-in duration-500 overflow-hidden pb-4">
      
      {/* Header */}
      <div className="shrink-0 space-y-4">
        <div className="flex justify-between items-end">
           <div>
             <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Neural Vault</h2>
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary">Stored Intelligence</p>
           </div>
           <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20">
              <Database size={24} />
           </div>
        </div>

        <div className="relative">
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Query Vault Storage..." 
            className="w-full glass-effect rounded-3xl py-4 px-6 pl-14 text-sm font-bold text-white outline-none border-none"
          />
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest border transition-all shrink-0 ${
                activeTab === cat ? 'bg-brand-primary text-brand-bg border-brand-primary shadow-lg' : 'glass-effect border-white/5 text-slate-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Bento Layout for Vault */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-40">
        <div className="bento-grid-masonry">
           {items.map((item, idx) => (
             <div 
               key={item.id}
               className={`module-entry glass-effect rounded-[2rem] p-6 flex flex-col justify-between cursor-pointer group hover:scale-[1.02] border border-white/5 ${idx % 6 === 0 ? 'bento-wide' : ''}`}
               onClick={() => setSelectedItem(item)}
             >
               <div className="flex justify-between items-start">
                  <div className="p-3 rounded-2xl bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                     <Bookmark size={16} />
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); !stagedItems.find(i => i.id === item.id) && setStagedItems(p => [...p, item]); }}
                    className="p-2 rounded-xl bg-white/5 text-slate-500 hover:text-brand-primary transition-colors"
                  >
                     <Combine size={14} />
                  </button>
               </div>
               <div className="mt-4">
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">{item.category}</span>
                  <h4 className="text-sm font-black text-white uppercase italic leading-tight mt-1">{item.title}</h4>
               </div>
             </div>
           ))}
        </div>
      </div>

      {/* Item Expansion Overlay */}
      {selectedItem && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-brand-bg/95 backdrop-blur-3xl animate-in zoom-in duration-300">
           <div className="glass-effect w-full max-w-sm rounded-[3rem] p-10 border border-brand-primary/20 relative shadow-2xl">
              <button onClick={() => setSelectedItem(null)} className="absolute top-8 right-8 p-3 glass-effect rounded-2xl text-slate-500 hover:text-white"><X size={24} /></button>
              <div className="space-y-8">
                 <div className="text-center space-y-2">
                    <span className="text-[10px] font-black uppercase text-brand-primary tracking-[0.4em]">{selectedItem.category} NODE</span>
                    <h3 className="text-3xl font-black uppercase italic text-white tracking-tighter leading-none">{selectedItem.title}</h3>
                 </div>
                 <div className="p-6 rounded-[2rem] bg-black/40 border border-white/5 space-y-4">
                    <p className="text-sm text-slate-300 font-bold leading-relaxed italic">{selectedItem.description}</p>
                    <div className="p-5 rounded-2xl bg-brand-primary/5 border border-brand-primary/10 font-mono text-[11px] text-slate-400">
                       {selectedItem.content}
                    </div>
                 </div>
                 <button 
                    onClick={() => { navigator.clipboard.writeText(selectedItem.content); alert("Copied!"); }}
                    className="w-full py-5 bg-brand-primary text-brand-bg rounded-2xl font-black uppercase text-xs tracking-widest active:scale-95 transition-all flex items-center justify-center gap-3"
                 >
                    <Copy size={18} /> Clone Trace
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Assembly Bar - Fixed at bottom of Vault */}
      {stagedItems.length > 0 && (
        <div className="fixed bottom-24 left-6 right-6 z-[1001] animate-in slide-in-from-bottom-10">
          <div className="glass-effect rounded-[2.5rem] p-6 border-4 border-brand-primary/30 shadow-2xl shadow-brand-primary/10 bg-slate-900/90 backdrop-blur-3xl">
             <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center text-brand-bg">
                      <Sparkles size={20} fill="currentColor" />
                   </div>
                   <div>
                      <h4 className="text-xs font-black uppercase text-white tracking-widest">Neural Assembly</h4>
                      <p className="text-[9px] font-bold text-brand-primary uppercase">{stagedItems.length} Blocks Staged</p>
                   </div>
                </div>
                <button 
                   onClick={() => { navigator.clipboard.writeText(stagedItems.map(i => i.content).join('\n\n')); setStagedItems([]); alert("Assembly Sync Complete!"); }}
                   className="bg-brand-primary text-brand-bg px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all"
                >
                   Finalize Chain
                </button>
             </div>
             <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {stagedItems.map(item => (
                  <div key={item.id} className="glass-effect px-4 py-2 rounded-xl border border-brand-primary/20 flex items-center gap-2 shrink-0">
                     <span className="text-[9px] font-black text-white italic uppercase">{item.title}</span>
                     <button onClick={() => setStagedItems(p => p.filter(i => i.id !== item.id))} className="text-brand-error/50 hover:text-brand-error"><Trash2 size={12} /></button>
                  </div>
                ))}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};