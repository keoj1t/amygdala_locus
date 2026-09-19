"use client";

import React, { useState, useEffect } from "react";
import { X, Key, ShieldCheck, Zap, Info, Check } from "lucide-react";

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveKeys: (keys: ApiKeys) => void;
  initialKeys: ApiKeys;
}

export interface ApiKeys {
  serperApiKey?: string;
  geminiApiKey?: string;
  openaiApiKey?: string;
  googleApiKey?: string;
  googleCx?: string;
  apifyApiKey?: string;
}

export const ApiSettingsModal: React.FC<ApiSettingsModalProps> = ({
  isOpen,
  onClose,
  onSaveKeys,
  initialKeys,
}) => {
  const [keys, setKeys] = useState<ApiKeys>(initialKeys);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setKeys(initialKeys);
  }, [initialKeys]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveKeys(keys);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  const handleClear = () => {
    const cleared = {
      serperApiKey: "",
      geminiApiKey: "",
      openaiApiKey: "",
      googleApiKey: "",
      googleCx: "",
      apifyApiKey: "",
    };
    setKeys(cleared);
    onSaveKeys(cleared);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-slate-900/95 border border-slate-750 rounded-3xl shadow-2xl overflow-hidden z-10">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Настройки API и Режимов</h3>
              <p className="text-xs text-slate-400">
                Подключение Serper.dev, Gemini Vision, Apify и OpenAI
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

        {/* Body Form */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-indigo-200 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              Ключи Serper.dev и Gemini Vision активируют <strong>живой поиск реальных изображений</strong> любого ВУЗа по всему вебу за &lt; 30 секунд.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Apify API Token (Reddit Scraper trudax/reddit-scraper-lite):
            </label>
            <input
              type="password"
              value={keys.apifyApiKey || ""}
              onChange={(e) => setKeys({ ...keys, apifyApiKey: e.target.value })}
              placeholder="apify_api_..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Serper.dev API Key (Google Images Search):
            </label>
            <input
              type="password"
              value={keys.serperApiKey || ""}
              onChange={(e) => setKeys({ ...keys, serperApiKey: e.target.value })}
              placeholder="e7993b70..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Google Gemini API Key (Gemini Flash Vision):
            </label>
            <input
              type="password"
              value={keys.geminiApiKey || ""}
              onChange={(e) => setKeys({ ...keys, geminiApiKey: e.target.value })}
              placeholder="AQ... или AIzaSy..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              OpenAI API Key (GPT-4o-mini Vision):
            </label>
            <input
              type="password"
              value={keys.openaiApiKey || ""}
              onChange={(e) => setKeys({ ...keys, openaiApiKey: e.target.value })}
              placeholder="sk-..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Google Custom Search API Key:
              </label>
              <input
                type="password"
                value={keys.googleApiKey || ""}
                onChange={(e) => setKeys({ ...keys, googleApiKey: e.target.value })}
                placeholder="AIzaSy..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Google Search Engine ID (CX):
              </label>
              <input
                type="text"
                value={keys.googleCx || ""}
                onChange={(e) => setKeys({ ...keys, googleCx: e.target.value })}
                placeholder="0123456789..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-800 flex items-center justify-between bg-slate-950/60">
          <button
            onClick={handleClear}
            className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
          >
            Сбросить ключи
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
            >
              Отмена
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl gradient-bg text-white font-semibold text-xs shadow-md shadow-indigo-500/25 hover:opacity-95 active:scale-95"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Сохранено!</span>
                </>
              ) : (
                <span>Сохранить настройки</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
