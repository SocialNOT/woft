
import React, { useRef, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';
import LogicVisualizer from './LogicVisualizer';
import SymposiumView from './SymposiumView';

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  isHeatmapOn?: boolean;
  onTranslate: (id: string, text: string) => void;
  onRegenerate: (id: string) => void;
  onStarterClick: (text: string) => void;
  onVisualizeDNA?: (id: string, dna: string) => void;
  onToggleStar: (id: string) => void;
  onTogglePin: (id: string) => void;
  onAnalyzeDNA?: (message: Message) => void;
  onCopy: (text: string) => void;
  onShare: (message: Message) => void;
  onListen: (text: string) => void;
  onBranch: (id: string) => void;
}

const AI_ISMS = [
  'delve', 'tapestry', 'unleash', 'nestled', 'pivotal', 'comprehensive', 
  'meticulous', 'leverage', 'synergy', 'transformative', 'cutting-edge', 
  'game-changer', 'foster', 'landscape', 'paradigm', 'robust', 'seamless',
  'unparalleled', 'multifaceted', 'demystify', 'innovative'
];

const COMBINED_SLOGAN = "MASTER THE ART OF HIGH-SPEED SYNTHESIS. SCALE YOUR MIND. MASTER THE ART OF HIGH-SPEED SYNTHESIS. SCALE YOUR MIND.";

const LOADING_STATUSES = [
  'ANALYZING INPUT PROTOCOL...',
  'MAPPING NEURAL DNA...',
  'APPLYING FRAMEWORK CONSTRAINTS...',
  'SYNTHESIZING LOGIC PATH...',
  'FINALIZING STRUCTURAL SNAP...'
];

