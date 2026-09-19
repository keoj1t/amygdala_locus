"use client";

import Link from "next/link";
import { ArrowRight, GitCompare, ArrowUpDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CampusProfile } from "@/types/campus";
import { Header } from "@/components/Header";
import { AuthModal, Account } from "@/components/AuthModal";

export default function ComparePage() {
  const [items, setItems] = useState<CampusProfile[]>([]);
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [account, setAccount] = useState<Account | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    try {
      const savedAccount = sessionStorage.getItem("locus_account");
      if (savedAccount) setAccount(JSON.parse(savedAccount));
      const savedTheme = localStorage.getItem("locus_theme") as "light" | "dark" | null;
      if (savedTheme) setTheme(savedTheme);
      const list = JSON.parse(localStorage.getItem("locus_favorites") || "[]");
      setItems(list);
      setA(list[0]?.university.universityName || (list[0]?.university as any)?.name || "");
      setB(list[1]?.university.universityName || (list[1]?.university as any)?.name || "");
    } catch {}
  }, []);

  const names = items.map((i) => i.university.universityName || (i.university as any).name);
  const pair = useMemo(
    () => [
      items.find((i) => (i.university.universityName || (i.university as any).name) === a),
      items.find((i) => (i.university.universityName || (i.university as any).name) === b),
    ],
    [items, a, b]
  );

  const rows = [
    { label: "Визуальных источников", get: (x: CampusProfile) => `${x.totalImages} фото` },
    { label: "Достоверность (Trust)", get: (x: CampusProfile) => `${x.overallTrustScore}%` },
    { label: "Общежитие (цена)", get: (x: CampusProfile) => x.university.dormitory?.priceRange || "нет данных" },
    { label: "До кампуса", get: (x: CampusProfile) => x.university.dormitory?.distanceToCampus || "нет данных" },
    { label: "Транспорт", get: (x: CampusProfile) => x.university.costOfLiving?.publicTransportTicket || "нет данных" },
    { label: "Год основания", get: (x: CampusProfile) => `${x.university.foundedYear || "—"} г.` },
  ];

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

      <section className="shell compare-page">
        <p className="section-label">Сравнение кампусов</p>
        <h1>Сравнить ВУЗы</h1>
        <p className="compare-lead">
          Сопоставьте сохранённые профили по ключевым условиям жизни, ценам и инфраструктуре кампуса.
        </p>

        {names.length < 2 ? (
          <div className="empty-saved p-8 rounded-3xl border border-dashed border-[var(--line)] bg-[var(--soft)]/50 mt-6">
            <GitCompare size={28} className="text-[var(--muted)]" />
            <h3 className="text-base font-bold m-0 text-[var(--ink)]">Недостаточно ВУЗов для сравнения</h3>
            <p className="text-xs text-[var(--muted)] m-0">
              Добавьте хотя бы два университета в избранное на главной странице, чтобы сравнить их параметры.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--ink)] text-[var(--paper)] text-xs font-semibold mt-2"
            >
              Найти и добавить ВУЗ
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 my-6">
              <select
                value={a}
                onChange={(e) => setA(e.target.value)}
                className="w-full p-3 rounded-xl border border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] text-xs font-medium"
              >
                {names.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
              <div className="hidden sm:flex items-center justify-center p-2 text-[var(--muted)]">
                <ArrowRight size={18} />
              </div>
              <select
                value={b}
                onChange={(e) => setB(e.target.value)}
                className="w-full p-3 rounded-xl border border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] text-xs font-medium"
              >
                {names.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {pair.map(
                (item, i) =>
                  item && (
                    <article
                      key={i}
                      className="rounded-2xl border border-[var(--line)] bg-[var(--soft)]/60 overflow-hidden"
                    >
                      <div className="h-40 bg-[var(--soft)] relative">
                        <img
                          src={item.images[0]?.url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h2 className="text-base font-bold text-[var(--ink)] m-0">
                          {item.university.universityName}
                        </h2>
                        <p className="text-xs text-[var(--muted)] mt-1 mb-0">
                          {item.university.city}, {item.university.country}
                        </p>
                      </div>
                    </article>
                  )
              )}
            </div>

            <div className="compare-table overflow-x-auto rounded-2xl border border-[var(--line)] bg-[var(--paper)]">
              <div className="table-head grid grid-cols-3 gap-3 p-3 bg-[var(--soft)] text-xs font-bold text-[var(--muted)] uppercase tracking-wider">
                <span>Параметр</span>
                <span className="truncate">{a}</span>
                <span className="truncate">{b}</span>
              </div>
              {rows.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-3 gap-3 p-3.5 border-t border-[var(--line)] text-xs"
                >
                  <span className="text-[var(--muted)] font-medium">{row.label}</span>
                  <b className="text-[var(--ink)] font-semibold">{pair[0] ? row.get(pair[0]) : "—"}</b>
                  <b className="text-[var(--ink)] font-semibold">{pair[1] ? row.get(pair[1]) : "—"}</b>
                </div>
              ))}
            </div>
          </>
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
