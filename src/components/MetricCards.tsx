import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt, faBullseye, faChartLine, faShieldHalved, faComments, faRobot } from "@fortawesome/free-solid-svg-icons";
import type { Metrics } from "@/lib/api";

interface Props { metrics?: Metrics }

const cards = (m: Metrics) => [
  { icon: faComments, label: "오늘 상담", value: m.totalToday.toLocaleString(), suffix: "건", color: "#7c3aed" },
  { icon: faBolt, label: "평균 응답시간", value: m.avgResponseSec.toFixed(1), suffix: "초", color: "#a78bfa" },
  { icon: faBullseye, label: "RAG 정확도", value: m.ragAccuracy + "", suffix: "%", color: "#6366f1" },
  { icon: faChartLine, label: "자동화율", value: m.automationRate + "", suffix: "%", color: "#8b5cf6" },
  { icon: faShieldHalved, label: "고객 만족도", value: m.satisfaction + "", suffix: "%", color: "#22c55e" },
  { icon: faRobot, label: "온라인 상담사", value: m.activeAgents + "", suffix: "명", color: "#c4b5fd" },
];

export const MetricCards = ({ metrics }: Props) => {
  if (!metrics) return null;
  return (
    <div className="row g-3 mb-4">
      {cards(metrics).map((c) => (
        <div className="col-6 col-md-4 col-xl-2" key={c.label}>
          <div className="brand-card p-3 h-100">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="icon-bubble" style={{ width: 36, height: 36, fontSize: 14, background: c.color + "20", color: c.color }}>
                <FontAwesomeIcon icon={c.icon} />
              </span>
              <small className="text-muted">{c.label}</small>
            </div>
            <div className="fw-bold" style={{ fontSize: "1.4rem" }}>
              {c.value}<span className="h6 text-muted ms-1">{c.suffix}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
