
import React, { useState, useMemo, useEffect } from 'react';
import { Category, ConversionState, AIResponse } from './types';
import { CATEGORIES_CONFIG } from './constants';
import { askGeminiAboutConversion } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<ConversionState>({
    category: Category.LENGTH,
    fromValue: '1',
    fromUnit: 'm',
    toUnit: 'km'
  });

  const [aiQuery, setAiQuery] = useState('');
  const [aiResult, setAiResult] = useState<AIResponse | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  useEffect(() => {
    const config = CATEGORIES_CONFIG[state.category];
    setState(prev => ({
      ...prev,
      fromUnit: config.units[0].value,
      toUnit: config.units[1]?.value || config.units[0].value
    }));
  }, [state.category]);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShowInstallBtn(false);
    setDeferredPrompt(null);
  };

  const forceUpdate = () => {
    alert("최신 버전을 확인하고 앱을 다시 시작합니다! 🌸");
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (let registration of registrations) {
          registration.update();
        }
      });
    }
    window.location.reload();
  };

  const convertedValue = useMemo(() => {
    const val = parseFloat(state.fromValue);
    if (isNaN(val)) return '0';

    if (state.category === Category.TEMPERATURE) {
      const from = state.fromUnit;
      const to = state.toUnit;
      let celsius = val;
      if (from === 'F') celsius = (val - 32) * 5/9;
      if (from === 'K') celsius = val - 273.15;
      let result = celsius;
      if (to === 'F') result = (celsius * 9/5) + 32;
      if (to === 'K') result = celsius + 273.15;
      return result.toLocaleString(undefined, { maximumFractionDigits: 4 });
    }

    const config = CATEGORIES_CONFIG[state.category];
    const fromUnit = config.units.find(u => u.value === state.fromUnit);
    const toUnit = config.units.find(u => u.value === state.toUnit);
    if (!fromUnit || !toUnit || !fromUnit.ratio || !toUnit.ratio) return '0';
    const baseValue = val * fromUnit.ratio;
    const result = baseValue / toUnit.ratio;
    return result.toLocaleString(undefined, { maximumFractionDigits: 6 });
  }, [state]);

  const handleAiAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    setIsAiLoading(true);
    const result = await askGeminiAboutConversion(aiQuery);
    setAiResult(result);
    setIsAiLoading(false);
  };

  return (
    <div className="min-h-screen font-sans text-slate-700 pb-12 relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-pink-50 via-white to-emerald-50 -z-10"></div>

      {showInstallBtn && (
        <div className="bg-white/80 backdrop-blur-md text-pink-600 px-6 py-3 flex items-center justify-between shadow-sm sticky top-0 z-[100] border-b border-pink-100">
          <p className="text-sm font-bold">🌸 홈 화면에 설치하고 바로 사용하세요!</p>
          <button onClick={handleInstallClick} className="bg-pink-500 text-white px-4 py-1.5 rounded-full text-xs font-black shadow-lg">설치</button>
        </div>
      )}

      <header className={`sticky ${showInstallBtn ? 'top-[45px]' : 'top-0'} z-50 backdrop-blur-md bg-white/60 border-b border-pink-50`}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-pink-400 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-pink-100 animate-bounce-slow">
              <i className="fas fa-seedling text-lg"></i>
            </div>
            <h1 className="text-xl font-black tracking-tight text-pink-600">OmniUnit <span className="text-emerald-500">AI</span></h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden xs:flex bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest items-center">
              Spring v5
            </div>
            <button 
              onClick={forceUpdate}
              className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500 text-white shadow-lg shadow-pink-200 active:scale-90 transition-all"
            >
              <i className="fas fa-sync-alt text-xs"></i>
              <span className="text-[10px] font-bold">최신 업데이트</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-6">
        <section className="mb-8">
          <div className="flex gap-4 overflow-x-auto no-scrollbar py-2 px-2 snap-x">
            {(Object.keys(CATEGORIES_CONFIG) as Category[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setState(prev => ({ ...prev, category: cat }))}
                className={`snap-center flex flex-col items-center justify-center gap-1 min-w-[90px] p-4 rounded-[2rem] transition-all duration-300 ${
                  state.category === cat 
                  ? 'bg-white shadow-xl shadow-pink-100/50 scale-105 border-2 border-pink-200' 
                  : 'bg-white/40 hover:bg-white/60 text-slate-400 border border-transparent'
                }`}
              >
                <div className="h-10 flex items-center justify-center">
                  {CATEGORIES_CONFIG[cat].icon}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-tighter mt-1 ${state.category === cat ? 'text-pink-600' : 'text-slate-400'}`}>{cat}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-10 shadow-2xl shadow-pink-100/30 border border-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-100/40 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex flex-col gap-8">
              <div className="space-y-2">
                <div className="flex items-center justify-between px-2">
                  <label className="text-[10px] font-black text-pink-400 uppercase tracking-widest">입력값</label>
                  <button onClick={() => setState(prev => ({ ...prev, fromUnit: prev.toUnit, toUnit: prev.fromUnit }))} className="w-8 h-8 rounded-full bg-pink-50 text-pink-400 active:rotate-180 duration-500"><i className="fas fa-exchange-alt"></i></button>
                </div>
                <input type="number" inputMode="decimal" value={state.fromValue} onChange={(e) => setState(prev => ({ ...prev, fromValue: e.target.value }))} className="w-full text-5xl font-black bg-slate-50 p-6 rounded-3xl outline-none transition-all text-slate-800" />
                <select value={state.fromUnit} onChange={(e) => setState(prev => ({ ...prev, fromUnit: e.target.value }))} className="w-full p-4 bg-white rounded-2xl text-slate-600 font-bold border border-slate-100 shadow-sm appearance-none">
                  {CATEGORIES_CONFIG[state.category].units.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                </select>
              </div>
              <div className="flex justify-center -my-4 relative z-20"><div className="bg-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg text-emerald-400 border border-pink-50"><i className="fas fa-chevron-down animate-bounce"></i></div></div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest px-2">결과값</label>
                <div className="w-full text-5xl font-black bg-emerald-50 text-emerald-600 p-6 rounded-3xl break-all min-h-[104px] flex items-center tracking-tighter">{convertedValue}</div>
                <select value={state.toUnit} onChange={(e) => setState(prev => ({ ...prev, toUnit: e.target.value }))} className="w-full p-4 bg-white rounded-2xl text-slate-600 font-bold border border-slate-100 shadow-sm appearance-none">
                  {CATEGORIES_CONFIG[state.category].units.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
             <div className="relative z-10">
               <div className="flex items-center gap-3 mb-6"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span><h4 className="font-black text-sm uppercase tracking-widest text-slate-400 italic">Spring Assistant</h4></div>
               <form onSubmit={handleAiAsk} className="relative">
                 <input type="text" placeholder="봄 소풍에 챙길 물 500ml는 몇 컵인가요?" value={aiQuery} onChange={(e) => setAiQuery(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 pr-14 outline-none focus:bg-white/10 text-lg" />
                 <button disabled={isAiLoading} className="absolute right-2 top-2 bottom-2 bg-pink-500 px-4 rounded-xl shadow-lg active:scale-90 transition-transform">
                   {isAiLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
                 </button>
               </form>
               {aiResult && (
                 <div className="mt-8 grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-top-2 duration-500">
                   <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                     <p className="text-xl font-black text-pink-300 mb-1">{aiResult.result}</p>
                     <p className="text-sm text-slate-300">{aiResult.explanation}</p>
                   </div>
                   <div className="bg-emerald-500/10 rounded-2xl p-5 border border-emerald-500/10">
                     <p className="text-xs italic text-emerald-50 font-medium">"{aiResult.fact}"</p>
                   </div>
                 </div>
               )}
             </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
