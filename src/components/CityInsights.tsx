"use client";

import React from "react";
import { 
  Building2, 
  BedDouble, 
  Wallet, 
  Bus, 
  CheckCircle, 
  Footprints, 
  MapPin
} from "lucide-react";
import { UniversityMetrics } from "@/types/campus";

interface CityInsightsProps {
  meta?: UniversityMetrics;
  isLoading?: boolean;
}

export const CityInsights: React.FC<CityInsightsProps> = ({ meta, isLoading }) => {
  if (isLoading || !meta) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 animate-pulse">
          <div className="h-6 w-64 bg-slate-800 rounded-lg mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-48 bg-slate-900/80 rounded-2xl border border-slate-800" />
            <div className="h-48 bg-slate-900/80 rounded-2xl border border-slate-800" />
            <div className="h-48 bg-slate-900/80 rounded-2xl border border-slate-800" />
          </div>
        </div>
      </div>
    );
  }

  const dormitory = meta.dormitory || {
    guaranteeFirstYear: meta.dormitoryInfo?.guaranteedForFreshmen ?? true,
    priceRange: meta.dormitoryInfo?.averageMonthlyCostKZT ? `${meta.dormitoryInfo.averageMonthlyCostKZT} ₸ / мес` : "$100-$300 / mo",
    distanceToCampus: meta.dormitoryInfo?.distanceToCampus || "В шаговой доступности",
    roomTypes: meta.dormitoryInfo?.roomTypes || ["1-местные", "2-местные"],
  };

  const costOfLiving = meta.costOfLiving || {
    priceIndex: (meta.livingCostInfo?.overallCostIndex as any) || 'Moderate',
    averageMealPrice: meta.livingCostInfo?.avgMealPrice ? `${meta.livingCostInfo.avgMealPrice} ${meta.livingCostInfo.currency || 'USD'}` : "$5-$10",
    publicTransportTicket: meta.livingCostInfo?.publicTransportCost ? `${meta.livingCostInfo.publicTransportCost} ${meta.livingCostInfo.currency || 'USD'}` : "$1-$2",
    rentNearCampus: meta.livingCostInfo?.dormPriceRange || "$300-$700 / mo",
  };

  const transportAndLocation = meta.transportAndLocation || {
    walkScore: meta.transitInfo?.walkabilityScore || 85,
    routesAndStops: meta.transitInfo?.closestMetroOrBus || "Автобусные маршруты и станции в шаговой доступности",
    timeToAirportOrStation: meta.transitInfo?.airportTransitTime || "20-30 мин на общественном транспорте",
  };

  const city = meta.city || "Город";
  const country = meta.country || "Страна";
  const currency = meta.currency || meta.livingCostInfo?.currency || "USD";

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Инфраструктура, Общежития и Город: {city} ({country})
              </h3>
              <p className="text-xs text-slate-400">
                Ориентировочная стоимость проживания и студенческий быт в локальной валюте ({currency})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900/90 border border-slate-700 text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span>{city}, {country}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Dormitory Info */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-400">
                <BedDouble className="w-5 h-5" />
                <h4 className="font-bold text-sm text-white">Студенческие Общежития</h4>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
                Dormitory
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Гарантия для 1 курса:</span>
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {dormitory.guaranteeFirstYear ? "Предоставляется" : "По запросу / конкурсу"}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Стоимость общежития:</span>
                <span className="font-semibold text-white font-mono">{dormitory.priceRange}</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Расстояние до кампуса:</span>
                <span className="text-slate-200">{dormitory.distanceToCampus}</span>
              </div>

              {dormitory.roomTypes && dormitory.roomTypes.length > 0 && (
                <div>
                  <span className="text-slate-400 block mb-1.5">Типы комнат:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {dormitory.roomTypes.map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-lg bg-slate-800 text-[11px] text-slate-300 border border-slate-700/50">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Cost of Living */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400">
                <Wallet className="w-5 h-5" />
                <h4 className="font-bold text-sm text-white">Стоимость Жизни ({currency})</h4>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                {costOfLiving.priceIndex} Index
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Средний чек (Обед / Mensa):</span>
                <span className="font-semibold text-white font-mono">{costOfLiving.averageMealPrice}</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Студенческий транспорт:</span>
                <span className="font-semibold text-white font-mono">{costOfLiving.publicTransportTicket}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Аренда жилья рядом:</span>
                <span className="text-slate-200 font-mono text-[11px]">{costOfLiving.rentNearCampus}</span>
              </div>
            </div>
          </div>

          {/* Card 3: Transit & Transport */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-400">
                <Bus className="w-5 h-5" />
                <h4 className="font-bold text-sm text-white">Транспорт и Доступность</h4>
              </div>
              <div className="flex items-center gap-1 text-cyan-300 font-bold text-xs font-mono">
                <Footprints className="w-3.5 h-3.5 text-cyan-400" />
                <span>{transportAndLocation.walkScore} / 100</span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div>
                <span className="text-slate-400 block mb-1">Маршруты, метро и остановки:</span>
                <p className="text-slate-200 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 text-[11px] leading-relaxed">
                  {transportAndLocation.routesAndStops}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-400">До аэропорта / вокзала:</span>
                <span className="text-slate-200 font-semibold">{transportAndLocation.timeToAirportOrStation}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
