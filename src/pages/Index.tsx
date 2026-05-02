import { useEffect, useState } from "react";
import { useConsultationStore } from "@/store/consultationStore";
import { AppHeader } from "@/components/AppHeader";
import { MetricCards } from "@/components/MetricCards";
import { Charts } from "@/components/Charts";
import { FAQSearch } from "@/components/FAQSearch";
import { ChatPanel } from "@/components/ChatPanel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faComments, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

type Tab = "dashboard" | "faq" | "chat";

const Index = () => {
  const { load, loading, error, metrics, dailyVolume, categories, responseTimes } = useConsultationStore();
  const [tab, setTab] = useState<Tab>("dashboard");

  useEffect(() => {
    document.title = "AI 고객 상담 시스템 — RAG 대시보드";
    load();
  }, [load]);

  return (
    <main className="app-shell">
      <AppHeader />
      <div className="container-fluid px-4 px-md-5 py-4">
        <ul className="nav nav-pills gap-2 mb-4">
          {[
            { k: "dashboard", icon: faChartLine, label: "대시보드" },
            { k: "faq", icon: faMagnifyingGlass, label: "FAQ 검색" },
            { k: "chat", icon: faComments, label: "AI 상담" },
          ].map((t) => (
            <li className="nav-item" key={t.k}>
              <button className={`nav-link ${tab === t.k ? "active" : ""}`} onClick={() => setTab(t.k as Tab)}>
                <FontAwesomeIcon icon={t.icon} className="me-2" />{t.label}
              </button>
            </li>
          ))}
        </ul>

        {loading && <div className="text-muted text-center py-5">데이터 불러오는 중…</div>}
        {error && <div className="alert alert-danger">데이터 로드 실패: {error}</div>}

        {!loading && !error && tab === "dashboard" && (
          <>
            <MetricCards metrics={metrics} />
            <Charts daily={dailyVolume} categories={categories} responseTimes={responseTimes} metrics={metrics} />
          </>
        )}

        {!loading && !error && tab === "faq" && <FAQSearch />}

        {!loading && !error && tab === "chat" && (
          <div className="row g-4">
            <div className="col-12 col-lg-7"><ChatPanel /></div>
            <div className="col-12 col-lg-5"><FAQSearch /></div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Index;
