
import React from 'react';
import { DNABreakdown, GroundingChunk } from '../types';

interface LogicVisualizerProps {
  breakdown?: DNABreakdown;
  sources?: GroundingChunk[];
}

const LogicVisualizer: React.FC<LogicVisualizerProps> = ({ breakdown, sources }) => {
  if (!breakdown && (!sources || sources.length === 0)) return null;

  return (
    <div className="mt-4 border-t-2 border-black bg-slate-50 p-4 space-y-6 animate-in slide-in-from-top-2 duration-300">
      {/* DNA Metrics Section */}
      {breakdown && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
             <span className="text-[10px] font-black uppercase tracking-widest text-sky-600">Linguistic DNA Mapping</span>
             <span className="text-[8px] font-bold text-slate-400">STRUCTURAL SNAP V1.0</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <MetricBar label="Logic Score" value={breakdown.metrics.logicScore} color="bg-black" />
            <MetricBar label="Entropy" value={breakdown.metrics.entropyLevel} color="bg-amber-500" />
            <MetricBar label="Clarity" value={breakdown.metrics.clarityIndex} color="bg-sky-500" />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="p-3 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0_#000]">
               <span className="text-[8px] font-black uppercase text-slate-400 block mb-1">Logic Path</span>
               <p className="text-[10px] font-bold leading-tight">{breakdown.logicPath}</p>
            </div>
            <div className="p-3 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0_#000]">
               <span className="text-[8px] font-black uppercase text-slate-400 block mb-1">Semantic Weight</span>
               <p className="text-[10px] font-bold leading-tight">{breakdown.semanticWeight}</p>
            </div>
          </div>
        </div>
      )}

      {/* Sources / Grounding Section */}
      {sources && sources.length > 0 && (
        <div className="space-y-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Grounding Citations</span>
          <div className="space-y-2">
            {sources.map((source, idx) => (
              <a 
                key={idx} 
                href={source.web?.uri || source.maps?.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2 bg-white border-2 border-black rounded-lg hover:bg-slate-100 transition-colors group"
              >
                <div className="w-6 h-6 bg-slate-100 border border-black rounded flex items-center justify-center text-[10px] shrink-0 group-hover:bg-black group-hover:text-white">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-black truncate">{source.web?.title || source.maps?.title || "Verifiable Source"}</div>
                  <div className="text-[8px] font-bold text-sky-600 truncate">{source.web?.uri || source.maps?.uri}</div>
                </div>
                <span className="text-[12px] opacity-30 group-hover:opacity-100 transition-opacity">↗</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const MetricBar = ({ label, value, color }: { label: string, value: number, color: string }) => {
  const percentage = Math.min(Math.max(value * 100, 5), 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-end">
        <span className="text-[9px] font-black uppercase">{label}</span>
        <span className="text-[9px] font-black">{Math.round(value * 100)}%</span>
      </div>
      <div className="h-3 w-full bg-slate-200 border-2 border-black rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-1000 ease-out`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};

export default LogicVisualizer;
