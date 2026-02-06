import React, { useState, useMemo } from 'react';
import { Search, ChevronRight, X, Bookmark, Zap, Cpu, Book, User, Terminal, Layers, FileText, Filter } from 'lucide-react';
import { FULL_KNOWLEDGE_BASE } from '../knowledge/data';
import { KnowledgeItem } from '../types';

export const LibraryView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);

  const categories = ['All', 'Phase', 'Framework', 'Persona', 'Architecture', 'Linguistic'];

  const items = useMemo(() => {
    return FULL_KNOWLEDGE_BASE
      .filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             item.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCat = activeCategory === 'All' || item.category === activeCategory;
        return matchesSearch && matchesCat;
      });
  }, [searchQuery, activeCategory]);

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500 overflow-hidden pb-4">
      
      {/* Header Info */}
      <div className="shrink-0 flex justify-between items-end border-l-2 border-terminal-primary pl-6 py-2">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-terminal-primary uppercase tracking-[0.3em]">Knowledge Directory</p>
          <h1 className="text-2xl font-black uppercase tracking-tighter text-white">NEURAL_ARCHIVE://{activeCategory.toUpperCase()}</h1>
        </div>
        <div className="text-right text-[10px] font-bold text-terminal-dim">
           FILES_COUNT: {items.length}
        </div>
      </div>

      {/* Controls */}
      <div className="shrink-0 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by keyword..." 
              className="w-full bg-black border border-terminal-border py-2 px-4 pl-10 text-[11px] font-bold focus:border-terminal-primary outline-none text-white"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-terminal-dim" size={14} />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`btn-terminal shrink-0 ${activeCategory === cat ? 'bg-terminal-primary text-black border-terminal-primary' : 'text-terminal-dim'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <div className="flex-1 overflow-hidden border border-terminal-border flex flex-col bg-black">
         <div className="grid grid-cols-12 bg-slate-900 border-b border-terminal-border px-4 py-2 text-[9px] font-black uppercase tracking-widest text-terminal-dim">
            <div className="col-span-5">File_Name</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-4">Metadata_Summary</div>
            <div className="col-span-1 text-right">Access</div>
         </div>
         <div className="flex-1 overflow-y-auto no-scrollbar">
            {items.map((item, idx) => (
              <div 
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="grid grid-cols-12 px-4 py-3 text-[10px] border-b border-terminal-border/30 hover:bg-terminal-primary hover:text-black cursor-pointer group transition-colors"
              >
                <div className="col-span-5 flex items-center gap-3">
                   <FileText size={12} className="text-terminal-dim group-hover:text-black" />
                   <span className="font-bold truncate uppercase italic">{item.title}</span>
                </div>
                <div className="col-span-2 text-[9px] font-bold uppercase text-terminal-dim group-hover:text-black">{item.category}</div>
                <div className="col-span-4 text-terminal-dim group-hover:text-black/80 truncate pr-4">{item.description}</div>
                <div className="col-span-1 text-right">
                   <ChevronRight size={12} className="inline opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
         </div>
      </div>

      {/* Item Viewer Overlay */}
      {selectedItem && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in zoom-in duration-300">
           <div className="w-full max-w-2xl bg-black border border-terminal-primary flex flex-col shadow-[0_0_50px_rgba(34,211,238,0.2)]">
              <div className="bg-terminal-primary px-4 py-1 flex justify-between items-center text-black font-black text-[11px] uppercase tracking-widest">
                 <span>READ_BUFFER: {selectedItem.title}</span>
                 <X size={16} onClick={() => setSelectedItem(null)} className="cursor-pointer hover:scale-110" />
              </div>
              <div className="p-8 space-y-8 max-h-[80vh] overflow-y-auto no-scrollbar">
                 <div className="space-y-2 border-b border-terminal-border pb-4">
                    <p className="text-[10px] font-bold text-terminal-primary uppercase tracking-[0.3em]">Module Overview</p>
                    <p className="text-sm font-bold leading-relaxed">{selectedItem.description}</p>
                 </div>

                 <div className="space-y-4">
                    <div className="flex items-center gap-2">
                       <Terminal size={14} className="text-terminal-primary" />
                       <p className="text-[10px] font-bold text-terminal-dim uppercase tracking-widest">Technical Payload</p>
                    </div>
                    <div className="bg-slate-950 border border-terminal-border p-6 font-mono text-xs text-terminal-primary leading-relaxed whitespace-pre-wrap">
                       {selectedItem.content}
                    </div>
                 </div>

                 <div className="flex gap-4 pt-4">
                    <button className="flex-1 btn-terminal bg-terminal-primary text-black py-4 font-black">
                       Execute Module
                    </button>
                    <button className="flex-1 btn-terminal border-terminal-primary text-terminal-primary py-4 hover:bg-terminal-primary hover:text-black">
                       Copy Reference
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};