// Pinia 스타일의 store. (React 환경에서는 zustand로 매핑하지만,
// 역할은 동일합니다: 상태 + axios 호출 + 셀렉터)
import { create } from "zustand";
import { fetchConsultationData, type ConsultationData, type FAQ } from "@/lib/api";

interface State extends Partial<ConsultationData> {
  loading: boolean;
  error: string | null;
  load: () => Promise<void>;
  searchFAQ: (query: string) => FAQ[];
  ragAnswer: (query: string) => { faq: FAQ | null; confidence: number };
}

export const useConsultationStore = create<State>((set, get) => ({
  loading: false,
  error: null,

  load: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchConsultationData();
      set({ ...data, loading: false });
    } catch (e) {
      set({ loading: false, error: e instanceof Error ? e.message : "load failed" });
    }
  },

  searchFAQ: (query) => {
    const faqs = get().faqs ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return faqs
      .map((f) => {
        const hay = (f.question + " " + f.answer + " " + f.keywords.join(" ")).toLowerCase();
        let score = 0;
        for (const token of q.split(/\s+/)) {
          if (!token) continue;
          if (hay.includes(token)) score += 2;
          if (f.keywords.some((k) => k.toLowerCase().includes(token))) score += 3;
        }
        return { f, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.f);
  },

  ragAnswer: (query) => {
    const matches = get().searchFAQ(query);
    if (matches.length === 0) return { faq: null, confidence: 0 };
    const top = matches[0];
    const confidence = Math.min(99, 60 + matches.length * 8);
    return { faq: top, confidence };
  },
}));
