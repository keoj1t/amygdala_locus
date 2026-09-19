"use client";

import React from "react";
import {
  Building2,
  FlaskConical,
  Layers3,
  MapPin,
  Trophy,
  Users,
  BedDouble,
  ShieldCheck,
  AlertCircle,
  ArrowUpDown,
} from "lucide-react";
import { CategoryType } from "@/types/campus";

interface FilterBarProps {
  activeCategory: CategoryType | "all";
  onSelectCategory: (cat: CategoryType | "all") => void;
  categoryCounts: Record<string, number>;
  trustFilter: "all" | "verified_only" | "needs_check_only";
  onSelectTrustFilter: (tf: "all" | "verified_only" | "needs_check_only") => void;
  sortBy: "trust" | "newest";
  onSelectSortBy: (sort: "trust" | "newest") => void;
}

const tabs: { id: CategoryType | "all"; label: string; icon: React.ElementType }[] = [
  { id: "all", label: "Все", icon: Layers3 },
  { id: "campus", label: "Кампус", icon: Building2 },
  { id: "dorm", label: "Общежития", icon: BedDouble },
  { id: "lab", label: "Лаборатории", icon: FlaskConical },
  { id: "sport", label: "Спорт", icon: Trophy },
  { id: "city", label: "Город", icon: MapPin },
  { id: "student_life", label: "Жизнь", icon: Users },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  activeCategory,
  onSelectCategory,
  categoryCounts,
  trustFilter,
  onSelectTrustFilter,
  sortBy,
  onSelectSortBy,
}) => {
  return (
    <div className="category-bar shell">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3.5">
        <p className="text-sm font-semibold text-[var(--ink)] tracking-tight">
          Фотогалерея кампуса
        </p>

        {/* Quick Secondary Trust & Sort Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {/* Trust Score filter dropdown / pills */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--soft)]/70 border border-[var(--line)]">
            <button
              onClick={() => onSelectTrustFilter("all")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                trustFilter === "all"
                  ? "bg-[var(--paper)] text-[var(--ink)] font-semibold shadow-2xs"
                  : "text-[var(--muted)] hover:text-[var(--ink)]"
              }`}
            >
              Все фото
            </button>
            <button
              onClick={() => onSelectTrustFilter("verified_only")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                trustFilter === "verified_only"
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/30"
                  : "text-[var(--muted)] hover:text-[var(--ink)]"
              }`}
            >
              <ShieldCheck size={13} className="text-emerald-500" />
              <span>&ge;75%</span>
            </button>
          </div>

          {/* Sort Switcher */}
          <button
            onClick={() => onSelectSortBy(sortBy === "trust" ? "newest" : "trust")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--soft)]/70 border border-[var(--line)] text-[var(--ink)] hover:bg-[var(--soft)] transition-colors text-xs"
            title="Сменить сортировку"
          >
            <ArrowUpDown size={13} className="text-[var(--muted)]" />
            <span>{sortBy === "trust" ? "По рейтингу доверия" : "Сначала новые"}</span>
          </button>
        </div>
      </div>

      {/* Main Categories Horizontal Scrollable Bar */}
      <div className="category-scroll-wrapper">
        <div className="category-scroll-inner">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const count =
              tab.id === "all"
                ? Object.values(categoryCounts).reduce((a, b) => a + b, 0)
                : categoryCounts[tab.id] || 0;

            return (
              <button
                key={tab.id}
                onClick={() => onSelectCategory(tab.id)}
                className={`category-pill ${activeCategory === tab.id ? "active" : ""}`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
                <small className="opacity-70 font-semibold">{count}</small>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
