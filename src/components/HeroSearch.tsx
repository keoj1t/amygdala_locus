"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, Building2, Search, Sparkles, X, History, TrendingUp } from "lucide-react";
import { POPULAR_SUGGESTIONS } from "@/lib/constants/universities";

interface HeroSearchProps {
  onSearch: (name: string) => void;
  isLoading: boolean;
  currentQuery?: string;
}

const QUICK_CHIPS = [
  "MIT",
  "Czech Technical University in Prague",
  "Astana IT University",
  "Nazarbayev University",
  "Harvard University",
  "Stanford University",
  "KazNU (КазНУ)",
];

export const HeroSearch: React.FC<HeroSearchProps> = ({
  onSearch,
  isLoading,
  currentQuery,
}) => {
  const [value, setValue] = useState(currentQuery || "");
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setValue(currentQuery || "");
  }, [currentQuery]);

  useEffect(() => {
    try {
      setRecent(JSON.parse(localStorage.getItem("locus_recent_searches") || "[]"));
    } catch {}
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const results = POPULAR_SUGGESTIONS.filter((item) =>
    `${item.name} ${item.city}`.toLowerCase().includes(value.toLowerCase())
  ).slice(0, 5);

  const remember = (name: string) => {
    const next = [name, ...recent.filter((item) => item !== name)].slice(0, 5);
    setRecent(next);
    try {
      localStorage.setItem("locus_recent_searches", JSON.stringify(next));
    } catch {}
  };

  const pick = (name: string) => {
    remember(name);
    setValue(name);
    setOpen(false);
    onSearch(name);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !isLoading) {
      pick(value.trim());
    }
  };

  const shown = value
    ? results
    : [
        ...recent.map((name) => ({
          name,
          query: `recent-${name}`,
          city: "Недавний поиск",
        })),
        ...POPULAR_SUGGESTIONS.filter((item) => !recent.includes(item.name)).slice(0, 5),
      ];

  return (
    <section id="top" className="hero shell">
      <div className="hero-copy">
        <div className="eyebrow">
          <span className="status-dot" />
          Visual intelligence for education
        </div>

        <h1>
          <span className="hero-word word-1">Проверенный</span>{" "}
          <span className="hero-word word-2">визуальный профиль</span>
          <br className="hidden sm:inline" />
          <span className="hero-word word-3">университета</span>{" "}
          <span className="hero-word word-4">за 30 секунд.</span>
        </h1>

        <p className="hero-description">
          Собираем и проверяем реальные фотографии кампуса, общежитий и лабораторий, чтобы выбор ВУЗа был объективным и точным.
        </p>
      </div>

      <div ref={root} className="search-area">
        <form onSubmit={submit} className="search-card">
          <Search size={19} className="text-[var(--muted)] shrink-0 ml-1" />
          <input
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="Название ВУЗа (например: MIT, ČVUT, AITU...)"
            disabled={isLoading}
            className="w-full text-sm sm:text-base"
          />

          {value && (
            <button
              className="clear-button p-1"
              type="button"
              onClick={() => setValue("")}
              aria-label="Очистить"
            >
              <X size={16} />
            </button>
          )}

          <button
            className="search-submit shrink-0"
            disabled={!value.trim() || isLoading}
            type="submit"
          >
            <span className="hidden sm:inline">{isLoading ? "Анализируем..." : "Создать профиль"}</span>
            <span className="sm:hidden">{isLoading ? "..." : "Поиск"}</span>
            <ArrowRight size={17} />
          </button>
        </form>

        {/* Quick Suggestion Chips (Horizontal scroll on mobile) */}
        <div className="mt-3.5 flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none text-xs text-[var(--muted)]">
          <div className="flex items-center gap-1 shrink-0 font-medium mr-1 text-[11px] uppercase tracking-wider">
            <TrendingUp size={13} className="text-[#8b5cf6]" />
            <span>Часто ищут:</span>
          </div>
          {QUICK_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => pick(chip)}
              className="shrink-0 px-2.5 py-1 rounded-full bg-[var(--soft)]/80 hover:bg-[var(--soft)] text-[var(--ink)] border border-[var(--line)]/80 text-xs transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Search Autocomplete Dropdown */}
        {open && (
          <div className="suggestions">
            <p>{value ? "Подходящие университеты" : "Недавние и популярные"}</p>
            {shown.length ? (
              shown.map((item) => (
                <button
                  key={item.query}
                  onClick={() => pick(item.name)}
                  type="button"
                  className="flex items-center justify-between w-full p-2.5 text-left rounded-xl hover:bg-[var(--soft)]"
                >
                  <span className="flex items-center gap-2.5 font-medium text-xs sm:text-sm">
                    {item.city === "Недавний поиск" ? (
                      <History size={15} className="text-[var(--muted)]" />
                    ) : (
                      <Building2 size={15} className="text-[#8b5cf6]" />
                    )}
                    <span>{item.name}</span>
                  </span>
                  <small className="text-[11px] text-[var(--muted)]">{item.city}</small>
                </button>
              ))
            ) : value ? (
              <button
                onClick={() => pick(value)}
                type="button"
                className="flex items-center gap-2.5 w-full p-2.5 text-left rounded-xl hover:bg-[var(--soft)] text-[#8b5cf6] font-semibold text-xs sm:text-sm"
              >
                <Sparkles size={16} />
                <span>Сгенерировать профиль для «{value}»</span>
              </button>
            ) : null}
          </div>
        )}

        {/* Search Note / Steps */}
        <div className="search-note">
          <span>01</span> Поиск <i />
          <span>02</span> Проверка <i />
          <span>03</span> Профиль
        </div>
      </div>

      {/* Decorative Hero Campus Visual */}
      <div className="hero-visual" aria-hidden="true">
        <div className="visual-arch" />
        <div className="visual-sun" />
        <div className="visual-building">
          <span /><span /><span /><span />
          <span /><span /><span /><span />
        </div>
        <div className="visual-caption">
          campus<br />
          <b>in focus</b>
        </div>
      </div>
    </section>
  );
};
