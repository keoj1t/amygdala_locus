"use client";
import Link from "next/link";
import React from "react";
import { ArrowUpRight, CircleUserRound, Heart, Moon, Sun } from "lucide-react";
interface HeaderProps { onOpenAuth: () => void; isAuthenticated: boolean; theme: "light" | "dark"; onToggleTheme: () => void; }
export const Header: React.FC<HeaderProps> = ({ onOpenAuth, isAuthenticated, theme, onToggleTheme }) => <header className="site-header"><div className="shell nav-inner"><Link href="/" className="brand"><span className="brand-mark">L</span><span>locus</span></Link><nav className="nav-links"><Link href="/#how">Как это работает</Link><Link href="/compare">Сравнить</Link><Link href="/favorites">Избранное</Link></nav><div className="nav-actions"><button className="icon-button" onClick={onToggleTheme} aria-label="Сменить тему">{theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}</button>{isAuthenticated ? <Link className="account-button" href="/account"><CircleUserRound size={17} /> Кабинет</Link> : <button className="account-button" onClick={onOpenAuth}>Войти <ArrowUpRight size={16} /></button>}</div></div></header>;
