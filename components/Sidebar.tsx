
import React, { useState, useMemo } from 'react';
import { MASTER_REGISTRY } from '../registry';
import { CategoryType, RegistryItem } from '../types';

interface SidebarProps {
  initialCategory?: 'persona' | 'framework';
  activePersona?: string;
  activeFramework?: string;
  customItems?: RegistryItem[];
  onClose?: () => void;
  onActivate: (category: CategoryType, id: string) => void;
  onStarterClick?: (prompt: string) => void;
  onCreateCustom: (item: RegistryItem) => void;
  onDeleteCustom: (id: string) => void;
}

const ITEM_ICONS: Record<string, string> = {
  'f1': '🏁', 'f2': '⛓️', 'f3': '🌲', 'f4': '📸', 'f5': '⏪', 'f6': '🤔', 'f7': '💎', 'f8': '🧱', 'f9': '🚫', 'f10': '🎮',
  'p1': '🧐', 'p2': '🕯️', 'p3': '🗺️', 'p4': '💵', 'p5': '🧠', 'p6': '📜', 'p7': '📊', 'p8': '📝', 'p9': '🏛️', 'p10': '🤝',
  'p50': '👑'
};

const Sidebar: React.FC<SidebarProps> = ({ 
  initialCategory, activePersona, activeFramework, customItems = [], onClose, onActivate, onStarterClick, onCreateCustom, onDeleteCustom
}) => {
  const [activeMode, setActiveMode] = useState<'persona' | 'framework'>(initialCategory || 'persona');
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<RegistryItem | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Custom Item Form State
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrompt, setNewPrompt] = useState('');

  const fullList = useMemo(() => [...MASTER_REGISTRY, ...customItems], [customItems]);

  const groupedItems = useMemo(() => {
    const rawItems = activeMode === 'persona' 
      ? fullList.filter(i => i.category === CategoryType.PERSONA)
      : fullList.filter(i => i.category === CategoryType.FRAMEWORK);

    const filtered = rawItems.filter(i => 
      i.name.toLowerCase().includes(search.toLowerCase()) || 
      i.description.toLowerCase().includes(search.toLowerCase()) ||
      i.group.toLowerCase().includes(search.toLowerCase())
    );

    return filtered.reduce((acc, item) => {
      const g = item.group || 'OTHER';
      if (!acc[g]) acc[g] = [];
      acc[g].push(item);
      return acc;
    }, {} as Record<string, RegistryItem[]>);
  }, [activeMode, search, fullList]);

  const sortedGroups = useMemo(() => Object.keys(groupedItems).sort(), [groupedItems]);

  const isActuallyActive = (id: string) => (activeMode === 'persona' ? activePersona === id : activeFramework === id);

  const handleCreate = () => {
    if (!newName || !newDesc) return;
    const newItem: RegistryItem = {
      id: `custom-${Date.now()}`,
      name: newName,
      description: newDesc,
      systemPrompt: newPrompt,
      category: activeMode === 'persona' ? CategoryType.PERSONA : CategoryType.FRAMEWORK,
      group: 'CUSTOM',
      isCustom: true
    };
    onCreateCustom(newItem);
    setNewName(''); setNewDesc(''); setNewPrompt('');
    setShowCreateForm(false);
  };

  return (
    <div className="h-full flex flex-col bg-white text-black">
      {/* Sleek, Compact Header */}
      <div className="p-4 border-b-2 border-black/5 shrink-0 bg-white">
        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl mb-3">
           <button 
             onClick={() => { setActiveMode('persona'); setSelectedItem(null); setShowCreateForm(false); }} 
             className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all tracking-wider ${activeMode === 'persona' ? 'bg-black text-white shadow-md' : 'text-black/50 hover:text-black'}`}
           >
             Personas
           </button>
           <button 
             onClick={() => { setActiveMode('framework'); setSelectedItem(null); setShowCreateForm(false); }} 
             className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all tracking-wider ${activeMode === 'framework' ? 'bg-black text-white shadow-md' : 'text-black/50 hover:text-black'}`}
           >
             Frameworks
           </button>
        </div>

        <div className="flex gap-2">
           <div className="relative flex-1">
              <input 
                type="text" 
                placeholder={`Filter ${activeMode}s...`}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-white rounded-xl px-4 py-2.5 text-[13px] font-bold outline-none border-2 border-black focus:border-sky-500 transition-all placeholder:text-black/20 text-black"
              />
           </div>
           <button 
             onClick={() => setShowCreateForm(!showCreateForm)}
             className={`w-11 h-11 border-2 border-black rounded-xl flex items-center justify-center transition-all ${showCreateForm ? 'bg-black text-white' : 'bg-white hover:bg-slate-50'}`}
             title="Custom DNA Architect"
           >
             {showCreateForm ? '✕' : '+'}
           </button>
        </div>
      </div>

      {/* Main List Area - Grouped Rendering */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-6 bg-slate-50/30">
        {showCreateForm ? (
          <div className="p-4 space-y-4 animate-in slide-in-from-top-4 duration-300">
             <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 mb-4">DNA ARCHITECT: {activeMode}</span>
                <div className="space-y-3">
                   <div className="space-y-1">
                      <label className="text-[8px] font-black uppercase text-slate-400">Identity Name</label>
                      <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Chaos Engineer" className="w-full p-3 bg-white border-2 border-black rounded-xl text-[12px] font-black" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[8px] font-black uppercase text-slate-400">Brief Description</label>
                      <input value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="High-speed stress testing..." className="w-full p-3 bg-white border-2 border-black rounded-xl text-[12px] font-black" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[8px] font-black uppercase text-slate-400">Neural Instruction (DNA)</label>
                      <textarea value={newPrompt} onChange={e => setNewPrompt(e.target.value)} rows={3} placeholder="Act as a... Focus on... Avoid..." className="w-full p-3 bg-white border-2 border-black rounded-xl text-[12px] font-black resize-none" />
                   </div>
                   <button onClick={handleCreate} className="w-full py-4 bg-black text-white rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-[6px_6px_0_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-none transition-all">Initialize Identity</button>
                </div>
             </div>
          </div>
        ) : (
          <>
            {sortedGroups.map(groupName => (
              <div key={groupName} className="space-y-2">
                <h4 className="px-2 text-[9px] font-black uppercase tracking-[0.2em] text-black/30 sticky top-0 bg-slate-50/80 backdrop-blur-sm py-1 z-10">
                  {groupName}
                </h4>
                <div className="space-y-2">
                  {groupedItems[groupName].map(item => (
                    <div 
                      key={item.id}
                      onClick={() => setSelectedItem(selectedItem?.id === item.id ? null : item)}
                      className={`w-full text-left p-3 rounded-2xl transition-all cursor-pointer border-2 relative group flex items-center gap-3 ${
                        isActuallyActive(item.id) 
                          ? 'border-black bg-black text-white' 
                          : (selectedItem?.id === item.id ? 'border-sky-500 bg-sky-50 shadow-sm' : 'border-black/5 bg-white hover:border-black/20 shadow-sm')
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 ${isActuallyActive(item.id) ? 'bg-white/10' : 'bg-slate-100'}`}>
                          {item.isCustom ? '🛠️' : (ITEM_ICONS[item.id] || '⚙️')}
                      </div>
                      <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[14px] font-black tracking-tight truncate">{item.name}</span>
                            {isActuallyActive(item.id) && <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />}
                          </div>
                          <span className={`text-[9px] font-bold uppercase tracking-tight block truncate opacity-60`}>
                            {item.description}
                          </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {sortedGroups.length === 0 && (
               <div className="py-12 text-center">
                  <span className="text-4xl block mb-4 opacity-10">🔍</span>
                  <span className="text-[11px] font-black uppercase tracking-widest text-black/40">No Matches Found</span>
               </div>
            )}
          </>
        )}
      </div>

      {/* Compact Detail Panel */}
      <div className={`shrink-0 bg-white border-t-2 border-black/5 transition-all duration-300 ${selectedItem && !showCreateForm ? 'max-h-[300px] p-4 opacity-100' : 'max-h-0 p-0 opacity-0 overflow-hidden'}`}>
        {selectedItem && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
             <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                     <span className="text-[9px] font-black uppercase tracking-widest text-sky-600">DNA Parameters</span>
                     {selectedItem.isCustom && <span className="text-[7px] font-black bg-amber-100 text-amber-600 px-1 rounded">USER-BUILT</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedItem.isCustom && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); if(window.confirm('Wipe this DNA?')) onDeleteCustom(selectedItem.id); setSelectedItem(null); }} 
                        className="text-[10px] opacity-30 hover:opacity-100 grayscale hover:grayscale-0 transition-all"
                        title="Delete Identity"
                      >
                        🗑️
                      </button>
                    )}
                    <button onClick={() => setSelectedItem(null)} className="text-[14px] font-black hover:scale-110">✕</button>
                  </div>
                </div>
                <h3 className="text-[16px] font-black tracking-tight text-black">{selectedItem.name}</h3>
                <p className="text-[12px] font-medium text-black/60 leading-tight">{selectedItem.description}</p>
             </div>
             
             {selectedItem.systemPrompt && (
               <div className="p-2.5 bg-slate-50 rounded-lg font-mono text-[10px] leading-tight font-bold text-black/70 italic max-h-[60px] overflow-y-auto no-scrollbar">
                  {selectedItem.systemPrompt}
               </div>
             )}

             <div className="grid grid-cols-2 gap-3 pb-2">
               <button 
                 onClick={() => {
                   if (onStarterClick) {
                     onStarterClick(`Technical stress-test for ${selectedItem.name}: Evaluate effectiveness and reveal logic gaps.`);
                     if (onClose) onClose();
                   }
                 }}
                 className="py-3 bg-white border-2 border-black rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all active:scale-95"
               >
                 Stress Test
               </button>
               <button 
                 onClick={() => {
                    onActivate(selectedItem.category, selectedItem.id);
                 }}
                 className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 ${isActuallyActive(selectedItem.id) ? 'bg-sky-500 text-white opacity-50' : 'bg-black text-white hover:bg-sky-600'}`}
               >
                 {isActuallyActive(selectedItem.id) ? 'Active' : 'Activate'}
               </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
