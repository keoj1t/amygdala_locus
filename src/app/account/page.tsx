"use client";

import Link from "next/link";
import { LogOut, User, Shield, KeyRound, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import type { Account } from "@/components/AuthModal";
import { Header } from "@/components/Header";
import { AuthModal } from "@/components/AuthModal";

export default function AccountPage() {
  const [account, setAccount] = useState<Account | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  useEffect(() => {
    try {
      const savedAccount = sessionStorage.getItem("locus_account");
      if (savedAccount) setAccount(JSON.parse(savedAccount));
      const savedTheme = localStorage.getItem("locus_theme") as "light" | "dark" | null;
      if (savedTheme) setTheme(savedTheme);
    } catch {}
  }, []);

  const logout = () => {
    sessionStorage.removeItem("locus_account");
    setAccount(null);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 2000);
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

      <section className="shell account-page pb-12">
        <p className="section-label">Профиль пользователя</p>

        {account ? (
          <div className="max-w-xl">
            <h1>Здравствуйте, {account.name}.</h1>
            <p className="text-sm text-[var(--muted)] mt-1 mb-6">{account.email}</p>

            <div className="account-card p-6 rounded-3xl border border-[var(--line)] bg-[var(--paper)] shadow-sm space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-[var(--line)]">
                <Shield size={18} className="text-[#8b5cf6]" />
                <h2 className="text-base font-bold m-0 text-[var(--ink)]">Безопасность аккаунта</h2>
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-3">
                <label className="block text-xs font-semibold text-[var(--muted)]">
                  Сменить пароль
                </label>
                <div className="flex items-center gap-2 p-2.5 rounded-xl border border-[var(--line)] bg-[var(--soft)]/50">
                  <KeyRound size={16} className="text-[var(--muted)]" />
                  <input
                    type="password"
                    placeholder="Введите новый пароль..."
                    className="w-full bg-transparent border-0 outline-none text-xs text-[var(--ink)]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-[var(--ink)] text-[var(--paper)] text-xs font-semibold hover:opacity-90 transition-opacity"
                >
                  {passwordSaved ? "Пароль обновлён!" : "Сохранить новый пароль"}
                </button>
              </form>

              <div className="pt-3 border-t border-[var(--line)]">
                <button
                  className="logout-button w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
                  onClick={logout}
                >
                  <LogOut size={16} />
                  <span>Выйти из аккаунта</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-saved p-8 rounded-3xl border border-dashed border-[var(--line)] bg-[var(--soft)]/50 text-center max-w-md">
            <User size={28} className="text-[var(--muted)] mx-auto mb-2 opacity-50" />
            <h3 className="text-base font-bold text-[var(--ink)] m-0">Требуется авторизация</h3>
            <p className="text-xs text-[var(--muted)] mt-1 mb-4">
              Войдите в свой аккаунт, чтобы управлять профилем и сохранёнными настройками.
            </p>
            <button
              onClick={() => setIsAuthOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--ink)] text-[var(--paper)] text-xs font-semibold"
            >
              <span>Войти в аккаунт</span>
              <ArrowRight size={14} />
            </button>
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
