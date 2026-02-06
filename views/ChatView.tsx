import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Globe, Activity, RefreshCw, Terminal, Volume2, MicOff, Waves, Binary, ChevronRight, Share2 } from 'lucide-react';
import { chatMentorStream, connectLiveNeuralLink } from '../services/geminiService';
import { ChatMessage, UserProgress } from '../types';

interface Props {
  progress?: UserProgress;
}

export const ChatView: React.FC<Props> = ({ progress }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Kernel.v3.0 Secure Connection Established. RAG Mentor Protocol Active. Awaiting queries for system synthesis.", timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user' as const, text: userMsg, timestamp: Date.now() }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const history = newMessages
        .filter(m => m.role !== 'system')
        .map(m => ({ role: m.role as 'user' | 'model', parts: [{ text: m.text }] }));
      
      let currentModelResponse = "";
      setMessages(prev => [...prev, { role: 'model', text: "", timestamp: Date.now() }]);

      const stream = chatMentorStream(history, userMsg);
      
      for await (const chunk of await stream) {
        if (chunk.text) {
          currentModelResponse += chunk.text;
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = { ...updated[updated.length - 1], text: currentModelResponse };
            return updated;
          });
        }
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "[ERROR] NEURAL_CORE_TIMEOUT: Re-establishing link...", timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-black border border-terminal-border animate-in fade-in duration-500 overflow-hidden">
      
      {/* Console Header */}
      <div className="h-8 bg-slate-900 border-b border-terminal-border flex justify-between items-center px-4 shrink-0">
         <div className="flex items-center gap-2">
            <Activity size={12} className="text-terminal-success" />
            <span className="text-[9px] font-black uppercase tracking-widest">MENTOR_CONSOLE_LINK_04</span>
         </div>
         <div className="flex gap-4 text-[9px] font-bold text-terminal-dim">
            <span>MEM: 12GB</span>
            <span>LATENCY: 42ms</span>
         </div>
      </div>

      {/* Feed Area */}
      <div className="flex-1 overflow-y-auto p-6 font-mono space-y-6 no-scrollbar" ref={scrollRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className="animate-in fade-in duration-300">
            <div className="flex gap-4">
              <span className={`text-[10px] font-black shrink-0 ${msg.role === 'user' ? 'text-terminal-accent' : 'text-terminal-primary'}`}>
                {msg.role === 'user' ? '[USER]' : '[MDL]'}
              </span>
              <div className={`text-[11px] leading-relaxed ${msg.role === 'user' ? 'text-white' : 'text-terminal-primary/90'}`}>
                <p className="whitespace-pre-wrap">{msg.text || (isLoading && idx === messages.length - 1 ? "..." : "")}</p>
                <p className="text-[8px] text-terminal-dim mt-2 opacity-50 uppercase tracking-widest">
                  {new Date(msg.timestamp || Date.now()).toLocaleTimeString()} // ID: {idx.toString().padStart(4, '0')}
                </p>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-[11px] text-terminal-primary animate-pulse flex items-center gap-2">
            <span>[SYS]</span>
            <span>THINKING<span className="cursor-blink">_</span></span>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="h-16 border-t border-terminal-border bg-slate-950 flex items-center px-4 gap-4 shrink-0">
        <ChevronRight size={14} className="text-terminal-primary" />
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="ENTER_QUERY_COMMAND..."
          className="flex-1 bg-transparent border-none outline-none text-[12px] font-mono text-white placeholder:text-terminal-dim"
          autoFocus
        />
        <button 
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="btn-terminal border-terminal-primary text-terminal-primary flex items-center gap-2"
        >
          {isLoading ? <RefreshCw className="animate-spin" size={12} /> : "EXE"}
        </button>
      </div>

    </div>
  );
};