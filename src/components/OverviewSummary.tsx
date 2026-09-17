"use client";
import React from "react";
import { Download, ExternalLink, Heart, MapPin, Plus } from "lucide-react";
import { CampusProfile } from "@/types/campus";

export const OverviewSummary = ({ profile, onExport, isFavorite, onToggleFavorite }: { profile: CampusProfile; onExport: () => void; isFavorite: boolean; onToggleFavorite: () => void }) => {
  const name = profile.university.universityName || (profile.university as any).name;
  const cover = profile.images[0];
  return <section className="profile-intro shell">
    <div className="profile-copy"><p className="section-label">Визуальный профиль</p><div className="profile-title"><h2>{name}</h2><button className={isFavorite ? "favorite-button active" : "favorite-button"} onClick={onToggleFavorite}><Heart size={17} fill={isFavorite ? "currentColor" : "none"}/>{isFavorite ? "В избранном" : "В избранное"}</button></div><p className="search-time">Поиск и проверка: {(profile.executionTimeMs / 1000).toFixed(1)} сек.</p><div className="profile-place"><MapPin size={15} />{profile.university.city}, {profile.university.country}</div>
      <details className="more-data"><summary><Plus size={15} />Доп. данные</summary><div><p>{profile.summary}</p>{profile.keyHighlights?.length > 0 && <ul>{profile.keyHighlights.map((item, i) => <li key={i}>{item}</li>)}</ul>}<button onClick={onExport}><Download size={14} />Скачать JSON</button></div></details>
    </div>
    {cover && <button className="profile-cover" onClick={() => document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" })}><img src={cover.url} alt={cover.title} /><span>{profile.totalImages} фото <ExternalLink size={14} /></span></button>}
  </section>;
};
