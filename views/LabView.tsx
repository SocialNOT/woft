
import React, { useState } from 'react';
import { LabFramework, UserProgress } from '../types';
import { FRAMEWORKS } from '../constants';
// Added RefreshCw to lucide-react imports to fix error on line 118
import { Beaker, ShieldAlert, Layers, Cpu, Zap, RotateCcw, Activity, ShieldCheck, ChevronRight, Play, Info, RefreshCw } from 'lucide-react';
import { scorePrompt } from '../services/geminiService';

export const LabView: React.FC<{ progress?: UserProgress }> = ({ progress }) => {
  const [activeTab, setActiveTab] = useState<'forge' | 'audit' | 'sim'>('forge');
  const [selectedFw, setSelectedFw] = useState<LabFramework>(FRAMEWORKS[0]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [auditResult, setAuditResult] = useState<{score: number, feedback: string, suggestion?: string} | null>(null);

  const handleInput = (key: string, val: string) => {
    setFormData(prev => ({ ...prev, [key]: val }));
  };

  const runSynthesis = async () => {
    setIsProcessing(true);
    try {
      const res = await scorePrompt(selectedFw.id, formData);
      setAuditResult(res);
      setActiveTab('audit');
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForge = () => {
    setFormData({});
    setAuditResult(null);
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500">
      
      {/* Lab Control Tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-slate-900 border border-terminal-border rounded-xl">
        {[
          { id: 'forge', label: 'FRAMEWORK_FORGE', icon: Layers },
          { id: 'audit', label: 'NEURAL_AUDIT', icon: ShieldAlert },
          { id: 'sim', label: 'AGENT_SIM', icon: Cpu }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-lg text-[10px] font-black transition-all border ${
              activeTab === tab.id ? 'bg-terminal-primary text-black border-terminal-primary' : 'text-terminal-dim hover:text-white border-transparent'
            }`}
          >
            <tab.icon size={14} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
        
        {activeTab === 'forge' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4">
            {/* Framework Selector Sidebar */}
            <div className="lg:col-span-1 border border-terminal-border bg-black h-fit">
              <div className="bg-slate-900 p-3 border-b border-terminal-border flex justify-between items-center">
                <span className="text-[9px] font-black uppercase tracking-widest">Logic Models</span>
                <Info size={12} className="text-terminal-dim" />
              </div>
              <div className="max-h-[400px] overflow-y-auto no-scrollbar p-2 space-y-1">
                {FRAMEWORKS.map(fw => (
                  <button
                    key={fw.id}
                    onClick={() => { setSelectedFw(fw); resetForge(); }}
                    className={`w-full text-left px-4 py-3 text-[10px] font-bold border transition-all flex justify-between items-center ${
                      selectedFw.id === fw.id ? 'border-terminal-primary text-terminal-primary bg-terminal-primary/5' : 'border-transparent text-terminal-dim hover:bg-white/5'
                    }`}
                  >
                    <span>{fw.name}</span>
                    {selectedFw.id === fw.id && <Zap size={10} fill="currentColor" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Workspace */}
            <div className="lg:col-span-2 border border-terminal-border bg-black flex flex-col">
               <div className="bg-slate-900 p-4 border-b border-terminal-border flex justify-between items-center">
                  <div className="flex items-center gap-3">
                     <Beaker size={14} className="text-terminal-primary" />
                     <h3 className="text-[11px] font-black uppercase tracking-widest text-white">Synthesize: {selectedFw.name}</h3>
                  </div>
                  <button onClick={resetForge} className="text-terminal-dim hover:text-terminal-error transition-colors">
                    <RotateCcw size={14} />
                  </button>
               </div>
               <div className="p-6 space-y-6">
                  <div className="p-4 bg-terminal-primary/5 border border-terminal-primary/20 rounded-lg">
                    <p className="text-[10px] text-terminal-primary/80 leading-relaxed italic font-medium">"{selectedFw.description}"</p>
                  </div>
                  <div className="space-y-4">
                    {selectedFw.fields.map(field => (
                      <div key={field.key} className="space-y-2">
                        <label className="text-[9px] font-black text-terminal-dim uppercase tracking-widest ml-1">{field.label}</label>
                        <textarea 
                          value={formData[field.key] || ''}
                          onChange={(e) => handleInput(field.key, e.target.value)}
                          placeholder={field.placeholder || `Define ${field.label}...`}
                          className="w-full bg-slate-950 border border-terminal-border rounded-lg p-4 text-xs text-white outline-none focus:border-terminal-primary/50 min-h-[80px] resize-none"
                        />
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={runSynthesis}
                    disabled={isProcessing || Object.keys(formData).length === 0}
                    className="w-full py-5 bg-terminal-primary text-black font-black uppercase text-[11px] tracking-[0.2em] flex items-center justify-center gap-3 disabled:opacity-20 transition-all hover:scale-[1.01] active:scale-95 shadow-lg shadow-terminal-primary/20"
                  >
                    {isProcessing ? <RefreshCw className="animate-spin" size={16} /> : <Zap size={16} fill="currentColor" />}
                    Ignite Neural Audit
                  </button>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in zoom-in-95 duration-500">
            {auditResult ? (
              <div className="border border-terminal-border bg-black overflow-hidden">
                <div className="bg-terminal-primary px-6 py-3 flex justify-between items-center text-black font-black uppercase tracking-widest text-[11px]">
                   <span>Diagnostic Summary</span>
                   <ShieldCheck size={16} />
                </div>
                <div className="p-8 space-y-8">
                   <div className="flex flex-col items-center gap-4 text-center">
                      <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-900" />
                          <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={364.4} strokeDashoffset={364.4 - (364.4 * auditResult.score / 100)} className="text-terminal-primary transition-all duration-1000" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                           <span className="text-3xl font-black text-white">{auditResult.score}</span>
                           <span className="text-[8px] font-black text-terminal-primary uppercase">Fidelity</span>
                        </div>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="space-y-2">
                        <h5 className="text-[9px] font-black uppercase text-terminal-dim tracking-widest">Logic Audit Feed</h5>
                        <div className="bg-slate-950 border border-terminal-border p-6 rounded-xl font-mono text-[11px] leading-relaxed text-terminal-primary/90">
                           {auditResult.feedback}
                        </div>
                      </div>
                      {auditResult.suggestion && (
                        <div className="space-y-2">
                          <h5 className="text-[9px] font-black uppercase text-terminal-dim tracking-widest">Synthesis Recommendation</h5>
                          <div className="bg-terminal-primary/5 border border-terminal-primary/20 p-6 rounded-xl font-mono text-[11px] leading-relaxed text-slate-300 italic">
                             {auditResult.suggestion}
                          </div>
                        </div>
                      )}
                   </div>

                   <button 
                     onClick={() => setActiveTab('forge')}
                     className="w-full py-4 border border-terminal-primary text-terminal-primary font-black uppercase text-[10px] tracking-widest hover:bg-terminal-primary hover:text-black transition-all"
                   >
                     Return to Forge
                   </button>
                </div>
              </div>
            ) : (
              <div className="py-20 flex flex-col items-center justify-center text-center space-y-6 opacity-20">
                 <ShieldAlert size={64} />
                 <p className="text-xs font-black uppercase tracking-widest">No Active Audit Trace Detected.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'sim' && (
          <div className="flex-1 border border-terminal-border bg-black p-12 text-center flex flex-col items-center justify-center space-y-6">
             <div className="w-20 h-20 rounded-full border-2 border-terminal-accent/30 flex items-center justify-center text-terminal-accent animate-pulse">
                <Cpu size={40} />
             </div>
             <div className="space-y-2">
                <h3 className="text-xl font-black italic uppercase text-white tracking-tighter">Agent Orchestrator</h3>
                <p className="text-xs text-terminal-dim max-w-sm uppercase font-bold tracking-widest leading-relaxed">
                   Simulation requires Phase III: Alchemist Level Authorization. Level up via the Roadmap to unlock multi-agent sandbox.
                </p>
             </div>
             <button className="px-8 py-4 bg-terminal-accent text-black font-black uppercase text-[10px] tracking-widest shadow-xl shadow-terminal-accent/20">
                Unlock Prototype
             </button>
          </div>
        )}

      </div>

    </div>
  );
};
