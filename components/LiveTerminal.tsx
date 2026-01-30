
import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

interface LiveTerminalProps {
  onClose: (transcription?: string) => void;
  systemInstruction?: string;
}

// Manual base64 helpers as per guidelines
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const LiveTerminal: React.FC<LiveTerminalProps> = ({ onClose, systemInstruction }) => {
  const [status, setStatus] = useState<'connecting' | 'active' | 'closed'>('connecting');
  const [userTranscript, setUserTranscript] = useState('');
  const [modelTranscript, setModelTranscript] = useState('');
  const [isPulsing, setIsPulsing] = useState(false);
  
  const audioContextsRef = useRef<{ input: AudioContext; output: AudioContext } | null>(null);
  const sessionRef = useRef<any>(null);
  const transcriptionRef = useRef({ user: '', model: '' });
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  useEffect(() => {
    const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    audioContextsRef.current = { input: inputCtx, output: outputCtx };

    const initLive = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Create a new instance right before connecting to ensure latest API key
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const sessionPromise = ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-12-2025',
          callbacks: {
            onopen: () => {
              setStatus('active');
              const source = inputCtx.createMediaStreamSource(stream);
              const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
              
              scriptProcessor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                const l = inputData.length;
                const int16 = new Int16Array(l);
                for (let i = 0; i < l; i++) {
                  int16[i] = inputData[i] * 32768;
                }
                const base64 = encode(new Uint8Array(int16.buffer));
                sessionPromise.then(session => {
                  session.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } });
                });
              };
              
              source.connect(scriptProcessor);
              scriptProcessor.connect(inputCtx.destination);
            },
            onmessage: async (message: LiveServerMessage) => {
              // Handle Audio Output
              const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
              if (base64Audio) {
                setIsPulsing(true);
                const ctx = outputCtx;
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                const buffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
                const source = ctx.createBufferSource();
                source.buffer = buffer;
                source.connect(ctx.destination);
                source.addEventListener('ended', () => {
                  sourcesRef.current.delete(source);
                  if (sourcesRef.current.size === 0) setIsPulsing(false);
                });
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += buffer.duration;
                sourcesRef.current.add(source);
              }

              // Handle Transcriptions
              if (message.serverContent?.inputTranscription) {
                transcriptionRef.current.user += message.serverContent.inputTranscription.text;
                setUserTranscript(transcriptionRef.current.user);
              }
              if (message.serverContent?.outputTranscription) {
                transcriptionRef.current.model += message.serverContent.outputTranscription.text;
                setModelTranscript(transcriptionRef.current.model);
              }
              if (message.serverContent?.turnComplete) {
                transcriptionRef.current.user += '\n';
                transcriptionRef.current.model += '\n';
              }

              if (message.serverContent?.interrupted) {
                for (const s of sourcesRef.current) s.stop();
                sourcesRef.current.clear();
                nextStartTimeRef.current = 0;
                setIsPulsing(false);
              }
            },
            onerror: (e) => console.error("Live Error", e),
            onclose: () => setStatus('closed')
          },
          config: {
            responseModalities: [Modality.AUDIO],
            inputAudioTranscription: {},
            outputAudioTranscription: {},
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
            systemInstruction: systemInstruction || "You are a Tactical Logical Liaison. Your goal is to listen to the user's messy thoughts and provide immediate, human-like, structured spoken feedback. Be brief, professional, and razor-sharp."
          }
        });

        sessionRef.current = await sessionPromise;
      } catch (err) {
        console.error("Mic Access Failed", err);
        setStatus('closed');
      }
    };

    initLive();

    return () => {
      if (sessionRef.current) sessionRef.current.close();
      if (audioContextsRef.current) {
        audioContextsRef.current.input.close();
        audioContextsRef.current.output.close();
      }
    };
  }, []);

  const handleEnd = () => {
    onClose(transcriptionRef.current.user);
  };

  return (
    <div className="fixed inset-0 z-[3000] bg-white flex flex-col items-center justify-between p-8 text-center animate-in fade-in duration-500">
      <div className="w-full flex justify-between items-center max-w-[400px]">
        <div className="flex flex-col items-start">
           <span className="text-[10px] font-black uppercase tracking-widest text-sky-500">Neural Nexus</span>
           <span className="text-[14px] font-black uppercase italic">Live Terminal</span>
        </div>
        <div className={`px-2 py-0.5 rounded border-2 border-black text-[8px] font-black uppercase ${status === 'active' ? 'bg-emerald-400' : 'bg-slate-200'}`}>
          {status}
        </div>
      </div>

      <div className="relative flex flex-col items-center justify-center flex-1 w-full max-w-[400px]">
         <div className={`w-40 h-40 rounded-full border-4 border-black flex items-center justify-center transition-all duration-300 ${isPulsing ? 'scale-110 shadow-[0_0_50px_rgba(14,165,233,0.3)]' : 'scale-100'}`}>
            <div className={`w-32 h-32 rounded-full border-2 border-black bg-sky-50 flex items-center justify-center overflow-hidden`}>
                <div className={`w-full h-full bg-sky-500 opacity-20 transition-all duration-700 ${isPulsing ? 'animate-pulse' : ''}`} />
            </div>
         </div>
         
         <div className="mt-12 w-full space-y-4 text-left overflow-y-auto max-h-[160px] no-scrollbar">
            {userTranscript && (
              <div className="p-3 bg-slate-50 border-2 border-black rounded-xl animate-in slide-in-from-bottom-2">
                 <span className="text-[7px] font-black text-slate-400 block mb-1">USER LOG</span>
                 <p className="text-[11px] font-bold italic line-clamp-3">{userTranscript}</p>
              </div>
            )}
            {modelTranscript && (
              <div className="p-3 bg-black text-white rounded-xl animate-in slide-in-from-bottom-2">
                 <span className="text-[7px] font-black text-slate-400 block mb-1 uppercase">Synthesis Feed</span>
                 <p className="text-[11px] font-bold">{modelTranscript}</p>
              </div>
            )}
         </div>
      </div>

      <button 
        onClick={handleEnd}
        className="w-full max-w-[260px] py-4 bg-black text-white rounded-2xl font-black uppercase text-[12px] tracking-[0.2em] shadow-[10px_10px_0_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-none transition-all"
      >
        Close Connection
      </button>
    </div>
  );
};

export default LiveTerminal;
