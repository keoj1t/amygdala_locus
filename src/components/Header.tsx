"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import {
  ArrowUpRight,
  CircleUserRound,
  Compass,
  Heart,
  Menu,
  Moon,
  Scale,
  Search,
  Sparkles,
  Sun,
  User,
  X,
} from "lucide-react";

interface HeaderProps {
  onOpenAuth: () => void;
  isAuthenticated: boolean;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAuth,
  isAuthenticated,
  theme,
  onToggleTheme,
}) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top Header */}
      <header className="site-header">
        <div className="shell nav-inner">
          <Link href="/" className="brand">
            <span className="brand-mark">L</span>
            <span>locus</span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="nav-links">
            <Link
              href="/#how"
              className={pathname === "/#how" ? "active" : ""}
            >
              Как это работает
            </Link>
            <Link
              href="/compare"
              className={pathname === "/compare" ? "active font-bold text-[var(--ink)]" : ""}
            >
              Сравнить
            </Link>
            <Link
              href="/favorites"
              className={pathname === "/favorites" ? "active font-bold text-[var(--ink)]" : ""}
            >
              Избранное
            </Link>
          </nav>

          {/* Actions: Theme Toggle + Auth / Profile */}
          <div className="nav-actions">
            <button
              className="icon-button"
              onClick={onToggleTheme}
              aria-label="Сменить тему"
              title="Переключить тему оформления"
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {isAuthenticated ? (
              <Link className="account-button" href="/account">
                <CircleUserRound size={17} />
                <span className="hidden sm:inline">Кабинет</span>
              </Link>
            ) : (
              <button className="account-button" onClick={onOpenAuth}>
                <span>Войти</span>
                <ArrowUpRight size={16} />
              </button>
            )}

            {/* Mobile menu toggle button */}
            <button
              className="icon-button sm:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Меню"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t border-[var(--line)] bg-[var(--paper)]/95 backdrop-blur-xl p-4 shadow-xl animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-2xl transition-colors ${
                  pathname === "/" ? "bg-[var(--soft)] font-semibold text-[var(--ink)]" : "text-[var(--muted)]"
                }`}
              >
                <Search size={18} />
                <span>Поиск ВУЗов</span>
              </Link>
              <Link
                href="/compare"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-2xl transition-colors ${
                  pathname === "/compare" ? "bg-[var(--soft)] font-semibold text-[var(--ink)]" : "text-[var(--muted)]"
                }`}
              >
                <Scale size={18} />
                <span>Сравнение кампусов</span>
              </Link>
              <Link
                href="/favorites"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-2xl transition-colors ${
                  pathname === "/favorites" ? "bg-[var(--soft)] font-semibold text-[var(--ink)]" : "text-[var(--muted)]"
                }`}
              >
                <Heart size={18} />
                <span>Избранные ВУЗы</span>
              </Link>
              <Link
                href="/#how"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-2xl text-[var(--muted)]"
              >
                <Compass size={18} />
                <span>Как это работает</span>
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation Bar (iOS / Android Bottom Nav) */}
      <nav className="mobile-bottom-bar sm:hidden" aria-label="Мобильная навигация">
        <Link
          href="/"
          className={`mobile-nav-item ${pathname === "/" ? "active" : ""}`}
        >
          <Search size={19} />
          <span>Поиск</span>
        </Link>
        <Link
          href="/compare"
          className={`mobile-nav-item ${pathname === "/compare" ? "active" : ""}`}
        >
          <Scale size={19} />
          <span>Сравнить</span>
        </Link>
        <Link
          href="/favorites"
          className={`mobile-nav-item ${pathname === "/favorites" ? "active" : ""}`}
        >
          <Heart size={19} />
          <span>Избранное</span>
        </Link>
        {isAuthenticated ? (
          <Link
            href="/account"
            className={`mobile-nav-item ${pathname === "/account" ? "active" : ""}`}
          >
            <User size={19} />
            <span>Кабинет</span>
          </Link>
        ) : (
          <button
            onClick={onOpenAuth}
            className="mobile-nav-item"
            type="button"
          >
            <CircleUserRound size={19} />
            <span>Вход</span>
          </button>
        )}
      </nav>
    </>
  );
};
