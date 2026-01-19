
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

  // Sync default units when category changes
  useEffect(() => {
    const config = CATEGORIES_CONFIG[state.category];
    setState(prev => ({
      ...prev,
      fromUnit: config.units[0].value,
      toUnit: config.units[1]?.value || config.units[0].value
    }));
  }, [state.category]);

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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg shadow-blue-200 shadow-lg">
              <i className="fas fa-layer-group text-xl"></i>
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">
              OmniUnit AI
            </h1>
          </div>
          <div className="hidden md:flex text-sm text-slate-500 font-medium">
            Smart & Universal Unit Converter
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sidebar / Category Selector */}
        <section className="lg:col-span-1 space-y-4">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider px-2">Categories</h2>
          <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2 pb-4 lg:pb-0 scrollbar-hide">
            {(Object.keys(CATEGORIES_CONFIG) as Category[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setState(prev => ({ ...prev, category: cat }))}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 whitespace-nowrap lg:w-full group ${
                  state.category === cat 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                  : 'bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className={`text-lg ${state.category === cat ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'}`}>
                  {CATEGORIES_CONFIG[cat].icon}
                </span>
                <span className="font-medium">{cat}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Converter Main Area */}
        <section className="lg:col-span-2 space-y-8">
          
          {/* Main Card */}
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200 border border-slate-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="text-blue-600 bg-blue-50 p-3 rounded-2xl">
                {CATEGORIES_CONFIG[state.category].icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold">{state.category} Converter</h3>
                <p className="text-slate-500 text-sm">Select units and enter values to convert instantly</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
              {/* From Section */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-600">From</label>
                <div className="relative">
                  <input
                    type="number"
                    value={state.fromValue}
                    onChange={(e) => setState(prev => ({ ...prev, fromValue: e.target.value }))}
                    className="w-full text-3xl font-bold bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white p-6 rounded-2xl outline-none transition-all"
                  />
                </div>
                <select
                  value={state.fromUnit}
                  onChange={(e) => setState(prev => ({ ...prev, fromUnit: e.target.value }))}
                  className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748b%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-[right_1rem_center] bg-no-repeat"
                >
                  {CATEGORIES_CONFIG[state.category].units.map(u => (
                    <option key={u.value} value={u.value}>{u.label}</option>
                  ))}
                </select>
              </div>

              {/* Center Swap Button (Mobile: hidden, Desktop: visible) */}
              <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <button 
                  onClick={() => setState(prev => ({ ...prev, fromUnit: prev.toUnit, toUnit: prev.fromUnit }))}
                  className="bg-white p-3 rounded-full shadow-lg border border-slate-100 text-blue-600 hover:scale-110 transition-transform"
                >
                  <i className="fas fa-exchange-alt"></i>
                </button>
              </div>

              {/* To Section */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-600">To</label>
                <div className="relative">
                  <div className="w-full text-3xl font-bold bg-blue-50 text-blue-700 p-6 rounded-2xl border-2 border-transparent">
                    {convertedValue}
                  </div>
                </div>
                <select
                  value={state.toUnit}
                  onChange={(e) => setState(prev => ({ ...prev, toUnit: e.target.value }))}
                  className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748b%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-[right_1rem_center] bg-no-repeat"
                >
                  {CATEGORIES_CONFIG[state.category].units.map(u => (
                    <option key={u.value} value={u.value}>{u.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* AI Assistant Section */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700">
               <i className="fas fa-microchip text-9xl"></i>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter">AI Driven</span>
                <h4 className="text-xl font-bold">Ask Gemini Assistant</h4>
              </div>
              <p className="text-indigo-200 text-sm mb-6">Type a custom conversion or ask about any unit's history.</p>

              <form onSubmit={handleAiAsk} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g., How many lightyears in 100 meters?"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 outline-none focus:bg-white/20 transition-all text-white placeholder:text-indigo-300/50"
                />
                <button
                  disabled={isAiLoading}
                  className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-6 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95 flex items-center gap-2"
                >
                  {isAiLoading ? (
                    <i className="fas fa-circle-notch fa-spin"></i>
                  ) : (
                    <i className="fas fa-magic"></i>
                  )}
                  <span>{isAiLoading ? 'Thinking...' : 'Ask'}</span>
                </button>
              </form>

              {aiResult && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-2 text-blue-400 mb-2 font-semibold">
                      <i className="fas fa-calculator"></i>
                      <span>Result</span>
                    </div>
                    <p className="text-lg leading-relaxed">{aiResult.result}</p>
                    <p className="text-sm text-indigo-300 mt-2">{aiResult.explanation}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-2 text-amber-400 mb-2 font-semibold">
                      <i className="fas fa-lightbulb"></i>
                      <span>Did you know?</span>
                    </div>
                    <p className="text-sm italic leading-relaxed text-indigo-100 opacity-90">
                      "{aiResult.fact}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-4 mt-12 text-center text-slate-400 text-xs">
        <p>© 2024 OmniUnit AI. Accurate & Efficient Unit Conversion Service.</p>
        <div className="mt-2 flex justify-center gap-4">
          <a href="#" className="hover:text-blue-600 transition-colors">Documentation</a>
          <span>•</span>
          <a href="#" className="hover:text-blue-600 transition-colors">API Status</a>
          <span>•</span>
          <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
