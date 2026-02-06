
import React, { useState } from 'react';
import { UserProgress } from '../types';
import { Play, RotateCcw, Copy, Share2, Sparkles, Binary, Terminal, RefreshCw, Cpu, Brain, Check, Code } from 'lucide-react';
import { synthesizeNeuralBlueprint } from '../services/geminiService';

interface Props {
  progress: UserProgress;
  initialData?: { framework: string; persona: string; input: string };
}

export const ConsoleView: React.FC<Props> = ({ progress, initialData }) => {
  const [activeTab, setActiveTab] = useState<'design' | 'output' | 'trace'>('design');
  const [input, setInput] = useState(initialData?.input || '');
  const [framework, setFramework] = useState(initialData?.framework || 'R.A.C.E');
  const [persona, setPersona] = useState(initialData?.persona || 'Systems Architect');
  const [output, setOutput] = useState('');
  const [trace, setTrace] = useState<string[]>([]);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleSynthesize = async () => {
    if (!input.trim() || isSynthesizing) return;
    
    setIsSynthesizing(true);
    setActiveTab('output');
    setOutput('');
    setTrace(['[INIT] Requesting Neural Synthesis...', '[LOAD] Applying Layered Design Constraints...']);
    
    try {
      const result = await synthesizeNeuralBlueprint(framework, persona, input);
      
      // Split trace from content if present
      const traceMatch = result.match(/\[NEURAL_TRACE\]([\s\S]*)/);
      const cleanContent = result.replace(/\[NEURAL_TRACE\]([\s\S]*)/, '').trim();
      
      setOutput(cleanContent);
      if (traceMatch) {
        setTrace(prev => [...prev, '[SUCCESS] Logic Anchoring Complete.', ...traceMatch[1].split('\n').filter(l => l.trim())]);
      } else {
        setTrace(prev => [...prev, '[SUCCESS] Blueprint Genesis Complete.']);
      }
    } catch (err) {
      setOutput("Neural Core Desync: Check your connection or API configuration.");
      setTrace(prev => [...prev, '[ERROR] Synthesis Interrupted.']);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 pb-4">
      
      {/* Sandbox Header */}
      <div className="flex justify-between items-center mb-6 px-1">
        <div>
           <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white leading-none">Console</h2>
           <p className="text-[9px] font-black uppercase tracking-[0.3em] text-brand-accent mt-1">Experimental Core v3.0</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => { setInput(''); setOutput(''); setTrace([]); setActiveTab('design'); }}
            className="p-3 glass-effect rounded-2xl text-slate-500 hover:text-brand-primary transition-all active:scale-90"
          >
            <RotateCcw size={18} />
          </button>
          <button 
            onClick={handleSynthesize}
            disabled={!input.trim() || isSynthesizing}
            className="p-4 bg-brand-primary text-brand-bg rounded-2xl shadow-[0_4px_15px_rgba(34,211,238,0.4)] active:scale-90 transition-all disabled:opacity-30 disabled:grayscale"
          >
            {isSynthesizing ? <RefreshCw className="animate-spin" size={20} /> : <Play size={20} fill="currentColor" />}
          </button>
        </div>
      </div>

      {/* Tab Nav */}
      <div className="flex gap-2 p-1 bg-black/20 rounded-3xl mb-4">
        {['design', 'output', 'trace'].map(t => (
          <button 
            key={t}
            onClick={() => setActiveTab(t as any)}
            className={`flex-1 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${
              activeTab === t ? 'bg-white/10 text-brand-primary shadow-lg' : 'text-slate-500'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Workspace */}
      <div className="flex-1 glass-effect rounded-6xl border border-white/5 relative overflow-hidden flex flex-col bg-slate-950/40">
        {activeTab === 'design' && (
          <div className="flex-1 flex flex-col p-8 space-y-6">
             <div className="grid grid-cols-2 gap-3">
               <div className="glass-effect rounded-2xl p-4 border border-brand-primary/10 space-y-2">
                 <div className="flex items-center gap-2 text-brand-primary">
                    <Binary size={14} />
                    <span className="text-[8px] font-black uppercase tracking-widest">Framework</span>
                 </div>
                 <select 
                    value={framework} 
                    onChange={(e) => setFramework(e.target.value)}
                    className="bg-transparent border-none text-[10px] font-bold text-white uppercase outline-none w-full"
                 >
                    {['R.A.C.E', 'CRISPE', 'Chain of Thought', 'Socratic'].map(f => (
                        <option key={f} value={f} className="bg-slate-900">{f}</option>
                    ))}
                 </select>
               </div>
               <div className="glass-effect rounded-2xl p-4 border border-brand-accent/10 space-y-2">
                 <div className="flex items-center gap-2 text-brand-accent">
                    <Sparkles size={14} />
                    <span className="text-[8px] font-black uppercase tracking-widest">Persona</span>
                 </div>
                 <select 
                    value={persona} 
                    onChange={(e) => setPersona(e.target.value)}
                    className="bg-transparent border-none text-[10px] font-bold text-white uppercase outline-none w-full"
                 >
                    {['Systems Architect', 'Grand Scholar', 'Research Auditor', 'Tutor'].map(p => (
                        <option key={p} value={p} className="bg-slate-900">{p}</option>
                    ))}
                 </select>
               </div>
             </div>
             
             <div className="flex-1 space-y-2">
                <label className="text-[8px] font-black uppercase text-slate-500 tracking-widest ml-1">Logic Payload</label>
                <textarea 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Inject raw context or primary logic requirements here..."
                  className="w-full h-full bg-transparent border-none focus:ring-0 text-sm font-mono text-slate-200 resize-none placeholder:text-slate-800 outline-none p-0"
                />
             </div>
          </div>
        )}

        {activeTab === 'output' && (
          <div className="flex-1 p-8 font-mono text-[12px] text-brand-primary leading-relaxed whitespace-pre-wrap animate-in zoom-in-95 duration-400 overflow-y-auto no-scrollbar">
             {output ? (
                <>
                    <span className="opacity-40">// NEURAL_SYNTHESIS_SUCCESS</span>
                    <br /><br />
                    <span className="text-white">{output}</span>
                </>
             ) : (
                <div className="flex flex-col items-center justify-center h-full opacity-20 space-y-4">
                    <Brain size={48} className="animate-pulse" />
                    <p className="text-[10px] font-black uppercase">Awaiting Ignition...</p>
                </div>
             )}
          </div>
        )}

        {activeTab === 'trace' && (
          <div className="flex-1 p-8 space-y-6 overflow-y-auto no-scrollbar">
             {trace.length > 0 ? trace.map((line, i) => (
               <div key={i} className="flex gap-5 animate-in slide-in-from-left-2" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="flex flex-col items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-primary shadow-[0_0_8px_#22D3EE]" />
                    <div className="w-px flex-1 bg-white/10 mt-2" />
                  </div>
                  <div className="space-y-1.5 pb-4">
                     <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest">
                        {line.startsWith('[') ? line.split(']')[0].replace('[','') : `STEP ${i}`}
                     </p>
                     <p className="text-[11px] text-slate-400 italic leading-relaxed">
                        {line.includes(']') ? line.split(']')[1].trim() : line}
                     </p>
                  </div>
               </div>
             )) : (
                <div className="flex flex-col items-center justify-center h-full opacity-20 space-y-4">
                    <Terminal size={48} />
                    <p className="text-[10px] font-black uppercase">No Active Trace</p>
                </div>
             )}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-4 flex gap-4 px-1 shrink-0">
         <button 
            onClick={handleCopy}
            disabled={!output}
            className="flex-1 glass-effect rounded-3xl py-5 flex items-center justify-center gap-3 text-[10px] font-black uppercase text-white hover:bg-white/5 active:scale-95 transition-all disabled:opacity-20"
         >
           {isCopied ? <Check size={16} className="text-brand-success" /> : <Copy size={16} className="text-brand-primary" />} 
           {isCopied ? 'Copied' : 'Copy Bundle'}
         </button>
         <button 
            disabled={!output}
            className="flex-1 glass-effect rounded-3xl py-5 flex items-center justify-center gap-3 text-[10px] font-black uppercase text-white hover:bg-white/5 active:scale-95 transition-all disabled:opacity-20"
         >
           <Share2 size={16} className="text-brand-accent" /> Share Link
         </button>
      </div>

    </div>
  );
};
