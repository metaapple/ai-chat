import { Chart } from "react-google-charts";
import type { CategoryStat, DailyVolume, Metrics, ResponseTime } from "@/lib/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartArea, faChartPie, faChartColumn, faGaugeHigh } from "@fortawesome/free-solid-svg-icons";

interface Props {
  daily?: DailyVolume[];
  categories?: CategoryStat[];
  responseTimes?: ResponseTime[];
  metrics?: Metrics;
}

const baseOpts = {
  backgroundColor: "transparent",
  legend: { textStyle: { color: "#475569" }, position: "bottom" as const },
  hAxis: { textStyle: { color: "#64748b" }, gridlines: { color: "#e2e8f0" } },
  vAxis: { textStyle: { color: "#64748b" }, gridlines: { color: "#e2e8f0" } },
  chartArea: { width: "86%", height: "70%" },
};

export const Charts = ({ daily = [], categories = [], responseTimes = [], metrics }: Props) => {
  const lineData = [["날짜", "AI 응대", "상담사 응대"], ...daily.map((d) => [d.date, d.ai, d.human])];
  const pieData = [["카테고리", "건수"], ...categories.map((c) => [c.name, c.value])];
  const barData = [["시간대", "응답시간(초)", { role: "style" }], ...responseTimes.map((r) => [r.hour, r.seconds, "#7c3aed"])];
  const gaugeData = [["Label", "Value"], ["만족도", metrics?.satisfaction ?? 0]];

  return (
    <div className="row g-4 mb-4">
      <div className="col-12 col-xl-8">
        <div className="brand-card p-4 h-100">
          <h2 className="h6 fw-bold mb-3"><FontAwesomeIcon icon={faChartArea} className="text-brand me-2" />일별 상담 건수 추이</h2>
          <Chart chartType="AreaChart" width="100%" height="300px" data={lineData}
            options={{ ...baseOpts, colors: ["#7c3aed", "#c4b5fd"], areaOpacity: 0.25, isStacked: false }} />
        </div>
      </div>
      <div className="col-12 col-xl-4">
        <div className="brand-card p-4 h-100">
          <h2 className="h6 fw-bold mb-3"><FontAwesomeIcon icon={faChartPie} className="text-brand me-2" />카테고리별 문의</h2>
          <Chart chartType="PieChart" width="100%" height="300px" data={pieData}
            options={{ ...baseOpts, pieHole: 0.5, colors: categories.map((c) => c.color), pieSliceTextStyle: { color: "#fff", fontSize: 12 } }} />
        </div>
      </div>
      <div className="col-12 col-lg-7">
        <div className="brand-card p-4 h-100">
          <h2 className="h6 fw-bold mb-3"><FontAwesomeIcon icon={faChartColumn} className="text-brand me-2" />시간대별 평균 응답시간</h2>
          <Chart chartType="ColumnChart" width="100%" height="280px" data={barData}
            options={{ ...baseOpts, legend: "none" }} />
        </div>
      </div>
      <div className="col-12 col-lg-5">
        <div className="brand-card p-4 h-100">
          <h2 className="h6 fw-bold mb-3"><FontAwesomeIcon icon={faGaugeHigh} className="text-brand me-2" />고객 만족도</h2>
          <Chart chartType="Gauge" width="100%" height="280px" data={gaugeData}
            options={{
              redFrom: 0, redTo: 50, redColor: "#ef4444",
              yellowFrom: 50, yellowTo: 80, yellowColor: "#f59e0b",
              greenFrom: 80, greenTo: 100, greenColor: "#22c55e",
              minorTicks: 5, min: 0, max: 100,
            }} />
          <div className="text-center text-muted small mt-2">목표 90% · 현재 {metrics?.satisfaction ?? 0}%</div>
        </div>
      </div>
    </div>
  );
};
