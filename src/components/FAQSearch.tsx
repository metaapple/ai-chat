import { useMemo, useState } from "react";
import { useConsultationStore } from "@/store/consultationStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faFire, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

export const FAQSearch = () => {
  const { faqs = [], searchFAQ } = useConsultationStore();
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<number | null>(null);
  const [activeCat, setActiveCat] = useState<string>("전체");

  const categories = useMemo(() => ["전체", ...Array.from(new Set(faqs.map((f) => f.category)))], [faqs]);

  const list = useMemo(() => {
    const base = q.trim() ? searchFAQ(q) : [...faqs].sort((a, b) => b.views - a.views);
    return activeCat === "전체" ? base : base.filter((f) => f.category === activeCat);
  }, [q, faqs, activeCat, searchFAQ]);

  return (
    <div className="brand-card p-4">
      <div className="d-flex align-items-center gap-2 mb-3">
        <FontAwesomeIcon icon={faFire} className="text-brand" />
        <h2 className="h6 fw-bold mb-0">RAG 기반 FAQ 검색</h2>
      </div>

      <div className="position-relative mb-3">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="position-absolute text-muted" style={{ top: 14, left: 14 }} />
        <input
          className="form-control form-control-lg ps-5"
          placeholder="궁금한 내용을 입력하세요 (예: 환불, 비밀번호)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="d-flex flex-wrap gap-2 mb-3">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCat(c)}
            className={`btn btn-sm ${activeCat === c ? "btn-brand" : "btn-outline-secondary"}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="d-flex flex-column gap-2" style={{ maxHeight: 420, overflowY: "auto" }}>
        {list.length === 0 ? (
          <div className="text-muted text-center py-4">일치하는 FAQ가 없습니다.</div>
        ) : list.map((f) => {
          const open = openId === f.id;
          return (
            <div key={f.id} className="brand-card p-3" role="button" onClick={() => setOpenId(open ? null : f.id)}>
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-brand-soft text-brand">{f.category}</span>
                  <span className="fw-semibold">{f.question}</span>
                </div>
                <div className="d-flex align-items-center gap-3 text-muted small">
                  <span>조회 {f.views.toLocaleString()}</span>
                  <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} />
                </div>
              </div>
              {open && <div className="mt-3 text-muted small">{f.answer}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
