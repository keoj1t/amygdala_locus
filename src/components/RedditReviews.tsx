"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, ExternalLink, ThumbsUp, User, Calendar, Quote, AlertCircle, Sparkles, Loader2 } from "lucide-react";
import { RedditReview } from "@/lib/services/reddit-scraper";

interface RedditReviewsProps {
  universityName: string;
}

const LOADING_HINTS = [
  "Ещё момент, находим живые треды и обсуждения...",
  "Осталось ещё чуть-чуть, собираем мнения об общежитиях и кампусе...",
  "Буквально секунду, структурируем опыт студентов...",
  "Почти готово, финализируем результаты..."
];

export const RedditReviews: React.FC<RedditReviewsProps> = ({ universityName }) => {
  const [reviews, setReviews] = useState<RedditReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hintIndex, setHintIndex] = useState(0);

  // Rotate loading step text smoothly
  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setHintIndex((prev) => (prev + 1) % LOADING_HINTS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    let isMounted = true;

    async function loadReviews() {
      if (!universityName.trim()) {
        setReviews([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/university/reviews?name=${encodeURIComponent(universityName)}`);
        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`);
        }
        const data = await res.json();
        if (isMounted) {
          setReviews(data.reviews || []);
        }
      } catch (err) {
        console.warn("Failed to load Reddit reviews:", err);
        if (isMounted) {
          setError("Не удалось загрузить обсуждения с Reddit");
          setReviews([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadReviews();

    return () => {
      isMounted = false;
    };
  }, [universityName]);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <section className="shell reddit-section my-12">
      <div className="reddit-container p-6 sm:p-9 rounded-3xl border border-[var(--line)] bg-[var(--paper)] shadow-sm">
        {/* Section Header with single Reddit accent */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-5 border-b border-[var(--line)]">
          <div className="flex items-center gap-3.5">
            {/* Exactly ONE Reddit orange accent icon */}
            <div className="w-10 h-10 rounded-2xl bg-[var(--soft)] border border-[var(--line)] flex items-center justify-center text-[#FF4500] shadow-sm">
              <MessageSquare className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-lg sm:text-xl font-bold text-[var(--ink)] tracking-tight">
                  Студенческие обсуждения и отзывы
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--soft)] text-[var(--muted)] border border-[var(--line)]">
                  Reddit Community
                </span>
              </div>
              <p className="text-xs text-[var(--muted)] mt-0.5">
                Живые мнения студентов, впечатления о кампусе, сессиях и общежитиях {universityName}
              </p>
            </div>
          </div>

          {!isLoading && reviews.length > 0 && (
            <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-[var(--soft)] text-[var(--ink)] border border-[var(--line)]">
              <Sparkles className="w-3.5 h-3.5 text-[#8b5cf6]" />
              <span>{reviews.length} {reviews.length === 1 ? 'обсуждение' : reviews.length < 5 ? 'обсуждения' : 'обсуждений'}</span>
            </div>
          )}
        </div>

        {/* Live Status Banner while reviews are being scraped */}
        {isLoading && (
          <div className="mb-6 p-4 sm:p-4.5 rounded-2xl bg-[var(--soft)]/90 border border-violet-500/25 flex flex-wrap items-center justify-between gap-3.5 shadow-sm transition-all duration-300">
            <div className="flex items-center gap-3.5">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-[var(--paper)] border border-violet-500/30 text-[#8b5cf6] shadow-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div>
                <div className="text-xs font-semibold text-[var(--ink)] flex items-center gap-2">
                  <span>Сбор мнений студентов в реальном времени</span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#8b5cf6] animate-ping" />
                </div>
                <p className="text-[11px] text-[var(--muted)] mt-0.5 font-medium transition-all duration-300">
                  {LOADING_HINTS[hintIndex]}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-medium text-[var(--ink)] px-3.5 py-1.5 rounded-full bg-[var(--paper)] border border-[var(--line)] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Фото и галерея универа выше уже открыты к просмотру</span>
            </div>
          </div>
        )}

        {/* Loading State Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="p-6 rounded-2xl border border-[var(--line)] bg-[var(--soft)]/70 animate-pulse flex flex-col justify-between h-52"
              >
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-4 w-20 bg-[var(--line)] rounded-md" />
                    <div className="h-4 w-24 bg-[var(--line)] rounded-md" />
                  </div>
                  <div className="h-4.5 w-4/5 bg-[var(--line)] rounded mb-2.5" />
                  <div className="h-3.5 w-full bg-[var(--line)]/70 rounded mb-1.5" />
                  <div className="h-3.5 w-2/3 bg-[var(--line)]/70 rounded" />
                </div>
                <div className="flex justify-between items-center pt-3.5 border-t border-[var(--line)]/40">
                  <div className="h-3.5 w-16 bg-[var(--line)] rounded" />
                  <div className="h-3.5 w-24 bg-[var(--line)] rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && reviews.length === 0 && (
          <div className="py-12 px-4 text-center rounded-2xl border border-dashed border-[var(--line)] bg-[var(--soft)]/40">
            <AlertCircle className="w-8 h-8 text-[var(--muted)] mx-auto mb-2 opacity-60" />
            <h4 className="text-sm font-semibold text-[var(--ink)]">
              {error ? error : "Обсуждений на Reddit пока не найдено"}
            </h4>
            <p className="text-xs text-[var(--muted)] mt-1 max-w-md mx-auto">
              Попробуйте обновить профиль или повторить запрос позже.
            </p>
          </div>
        )}

        {/* Reviews Grid in Clean Site Theme */}
        {!isLoading && reviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="reddit-card group p-6 rounded-2xl border border-[var(--line)] bg-[var(--soft)]/50 hover:bg-[var(--soft)] transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Card Meta Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5 text-xs text-[var(--muted)]">
                    <div className="flex items-center gap-2">
                      {review.subreddit && (
                        <span className="font-semibold text-[var(--ink)] bg-[var(--paper)] px-2.5 py-0.5 rounded-lg border border-[var(--line)] text-[11px]">
                          r/{review.subreddit}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>u/{review.author}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {review.score > 0 && (
                        <span className="flex items-center gap-1 font-semibold text-[var(--ink)] bg-[var(--paper)] px-2 py-0.5 rounded-md border border-[var(--line)] text-[11px]">
                          <ThumbsUp className="w-3 h-3 text-[var(--muted)]" />
                          <span>{review.score}</span>
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-[11px]">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(review.createdAt)}</span>
                      </span>
                    </div>
                  </div>

                  {/* Post Title */}
                  <h4 className="text-sm sm:text-base font-semibold text-[var(--ink)] leading-snug mb-2.5 group-hover:underline underline-offset-4 decoration-[var(--line)] transition-all">
                    {review.title}
                  </h4>

                  {/* Post Quote / Body */}
                  {review.text && (
                    <div className="relative mt-2 mb-4 p-3.5 rounded-xl bg-[var(--paper)] border border-[var(--line)]/70">
                      <Quote className="w-3.5 h-3.5 text-[var(--muted)]/40 absolute top-2.5 left-2.5 -scale-x-100" />
                      <p className="text-xs text-[var(--muted)] line-clamp-4 leading-relaxed pl-3 italic">
                        «{review.text}»
                      </p>
                    </div>
                  )}
                </div>

                {/* Card Action Link */}
                <div className="pt-3.5 border-t border-[var(--line)]/60 flex items-center justify-between">
                  <span className="text-[11px] text-[var(--muted)]">
                    Reddit thread
                  </span>
                  <a
                    href={review.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--ink)] hover:opacity-75 transition-opacity group/link"
                  >
                    <span>Перейти к обсуждению</span>
                    <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
