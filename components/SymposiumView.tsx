
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { SymposiumResponse } from '../types';
import LogicVisualizer from './LogicVisualizer';

interface SymposiumViewProps {
  data: SymposiumResponse[];
}

const SymposiumView: React.FC<SymposiumViewProps> = ({ data }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4 mt-2 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center gap-2 px-2">
        <div className="h-px flex-1 bg-black/10"></div>
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-sky-500">Neural Symposium Active</span>
        <div className="h-px flex-1 bg-black/10"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.map((res, idx) => (
          <div 
            key={idx} 
            className={`border-2 border-black rounded-xl overflow-hidden transition-all duration-300 bg-white ${expandedId === res.personaId ? 'ring-4 ring-sky-500/20 scale-[1.02] z-10' : 'scale-100'}`}
          >
            <div className="p-3 border-b-2 border-black bg-slate-50 flex justify-between items-center">
              <span className="text-[10px] font-black uppercase truncate max-w-[120px]">{res.persona}</span>
              <button 
                onClick={() => setExpandedId(expandedId === res.personaId ? null : res.personaId)}
                className="w-5 h-5 flex items-center justify-center border border-black rounded bg-white text-[10px] hover:bg-black hover:text-white"
              >
                {expandedId === res.personaId ? '−' : '+'}
              </button>
            </div>
            <div className="p-4 prose prose-slate max-w-none text-[12px] leading-relaxed">
              <ReactMarkdown>{res.content}</ReactMarkdown>
            </div>
            
            {expandedId === res.personaId && (
              <div className="animate-in slide-in-from-top-2">
                <LogicVisualizer breakdown={res.dnaBreakdown} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SymposiumView;
