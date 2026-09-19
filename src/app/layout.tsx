import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AiAssistantPanel } from "@/components/AiAssistantPanel";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f7f5" },
    { media: "(prefers-color-scheme: dark)", color: "#111110" },
  ],
};

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
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <script
          dangerouslySetInnerHTML={{
            __html: "try{document.documentElement.dataset.theme=localStorage.getItem('locus_theme')||'light'}catch(e){}",
          }}
        />
      </head>
      <body className="min-h-screen antialiased">
        {children}
        <AiAssistantPanel />
      </body>
    </html>
  );
}
