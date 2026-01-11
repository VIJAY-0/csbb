
import React, { useState, useMemo } from 'react';
import { 
  Github, 
  Server, 
  Terminal, 
  Layout, 
  Play, 
  Pause, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp,
  Cpu,
  Database,
  Globe,
  CheckCircle2,
  XCircle,
  Shield,
  Network
} from 'lucide-react';
import { SandboxStatus, SandboxPayload, Step } from './types';

// Helper: Generate a unique ID similar to the backend format
const generateTaskId = () => Math.random().toString(16).slice(2, 26);

export default function App() {
  const [step, setStep] = useState<Step>(Step.GITHUB_SETUP);
  const [status, setStatus] = useState<SandboxStatus>('DISCONNECTED');
  
  // Form State
  const [githubUrl, setGithubUrl] = useState('');
  const [serverUrl, setServerUrl] = useState('');
  const [taskId, setTaskId] = useState('');
  const [networkGroup, setNetworkGroup] = useState('');
  const [isolated, setIsolated] = useState(true);
  const [cpu, setCpu] = useState(1);
  const [memory, setMemory] = useState(1024);
  
  const [isJsonOpen, setIsJsonOpen] = useState(false);

  const handleCreateClone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubUrl.trim()) return;
    
    setTaskId(generateTaskId());
    setStep(Step.SERVER_CONFIG);
    setStatus('INITIALIZING');
  };

  const handleConnectServer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serverUrl.trim()) return;
    setStatus('CONNECTED');
    setStep(Step.ORCHESTRATOR);
  };

  const currentPayload: SandboxPayload = {
    task_id: taskId || 'pending',
    cpu: cpu,
    memory: memory,
    network_group: networkGroup,
    isolated: isolated,
    github_url: githubUrl,
    server_url: serverUrl || undefined
  };

  const reset = () => {
    setStep(Step.GITHUB_SETUP);
    setStatus('DISCONNECTED');
    setGithubUrl('');
    setServerUrl('');
    setTaskId('');
    setNetworkGroup('');
    setIsolated(true);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-slate-900/50 border-b border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
            <Layout className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white uppercase">Sandbox Orchestrator</h1>
            <p className="text-[10px] text-slate-500 font-mono tracking-widest leading-none">REDIS PUB/SUB CONTROL PANEL</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
            <div className={`w-2 h-2 rounded-full ${
              status === 'CONNECTED' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
              status === 'INITIALIZING' ? 'bg-amber-500 animate-pulse' : 'bg-slate-600'
            }`} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {status}
            </span>
          </div>
          {step !== Step.GITHUB_SETUP && (
            <button 
              onClick={reset}
              className="px-3 py-1.5 rounded-md border border-slate-800 text-[10px] font-bold uppercase text-slate-500 hover:text-white hover:bg-slate-900 transition-all"
            >
              Restart Session
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-hidden p-6 relative flex flex-col gap-6">
        <div className="max-w-6xl mx-auto w-full h-full flex flex-col">
          
          {/* STEP 1: GITHUB SETUP */}
          {step === Step.GITHUB_SETUP && (
            <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-full max-w-2xl bg-slate-900/40 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <Github className="w-32 h-32" />
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Environment Configuration</h2>
                  <p className="text-slate-400 text-sm">Define your isolated sandbox instance parameters to be published to the worker.</p>
                </div>
                
                <form onSubmit={handleCreateClone} className="space-y-6">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">GitHub Repository</label>
                    <div className="relative group">
                      <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                      <input 
                        required
                        type="url"
                        placeholder="https://github.com/VIJAY-0/Mysql-Containers-Orchestration"
                        className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-slate-100 placeholder:text-slate-700"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Network Group</label>
                      <div className="relative group">
                        <Network className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-indigo-400" />
                        <input 
                          type="text"
                          placeholder="default_vpc"
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500/50 text-slate-200 text-sm"
                          value={networkGroup}
                          onChange={(e) => setNetworkGroup(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Security Isolation</label>
                      <button 
                        type="button"
                        onClick={() => setIsolated(!isolated)}
                        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border transition-all ${
                          isolated ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' : 'bg-slate-950/50 border-slate-800 text-slate-500'
                        }`}
                      >
                        <span className="text-sm font-medium">{isolated ? 'Isolated' : 'Public'}</span>
                        <Shield className={`w-4 h-4 ${isolated ? 'opacity-100' : 'opacity-30'}`} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-slate-500">
                          <Cpu className="w-4 h-4" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">vCPU Allocation</span>
                        </div>
                        <span className="text-xs font-mono text-indigo-400">{cpu} Core</span>
                      </div>
                      <input 
                        type="range" min="1" max="8" step="1" 
                        value={cpu} onChange={(e) => setCpu(Number(e.target.value))}
                        className="w-full accent-indigo-500"
                      />
                    </div>
                    <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-slate-500">
                          <Database className="w-4 h-4" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">RAM Allocation</span>
                        </div>
                        <span className="text-xs font-mono text-indigo-400">{memory} MB</span>
                      </div>
                      <input 
                        type="range" min="512" max="8192" step="512" 
                        value={memory} onChange={(e) => setMemory(Number(e.target.value))}
                        className="w-full accent-indigo-500"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full flex items-center justify-center gap-3 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.2)] active:scale-[0.98]"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    PROVISION & CLONE
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* STEP 2: SERVER CONFIG */}
          {step === Step.SERVER_CONFIG && (
            <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-full max-w-lg bg-slate-900/40 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm shadow-2xl relative">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-bold border border-amber-500/20 rounded-full animate-pulse">
                      WAITING FOR WORKER
                    </div>
                    <span className="text-[10px] font-mono text-slate-600">ID: {taskId}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Connect to Session</h2>
                  <p className="text-slate-400 text-sm">The environment is being cloned. Provide the VS Code server endpoint provided by the orchestrator.</p>
                </div>
                
                <form onSubmit={handleConnectServer} className="space-y-6">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">VS Code Server URL</label>
                    <div className="relative group">
                      <Server className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-emerald-400 transition-colors" />
                      <input 
                        required
                        type="url"
                        placeholder="http://172.16.0.45:8080"
                        className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-slate-100 placeholder:text-slate-700"
                        value={serverUrl}
                        onChange={(e) => setServerUrl(e.target.value)}
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] active:scale-[0.98]"
                  >
                    <Globe className="w-5 h-5" />
                    ATTACH STREAM
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* STEP 3: ORCHESTRATOR DASHBOARD */}
          {step === Step.ORCHESTRATOR && (
            <div className="flex-1 flex flex-col gap-4 animate-in fade-in duration-700">
              {/* Control Bar */}
              <div className="flex items-center justify-between p-3 px-4 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 pr-4 border-r border-slate-800">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                      <Github className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white truncate max-w-[180px] leading-tight">
                        {githubUrl.split('/').pop()}
                      </span>
                      <span className="text-[9px] font-mono text-slate-500">{taskId}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-all text-[11px] font-bold uppercase tracking-wider shadow-lg shadow-indigo-500/20 group">
                      <Play className="w-3.5 h-3.5 fill-current" />
                      CLONE
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all text-[11px] font-bold uppercase tracking-wider border border-slate-700">
                      <Pause className="w-3.5 h-3.5" />
                      PAUSE
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all text-[11px] font-bold uppercase tracking-wider border border-slate-700">
                      <RefreshCw className="w-3.5 h-3.5" />
                      RESTART
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-[10px] font-mono text-slate-500">
                  <div className="flex flex-col items-end">
                    <span className="text-slate-600 text-[8px] uppercase tracking-widest">Environment</span>
                    <span className="text-emerald-500">{isolated ? 'ISOLATED' : 'SHARED'}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-slate-600 text-[8px] uppercase tracking-widest">Resources</span>
                    <span className="text-indigo-400">{cpu}vC | {memory}MB</span>
                  </div>
                </div>
              </div>

              {/* VSCode Stream Container */}
              <div className="flex-1 relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl group flex flex-col">
                <div className="h-8 bg-slate-950 border-b border-slate-800 flex items-center px-4 justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                    </div>
                    <span className="ml-4 text-[10px] font-mono text-slate-500">{serverUrl}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-500 tracking-widest uppercase">Streaming Live</span>
                  </div>
                </div>
                
                <div className="flex-1 relative">
                  <iframe 
                    src={serverUrl} 
                    className="absolute inset-0 w-full h-full border-none bg-slate-900"
                    title="VS Code Stream"
                    onError={() => setStatus('ERROR')}
                  />
                  
                  {status === 'ERROR' && (
                    <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-8 text-center backdrop-blur-sm">
                      <XCircle className="w-12 h-12 text-rose-500 mb-4" />
                      <h3 className="text-lg font-bold text-white mb-2">Endpoint Unreachable</h3>
                      <p className="text-slate-400 text-sm max-w-sm font-mono">CODE: ERR_CONNECTION_REFUSED<br/>TARGET: {serverUrl}</p>
                      <button onClick={reset} className="mt-6 text-xs text-indigo-400 underline underline-offset-4 font-bold">RECONFIGURE NETWORK</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* JSON PREVIEW SECTION */}
          <div className="mt-4">
            <button 
              onClick={() => setIsJsonOpen(!isJsonOpen)}
              className="w-full flex items-center justify-between p-3 bg-slate-900/40 border border-slate-800 rounded-xl hover:bg-slate-900/60 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-slate-800 rounded-md group-hover:bg-indigo-500/20 transition-colors">
                  <Terminal className="w-4 h-4 text-indigo-400" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Redis Published Payload</span>
              </div>
              <div className="flex items-center gap-2">
                 <span className="text-[9px] font-mono text-slate-600 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">channel: worker:codesb:start</span>
                 {isJsonOpen ? <ChevronUp className="w-4 h-4 text-slate-600" /> : <ChevronDown className="w-4 h-4 text-slate-600" />}
              </div>
            </button>
            
            {isJsonOpen && (
              <div className="mt-2 p-5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] overflow-x-auto animate-in slide-in-from-top-2 duration-200 shadow-inner">
                <div className="flex justify-between items-center mb-4 border-b border-slate-900 pb-2">
                   <span className="text-slate-600">application/json</span>
                   <span className="text-[10px] text-indigo-500/50">READY FOR PUBLISH</span>
                </div>
                <pre className="text-indigo-400/90 leading-relaxed">
                  {JSON.stringify(currentPayload, null, 2)}
                </pre>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Footer Branding */}
      <footer className="px-6 py-3 flex items-center justify-between border-t border-slate-900 bg-slate-950/80 backdrop-blur-md">
        <div className="flex items-center gap-4 text-[9px] text-slate-600 uppercase tracking-[0.2em] font-bold">
          <span className="hover:text-slate-400 transition-colors cursor-default">System v3.4.1</span>
          <div className="w-1 h-1 bg-slate-800 rounded-full" />
          <span className="hover:text-slate-400 transition-colors cursor-default">Cloud Orchestrator</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 px-2 py-1 rounded border border-slate-900 bg-slate-950 text-[9px] font-bold text-slate-500">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            WORKER_POOL: ACTIVE
          </span>
        </div>
      </footer>
    </div>
  );
}
