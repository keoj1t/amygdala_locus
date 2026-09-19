"use client";

import Link from "next/link";
import { Heart, Trash2, Scale, ArrowRight, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { CampusProfile } from "@/types/campus";
import { Header } from "@/components/Header";
import { AuthModal, Account } from "@/components/AuthModal";

export default function FavoritesPage() {
  const [items, setItems] = useState<CampusProfile[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [account, setAccount] = useState<Account | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    try {
      const savedAccount = sessionStorage.getItem("locus_account");
      if (savedAccount) setAccount(JSON.parse(savedAccount));
      const savedTheme = localStorage.getItem("locus_theme") as "light" | "dark" | null;
      if (savedTheme) setTheme(savedTheme);
      setItems(JSON.parse(localStorage.getItem("locus_favorites") || "[]"));
    } catch {}
  }, []);

  const remove = (index: number) => {
    const next = items.filter((_, i) => i !== index);
    setItems(next);
    try {
      localStorage.setItem("locus_favorites", JSON.stringify(next));
    } catch {}
  };

  return (
    <main data-theme={theme} className="saved-page min-h-screen">
      <Header
        onOpenAuth={() => setIsAuthOpen(true)}
        isAuthenticated={Boolean(account)}
        theme={theme}
        onToggleTheme={() =>
          setTheme((prev) => {
            const next = prev === "light" ? "dark" : "light";
            localStorage.setItem("locus_theme", next);
            return next;
          })
        }
      />

      <section className="shell saved-head">
        <p className="section-label">Ваша подборка</p>
        <h1>Избранное</h1>
        <p className="text-sm text-[var(--muted)] m-0">Сохранённые визуальные профили ВУЗов — в одном месте.</p>
      </section>

      <section className="shell saved-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-6 pb-12">
        {items.length ? (
          items.map((item, index) => {
            const name = item.university.universityName || (item.university as any).name;
            return (
              <article
                key={`${name}-${index}`}
                className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--soft)]/50 flex flex-col justify-between"
              >
                <div className="h-44 bg-[var(--soft)] relative">
                  <img
                    src={item.images[0]?.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-[var(--paper)]/90 backdrop-blur-md text-[11px] font-bold text-[var(--ink)] border border-[var(--line)]">
                    {item.overallTrustScore}% Trust
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-[var(--ink)] m-0 line-clamp-1">{name}</h2>
                    <p className="text-xs text-[var(--muted)] mt-1 mb-0">
                      {item.university.city}, {item.university.country}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[var(--line)]/70">
                    <Link
                      href="/compare"
                      className="flex items-center gap-1.5 text-xs font-semibold text-[var(--ink)] hover:text-[#8b5cf6] transition-colors"
                    >
                      <Scale size={14} />
                      <span>Сравнить</span>
                    </Link>

                    <button
                      onClick={() => remove(index)}
                      aria-label="Удалить из избранного"
                      className="p-1.5 rounded-lg text-[var(--muted)] hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="empty-saved col-span-full p-8 rounded-3xl border border-dashed border-[var(--line)] bg-[var(--soft)]/50 text-center">
            <Heart size={28} className="text-[var(--muted)] mx-auto mb-2 opacity-50" />
            <h3 className="text-base font-bold text-[var(--ink)] m-0">Список избранного пуст</h3>
            <p className="text-xs text-[var(--muted)] mt-1 mb-4">
              Здесь появятся университеты, которые вы отметите сердечком на главной странице.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--ink)] text-[var(--paper)] text-xs font-semibold"
            >
              <span>Найти университет</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </section>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthenticated={(next) => {
          setAccount(next);
          sessionStorage.setItem("locus_account", JSON.stringify(next));
        }}
      />
    </main>
  );
}
