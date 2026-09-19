"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, MessageCircle, Plus, Send, X, Bot } from "lucide-react";

type Msg = { role: "user" | "assistant"; text: string };
type Chat = { id: string; title: string; messages: Msg[] };

const welcome = (name: string): Chat => ({
  id: crypto.randomUUID(),
  title: "Новый разговор",
  messages: [
    {
      role: "assistant",
      text: `Привет, ${name}! Я ваш AI-консультант по университетам и кампусам. Задайте любой вопрос об общежитиях, поступлении, стоимости жизни или факультетах.`,
    },
  ],
});

const Markup = ({ text }: { text: string }) => (
  <>
    {text.split("\n").map((line, i) => {
      const parts = line
        .replace(/^###\s*/, "")
        .split(/(\*\*[^*]+\*\*)/g)
        .map((x, j) => {
          if (x.startsWith("**") && x.endsWith("**")) {
            return <strong key={j} className="font-semibold text-[var(--ink)]">{x.slice(2, -2)}</strong>;
          }
          return x;
        });

      return line.startsWith("###") ? (
        <h3 key={i} className="text-sm font-bold my-1.5">{parts}</h3>
      ) : (
        <p className={line.startsWith("- ") ? "chat-bullet" : "my-0.5"} key={i}>
          {parts.length ? parts : "\u00A0"}
        </p>
      );
    })}
  </>
);

export const AiAssistantPanel = () => {
  const [open, setOpen] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [draft, setDraft] = useState<Chat | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const [history, setHistory] = useState(false);
  const [value, setValue] = useState("");
  const [name, setName] = useState("друг");
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const user = JSON.parse(sessionStorage.getItem("locus_account") || "{}");
      const saved = (JSON.parse(localStorage.getItem("locus_ai_chats") || "[]") as Chat[]).filter((c) =>
        c.messages.some((m) => m.role === "user")
      );
      setName(user.name || "друг");
      setChats(saved);
    } catch {}
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => ref.current?.focus(), 220);
  }, [open]);

  const persist = (next: Chat[]) => {
    setChats(next);
    try {
      localStorage.setItem("locus_ai_chats", JSON.stringify(next));
    } catch {}
  };

  const current = active ? chats.find((c) => c.id === active) || draft : draft;

  const start = () => {
    const next = welcome(name);
    setDraft(next);
    setActive(null);
    setHistory(false);
  };

  const toggle = () => {
    if (!open && !current) start();
    setOpen(!open);
    setHistory(false);
  };

  const send = async () => {
    if (!value.trim() || loading || !current) return;
    const question = value.trim();
    setValue("");
    const userMsg: Msg = { role: "user", text: question };
    const base: Chat = {
      ...current,
      title: current.title === "Новый разговор" ? question.slice(0, 34) : current.title,
      messages: [...current.messages, userMsg],
    };
    const saved = current.id === active ? chats.map((c) => (c.id === active ? base : c)) : [base, ...chats];
    persist(saved);
    setDraft(null);
    setActive(base.id);
    setLoading(true);

    try {
      const profile = JSON.parse(localStorage.getItem("locus_active_profile") || "null");
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: base.messages, profile }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "AI временно недоступен.");
      persist(
        saved.map((c) =>
          c.id === base.id ? { ...c, messages: [...c.messages, { role: "assistant", text: data.answer }] } : c
        )
      );
    } catch (error: any) {
      persist(
        saved.map((c) =>
          c.id === base.id
            ? {
                ...c,
                messages: [
                  ...c.messages,
                  { role: "assistant", text: `Не удалось получить ответ: ${error.message || "попробуйте ещё раз"}` },
                ],
              }
            : c
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Tab / Mobile Bubble */}
      <button
        className={open ? "ai-tab open" : "ai-tab"}
        onClick={toggle}
        aria-label="Открыть AI-помощник"
      >
        <div className="flex items-center justify-center">
          {open ? <ChevronRight size={19} className="hidden sm:inline" /> : <ChevronLeft size={19} className="hidden sm:inline" />}
          <MessageCircle size={18} />
        </div>
      </button>

      {/* Drawer / Mobile Fullsheet Panel */}
      <aside className={open ? "ai-panel open" : "ai-panel"}>
        <div className="ai-head">
          <div>
            <small className="text-[10px] font-bold tracking-wider uppercase text-[var(--muted)]">AI Ассистент</small>
            <h2 className="text-lg sm:text-xl font-bold text-[var(--ink)] m-0">Привет, {name}</h2>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={start}
              title="Новый диалог"
              className="p-1.5 rounded-full hover:bg-[var(--soft)] text-[var(--ink)]"
            >
              <Plus size={18} />
            </button>
            <button
              onClick={toggle}
              title="Закрыть"
              className="p-1.5 rounded-full hover:bg-[var(--soft)] text-[var(--ink)]"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {history ? (
          <div className="ai-history p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <b className="text-sm font-semibold">История диалогов</b>
              <button
                onClick={start}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--ink)] text-[var(--paper)] text-xs font-semibold"
              >
                <Plus size={14} />
                <span>Новый чат</span>
              </button>
            </div>
            {chats.map((c) => (
              <button
                key={c.id}
                className={`w-full p-3 rounded-xl text-left transition-colors mb-1.5 ${
                  c.id === active ? "bg-[var(--soft)] font-semibold" : "hover:bg-[var(--soft)]/60"
                }`}
                onClick={() => {
                  setActive(c.id);
                  setDraft(null);
                  setHistory(false);
                }}
              >
                <div className="text-xs truncate text-[var(--ink)]">{c.title}</div>
                <small className="text-[10px] text-[var(--muted)]">
                  {c.messages.filter((m) => m.role === "user").length} сообщений
                </small>
              </button>
            ))}
          </div>
        ) : (
          <>
            <div className="ai-messages">
              {current?.messages.map((m, i) => (
                <div key={i} className={m.role}>
                  <Markup text={m.text} />
                </div>
              ))}
              {loading && (
                <div className="assistant ai-thinking flex gap-1 items-center p-3">
                  <span className="w-2 h-2 rounded-full bg-[var(--ink)] animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-[var(--ink)] animate-bounce [animation-delay:0.15s]" />
                  <span className="w-2 h-2 rounded-full bg-[var(--ink)] animate-bounce [animation-delay:0.3s]" />
                </div>
              )}
            </div>

            <form
              className="ai-input"
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
            >
              <button
                type="button"
                onClick={() => setHistory(true)}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg text-[var(--muted)] hover:text-[var(--ink)]"
              >
                История
              </button>
              <input
                ref={ref}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Спросите о кампусе или общежитии..."
              />
              <button
                type="submit"
                disabled={!value.trim() || loading}
                className="p-2 rounded-xl bg-[var(--ink)] text-[var(--paper)] disabled:opacity-40"
              >
                <Send size={15} />
              </button>
            </form>
          </>
        )}
      </aside>
    </>
  );
};
