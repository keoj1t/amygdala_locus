"use client";
import React from "react";
import { Download, ExternalLink, Heart, MapPin, Plus, Calendar, Building2, BedDouble, Bus } from "lucide-react";
import { CampusProfile } from "@/types/campus";

interface OverviewSummaryProps {
  profile: CampusProfile;
  onExport: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

/**
 * Formats basic Markdown (**bold**, paragraphs) into React elements
 */
function renderFormattedSummary(text: string) {
  if (!text) return null;

  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);

  return (
    <div className="space-y-3.5 text-sm leading-relaxed text-[var(--ink)]">
      {paragraphs.map((paragraph, pIdx) => {
        // Parse bold markdown **text**
        const parts = paragraph.split(/(\*\*[^*]+\*\*)/g);

        return (
          <p key={pIdx} className="m-0">
            {parts.map((part, partIdx) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                const boldContent = part.slice(2, -2);
                return (
                  <strong key={partIdx} className="font-semibold text-[var(--ink)]">
                    {boldContent}
                  </strong>
                );
              }
              return <span key={partIdx}>{part}</span>;
            })}
          </p>
        );
      })}
    </div>
  );
}

export const OverviewSummary: React.FC<OverviewSummaryProps> = ({
  profile,
  onExport,
  isFavorite,
  onToggleFavorite,
}) => {
  const name = profile.university.universityName || (profile.university as any).name;
  const cover = profile.images[0];
  const founded = profile.university.foundedYear;

  return (
    <section className="profile-intro shell">
      <div className="profile-copy">
        <p className="section-label">Визуальный профиль</p>
        
        <div className="profile-title">
          <h2>{name}</h2>
          <button
            className={isFavorite ? "favorite-button active" : "favorite-button"}
            onClick={onToggleFavorite}
          >
            <Heart size={17} fill={isFavorite ? "currentColor" : "none"} />
            {isFavorite ? "В избранном" : "В избранное"}
          </button>
        </div>

        <p className="search-time">
          Поиск и проверка: {(profile.executionTimeMs / 1000).toFixed(1)} сек.
        </p>

        <div className="flex flex-wrap items-center gap-3 profile-place">
          <div className="flex items-center gap-1.5">
            <MapPin size={15} />
            <span>{profile.university.city}, {profile.university.country}</span>
          </div>

          {founded && (
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--soft)] text-[11px] font-medium text-[var(--muted)] border border-[var(--line)]">
              <Calendar size={12} />
              <span>Основан в {founded} г.</span>
            </div>
          )}
        </div>

        {/* ChatGPT-style Enriched Details Section */}
        <details className="more-data mt-6">
          <summary className="font-medium">
            <Plus size={15} />
            <span>Доп. данные и аналитика кампуса</span>
          </summary>

          <div className="p-6 rounded-2xl bg-[var(--soft)]/70 border border-[var(--line)] mt-3">
            {/* Quick Fact Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 pb-5 border-b border-[var(--line)]">
              {founded && (
                <div className="p-3 rounded-xl bg-[var(--paper)] border border-[var(--line)]/60">
                  <span className="text-[10px] text-[var(--muted)] uppercase tracking-wider block mb-1">Основан</span>
                  <b className="text-xs font-semibold text-[var(--ink)]">{founded} год</b>
                </div>
              )}
              {profile.university.city && (
                <div className="p-3 rounded-xl bg-[var(--paper)] border border-[var(--line)]/60">
                  <span className="text-[10px] text-[var(--muted)] uppercase tracking-wider block mb-1">Город</span>
                  <b className="text-xs font-semibold text-[var(--ink)]">{profile.university.city}</b>
                </div>
              )}
              {profile.university.dormitory?.priceRange && (
                <div className="p-3 rounded-xl bg-[var(--paper)] border border-[var(--line)]/60">
                  <span className="text-[10px] text-[var(--muted)] uppercase tracking-wider block mb-1">Общежитие</span>
                  <b className="text-xs font-semibold text-[var(--ink)] truncate block" title={profile.university.dormitory.priceRange}>
                    {profile.university.dormitory.priceRange}
                  </b>
                </div>
              )}
              {profile.university.costOfLiving?.priceIndex && (
                <div className="p-3 rounded-xl bg-[var(--paper)] border border-[var(--line)]/60">
                  <span className="text-[10px] text-[var(--muted)] uppercase tracking-wider block mb-1">Индекс цен</span>
                  <b className="text-xs font-semibold text-[var(--ink)]">{profile.university.costOfLiving.priceIndex} Cost</b>
                </div>
              )}
            </div>

            {/* AI Enriched Structured Text with ChatGPT styling */}
            <div className="summary-content mb-5">
              {renderFormattedSummary(profile.summary)}
            </div>

            {/* Key Highlights list */}
            {profile.keyHighlights?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[var(--line)]/70">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)] block mb-2.5">
                  Ключевые факты и инфраструктура:
                </span>
                <ul className="space-y-2 text-xs text-[var(--ink)] pl-0 list-none m-0">
                  {profile.keyHighlights.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[var(--muted)] mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-5 pt-4 border-t border-[var(--line)]/70 flex justify-end">
              <button
                onClick={onExport}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--ink)] text-[var(--paper)] text-xs font-medium hover:opacity-90 transition-opacity"
              >
                <Download size={14} />
                <span>Скачать JSON</span>
              </button>
            </div>
          </div>
        </details>
      </div>

      {cover && (
        <button
          className="profile-cover"
          onClick={() => document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" })}
        >
          <img src={cover.url} alt={cover.title} />
          <span>
            {profile.totalImages} фото <ExternalLink size={14} />
          </span>
        </button>
      )}
    </section>
  );
};
