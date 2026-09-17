"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, 
  AlertCircle, 
  ExternalLink, 
  Calendar, 
  Eye, 
  Building, 
  BedDouble, 
  FlaskConical, 
  Trophy, 
  MapPin, 
  Users,
  Info
} from "lucide-react";
import { CampusImage, CategoryType } from "@/types/campus";

interface ImageGridProps {
  images: CampusImage[];
  onSelectImage: (image: CampusImage) => void;
}

const CATEGORY_NAMES: Record<CategoryType, { name: string; icon: any }> = {
  campus: { name: "Кампус & Здания", icon: Building },
  dorm: { name: "Общежитие", icon: BedDouble },
  lab: { name: "Лаборатория", icon: FlaskConical },
  sport: { name: "Спорт", icon: Trophy },
  city: { name: "Город & Окружение", icon: MapPin },
  student_life: { name: "Студенческая жизнь", icon: Users },
};

export const ImageGrid: React.FC<ImageGridProps> = ({ images, onSelectImage }) => {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  if (images.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 my-12 text-center py-16 rounded-3xl glass-panel border border-slate-800">
        <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-300">Нет изображений по выбранному фильтру</h3>
        <p className="text-sm text-slate-400 mt-1">Попробуйте выбрать другую категорию или сбросить фильтр достоверности.</p>
      </div>
    );
  }

  return (
    <div id="gallery" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <div key={images.map((image) => image.id).join("-")} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 gallery-transition">
        {images.map((img) => {
          const categoryMeta = CATEGORY_NAMES[img.category] || {
            name: img.category,
            icon: Building,
          };
          const CatIcon = categoryMeta.icon;
          const isVerified = img.trustScore >= 80;
          const isNeedsCheck = img.trustScore >= 50 && img.trustScore < 80;
          const isLow = img.trustScore < 50;
          const hasError = imageErrors[img.id];

          // Prefer the search thumbnail. If a source blocks hotlinking, never replace it
          // with an unrelated stock photo: show an explicit unavailable state instead.
          const displayUrl = img.thumbnailUrl || img.url;

          return (
            <div
              key={img.id}
              className="glass-panel glass-panel-hover rounded-3xl overflow-hidden border border-slate-800/80 flex flex-col group relative"
            >
              {/* Image Preview Container */}
              <div 
                className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900 cursor-pointer"
                onClick={() => onSelectImage(img)}
              >
                {hasError ? (
                  <div className="image-unavailable"><CatIcon className="w-7 h-7" /><span>Фото недоступно<br />у источника</span></div>
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={displayUrl}
                    alt={img.title}
                    loading="lazy"
                    onError={() => handleImageError(img.id)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                )}

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Top Category Badge */}
                <div className="image-category-badge">
                  <CatIcon className="w-3.5 h-3.5" />
                  <span>{categoryMeta.name}</span>
                </div>

                {/* Trust Score Badge */}
                <div className="absolute top-3 right-3">
                  {isVerified && (
                    <div className="image-trust-badge">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{img.trustScore}% Проверено</span>
                    </div>
                  )}
                  {isNeedsCheck && (
                    <div className="image-trust-badge">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{img.trustScore}% Требует проверки</span>
                    </div>
                  )}
                  {isLow && (
                    <div className="image-trust-badge">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{img.trustScore}% Неподтверждено</span>
                    </div>
                  )}
                </div>

                {/* Hover Eye Trigger */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/30">
                  <div className="image-preview-button">
                    <Eye className="w-4 h-4" />
                    <span>Посмотреть детали</span>
                  </div>
                </div>
              </div>

              {/* Card Meta & Source Details */}
              <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3 bg-slate-950/40">
                <div>
                  <h4 
                    onClick={() => onSelectImage(img)}
                    className="font-bold text-sm sm:text-base text-slate-100 group-hover:text-cyan-300 transition-colors cursor-pointer line-clamp-2"
                  >
                    {img.title}
                  </h4>

                  {/* AI Reasoning Pill */}
                  {img.aiReasoning && (
                    <div className="mt-2.5 p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
                      <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{img.aiReasoning}</span>
                    </div>
                  )}
                </div>

                {/* Footer Source Attribution & Date */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  {/* Source Link */}
                  <a
                    href={img.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 text-indigo-400 hover:text-cyan-300 font-medium transition-colors group/link truncate max-w-[180px]"
                    title={img.sourceUrl}
                  >
                    <span className="truncate">{img.sourceDomain || "source"}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0 group-hover/link:translate-x-0.5 transition-transform" />
                  </a>

                  {/* Date */}
                  {img.publishDate && (
                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Calendar className="w-3 h-3" />
                      <span>{img.publishDate}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
