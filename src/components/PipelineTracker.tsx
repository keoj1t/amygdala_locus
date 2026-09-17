"use client";

import React from "react";
import { 
  Sparkles, 
  Search, 
  Layers, 
  CheckCircle2, 
  FileText, 
  Clock, 
  Zap, 
  ShieldCheck 
} from "lucide-react";
import { PipelineTelemetry } from "@/types/campus";

interface PipelineTrackerProps {
  telemetry: PipelineTelemetry;
}

const STEPS = [
  { id: "expansion", label: "Генерация промптов", icon: Sparkles, desc: "5 категорий" },
  { id: "searching", label: "Параллельный поиск", icon: Search, desc: "Promise.all" },
  { id: "dedup", label: "Дедупликация", icon: Layers, desc: "pHash & Hamming" },
  { id: "ai_verification", label: "AI Vision оценка", icon: ShieldCheck, desc: "Trust Score" },
  { id: "summary", label: "Сводка кампуса", icon: FileText, desc: "Готово < 30с" },
];

export const PipelineTracker: React.FC<PipelineTrackerProps> = ({ telemetry }) => {
  const getStepStatus = (stepId: string, index: number) => {
    const stepOrder = ["idle", "expansion", "searching", "dedup", "ai_verification", "summary", "completed"];
    const currentIndex = stepOrder.indexOf(telemetry.step);
    const thisIndex = stepOrder.indexOf(stepId);

    if (telemetry.step === "completed") return "done";
    if (thisIndex < currentIndex) return "done";
    if (thisIndex === currentIndex) return "active";
    return "pending";
  };

  const seconds = (telemetry.timeElapsedMs / 1000).toFixed(1);

  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-4">
      <div className="glass-panel rounded-3xl p-5 sm:p-6 shadow-2xl border border-indigo-500/20 relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500" />

        {/* Header Telemetry row */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
              <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                Пайплайн генерации профиля
                {telemetry.step === "completed" && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Успешно завершено
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">
                {telemetry.currentActionText || "Обработка и верификация фотоматериалов в реальном времени"}
              </p>
            </div>
          </div>

          {/* Stopwatch & Elapsed */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80">
            <Clock className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: "6s" }} />
            <span className="text-xs text-slate-400 font-mono">Время:</span>
            <span className={`text-sm font-mono font-bold ${Number(seconds) <= 30 ? "text-emerald-400" : "text-amber-400"}`}>
              {seconds}s <span className="text-[10px] text-slate-500 font-normal">/ макс 30.0s</span>
            </span>
          </div>
        </div>

        {/* 5-Step Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 mb-4">
          {STEPS.map((step, idx) => {
            const status = getStepStatus(step.id, idx);
            const Icon = step.icon;

            return (
              <div
                key={step.id}
                className={`p-3 rounded-2xl border transition-all duration-300 relative ${
                  status === "done"
                    ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-200"
                    : status === "active"
                    ? "bg-indigo-950/40 border-cyan-400/60 shadow-lg shadow-indigo-950/80 scale-[1.02]"
                    : "bg-slate-900/40 border-slate-800 text-slate-500 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      status === "done"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : status === "active"
                        ? "bg-cyan-500/20 text-cyan-300 animate-pulse"
                        : "bg-slate-800 text-slate-500"
                    }`}
                  >
                    {status === "done" ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Icon className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">0{idx + 1}</span>
                </div>

                <div className="text-xs font-semibold text-slate-200 truncate">
                  {step.label}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {status === "active" ? "Выполняется..." : step.desc}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-900/80 rounded-full h-1.5 overflow-hidden border border-slate-800">
          <div
            className="h-full gradient-bg transition-all duration-300 ease-out"
            style={{ width: `${Math.min(100, Math.max(5, telemetry.stepProgress))}%` }}
          />
        </div>
      </div>
    </div>
  );
};
