"use client";
import React, { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import Link from 'next/link';

export default function AdminSyncPage() {
  const [isSyncing, setIsSyncing] = useState(false);
  const syncRef = React.useRef(false); // Ref to track status reliably inside loop
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [lastError, setLastError] = useState<string | null>(null);
  const [adminSecret, setAdminSecret] = useState('');
  const [config, setConfig] = useState({
    startPage: 1,
    endPage: 5,
    type: 'series',
    deepSync: false,
    autoPagination: false
  });

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 50)]);
  };

  const runSync = async () => {
    const adminUid = auth.currentUser?.uid;
    if (!adminUid) {
      alert('You must be logged in as an admin. Refresh page if you just logged in.');
      return;
    }

    if (syncRef.current) return;
    
    syncRef.current = true;
    setIsSyncing(true);
    setLogs([]);
    setLastError(null);
    setProgress({ current: 0, total: 0 });

    const typesToSync = config.type === 'all' ? ['series', 'movies', 'cartoon'] : [config.type];
    
    try {
      for (const currentType of typesToSync) {
        if (!syncRef.current) break;
        
        const modeText = config.autoPagination ? 'until last page' : `pages ${config.startPage}-${config.endPage}`;
        addLog(`📂 STARTING SYNC: ${currentType.toUpperCase()} (${modeText})`);

        // Logic: If autoPagination is on, use a very large end number and break when items.length === 0
        const start = config.startPage;
        const end = config.autoPagination ? 10000 : config.endPage;

        for (let p = start; p <= end; p++) {
          if (!syncRef.current) break;
          
          addLog(`📂 [${currentType}] Fetching discovery page ${p}...`);
          
          try {
            const discResp = await fetch('/api/admin/bulk-sync', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'x-admin-uid': adminUid,
                'Authorization': `Bearer ${adminSecret}`
              },
              body: JSON.stringify({ action: 'discover', page: p, type: currentType })
            });

            if (!discResp.ok) {
               const text = await discResp.text();
               throw new Error(`Discovery failed (${discResp.status}): ${text.slice(0, 50)}`);
            }

            const discData = await discResp.json();
            const items = discData.items || [];
            
            if (items.length === 0) {
               addLog(`🏁 Reached the end of ${currentType} content (Page ${p}).`);
               break; 
            }

            addLog(`✅ Discovered ${items.length} items on page ${p}`);
            setProgress(prev => ({ ...prev, total: prev.total + items.length }));

            for (const item of items) {
              if (!syncRef.current) break;

              addLog(`📥 Syncing ${currentType}: ${item.title}...`);
              
              try {
                const impResp = await fetch('/api/admin/bulk-sync', {
                  method: 'POST',
                  headers: { 
                    'Content-Type': 'application/json',
                    'x-admin-uid': adminUid,
                    'x-deep-sync': config.deepSync ? 'true' : 'false',
                    'Authorization': `Bearer ${adminSecret}`
                  },
                  body: JSON.stringify({ action: 'import', slugs: [item], type: currentType })
                });

                if (!impResp.ok) {
                  const text = await impResp.text();
                  throw new Error(`API Error ${impResp.status}: ${text.slice(0, 30)}`);
                }

                const impData = await impResp.json();
                if (impData.error) throw new Error(impData.error);
                
                const result = impData.results?.[0];
                if (result?.status === 'error') {
                   addLog(`⚠️ Skip: ${item.title} - ${result.error}`);
                } else {
                   addLog(`✅ Saved: ${item.title}`);
                }
              } catch (itemErr: any) {
                addLog(`❌ Failed: ${item.title} - ${itemErr.message}`);
                console.error('Item sync error:', itemErr);
              }
              
              setProgress(prev => ({ ...prev, current: prev.current + 1 }));
              // Yield for UI updates
              await new Promise(r => setTimeout(r, 50));
            }
          } catch (pageErr: any) {
            addLog(`🚨 Critical Error on ${currentType} Page ${p}: ${pageErr.message}`);
            // Don't throw here, just move to next type
            break;
          }
        }
      }
      addLog(`✨ ALL SYNC JOBS COMPLETED`);
    } catch (err: any) {
      setLastError(err.message);
      addLog(`🛑 JOB TERMINATED: ${err.message}`);
    } finally {
      syncRef.current = false;
      setIsSyncing(false);
      addLog(`🏁 Done.`);
    }
  };

  const stopSync = () => {
    syncRef.current = false;
    setIsSyncing(false);
    addLog(`⛔ Stopping process...`);
  };

  const clearDatabase = async () => {
    const adminUid = auth.currentUser?.uid;
    if (!adminUid) return;

    if (!confirm('🚨 ARE YOU SURE? This will permanently delete all cached anime metadata and players from the database. This action cannot be undone.')) {
      return;
    }

    setIsSyncing(true);
    addLog(`🧹 Initiating database wipe...`);
    try {
      const resp = await fetch('/api/admin/bulk-sync', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-uid': adminUid,
          'Authorization': `Bearer ${adminSecret}`
        },
        body: JSON.stringify({ action: 'clear' })
      });

      if (!resp.ok) throw new Error(`Clear failed: ${resp.status}`);
      addLog(`✨ DATABASE CLEANED SUCCESSFULLY`);
      setProgress({ current: 0, total: 0 });
    } catch (err: any) {
      addLog(`❌ FAILED TO CLEAR: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="max-w-6xl space-y-10 pb-20">
      <header className="flex items-center gap-6">
         <Link href="/admin/content" className="w-12 h-12 bg-bg-surface border border-border-subtle rounded-2xl flex items-center justify-center hover:bg-accent/10 transition-all hover:scale-105 shadow-lg group">
            <svg className="w-5 h-5 text-content-tertiary group-hover:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
         </Link>
         <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight">Bulk Site Importer</h1>
            <p className="text-content-tertiary">Automated database population with deep player caching.</p>
         </div>
      </header>

       {/* PRESET BUTTONS */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <button 
            onClick={() => setConfig({ startPage: 1, endPage: 10, type: 'all', deepSync: false, autoPagination: false })}
            className="p-6 bg-bg-surface border border-border-subtle rounded-[2rem] hover:border-accent/40 transition-all text-left space-y-2 group"
          >
             <p className="font-black text-[10px] text-accent uppercase tracking-wider">Preset 1</p>
             <p className="font-bold text-sm">⚡ Quick Discover</p>
             <p className="text-[10px] text-content-tertiary">Sync first 10 pages of all categories (Metadata only).</p>
          </button>
          
          <button 
            onClick={() => setConfig({ ...config, type: 'all', autoPagination: true, deepSync: false })}
            className="p-6 bg-bg-surface border border-border-subtle rounded-[2rem] hover:border-accent/40 transition-all text-left space-y-2 group"
          >
             <p className="font-black text-[10px] text-cyan-400 uppercase tracking-wider">Preset 2</p>
             <p className="font-bold text-sm">📚 The Whole Library</p>
             <p className="text-[10px] text-content-tertiary">Discover every single item on the site (Metadata only).</p>
          </button>

          <button 
            onClick={() => setConfig({ ...config, type: 'all', autoPagination: true, deepSync: true })}
            className="p-6 bg-bg-surface border border-border-subtle rounded-[2rem] hover:border-accent/40 transition-all text-left space-y-2 group"
          >
             <p className="font-black text-[10px] text-red-500 uppercase tracking-wider">Preset 3</p>
             <p className="font-bold text-sm">🧬 Deep Archive</p>
             <p className="text-[10px] text-content-tertiary">Metadata + Scrape every episode for players. (STALKER MODE)</p>
          </button>
       </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-12 lg:col-span-5 space-y-8">
           {/* SECURITY KEY */}
           <div className="bg-bg-surface border border-border-subtle rounded-[2.5rem] p-8 shadow-xl shadow-black/40 space-y-4">
              <div className="flex items-center justify-between">
                 <p className="text-[10px] font-black text-content-tertiary uppercase tracking-widest">Administrative Access</p>
                 <span className={`w-3 h-3 rounded-full ${adminSecret ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`} />
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-bold text-content-primary">Admin Secret Key</label>
                 <input 
                    type="password" 
                    placeholder="Enter your CRON_SECRET..."
                    value={adminSecret}
                    onChange={e => setAdminSecret(e.target.value)}
                    className="w-full px-5 py-4 bg-bg-elevated border border-border-subtle rounded-2xl font-mono focus:outline-none focus:border-accent text-sm"
                 />
                 <p className="text-[10px] text-content-tertiary italic">Required for bulk operations and database wipes.</p>
              </div>
           </div>

           <div className="bg-bg-surface border border-border-subtle rounded-[2.5rem] p-8 shadow-xl shadow-black/40 space-y-8">
              <div className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                       <span className="text-[10px] font-black text-content-tertiary uppercase tracking-widest block mb-3">Sync From Page</span>
                       <input 
                          type="number" 
                          value={config.startPage}
                          onChange={e => setConfig({...config, startPage: Number(e.target.value)})}
                          className="w-full px-5 py-4 bg-bg-elevated border border-border-subtle rounded-2xl font-bold focus:outline-none focus:border-accent text-sm"
                       />
                    </label>
                    <label className="block">
                       <span className="text-[10px] font-black text-content-tertiary uppercase tracking-widest block mb-3">Sync To Page</span>
                       <input 
                          type="number" 
                          value={config.endPage}
                          onChange={e => setConfig({...config, endPage: Number(e.target.value)})}
                          className="w-full px-5 py-4 bg-bg-elevated border border-border-subtle rounded-2xl font-bold focus:outline-none focus:border-accent text-sm"
                       />
                    </label>
                 </div>

                 <label className="block">
                    <span className="text-[10px] font-black text-content-tertiary uppercase tracking-widest block mb-3">Target Content Type</span>
                    <div className="relative">
                       <select 
                          value={config.type}
                          onChange={e => setConfig({...config, type: e.target.value})}
                          className="w-full px-5 py-4 bg-bg-elevated border border-border-subtle rounded-2xl font-bold focus:outline-none focus:border-accent appearance-none text-sm"
                       >
                          <option value="series">Anime Series Only</option>
                          <option value="movies">Movies Only</option>
                          <option value="cartoon">Donghua / Cartoon Only</option>
                          <option value="all">🚀 All Content (Global Site Sync)</option>
                       </select>
                       <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-content-tertiary">▼</div>
                    </div>
                 </label>

                 <div 
                    onClick={() => setConfig({...config, autoPagination: !config.autoPagination})}
                    className={`p-7 rounded-[2rem] border transition-all cursor-pointer group ${config.autoPagination ? 'bg-accent/10 border-accent shadow-lg shadow-accent/10' : 'bg-bg-elevated/50 border-border-subtle hover:border-accent/40'}`}
                 >
                    <div className="flex items-start justify-between gap-6">
                       <div className="space-y-2">
                          <p className={`font-black uppercase text-xs tracking-wider transition-colors ${config.autoPagination ? 'text-accent' : 'text-content-primary'}`}>Sync Until Last Page</p>
                          <p className="text-[10px] text-content-tertiary font-medium leading-relaxed">
                             Automatically follows pagination until the very end of the site. **Perfect for full site imports.**
                          </p>
                       </div>
                       <div className={`mt-1 w-14 h-7 rounded-full relative transition-all shadow-inner ${config.autoPagination ? 'bg-accent' : 'bg-bg-surface border-2 border-border-subtle'}`}>
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-md ${config.autoPagination ? 'left-8' : 'left-1'}`} />
                       </div>
                    </div>
                 </div>

                 <div 
                    onClick={() => setConfig({...config, deepSync: !config.deepSync})}
                    className={`p-7 rounded-[2rem] border transition-all cursor-pointer group ${config.deepSync ? 'bg-accent/10 border-accent shadow-lg shadow-accent/10' : 'bg-bg-elevated/50 border-border-subtle hover:border-accent/40'}`}
                 >
                    <div className="flex items-start justify-between gap-6">
                       <div className="space-y-2">
                          <p className={`font-black uppercase text-xs tracking-wider transition-colors ${config.deepSync ? 'text-accent' : 'text-content-primary'}`}>Deep Sync Players</p>
                          <p className="text-[10px] text-content-tertiary font-medium leading-relaxed">
                             Scrapes every single episode page to cache video sources. **Enables instant lag-free streaming.** (Caution: Slower sync time)
                          </p>
                       </div>
                       <div className={`mt-1 w-14 h-7 rounded-full relative transition-all shadow-inner ${config.deepSync ? 'bg-accent' : 'bg-bg-surface border-2 border-border-subtle'}`}>
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-md ${config.deepSync ? 'left-8' : 'left-1'}`} />
                       </div>
                    </div>
                 </div>
              </div>

              <div className="space-y-4">
                 <button 
                  onClick={runSync}
                  disabled={isSyncing}
                  className="w-full h-20 bg-accent text-bg-base font-black uppercase tracking-[0.3em] text-sm rounded-[2rem] hover:scale-[1.03] active:scale-95 transition-all disabled:opacity-50 shadow-2xl shadow-accent/40 group relative overflow-hidden"
                 >
                    <div className="relative z-10 flex items-center justify-center gap-4">
                       {isSyncing ? (
                          <div className="w-5 h-5 border-4 border-bg-base/20 border-t-bg-base rounded-full animate-spin" />
                       ) : (
                          <span className="flex items-center gap-3">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                             </svg>
                             Start Global Import
                          </span>
                       )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                 </button>
                 
                 {isSyncing && (
                    <button 
                       onClick={stopSync}
                       className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                       Stop Sync Process
                    </button>
                 )}
              </div>
           </div>
 
           {/* DATABASE TOOLS */}
           <div className="bg-bg-surface border border-border-subtle rounded-[2.5rem] p-8 shadow-xl shadow-black/40 space-y-6 mt-8">
              <div className="flex items-center gap-3">
                 <span className="text-xl">🛠️</span>
                 <p className="text-[10px] font-black text-content-tertiary uppercase tracking-widest">Database Tools</p>
              </div>
              <p className="text-[10px] text-content-tertiary leading-relaxed font-medium text-left">
                 Use these tools to manage the user database and test global features like the leaderboard.
              </p>
              <button 
                onClick={async () => {
                  if (!confirm('This will create 10 system bots for the leaderboard. Proceed?')) return;
                  try {
                    const { userDataService } = await import('@/lib/userDataService');
                    await userDataService.seedLeaderboard();
                    alert('Leaderboard seeded successfully!');
                  } catch (err) {
                    console.error('Seeding failed:', err);
                    alert('Seeding failed. Check console.');
                  }
                }}
                disabled={isSyncing}
                className="w-full py-5 bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 font-black uppercase tracking-[0.2em] text-[10px] rounded-[1.5rem] hover:bg-yellow-400 hover:text-black transition-all disabled:opacity-30 active:scale-95 flex items-center justify-center gap-3"
              >
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
                 </svg>
                 Seed Global Leaderboard
              </button>
           </div>

           {/* DANGER ZONE */}
           <div className="bg-red-500/5 border border-red-500/20 rounded-[2.5rem] p-8 space-y-6 shadow-xl shadow-red-500/5 mt-8">
              <div className="flex items-center gap-3">
                 <span className="text-xl">⚠️</span>
                 <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">Danger Zone</p>
              </div>
              <p className="text-[10px] text-content-tertiary leading-relaxed font-medium">
                 Resetting the database will remove all cached metadata, episode lists, and player sources. Use this if you want to perform a completely fresh site-wide synchronization.
              </p>
              <button 
                onClick={clearDatabase}
                disabled={isSyncing}
                className="w-full py-5 bg-red-500/10 text-red-500 border border-red-500/20 font-black uppercase tracking-[0.2em] text-[10px] rounded-[1.5rem] hover:bg-red-500 hover:text-white transition-all disabled:opacity-30 active:scale-95"
              >
                 Wipe All Cached Content
              </button>
           </div>
        </div>

        <div className="md:col-span-12 lg:col-span-7 space-y-8">
           {(isSyncing || progress.total > 0) && (
             <div className="bg-bg-surface border border-border-subtle rounded-[2.5rem] p-8 shadow-xl shadow-black/20 space-y-6">
                <div className="flex justify-between items-end">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-content-tertiary uppercase tracking-widest">Global Catalog Progress</p>
                      <p className="text-3xl font-black tabular-nums tracking-tight">
                        {progress.current} <span className="text-content-tertiary text-xl font-medium">/ {progress.total}</span>
                      </p>
                   </div>
                   <div className="flex flex-col items-end gap-2">
                      <p className="text-xs font-bold text-accent animate-pulse">
                        {isSyncing ? 'Syncing...' : 'Completed'}
                      </p>
                      <p className="text-[10px] font-mono text-content-tertiary">
                         {Math.round((progress.current / (progress.total || 1)) * 100)}%
                      </p>
                   </div>
                </div>
                <div className="h-4 bg-bg-elevated rounded-full overflow-hidden p-1 border border-border-subtle">
                   <div 
                      className="h-full bg-accent rounded-full transition-all duration-700 shadow-[0_0_20px_rgba(255,51,102,0.5)] relative overflow-hidden" 
                      style={{ width: `${(progress.current / (progress.total || 1)) * 100}%` }}
                   >
                       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                   </div>
                </div>
             </div>
           )}

           <div className="bg-bg-surface border border-border-subtle rounded-[2.5rem] flex flex-col h-[650px] shadow-2xl shadow-black/40 overflow-hidden">
              <div className="px-8 py-6 border-b border-border-subtle bg-bg-elevated/30 flex justify-between items-center">
                 <p className="text-[10px] font-black text-content-tertiary uppercase tracking-widest">Activity Monitor</p>
                 <button onClick={() => setLogs([])} className="text-[10px] font-bold text-content-tertiary hover:text-red-500 transition-colors">Clear Logs</button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 font-mono text-[11px] leading-relaxed custom-scrollbar p-8">
                 {logs.map((log, i) => (
                    <div key={i} className={`p-4 rounded-2xl border animate-in fade-in slide-in-from-left-4 duration-300 ${log.includes('❌') ? 'bg-red-500/10 border-red-500/20 text-red-400' : log.includes('✅') ? 'bg-green-500/5 border-green-500/20 text-green-400' : 'bg-bg-elevated/50 border-border-subtle/50 text-content-secondary'}`}>
                       {log}
                    </div>
                 ))}
                 {logs.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-20 grayscale">
                       <div className="w-20 h-20 bg-bg-elevated rounded-full flex items-center justify-center text-4xl">
                         📡
                       </div>
                       <p className="text-xs font-bold uppercase tracking-[0.2em]">Crawl sequence not initiated</p>
                    </div>
                 )}
              </div>
           </div>
        </div>
      </div>

      <style jsx>{`
         @keyframes shimmer {
            100% { transform: translateX(100%); }
         }
         .custom-scrollbar::-webkit-scrollbar {
           width: 4px;
         }
         .custom-scrollbar::-webkit-scrollbar-track {
           background: transparent;
         }
         .custom-scrollbar::-webkit-scrollbar-thumb {
           background: rgba(255, 51, 102, 0.2);
           border-radius: 10px;
         }
         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
           background: rgba(255, 51, 102, 0.4);
         }
      `}</style>
    </div>
  );
}
