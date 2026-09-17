"use client";

import React, { useState } from "react";
import { 
  X, 
  GitCompare, 
  ShieldCheck, 
  Building2, 
  BedDouble, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles 
} from "lucide-react";
import { ComparisonResult } from "@/types/campus";
import { POPULAR_SUGGESTIONS } from "@/lib/constants/universities";

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKeys?: any;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  onClose,
  apiKeys,
}) => {
  const [univA, setUnivA] = useState("Nazarbayev University");
  const [univB, setUnivB] = useState("Astana IT University");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCompare = async () => {
    if (!univA || !univB) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          universityA: univA,
          universityB: univB,
          apiKeys,
        }),
      });

      if (!res.ok) throw new Error("Не удалось выполнить сравнение ВУЗов");
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Ошибка при сравнении");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-5xl bg-slate-900/95 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Сравнение Кампусов ВУЗов
              </h3>
              <p className="text-xs text-slate-400">
                Сравнение Trust Score, общежитий и качества инфраструктуры двух университетов
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Selectors Bar */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Университет А:</label>
              <select
                value={univA}
                onChange={(e) => setUnivA(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                {POPULAR_SUGGESTIONS.map((s) => (
                  <option key={s.query} value={s.name}>{s.name} ({s.city})</option>
                ))}
              </select>
            </div>

            <div className="flex justify-center md:col-span-1">
              <button
                onClick={handleCompare}
                disabled={loading}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl gradient-bg text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Сравнить</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Университет Б:</label>
              <select
                value={univB}
                onChange={(e) => setUnivB(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                {POPULAR_SUGGESTIONS.map((s) => (
                  <option key={s.query} value={s.name}>{s.name} ({s.city})</option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Results Comparison Grid */}
          {result && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* AI Verdict Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 text-sm text-indigo-200 flex items-start gap-3 shadow-lg">
                <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white mb-1">Сравнительное заключение AI:</h4>
                  <p className="leading-relaxed">{result.verdict}</p>
                </div>
              </div>

              {/* Side-by-Side Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* University A Card */}
                <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-base text-white">{result.universityA.university.universityName || (result.universityA.university as any).name}</h4>
                      <p className="text-xs text-slate-400">{result.universityA.university.city}, {result.universityA.university.country}</p>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold">
                      {result.universityA.overallTrustScore}% Trust
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl">
                    {result.universityA.summary}
                  </p>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-800 text-slate-400">
                      <span>Стоимость общежития:</span>
                      <span className="font-mono text-emerald-400">{result.universityA.university.dormitory?.priceRange}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800 text-slate-400">
                      <span>Транспорт / Метро:</span>
                      <span className="font-mono text-cyan-400">{result.universityA.university.costOfLiving?.publicTransportTicket}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800 text-slate-400">
                      <span>Всего фото в профиле:</span>
                      <span className="font-mono text-white">{result.universityA.totalImages}</span>
                    </div>
                  </div>
                </div>

                {/* University B Card */}
                <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-base text-white">{result.universityB.university.universityName || (result.universityB.university as any).name}</h4>
                      <p className="text-xs text-slate-400">{result.universityB.university.city}, {result.universityB.university.country}</p>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold">
                      {result.universityB.overallTrustScore}% Trust
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl">
                    {result.universityB.summary}
                  </p>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-800 text-slate-400">
                      <span>Стоимость общежития:</span>
                      <span className="font-mono text-emerald-400">{result.universityB.university.dormitory?.priceRange}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800 text-slate-400">
                      <span>Транспорт / Метро:</span>
                      <span className="font-mono text-cyan-400">{result.universityB.university.costOfLiving?.publicTransportTicket}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800 text-slate-400">
                      <span>Всего фото в профиле:</span>
                      <span className="font-mono text-white">{result.universityB.totalImages}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
