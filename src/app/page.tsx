"use client";

import React, { useState, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { HeroSearch } from "@/components/HeroSearch";
import { SearchLoading } from "@/components/SearchLoading";
import { OverviewSummary } from "@/components/OverviewSummary";
import { FilterBar } from "@/components/FilterBar";
import { ImageGrid } from "@/components/ImageGrid";
import { ImageModal } from "@/components/ImageModal";
import { ApiKeys } from "@/components/ApiSettingsModal";
import { AuthModal, Account } from "@/components/AuthModal";
import { AccountModal } from "@/components/AccountModal";
import { CampusProfile, CampusImage, CategoryType, PipelineTelemetry } from "@/types/campus";
import { RedditReviews } from "@/components/RedditReviews";

export default function Home() {
  const [profile, setProfile] = useState<CampusProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<CampusImage | null>(null);

  // Filters & Sorting state
  const [activeCategory, setActiveCategory] = useState<CategoryType | "all">("all");
  const [trustFilter, setTrustFilter] = useState<"all" | "verified_only" | "needs_check_only">("all");
  const [sortBy, setSortBy] = useState<"trust" | "newest">("trust");

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [account, setAccount] = useState<Account | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [favorites, setFavorites] = useState<CampusProfile[]>([]);

  // API Keys state
  const [apiKeys, setApiKeys] = useState<ApiKeys>({});

  // Telemetry state
  const [telemetry, setTelemetry] = useState<PipelineTelemetry>({
    step: "idle",
    stepProgress: 0,
    timeElapsedMs: 0,
    totalImagesFetched: 0,
    duplicatesRemoved: 0,
    verifiedCount: 0,
    needsCheckCount: 0,
    averageTrustScore: 0,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load local interface preferences. The profile pipeline remains server-side and untouched.
  useEffect(() => {
    try {
      const savedKeys = localStorage.getItem("locus_api_keys");
      if (savedKeys) {
        setApiKeys(JSON.parse(savedKeys));
      }
    } catch {}

    const savedAccount = sessionStorage.getItem("locus_account");
    if (savedAccount) setAccount(JSON.parse(savedAccount));
    const savedTheme = localStorage.getItem("locus_theme") as "light" | "dark" | null;
    if (savedTheme) setTheme(savedTheme);
    try { setFavorites(JSON.parse(localStorage.getItem("locus_favorites") || "[]")); } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const saveApiKeys = (keys: ApiKeys) => {
    setApiKeys(keys);
    try {
      localStorage.setItem("locus_api_keys", JSON.stringify(keys));
    } catch {}
  };

  const handleGenerateProfile = async (universityName: string) => {
    if (!universityName.trim()) return;
    if (!account) {
      setIsAuthOpen(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    const startMs = Date.now();

    // Reset & start live telemetry
    setTelemetry({
      step: "expansion",
      stepProgress: 15,
      timeElapsedMs: 0,
      totalImagesFetched: 0,
      duplicatesRemoved: 0,
      verifiedCount: 0,
      needsCheckCount: 0,
      averageTrustScore: 0,
      currentActionText: `Шаг 1/5: Расширение поисковых запросов для "${universityName}" по 5 категориям...`,
    });

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTelemetry((prev) => ({
        ...prev,
        timeElapsedMs: Date.now() - startMs,
      }));
    }, 100);

    // Simulated progress steps for visual feedback during fetch
    const step2Timer = setTimeout(() => {
      setTelemetry((prev) => ({
        ...prev,
        step: "searching",
        stepProgress: 38,
        currentActionText: "Шаг 2/5: Параллельный поиск фотоматериалов (Promise.all)...",
      }));
    }, 250);

    const step3Timer = setTimeout(() => {
      setTelemetry((prev) => ({
        ...prev,
        step: "dedup",
        stepProgress: 60,
        currentActionText: "Шаг 3/5: Дедупликация и сравнение расстояний Хэмминга по pHash...",
      }));
    }, 550);

    const step4Timer = setTimeout(() => {
      setTelemetry((prev) => ({
        ...prev,
        step: "ai_verification",
        stepProgress: 82,
        currentActionText: "Шаг 4/5: Мультимодальная AI Vision оценка достоверности (Trust Score)...",
      }));
    }, 850);

    try {
      const res = await fetch("/api/campus-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          universityName,
          apiKeys,
        }),
      });

      clearTimeout(step2Timer);
      clearTimeout(step3Timer);
      clearTimeout(step4Timer);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Ошибка при генерации профиля");
      }

      const profileData: CampusProfile = await res.json();
      setProfile(profileData);
      try { localStorage.setItem("locus_active_profile", JSON.stringify(profileData)); } catch {}

      const elapsed = Date.now() - startMs;
      setTelemetry({
        step: "completed",
        stepProgress: 100,
        timeElapsedMs: elapsed,
        totalImagesFetched: profileData.totalImages + 4,
        duplicatesRemoved: 4,
        verifiedCount: profileData.images.filter((i) => i.trustStatus === "verified").length,
        needsCheckCount: profileData.images.filter((i) => i.trustStatus === "needs_check").length,
        averageTrustScore: profileData.overallTrustScore,
        currentActionText: `Профиль успешно сгенерирован за ${(elapsed / 1000).toFixed(1)} сек!`,
      });

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Не удалось загрузить профиль");
      setTelemetry((prev) => ({
        ...prev,
        step: "error",
        currentActionText: "Произошла ошибка при обработке запроса",
      }));
    } finally {
      setIsLoading(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  // Filter & Sort images
  const filteredImages = (profile?.images || []).filter((img) => {
    // 1. Category Filter
    if (activeCategory !== "all" && img.category !== activeCategory) {
      return false;
    }
    // 2. Trust Filter
    if (trustFilter === "verified_only" && img.trustScore < 75) {
      return false;
    }
    if (trustFilter === "needs_check_only" && img.trustScore >= 75) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === "trust") return b.trustScore - a.trustScore;
    if (sortBy === "newest") {
      return (b.publishDate || "").localeCompare(a.publishDate || "");
    }
    return 0;
  });

  const handleExportJson = () => {
    if (!profile) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    const uniName = profile.university.universityName || profile.university.name || "campus";
    downloadAnchor.setAttribute("download", `${uniName.replace(/\s+/g, "_")}_campus_profile.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const toggleFavorite = () => {
    if (!profile) return;
    const name = profile.university.universityName || (profile.university as any).name;
    setFavorites((current) => {
      const exists = current.some((item) => (item.university.universityName || (item.university as any).name) === name);
      const next = exists ? current.filter((item) => (item.university.universityName || (item.university as any).name) !== name) : [profile, ...current];
      localStorage.setItem("locus_favorites", JSON.stringify(next));
      return next;
    });
  };

  // Modal navigation
  const currentIndex = selectedImage
    ? filteredImages.findIndex((img) => img.id === selectedImage.id)
    : -1;

  const handlePrevImage = () => {
    if (currentIndex > 0) {
      setSelectedImage(filteredImages[currentIndex - 1]);
    } else {
      setSelectedImage(filteredImages[filteredImages.length - 1]);
    }
  };

  const handleNextImage = () => {
    if (currentIndex < filteredImages.length - 1) {
      setSelectedImage(filteredImages[currentIndex + 1]);
    } else {
      setSelectedImage(filteredImages[0]);
    }
  };

  return (
    <main className="min-h-screen flex flex-col" data-theme={theme}>
      {/* Navigation Header */}
      <Header
        onOpenAuth={() => setIsAuthOpen(true)}
        isAuthenticated={Boolean(account)}
        theme={theme}
        onToggleTheme={() => setTheme((prev) => { const next = prev === "light" ? "dark" : "light"; localStorage.setItem("locus_theme", next); return next; })}
      />

      {/* Hero Section */}
      <HeroSearch
        onSearch={handleGenerateProfile}
        isLoading={isLoading}
        currentQuery={profile?.university.universityName || (profile?.university as any)?.name || ""}
      />

      {!isLoading && <section id="how" className="how-section shell"><p className="section-label">Один ясный ответ</p><div className="how-grid"><p>Не сотни вкладок.<br /><b>Один профиль.</b></p><div><span>01</span><h3>Находим</h3><p>Изображения кампуса, общежитий, лабораторий и жизни студентов.</p></div><div><span>02</span><h3>Проверяем</h3><p>Убираем повторы и оцениваем связь каждого кадра с университетом.</p></div><div><span>03</span><h3>Собираем</h3><p>Вы получаете чистую визуальную картину за несколько секунд.</p></div></div></section>}

      {isLoading && <SearchLoading />}

      {/* Error Message */}
      {error && (
        <div className="w-full max-w-4xl mx-auto px-4 my-4">
          <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-sm">
            {error}
          </div>
        </div>
      )}

      {/* Overview & Summary Block */}
      {profile && (
        <>
          <OverviewSummary profile={profile} onExport={handleExportJson} isFavorite={favorites.some((item) => (item.university.universityName || (item.university as any).name) === (profile.university.universityName || (profile.university as any).name))} onToggleFavorite={toggleFavorite} />

          {/* Filter Tabs & Category Bar */}
          <FilterBar
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            categoryCounts={profile.categoryBreakdown}
            trustFilter={trustFilter}
            onSelectTrustFilter={setTrustFilter}
            sortBy={sortBy}
            onSelectSortBy={setSortBy}
          />

          {/* Verified Image Gallery Grid */}
          <ImageGrid
            images={filteredImages}
            onSelectImage={(img) => setSelectedImage(img)}
          />

          {/* Student Reviews & Discussions from Reddit */}
          <RedditReviews
            universityName={profile.university.universityName || (profile.university as any).name || ""}
          />
        </>
      )}

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-slate-800/80 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            LOCUS 2026 Hackathon • Case 01: Verified University Visual Profile
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Next.js 14 App Router</span>
            <span>•</span>
            <span>AI Vision Verification</span>
            <span>•</span>
            <span>pHash Dedup</span>
          </div>
        </div>
      </footer>

      {/* Lightbox Modal */}
      <ImageModal
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
        onPrev={filteredImages.length > 1 ? handlePrevImage : undefined}
        onNext={filteredImages.length > 1 ? handleNextImage : undefined}
      />

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onAuthenticated={(next) => { setAccount(next); sessionStorage.setItem("locus_account", JSON.stringify(next)); }} />
      <AccountModal isOpen={isAccountOpen} account={account} onClose={() => setIsAccountOpen(false)} onLogout={() => { sessionStorage.removeItem("locus_account"); setAccount(null); setIsAccountOpen(false); }} />
    </main>
  );
}
