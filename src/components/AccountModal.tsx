"use client";

import React, { useState } from "react";
import { KeyRound, LogOut, Mail, User, X, Check } from "lucide-react";
import type { Account } from "./AuthModal";

interface AccountModalProps {
  isOpen: boolean;
  account: Account | null;
  onClose: () => void;
  onLogout: () => void;
}

export const AccountModal = ({ isOpen, account, onClose, onLogout }: AccountModalProps) => {
  const [newPassword, setNewPassword] = useState("");
  const [saved, setSaved] = useState(false);

  if (!isOpen || !account) return null;

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length >= 8) {
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        setNewPassword("");
      }, 2500);
    }
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="auth-modal" role="dialog" aria-modal="true" aria-label="Личный кабинет">
        <button className="modal-close" onClick={onClose} aria-label="Закрыть окно" type="button">
          <X size={18} />
        </button>

        <div className="auth-content">
          <div className="auth-header">
            <div className="brand-mark">{account.name.charAt(0).toUpperCase()}</div>
            <div>
              <p className="auth-kicker">Профиль пользователя</p>
              <h2 className="auth-title">{account.name}</h2>
              <p className="auth-subtitle flex items-center gap-1.5 mt-0.5">
                <Mail size={13} className="text-[var(--muted)]" />
                <span>{account.email}</span>
              </p>
            </div>
          </div>

          <div className="account-divider my-4 border-t border-[var(--line)]" />

          {/* Change Password */}
          <form onSubmit={handleUpdatePassword} className="auth-form-fields">
            <div className="input-group">
              <label htmlFor="acc-new-password">Сменить пароль</label>
              <div className="input-wrapper">
                <KeyRound size={16} className="input-icon" />
                <input
                  id="acc-new-password"
                  type="password"
                  placeholder="Новый пароль (от 8 символов)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={8}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={newPassword.length < 8}
              className={`form-primary auth-submit-btn ${saved ? "!bg-emerald-600 !text-white" : ""}`}
            >
              {saved ? (
                <>
                  <Check size={16} />
                  <span>Пароль успешно обновлён</span>
                </>
              ) : (
                <>
                  <KeyRound size={16} />
                  <span>Обновить пароль</span>
                </>
              )}
            </button>
          </form>

          <div className="auth-footer mt-5 pt-4 border-t border-[var(--line)]">
            <button
              type="button"
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors font-semibold text-sm border border-rose-500/20"
            >
              <LogOut size={16} />
              <span>Выйти из аккаунта</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
