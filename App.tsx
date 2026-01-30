
import React, { useState, useRef, useEffect } from 'react';
// Add missing import for ReactMarkdown
import ReactMarkdown from 'react-markdown';
import { Message, CategoryType, CompassState, AttachedFile, RegistryItem } from './types';
import { callGemini, translateToBengali, generateSpeech, generateImage, decodeBase64, decodeAudioBuffer } from './geminiService';
import { MASTER_REGISTRY } from './registry';
import { HACKS_REGISTRY } from './hacks';
import { COURSE_BLUEPRINT } from './blueprint';
import ChatArea from './components/ChatArea';
import Sidebar from './components/Sidebar';
import LiveTerminal from './components/LiveTerminal';
import gsap from 'gsap';

const STORAGE_KEYS = {
  MESSAGES: 'wot_messages',
  PERSONA: 'wot_active_persona',
  FRAMEWORK: 'wot_active_framework',
  COMPASS: 'wot_compass_state',
  BRANCH: 'wot_active_branch',
  CUSTOM_ITEMS: 'wot_custom_items',
  THEME: 'wot_theme'
};

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeBranchId, setActiveBranchId] = useState<string>('main');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [registryMode, setRegistryMode] = useState<'persona' | 'framework' | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showHacks, setShowHacks] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [showStarred, setShowStarred] = useState(false);
  const [isLiveActive, setIsLiveActive] = useState(false);
  
  const [isConfigExpanded, setIsConfigExpanded] = useState(true);
  const [isToolsExpanded, setIsToolsExpanded] = useState(true);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isHeatmapOn, setIsHeatmapOn] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.THEME) === 'dark';
  });

  const [isImageGen, setIsImageGen] = useState(false);
  const [isCritique, setIsCritique] = useState(false);
  const [isAuditMode, setIsAuditMode] = useState(false);
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [customItems, setCustomItems] = useState<RegistryItem[]>([]);

  const [activePersona, setActivePersona] = useState<RegistryItem>(MASTER_REGISTRY.find(p => p.id === 'p50')!);
  const [activeFramework, setActiveFramework] = useState<RegistryItem>(MASTER_REGISTRY.find(f => f.id === 'f1')!);
  const [isWebGrounding, setIsWebGrounding] = useState(false);
  const [isDeepThink, setIsDeepThink] = useState(true);
  const [isSymposium, setIsSymposium] = useState(false);

  const [compass, setCompass] = useState<CompassState>({
    temperature: 0.7, topP: 0.9, topK: 40, seed: 42, thinkingBudget: 16000, aspectRatio: "1:1"
  });

  const fullRegistry = [...MASTER_REGISTRY, ...customItems];

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem(STORAGE_KEYS.THEME, isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    const savedMessages = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    const savedPersonaId = localStorage.getItem(STORAGE_KEYS.PERSONA);
    const savedFrameworkId = localStorage.getItem(STORAGE_KEYS.FRAMEWORK);
    const savedCompass = localStorage.getItem(STORAGE_KEYS.COMPASS);
    const savedBranch = localStorage.getItem(STORAGE_KEYS.BRANCH);
    const savedCustom = localStorage.getItem(STORAGE_KEYS.CUSTOM_ITEMS);

    let currentCustom: RegistryItem[] = [];
    if (savedCustom) {
      try { 
        currentCustom = JSON.parse(savedCustom);
        setCustomItems(currentCustom); 
      } catch (e) { console.error(e); }
    }
    
    if (savedMessages) {
      try { setMessages(JSON.parse(savedMessages)); } catch (e) { console.error(e); }
    }
    if (savedPersonaId) {
      const p = [...MASTER_REGISTRY, ...currentCustom].find(i => i.id === savedPersonaId);
      if (p) setActivePersona(p);
    }
    if (savedFrameworkId) {
      const f = [...MASTER_REGISTRY, ...currentCustom].find(i => i.id === savedFrameworkId);
      if (f) setActiveFramework(f);
    }
    if (savedCompass) {
      try { setCompass(JSON.parse(savedCompass)); } catch (e) { console.error(e); }
    }
    if (savedBranch) setActiveBranchId(savedBranch);
  }, []);

  useEffect(() => { localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages)); }, [messages]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PERSONA, activePersona.id); }, [activePersona]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.FRAMEWORK, activeFramework.id); }, [activeFramework]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.COMPASS, JSON.stringify(compass)); }, [compass]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.BRANCH, activeBranchId); }, [activeBranchId]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.CUSTOM_ITEMS, JSON.stringify(customItems)); }, [customItems]);

  const filteredMessages = messages.filter(m => !m.branchId || m.branchId === activeBranchId || m.branchId === 'main');

  const handleSubmit = async (overridePrompt?: string) => {
    const finalInput = overridePrompt || input;
    if (!finalInput.trim() && !attachedFile) return;
    setIsLoading(true);
    
    const userMsg: Message = { 
      id: Date.now().toString(), 
      role: 'user', 
      content: finalInput, 
      isStarred: false,
      branchId: activeBranchId,
      attachedFile: attachedFile || undefined
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setAttachedFile(null);

    try {
      const pinnedContext = messages.filter(m => m.isPinned && m.role === 'model').map(m => m.content).join("\n---\n");
      
      const response = await callGemini(
        finalInput, 
        compass, 
        isAuditMode ? 'p1' : activePersona.id, 
        activeFramework.id, 
        isWebGrounding, 
        isDeepThink, 
        isSymposium, 
        isCritique,
        userMsg.attachedFile,
        pinnedContext
      );
      
      let imageUrl = "";
      if (isImageGen && response.imagePrompt) {
        imageUrl = await generateImage(response.imagePrompt, compass.aspectRatio) || "";
      }

      const modelMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'model', content: response.answer, thought: response.thought, isStarred: false,
        branchId: activeBranchId,
        imageUrl: imageUrl,
        meta: { 
          framework: activeFramework.id, 
          persona: isAuditMode ? 'p1' : activePersona.id, 
          promptDNA: isAuditMode ? 'NEURAL_AUDIT_PROTOCOL' : response.promptDNA,
          dnaBreakdown: response.dnaBreakdown,
          sources: response.sources,
          symposium: response.symposium,
          critique: response.critique,
          imagePrompt: response.imagePrompt
        } 
      };
      setMessages(prev => [...prev, modelMsg]);
      if (isAuditMode) setIsAuditMode(false);
    } catch (e) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', content: "**SYSTEM_ERROR**: Neural bridge failed. Logic corruption detected.", isStarred: false, branchId: activeBranchId }]);
    } finally { setIsLoading(false); }
  };

  const handleBranch = (messageId: string) => {
    const newBranchId = `timeline-${Date.now()}`;
    const branchName = window.prompt("Name this Neural Branch:", "Alternative Path");
    if (!branchName) return;
    const msgIndex = messages.findIndex(m => m.id === messageId);
    const history = messages.slice(0, msgIndex + 1).map(m => ({ ...m, branchId: newBranchId }));
    setMessages(prev => [...prev, ...history]);
    setActiveBranchId(newBranchId);
  };

  const closeLive = (transcription?: string) => {
    setIsLiveActive(false);
    if (transcription && transcription.trim()) {
      setInput(prev => prev + (prev ? ' ' : '') + transcription.trim());
    }
  };

  const handleExport = () => {
    const content = messages.map(m => `### ${m.role === 'user' ? 'USER' : 'AI'} (${m.meta?.promptDNA || 'TEXT'})\n\n${m.content}\n\n---\n`).join("\n");
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `synthesis_dossier_${Date.now()}.md`;
    a.click();
  };

  const toggleStar = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, isStarred: !m.isStarred } : m));
  };

  const togglePin = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, isPinned: !m.isPinned } : m));
  };

  const handleTranslate = async (id: string, text: string) => {
    const translated = await translateToBengali(text);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, content: translated } : m));
  };

  const handleRegenerate = async (id: string) => {
    const msgIndex = messages.findIndex(m => m.id === id);
    if (msgIndex === -1) return;
    let lastUserPrompt = "";
    for (let i = msgIndex - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        lastUserPrompt = messages[i].content;
        break;
      }
    }
    if (lastUserPrompt) {
      setMessages(prev => prev.slice(0, msgIndex));
      handleSubmit(lastUserPrompt);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleShare = (message: Message) => {
    if (navigator.share) {
      navigator.share({ title: 'WOT Synthesis', text: message.content, url: window.location.href }).catch(console.error);
    } else {
      handleCopy(message.content);
      alert("Copied to clipboard for sharing.");
    }
  };

  const handleListen = async (text: string) => {
    const audioData = await generateSpeech(text);
    if (audioData) {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const decoded = decodeBase64(audioData);
      const buffer = await decodeAudioBuffer(decoded, audioCtx);
      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);
      source.start();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      setAttachedFile({ name: file.name, mimeType: file.type, data: base64 });
    };
    reader.readAsDataURL(file);
  };

  const addCustomItem = (item: RegistryItem) => {
    setCustomItems(prev => [...prev, item]);
  };

  const deleteCustomItem = (id: string) => {
    setCustomItems(prev => prev.filter(i => i.id !== id));
  };

  const clearMessages = () => {
    if (window.confirm("Initialize new session? All context and history will be purged.")) {
      setMessages([]);
      setAttachedFile(null);
      setActiveBranchId('main');
    }
  };

  if (!isInitialized) return <WelcomeSplash onEnter={() => setIsInitialized(true)} />;

  return (
    <div id="root" className={`${isFocusMode ? 'focus-mode' : ''}`}>
      {!isFocusMode && (
        <header className="header-top">
           <div className="flex justify-between items-center">
              <div className="flex flex-col">
                 <span className="nexus-label">Nexus Handshake</span>
                 <h1 className="logo-text italic">World of Texts</h1>
              </div>
              <div className="flex items-center gap-2">
                 <button 
                   onClick={() => setShowStarred(!showStarred)} 
                   className={`w-10 h-10 flex items-center justify-center border-3 border-[var(--border-primary)] rounded-xl text-lg transition-colors ${showStarred ? 'bg-amber-500 text-white' : 'bg-[var(--bg-canvas)] hover:bg-[var(--bg-secondary)]'}`}
                   title="View Starred Highlights"
                 >
                   ★
                 </button>
                 <button 
                   onClick={() => setIsDarkMode(!isDarkMode)} 
                   className="w-10 h-10 flex items-center justify-center border-3 border-[var(--border-primary)] rounded-xl text-lg bg-[var(--bg-canvas)] hover:bg-[var(--bg-secondary)] transition-colors"
                   title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                 >
                   {isDarkMode ? '☀️' : '🌙'}
                 </button>
                 <button 
                   onClick={() => setIsFocusMode(!isFocusMode)} 
                   className={`w-10 h-10 flex items-center justify-center border-3 border-[var(--border-primary)] rounded-xl text-lg transition-colors ${isFocusMode ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)] shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)]' : 'bg-[var(--bg-canvas)] hover:bg-[var(--bg-secondary)]'}`}
                   title="Toggle Focus Mode (Expands workspace)"
                 >
                   👁️
                 </button>
                 <button 
                   onClick={() => setIsSettingsOpen(true)} 
                   className="w-10 h-10 flex items-center justify-center border-3 border-[var(--border-primary)] rounded-xl text-lg bg-[var(--bg-canvas)] hover:bg-[var(--bg-secondary)] transition-colors"
                   title="Open Neural Parameters (Settings)"
                 >
                   ⚙️
                 </button>
              </div>
           </div>
           <div className="nav-buttons">
              <button onClick={() => setShowHacks(true)} className="nav-btn btn-dark" title="Quick formatting and logic shortcuts">Hacks</button>
              <button onClick={() => setShowRoadmap(true)} className="nav-btn btn-light" title="View mastery progression and future updates">Roadmap</button>
              <button onClick={handleExport} className="nav-btn btn-light !text-sky-500" title="Export current synthesis as Markdown">Export</button>
           </div>
        </header>
      )}

      {!isFocusMode && (
        <div className="config-area">
          <div className={`overflow-hidden transition-all duration-300 ${isConfigExpanded ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
             <div className="registry-bar">
                <div className="reg-item" onClick={() => setRegistryMode('persona')} title="Change active AI Persona DNA">
                   <span className="reg-label">Persona</span>
                   <span className="reg-value truncate max-w-[150px]">{activePersona.name}</span>
                </div>
                <div className="reg-item" onClick={() => setRegistryMode('framework')} title="Change reasoning framework logic">
                   <span className="reg-label">Framework</span>
                   <span className="reg-value truncate max-w-[150px]">{activeFramework.name}</span>
                </div>
             </div>
          </div>
          <div className="toggle-divider" onClick={() => setIsConfigExpanded(!isConfigExpanded)} title={isConfigExpanded ? "Hide Configuration" : "Show Configuration"}>
             <div className={`toggle-circle ${isConfigExpanded ? 'rotated' : ''}`}>▼</div>
          </div>
        </div>
      )}

      {activeBranchId !== 'main' && !isFocusMode && (
        <div className="bg-black text-white px-4 py-3 flex justify-between items-center border-b-2 border-sky-500">
           <span className="text-[11px] font-black uppercase tracking-widest">Active Branch: {activeBranchId.substring(0, 14).toUpperCase()}...</span>
           <button onClick={() => setActiveBranchId('main')} className="text-[11px] font-black underline hover:text-sky-400">Exit Neural Path</button>
        </div>
      )}

      <main className="main-canvas no-scrollbar">
         <ChatArea 
            messages={filteredMessages} isLoading={isLoading} 
            isHeatmapOn={isHeatmapOn}
            onStarterClick={handleSubmit} 
            onToggleStar={toggleStar}
            onTogglePin={togglePin}
            onTranslate={handleTranslate} 
            onRegenerate={handleRegenerate} 
            onCopy={handleCopy}
            onShare={handleShare}
            onListen={handleListen}
            onBranch={handleBranch}
         />
      </main>

      <footer className="terminal-block">
         <div className="toggle-divider !mb-4" onClick={() => setIsToolsExpanded(!isToolsExpanded)} title={isToolsExpanded ? "Hide Tools" : "Show Tools"}>
            <div className={`toggle-circle ${isToolsExpanded ? '' : 'rotated'}`}>▼</div>
         </div>
         <div className={`overflow-hidden transition-all duration-300 ${isToolsExpanded ? 'max-h-36 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="tool-grid-main">
               <ToolItem icon="🌐" label="WEB" active={isWebGrounding} onClick={() => setIsWebGrounding(!isWebGrounding)} tooltip="Enable Google Search grounding for real-time info" />
               <ToolItem icon="🧠" label="THINK" active={isDeepThink} onClick={() => setIsDeepThink(!isDeepThink)} tooltip="Allocate more tokens for deep reasoning (Thinking Budget)" />
               <ToolItem icon="📄" label="RAG" active={!!attachedFile || messages.some(m => m.isPinned)} onClick={() => fileInputRef.current?.click()} tooltip="Attach files or use pinned context for RAG" />
               <ToolItem icon="🎙️" label="SPEECH" active={isLiveActive} onClick={() => setIsLiveActive(true)} tooltip="Activate Live Audio Interaction" />
               <ToolItem icon="➕" label="NEW" active={false} onClick={clearMessages} tooltip="Initialize a completely new neural session" />
            </div>
         </div>
         <div className="console-box">
            <span 
              className="text-[20px] cursor-pointer text-[var(--text-primary)] font-black hover:scale-110 transition-transform" 
              onClick={() => setIsLiveActive(true)} 
              title="Activate Live Nexus Voice Connection"
            >
              🎙️
            </span>
            <input 
              type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} 
              accept="image/*,application/pdf,text/plain" 
            />
            <button 
              onClick={() => fileInputRef.current?.click()} 
              className="text-[20px] text-[var(--text-primary)] font-black hover:scale-110 transition-transform"
              title="Attach File (Image, PDF, Text)"
            >
              📎
            </button>
            <div className="flex-1 flex items-center min-w-0 px-2">
               {attachedFile && (
                  <div className="mr-2 px-2 py-1 bg-[var(--text-primary)] border-2 border-sky-500 rounded text-[10px] font-black truncate max-w-[140px] text-[var(--bg-canvas)]">
                     {attachedFile.name.toUpperCase()} <button onClick={() => setAttachedFile(null)} className="ml-2 text-sky-400">✕</button>
                  </div>
               )}
               <input 
                 type="text" value={input} onChange={e => setInput(e.target.value)}
                 onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                 placeholder={isAuditMode ? "POINT TO AUDIT SITE..." : "INJECT LOGIC COMMAND..."}
                 className="flex-1 bg-transparent font-black text-[16px] outline-none placeholder:opacity-40 text-[var(--text-primary)] uppercase"
               />
            </div>
            <button onClick={() => handleSubmit()} className="send-btn" title="Send logic protocol (Enter)">
               <span className="text-[20px] font-black">↑</span>
            </button>
         </div>
      </footer>

      {isLiveActive && (
        <LiveTerminal onClose={closeLive} systemInstruction={`Tactical Logic Liaison. Workspace: ${activeFramework.name}. Persona: ${activePersona.name}.`} />
      )}

      {showStarred && (
        <OverlayWrapper onClose={() => setShowStarred(false)} title="Starred Highlights">
           <div className="p-4 space-y-4">
              {messages.filter(m => m.isStarred).length === 0 ? (
                 <div className="py-24 text-center font-black uppercase text-[13px] tracking-widest text-[var(--text-primary)]">Zero marked logic blocks.</div>
              ) : (
                 messages.filter(m => m.isStarred).map(m => (
                    <div key={m.id} className="message-card p-5 relative bg-[var(--bg-card)]">
                       <button onClick={() => toggleStar(m.id)} className="absolute top-2 right-2 text-amber-500 text-lg" title="Unstar message">★</button>
                       <div className="text-[11px] font-black uppercase text-sky-500 mb-2 tracking-widest">{m.role === 'user' ? 'INPUT_LOG' : (m.meta?.promptDNA || 'SYNTHESIS_LOG')}</div>
                       <div className="text-[14px] font-black leading-relaxed text-[var(--text-primary)]">
                         <ReactMarkdown>{m.content}</ReactMarkdown>
                       </div>
                    </div>
                 ))
              )}
           </div>
        </OverlayWrapper>
      )}

      {showHacks && (
        <OverlayWrapper onClose={() => setShowHacks(false)} title="Registry Hacks">
           <div className="p-4 grid grid-cols-2 gap-4">
              {HACKS_REGISTRY.flatMap(g => g.items).slice(0, 40).map((h, i) => (
                 <button key={i} onClick={() => { setInput(prev => prev + (prev ? ' ' : '') + `[${h}]`); setShowHacks(false); }} className="p-5 bg-[var(--bg-canvas)] border-3 border-[var(--border-primary)] rounded-2xl text-[11px] font-black uppercase text-left hover:bg-[var(--text-primary)] hover:text-[var(--bg-canvas)] transition-all text-[var(--text-primary)] shadow-[4px_4px_0_var(--shadow-color)] active:translate-y-1 active:shadow-none" title={`Inject ${h} constraint`}>{h}</button>
              ))}
           </div>
        </OverlayWrapper>
      )}

      {showRoadmap && (
        <OverlayWrapper onClose={() => setShowRoadmap(false)} title="Mastery Roadmap">
           <div className="p-6 space-y-6">
              {COURSE_BLUEPRINT.phases.map(p => (
                 <div key={p.id} className="border-b-3 border-[var(--border-primary)] pb-6 mb-8 last:border-0">
                    <div className="text-[12px] font-black text-sky-500 mb-2 uppercase tracking-widest">PHASE {p.id}</div>
                    <div className="text-[18px] font-black text-[var(--text-primary)] leading-tight mb-4">{p.name}</div>
                    <div className="flex flex-wrap gap-3">
                       {p.modules.map(m => (
                          <button key={m.id} onClick={() => { handleSubmit(m.starterPrompt); setShowRoadmap(false); }} className="px-4 py-3 bg-[var(--bg-canvas)] border-3 border-[var(--border-primary)] rounded-xl text-[11px] font-black text-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-canvas)] transition-all shadow-[4px_4px_0_var(--shadow-color)] active:translate-y-1 active:shadow-none" title={`Run ${m.title} prompt`}>{m.id}</button>
                       ))}
                    </div>
                 </div>
              ))}
           </div>
        </OverlayWrapper>
      )}

      {registryMode && (
        <OverlayWrapper onClose={() => setRegistryMode(null)} title="Core Selection">
           <Sidebar 
             initialCategory={registryMode} 
             activePersona={activePersona.id} 
             activeFramework={activeFramework.id}
             customItems={customItems}
             onCreateCustom={addCustomItem}
             onDeleteCustom={deleteCustomItem}
             onActivate={(cat, id) => {
                const item = fullRegistry.find(i => i.id === id)!;
                if(cat === CategoryType.PERSONA) setActivePersona(item); else setActiveFramework(item);
                setRegistryMode(null);
             }}
             onClose={() => setRegistryMode(null)}
           />
        </OverlayWrapper>
      )}

      {isSettingsOpen && (
        <OverlayWrapper onClose={() => setIsSettingsOpen(false)} title="Neural Params">
           <div className="p-6 space-y-10">
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <label className="text-[12px] font-black uppercase text-sky-500 tracking-widest">Thinking Budget</label>
                    <span className="text-[12px] font-black text-[var(--text-primary)]">{compass.thinkingBudget}T</span>
                 </div>
                 <select value={compass.thinkingBudget} onChange={e => setCompass({...compass, thinkingBudget: parseInt(e.target.value)})} className="w-full p-5 bg-[var(--bg-canvas)] border-3 border-[var(--border-primary)] rounded-2xl text-[16px] font-black outline-none text-[var(--text-primary)]">
                    <option value={8000}>8,000 (RAPID)</option>
                    <option value={16000}>16,000 (BALANCED)</option>
                    <option value={32000}>32,000 (DEEP)</option>
                 </select>
              </div>
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <label className="text-[12px] font-black uppercase text-sky-500 tracking-widest">Entropy Lever</label>
                    <span className="text-[12px] font-black text-[var(--text-primary)]">{compass.temperature}</span>
                 </div>
                 <input type="range" min="0" max="1" step="0.1" value={compass.temperature} onChange={e => setCompass({...compass, temperature: parseFloat(e.target.value)})} className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer accent-sky-500" />
              </div>
           </div>
        </OverlayWrapper>
      )}
    </div>
  );
}

function ToolItem({ icon, label, active, onClick, tooltip }: any) {
  return (
    <button onClick={onClick} className={`tool-btn-main ${active ? 'active' : ''}`} title={tooltip}>
       <span className="text-[22px]">{icon}</span>
       <span className="text-[10px] font-black tracking-widest uppercase">{label}</span>
    </button>
  );
}

function OverlayWrapper({ children, onClose, title }: any) {
  return (
    <div className="fixed inset-0 z-[500] bg-black/60 backdrop-blur-md flex items-center justify-center p-4" onClick={onClose}>
       <div className="w-full max-w-[420px] h-[85vh] bg-[var(--bg-canvas)] rounded-[32px] border-4 border-[var(--border-primary)] flex flex-col overflow-hidden shadow-[25px_25px_0_rgba(14,165,233,0.3)]" onClick={e => e.stopPropagation()}>
          <div className="p-6 border-b-3 border-[var(--border-primary)] flex justify-between items-center bg-[var(--bg-canvas)]">
             <span className="text-[12px] font-black uppercase tracking-[0.25em] text-[var(--text-primary)]">{title}</span>
             <button onClick={onClose} className="w-10 h-10 flex items-center justify-center hover:bg-sky-50 rounded-full transition-colors border-3 border-[var(--border-primary)] text-[var(--text-primary)] font-black text-lg" title="Close Overlay">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar">{children}</div>
       </div>
    </div>
  );
}

const COMBINED_SLOGAN_TEXT = "MASTER THE ART OF HIGH-SPEED SYNTHESIS. SCALE YOUR MIND. MASTER THE ART OF HIGH-SPEED SYNTHESIS. SCALE YOUR MIND.";

function WelcomeSplash({ onEnter }: { onEnter: () => void }) {
  const words = ["Architect", "Strategist", "Sage", "Researcher", "Engineer"];
  const [currentWord, setCurrentWord] = useState(0);

  useEffect(() => {
    const wordInterval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2000);

    const tl = gsap.timeline();
    tl.from(".splash-title", { opacity: 0, y: 30, duration: 1.2, ease: "power4.out" })
      .from(".splash-hook", { opacity: 0, scale: 0.95, duration: 0.8, ease: "power2.out" }, "-=0.8")
      .from(".splash-notif-pill", { opacity: 0, scale: 0.8, duration: 0.8, ease: "back.out(1.7)" }, "-=0.4")
      .from(".splash-tier-card", { opacity: 0, y: 20, duration: 0.8, ease: "power2.out" }, "-=0.2")
      .from(".splash-btn-anim", { opacity: 0, y: 40, duration: 1.2, ease: "back.out(2)" }, "-=0.2");

    return () => {
      clearInterval(wordInterval);
    };
  }, []);

  return (
    <div className="splash-wrapper select-none no-scrollbar flex flex-col items-center justify-center h-full p-4 text-center">
      <div className="splash-title mb-4 shrink-0">
         <h1 className="text-[44px] sm:text-[52px] font-black uppercase italic tracking-tighter leading-[0.75] mb-2 text-[var(--text-primary)]">
            World of<br/>
            <span className="word-reveal min-w-[200px]">
              {words[currentWord].toUpperCase()}
            </span>
         </h1>
         <div className="h-2 w-20 bg-[var(--text-primary)] mx-auto rounded-full mb-4 shadow-[2px_2px_0_#0ea5e9]"></div>
         <p className="text-[10px] font-black text-sky-500 uppercase tracking-[0.4em]">Linguistic Engine V3.5</p>
      </div>

      <div className="splash-hook mb-8 max-w-[340px] shrink-0">
         <p className="text-[15px] sm:text-[17px] font-black leading-tight text-[var(--text-primary)]">
           Expertise mapped into <strong>Neural DNA</strong>. 
           Convert raw data into high-density structural logic with one handshake.
         </p>
      </div>

      <div className="splash-notif-pill w-full max-w-[340px] px-6 py-4 bg-[var(--text-primary)] text-[var(--bg-canvas)] rounded-full border-2 border-sky-500 shadow-[6px_6px_0_rgba(14,165,233,0.2)] mb-8 flex items-center overflow-hidden h-12 shrink-0 marquee-container">
         <p className="marquee-text text-[9px] sm:text-[11px] font-black uppercase tracking-[0.15em]">
            {COMBINED_SLOGAN_TEXT}
         </p>
      </div>

      <div className="splash-tier-card w-full max-w-[320px] px-8 py-4 bg-sky-50 rounded-[24px] border-4 border-black text-black shadow-[8px_8px_0_#000] mb-8 shrink-0">
         <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 text-sky-500">Free Tier Protocol Active</p>
         <p className="text-[12px] font-black leading-tight">Optimized for Gemini 3 Flash neural reasoning paths.</p>
      </div>

      <button 
        onClick={onEnter} 
        className="splash-btn splash-btn-anim shrink-0"
        title="Initialize mastery engine workspace"
      >
        Initiate Nexus
      </button>

      <div className="mt-6 shrink-0 opacity-40">
         <p className="text-[8px] font-black uppercase tracking-[0.4em] text-[var(--text-primary)]">Master Operator Registry V3.0</p>
      </div>
    </div>
  );
}
