"use client";

import React, { useState } from "react";
import { ArrowRight, Eye, EyeOff, Lock, Mail, User, X } from "lucide-react";

export type Account = { name: string; email: string };

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: (account: Account) => void;
}

export const AuthModal = ({ isOpen, onClose, onAuthenticated }: AuthModalProps) => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (mode === "register" && !name.trim())) return;
    
    const accountName = mode === "register" ? name.trim() : (email.split("@")[0] || "Пользователь");
    onAuthenticated({ name: accountName, email: email.trim() });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div 
        className="auth-modal" 
        role="dialog" 
        aria-modal="true" 
        aria-label={mode === "login" ? "Вход в систему" : "Регистрация"}
      >
        <button 
          className="modal-close" 
          onClick={onClose} 
          aria-label="Закрыть окно"
          type="button"
        >
          <X size={18} />
        </button>

        <div className="auth-content">
          {/* Brand & Subtitle */}
          <div className="auth-header">
            <div className="brand-mark">L</div>
            <div>
              <p className="auth-kicker">{mode === "login" ? "С возвращением" : "Новый профиль"}</p>
              <h2 className="auth-title">{mode === "login" ? "Войдите в Locus" : "Создайте аккаунт"}</h2>
              <p className="auth-subtitle">
                {mode === "login"
                  ? "Доступ к избранным университетам, заметкам и отзывам"
                  : "Сохраняйте кампусы, сравнивайте ВУЗы и общайтесь с AI"}
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab-btn ${mode === "login" ? "active" : ""}`}
              onClick={() => setMode("login")}
            >
              Вход
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${mode === "register" ? "active" : ""}`}
              onClick={() => setMode("register")}
            >
              Регистрация
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form-fields">
            {mode === "register" && (
              <div className="input-group">
                <label htmlFor="auth-name">Имя</label>
                <div className="input-wrapper">
                  <User size={16} className="input-icon" />
                  <input
                    id="auth-name"
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Как к вам обращаться"
                    required
                  />
                </div>
              </div>
            )}

            <div className="input-group">
              <label htmlFor="auth-email">Email</label>
              <div className="input-wrapper">
                <Mail size={16} className="input-icon" />
                <input
                  id="auth-email"
                  autoFocus={mode === "login"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="auth-password">Пароль</label>
              <div className="input-wrapper">
                <Lock size={16} className="input-icon" />
                <input
                  id="auth-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="Минимум 8 символов"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="form-primary auth-submit-btn">
              <span>{mode === "login" ? "Войти в аккаунт" : "Зарегистрироваться"}</span>
              <ArrowRight size={17} />
            </button>
          </form>

          {/* Footer switch */}
          <div className="auth-footer">
            <p className="auth-switch">
              {mode === "login" ? "Впервые здесь?" : "Уже есть аккаунт?"}{" "}
              <button 
                type="button"
                onClick={() => setMode(mode === "login" ? "register" : "login")}
                className="auth-switch-link"
              >
                {mode === "login" ? "Создать аккаунт" : "Войти"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
