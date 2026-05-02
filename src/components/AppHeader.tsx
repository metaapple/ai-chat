import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot, faHeadset } from "@fortawesome/free-solid-svg-icons";

export const AppHeader = () => (
  <header className="border-bottom bg-white" style={{ backdropFilter: "blur(8px)" }}>
    <div className="container-fluid px-4 px-md-5 py-3 d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center gap-3">
        <div className="icon-bubble brand-gradient" style={{ background: "var(--gradient-brand)", color: "#fff" }}>
          <FontAwesomeIcon icon={faRobot} />
        </div>
        <div>
          <h1 className="h5 fw-bold mb-0">AI 고객 상담 시스템</h1>
          <small className="text-muted">RAG 기반 FAQ 검색 · 스마트 응답 엔진</small>
        </div>
      </div>
      <div className="d-flex align-items-center gap-2 small text-muted">
        <span className="pulse-dot" />
        <span>실시간 운영중</span>
        <span className="vr mx-2 d-none d-md-inline" />
        <FontAwesomeIcon icon={faHeadset} className="text-brand d-none d-md-inline" />
        <span className="d-none d-md-inline">상담사 12명 온라인</span>
      </div>
    </div>
  </header>
);