const ChatArea: React.FC<ChatAreaProps> = ({ 
  messages, isLoading, isHeatmapOn, onStarterClick, onToggleStar, onTogglePin, onTranslate, onRegenerate, onCopy, onShare, onListen, onBranch
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [visibleLogicId, setVisibleLogicId] = useState<string | null>(null);
  const [loadingStatusIndex, setLoadingStatusIndex] = useState(0);

  useEffect(() => {
    if (messages.length > 0 || isLoading) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStatusIndex(prev => (prev + 1) % LOADING_STATUSES.length);
      }, 1500);
    } else {
      setLoadingStatusIndex(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const applyHeatmap = (text: string) => {
    if (!isHeatmapOn) return text;
    let newText = text;
    AI_ISMS.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      newText = newText.replace(regex, (match) => `<span class="bg-amber-400 text-black font-black px-1 rounded-sm border-b-2 border-black" title="AI Cliché Pattern">${match}</span>`);
    });
    return newText;
  };

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full py-6 px-8 text-center animate-in fade-in duration-700">
         <div className="flex flex-col items-center gap-y-3 mb-6">
            <h2 className="text-[46px] sm:text-[54px] font-black uppercase tracking-tighter leading-[0.8] text-[var(--text-primary)]">LOGIC</h2>
            <h2 className="text-[46px] sm:text-[54px] font-black uppercase tracking-tighter leading-[0.8] text-[var(--text-primary)]">UNBOUND</h2>
         </div>
         
         <div className="h-8 flex items-center justify-center mb-8 w-full overflow-hidden border-y-2 border-[var(--border-primary)]/10">
            <div className="marquee-text text-[11px] sm:text-[13px] font-black uppercase tracking-[0.2em] text-[#0ea5e9]">
              {COMBINED_SLOGAN}
            </div>
         </div>
         
         <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-[340px] mt-2 mb-8">
            <StarterIcon label="GUIDE" sub="LEARN LOGIC" icon="📚" onClick={() => onStarterClick("Deconstruct AI Parity.")} />
            <StarterIcon label="DRILL" sub="PRACTICE NOW" icon="⚒️" onClick={() => onStarterClick("Initiate logic drill.")} />
            <StarterIcon label="CHECK" sub="TEST OUTPUT" icon="🔬" onClick={() => onStarterClick("Audit my output.")} />
         </div>

         <div className="flex flex-col items-center gap-2 mt-auto">
            <div className="w-10 h-[4px] bg-[var(--text-primary)]"></div>
            <p className="text-[9px] sm:text-[11px] font-black uppercase tracking-[0.4em] text-[var(--text-primary)]">EVOLVE BEYOND THE PROMPT</p>
         </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 w-full gap-2">
      {messages.map((m) => (
        <div key={m.id} className={`flex flex-col w-full ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-4 duration-500`}>
           <div className={`message-card ${m.role === 'user' ? 'user-card' : 'model-card'} ${m.meta?.symposium ? 'max-w-full' : ''} ${m.isPinned ? 'ring-4 ring-sky-300' : ''}`}>
              <div className="card-header">
                 <div className="flex justify-between items-center w-full">
                    <span className={`text-[12px] font-black uppercase tracking-[0.05em] truncate pr-4 ${m.role === 'user' ? 'text-white' : 'text-sky-500'}`}>
                        {m.role === 'user' ? 'INPUT_PROTOCOL_V1' : (m.meta?.promptDNA || 'SYNTHESIS_ALPHA_00')}
                    </span>
                    <div className="flex items-center gap-4">
                      {m.role === 'user' && (
                        <button 
                          onClick={() => onToggleStar(m.id)}
                          className={`text-[20px] transition-all hover:scale-125 ${m.isStarred ? 'text-amber-400' : 'text-white'}`}
                          title="Mark Important"
                        >
                          {m.isStarred ? '★' : '☆'}
                        </button>
                      )}
                      <button 
                        onClick={() => onTogglePin(m.id)}
                        className={`text-[20px] transition-transform hover:scale-125 ${m.isPinned ? 'text-sky-500' : (m.role === 'user' ? 'text-white' : 'text-[var(--text-primary)]')}`}
                        title="Pin as Context"
                      >
                        📌
                      </button>
                    </div>
                 </div>

                 <div className="flex items-center justify-between w-full mt-1">
                    <div className="flex items-center gap-3">
                       <div className="branch-badge">
                          <span className="text-[6px] font-black opacity-70">BRANCH:</span>
                          <span className="leading-none">{m.branchId === 'main' || !m.branchId ? 'MAIN' : m.branchId.substring(0,8).toUpperCase()}</span>
                       </div>

                       {m.role === 'model' && (
                          <button 
                            onClick={() => setVisibleLogicId(visibleLogicId === m.id ? null : m.id)}
                            className="view-dna-btn"
                          >
                            <span>VIEW</span>
                            <span>DNA</span>
                          </button>
                       )}
                    </div>

                    {m.role === 'model' && (
                       <div className="flex items-center gap-5">
                          <button 
                            onClick={() => onBranch(m.id)}
                            className="text-[20px] hover:scale-125 transition-transform text-[var(--text-primary)]" 
                            title="Fork Neural Timeline"
                          >
                            🌿
                          </button>
                          <button 
                            onClick={() => onToggleStar(m.id)}
                            className={`text-[20px] transition-all hover:scale-125 ${m.isStarred ? 'text-amber-500' : 'text-[var(--text-primary)]'}`}
                            title="Mark Important"
                          >
                            {m.isStarred ? '★' : '☆'}
                          </button>
                       </div>
                    )}
                 </div>
              </div>
              
              <div className="card-body">
                 {m.role === 'user' ? (
                   <div className="text-right space-y-3">
                      {m.attachedFile && (
                        <div className="flex justify-end">
                           <div className="p-2.5 bg-black border-2 border-white rounded-xl inline-flex items-center gap-2 text-[10px] font-black text-white">
                              <span>📎</span> {m.attachedFile.name}
                           </div>
                        </div>
                      )}
                      <p className="font-black text-[16px] leading-snug">{m.content}</p>
                   </div>
                 ) : (
                   <>
                    {m.meta?.symposium ? (
                      <SymposiumView data={m.meta.symposium} />
                    ) : (
                      <div className="space-y-4">
                        {m.imageUrl && (
                          <div className="border-4 border-[var(--border-primary)] rounded-xl overflow-hidden shadow-[10px_10px_0_var(--shadow-color)] mb-6 animate-in zoom-in-95">
                             <img src={m.imageUrl} alt="Neural Anchor" className="w-full h-auto object-cover" />
                          </div>
                        )}
                        <div className="prose prose-slate max-w-none prose-headings:text-[var(--text-primary)] prose-p:text-[var(--text-primary)] font-medium">
                          {isHeatmapOn ? (
                            <div dangerouslySetInnerHTML={{ __html: applyHeatmap(m.content) }} />
                          ) : (
                            <ReactMarkdown>{m.content}</ReactMarkdown>
                          )}
                        </div>
                        {m.meta?.critique && (
                           <div className="mt-6 p-4 bg-sky-50 dark:bg-sky-950 border-3 border-[var(--border-primary)] rounded-xl text-[12px] font-black italic text-[var(--text-primary)] shadow-[4px_4px_0_var(--shadow-color)]">
                              <span className="block text-[8px] uppercase not-italic mb-1 text-sky-500 tracking-widest">RECURSIVE_CRITIQUE_LOG:</span>
                              "{m.meta.critique}"
                           </div>
                        )}
                      </div>
                    )}
                   </>
                 )}
              </div>

              {m.role === 'model' && visibleLogicId === m.id && !m.meta?.symposium && (
                <LogicVisualizer breakdown={m.meta?.dnaBreakdown} sources={m.meta?.sources} />
              )}

              {m.role === 'model' && (
                <div className="output-tool-grid">
                   <button className="output-tool-btn font-black" onClick={() => onTranslate(m.id, m.content)} title="Translate Protocol">🌐</button>
                   <button className="output-tool-btn font-black" onClick={() => onRegenerate(m.id)} title="Re-Initialize Synthesis">🔄</button>
                   <button className="output-tool-btn font-black" onClick={() => onListen(m.content)} title="Audio Feed">🔊</button>
                   <button className="output-tool-btn font-black" onClick={() => onCopy(m.content)} title="Extract Logic">📋</button>
                   <button className="output-tool-btn font-black" onClick={() => onShare(m)} title="Export Synthesis">↗️</button>
                </div>
              )}
           </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex flex-col items-start w-full animate-in slide-in-from-bottom-2 duration-300">
           <div className="message-card model-card pulse-soft opacity-80">
              <div className="card-header bg-[var(--bg-canvas)]">
                 <div className="flex justify-between items-center w-full">
                    <span className="text-[10px] font-black uppercase tracking-widest text-sky-500 animate-pulse">
                      {LOADING_STATUSES[loadingStatusIndex]}
                    </span>
                    <div className="w-4 h-4 rounded-full border-2 border-sky-500 border-t-transparent animate-spin"></div>
                 </div>
              </div>
              <div className="card-body space-y-4">
                 <div className="h-4 w-[90%] bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse"></div>
                 <div className="h-4 w-[100%] bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse"></div>
                 <div className="h-4 w-[75%] bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse"></div>
                 
                 <div className="pt-6 border-t-2 border-[var(--border-primary)]/5 flex gap-3">
                    <div className="h-8 flex-1 bg-slate-100 dark:bg-slate-900 rounded-lg border border-[var(--border-primary)]/10"></div>
                    <div className="h-8 flex-1 bg-slate-100 dark:bg-slate-900 rounded-lg border border-[var(--border-primary)]/10"></div>
                    <div className="h-8 flex-1 bg-slate-100 dark:bg-slate-900 rounded-lg border border-[var(--border-primary)]/10"></div>
                 </div>
              </div>
           </div>
        </div>
      )}
      <div ref={messagesEndRef} className="h-10 w-full flex-shrink-0" />
    </div>
  );
};

const StarterIcon = ({ label, sub, icon, onClick }: any) => (
  <div className="flex flex-col items-center cursor-pointer group" onClick={onClick}>
     <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-full border-4 border-[var(--border-primary)] flex items-center justify-center text-3xl sm:text-4xl shadow-[8px_8px_0_var(--shadow-color)] group-hover:bg-sky-50 dark:group-hover:bg-sky-950 transition-all group-active:translate-y-1 group-active:shadow-none bg-[var(--bg-canvas)]">
        {icon}
     </div>
     <div className="mt-4 flex flex-col items-center">
        <span className="text-[11px] sm:text-[13px] font-black uppercase text-[var(--text-primary)] leading-none mb-1">{label}</span>
        <span className="text-[8px] sm:text-[9px] font-black text-sky-500 uppercase tracking-tighter">{sub}</span>
     </div>
  </div>
);

export default ChatArea;
