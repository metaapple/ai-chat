import axios from "axios";

// json-server 호환:
// 로컬에서 `npx json-server public/db.json --port 4000` 실행 후
// .env 에 VITE_API_URL=http://localhost:4000 설정 시 자동 라우팅됩니다.
const baseURL = (import.meta.env.VITE_API_URL as string) || "";

export const api = axios.create({
  baseURL,
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

export interface FAQ {
  id: number;
  category: string;
  question: string;
  answer: string;
  keywords: string[];
  views: number;
}
export interface CategoryStat { name: string; value: number; color: string }
export interface DailyVolume { date: string; ai: number; human: number }
export interface ResponseTime { hour: string; seconds: number }
export interface Metrics {
  satisfaction: number;
  automationRate: number;
  totalToday: number;
  avgResponseSec: number;
  activeAgents: number;
  ragAccuracy: number;
}

export interface ConsultationData {
  faqs: FAQ[];
  categories: CategoryStat[];
  dailyVolume: DailyVolume[];
  responseTimes: ResponseTime[];
  metrics: Metrics;
}

export async function fetchConsultationData(): Promise<ConsultationData> {
  if (baseURL) {
    const [faqs, categories, dailyVolume, responseTimes, metrics] = await Promise.all([
      api.get<FAQ[]>("/faqs"),
      api.get<CategoryStat[]>("/categories"),
      api.get<DailyVolume[]>("/dailyVolume"),
      api.get<ResponseTime[]>("/responseTimes"),
      api.get<Metrics>("/metrics"),
    ]);
    return {
      faqs: faqs.data,
      categories: categories.data,
      dailyVolume: dailyVolume.data,
      responseTimes: responseTimes.data,
      metrics: metrics.data,
    };
  }
  const { data } = await api.get<ConsultationData>("/db.json");
  return data;
}
