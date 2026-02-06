import React, { useState, useEffect } from 'react';
import { View, LearningPhase, UserProgress } from './types';
import { HomeView } from './views/HomeView';
import { LibraryView } from './views/LibraryView';
import { JourneyView } from './views/JourneyView';
import { EngineView } from './views/EngineView';
import { ChatView } from './views/ChatView';
import { LabView } from './views/LabView';
import { ProfileView } from './views/ProfileView';
import { fetchUserProgress } from './services/supabaseService';
import { 
  Menu,
  ChevronLeft,
  Activity, 
  Database, 
  Settings, 
  Terminal, 
  Cpu, 
  User, 
  LayoutGrid, 
  Loader2,
  ChevronRight,
  Wifi,
  CloudLightning
} from 'lucide-react';

const DEFAULT_PROGRESS: UserProgress = {
  level: 1,
  phase: LearningPhase.SPARK,
  points: 120,
  streak: 1,
  completedLessons: [],
  skills: { logic: 42, clarity: 35, efficiency: 28, control: 15 }
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  const userId = localStorage.getItem('textscribe_user_id') || `ARCH_${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

  useEffect(() => {
    localStorage.setItem('textscribe_user_id', userId);
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    
    const handleResize = () => {
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const loadState = async () => {
      try {
        const cloudData = await fetchUserProgress(userId);
        if (cloudData) setProgress({ ...cloudData, userId });
      } catch (err) {
        console.error("Kernel Sync Error", err);
      } finally {
        setTimeout(() => setLoading(false), 1200); // Simulate kernel mount
      }
    };
    loadState();
  }, [userId]);

  const navItems = [
    { id: View.HOME, label: 'SYS.STATUS', icon: Activity },
    { id: View.VAULT, label: 'DIRECTORY', icon: Database },
    { id: View.JOURNEY, label: 'ROADMAP', icon: LayoutGrid },
    { id: View.CHAT, label: 'MENTOR.EXE', icon: Terminal },
    { id: View.LAB, label: 'LOGIC.LAB', icon: Cpu },
    { id: View.PROFILE, label: 'CITIZEN.ID', icon: User },
    { id: View.ENGINE, label: 'CONFIG.SYS', icon: Settings },
  ];

  if (loading) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center font-mono gap-6 text-terminal-primary">
        <Loader2 className="animate-spin" size={48} strokeWidth={1} />
        <div className="flex flex-col items-center gap-2">
          <p className="text-[10px] uppercase tracking-[0.5em] animate-pulse">Mounting Neural Kernel v3.0...</p>
          <div className="w-64 h-1 border border-terminal-border p-px">
            <div className="h-full bg-terminal-primary animate-[progress_1.5s_infinite]" />
          </div>
        </div>
        <style>{`@keyframes progress { 0% { width: 0%; } 50% { width: 100%; } 100% { width: 0%; } }`}</style>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col text-terminal-text bg-terminal-bg selection:bg-terminal-primary selection:text-black overflow-hidden">
      
      {/* OS Status Bar */}
      <header className="h-10 border-b border-terminal-border flex justify-between items-center px-4 bg-slate-950 shrink-0 z-[100]">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 hover:text-terminal-primary transition-colors lg:hidden"
          >
            <Menu size={18} />
          </button>
          <div className="hidden sm:flex items-center gap-1.5">
            <div className="dot bg-terminal-error"></div>
            <div className="dot bg-terminal-warning"></div>
            <div className="dot bg-terminal-success"></div>
          </div>
          <div className="h-4 w-px bg-terminal-border mx-1 hidden sm:block"></div>
          <span className="text-[10px] font-black tracking-[0.2em] text-terminal-primary truncate">TEXT-OS // {currentView}.MODULE</span>
        </div>
        
        <div className="flex items-center gap-4 sm:gap-8">
          <div className="hidden md:flex items-center gap-2">
             <Wifi size={12} className="text-terminal-success" />
             <span className="text-[9px] font-bold text-terminal-dim">LINK: STABLE</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-terminal-dim hidden xs:block">CPU_LOAD:</span>
            <div className="w-12 h-2 border border-terminal-border p-px hidden xs:block">
              <div className="h-full bg-terminal-success" style={{width: '24%'}}></div>
            </div>
          </div>
          <span className="text-[10px] font-bold text-terminal-dim font-mono">{currentTime}</span>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Responsive Collapsible Sidebar */}
        <aside 
          className={`
            fixed inset-y-0 left-0 z-50 w-64 border-r border-terminal-border bg-black transition-all duration-300 transform
            lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:w-0 lg:border-none'}
          `}
        >
          <div className="h-full flex flex-col bg-slate-950/80 backdrop-blur-md">
            <div className="p-6 border-b border-terminal-border">
              <p className="text-[9px] font-black text-terminal-dim uppercase tracking-[0.3em] mb-4">Core Directory</p>
              <nav className="space-y-1">
                {navItems.map(item => {
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentView(item.id);
                        if (window.innerWidth < 1024) setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold transition-all border border-transparent ${
                        isActive ? 'bg-terminal-primary text-black border-terminal-primary' : 'text-terminal-dim hover:text-terminal-primary hover:bg-white/5'
                      }`}
                    >
                      <item.icon size={14} strokeWidth={isActive ? 3 : 2} />
                      <span className="tracking-widest">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto no-scrollbar">
              <p className="text-[9px] font-black text-terminal-dim uppercase tracking-[0.3em] mb-4">Resource Monitor</p>
              <div className="space-y-4">
                {[
                  { label: 'Logic_Density', val: progress.skills.logic, color: 'bg-terminal-primary' },
                  { label: 'Control_Fidelity', val: progress.skills.control, color: 'bg-terminal-accent' },
                  { label: 'System_Uptime', val: 98, color: 'bg-terminal-success' }
                ].map(stat => (
                  <div key={stat.label} className="space-y-2">
                    <div className="flex justify-between text-[8px] font-black uppercase text-terminal-dim">
                      <span>{stat.label}</span>
                      <span>{stat.val}%</span>
                    </div>
                    <div className="h-1 bg-terminal-border rounded-full overflow-hidden">
                      <div className={`h-full ${stat.color} transition-all duration-1000`} style={{ width: `${stat.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-terminal-border bg-black/40">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-terminal-primary/10 flex items-center justify-center border border-terminal-primary/20 text-terminal-primary">
                    <CloudLightning size={18} />
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-terminal-dim uppercase">Rank: Architect</p>
                    <p className="text-[11px] font-black text-white">{progress.points} XP</p>
                  </div>
               </div>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && window.innerWidth < 1024 && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" 
            onClick={() => setIsSidebarOpen(false)} 
          />
        )}

        {/* Workspace Engine */}
        <main className="flex-1 overflow-hidden flex flex-col relative bg-black">
          
          {/* Sub-Header / Breadcrumbs */}
          <div className="h-10 border-b border-terminal-border bg-slate-900/30 flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-3">
              <ChevronRight size={14} className="text-terminal-primary animate-pulse" />
              <span className="text-[10px] font-bold text-terminal-dim tracking-widest">TEXT-OS:/ROOT/{currentView.toLowerCase()}</span>
            </div>
            <div className="text-[9px] font-mono text-terminal-dim hidden sm:block">
              AUTH_LEVEL: {progress.level >= 5 ? 'S-TIER' : 'A-TIER'}
            </div>
          </div>

          {/* Core View Rendering */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-8">
            <div className="max-w-5xl mx-auto h-full">
              {currentView === View.HOME && <HomeView progress={progress} onNavigate={(v) => setCurrentView(v)} />}
              {currentView === View.VAULT && <LibraryView />}
              {currentView === View.JOURNEY && <JourneyView progress={progress} onNavigate={(v) => setCurrentView(v)} />}
              {currentView === View.CHAT && <ChatView progress={progress} />}
              {currentView === View.LAB && <LabView progress={progress} />}
              {currentView === View.PROFILE && <ProfileView progress={progress} />}
              {currentView === View.ENGINE && <EngineView progress={progress} onUpdateProgress={(p) => setProgress(prev => ({...prev, ...p}))} />}
            </div>
          </div>

          {/* Unified Terminal Input */}
          <footer className="h-12 border-t border-terminal-border bg-slate-950 flex items-center px-6 gap-4 shrink-0">
             <span className="text-terminal-primary font-black text-sm italic tracking-tighter">TEXT-OS></span>
             <input 
              type="text" 
              placeholder="Inject command sequence... (help for directory)" 
              className="flex-1 bg-transparent border-none outline-none text-[11px] font-mono placeholder:text-terminal-dim/50 text-white"
             />
             <div className="hidden md:flex items-center gap-4 text-[9px] font-bold text-terminal-dim">
                <span className="text-terminal-primary">v3.0.4-LATEST</span>
                <span>SECURE: AES-256</span>
                <button className="hover:text-terminal-success transition-colors">SYNC</button>
             </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default App;