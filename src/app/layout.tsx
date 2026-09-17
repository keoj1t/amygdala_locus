import type { Metadata } from "next";
import "./globals.css";
import { AiAssistantPanel } from "@/components/AiAssistantPanel";

export const metadata: Metadata = {
  title: "LOCUS 2026 | Verified University Visual Profile Generator",
  description: "Создание проверенного визуального профиля университета за 30 секунд. AI-верификация фотоматериалов, кампусы, общежития, лаборатории и оценка доверия (Trust Score).",
  keywords: ["LOCUS 2026", "University Campus", "AI Verification", "Trust Score", "Nazarbayev University", "Astana IT University", "Satbayev University"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head><script dangerouslySetInnerHTML={{ __html: "try{document.documentElement.dataset.theme=localStorage.getItem('locus_theme')||'light'}catch(e){}" }} /></head>
      <body className="min-h-screen antialiased">{children}<AiAssistantPanel /></body>
    </html>
  );
}
