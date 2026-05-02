import { useEffect, useRef, useState } from "react";
import { useConsultationStore } from "@/store/consultationStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faRobot, faUser, faCircleQuestion } from "@fortawesome/free-solid-svg-icons";

interface Msg { id: number; role: "user" | "bot"; text: string; confidence?: number; suggestions?: string[] }

const SUGGESTIONS = ["환불은 언제 받나요?", "비밀번호 찾기", "배송 조회", "앱 오류"];

export const ChatPanel = () => {
  const { ragAnswer } = useConsultationStore();
  const [messages, setMessages] = useState<Msg[]>([
    { id: 0, role: "bot", text: "안녕하세요! AI 상담봇입니다. 궁금한 점을 입력해 주세요.", suggestions: SUGGESTIONS },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => { scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" }); }, [messages, typing]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    const userMsg: Msg = { id: Date.now(), role: "user", text: t };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const { faq, confidence } = ragAnswer(t);
      const reply: Msg = faq
        ? { id: Date.now() + 1, role: "bot", text: faq.answer, confidence }
        : { id: Date.now() + 1, role: "bot", text: "죄송합니다. 관련 답변을 찾지 못했어요. 1:1 상담사 연결을 도와드릴까요?", confidence: 0 };
      setMessages((m) => [...m, reply]);
      setTyping(false);
    }, 700);
  };

  return (
    <div className="brand-card d-flex flex-column" style={{ height: 560 }}>
      <div className="p-3 border-bottom d-flex align-items-center gap-2">
        <span className="icon-bubble brand-gradient" style={{ width: 36, height: 36, fontSize: 14, background: "var(--gradient-brand)", color: "#fff" }}>
          <FontAwesomeIcon icon={faRobot} />
        </span>
        <div>
          <div className="fw-bold small">AI 상담 엔진</div>
          <div className="text-muted" style={{ fontSize: 12 }}>RAG 기반 응답 · 평균 2.3초</div>
        </div>
      </div>

      <div ref={scroller} className="flex-grow-1 p-3 d-flex flex-column gap-2" style={{ overflowY: "auto" }}>
        {messages.map((m) => (
          <div key={m.id} className={`d-flex gap-2 ${m.role === "user" ? "justify-content-end" : "justify-content-start"}`}>
            {m.role === "bot" && <span className="icon-bubble" style={{ width: 28, height: 28, fontSize: 12 }}><FontAwesomeIcon icon={faRobot} /></span>}
            <div>
              <div className={`chat-bubble ${m.role}`}>{m.text}</div>
              {m.confidence !== undefined && m.confidence > 0 && (
                <div className="text-muted mt-1" style={{ fontSize: 11 }}>신뢰도 {m.confidence}%</div>
              )}
              {m.suggestions && (
                <div className="d-flex flex-wrap gap-1 mt-2">
                  {m.suggestions.map((s) => (
                    <button key={s} className="btn btn-sm btn-outline-secondary" onClick={() => send(s)}>
                      <FontAwesomeIcon icon={faCircleQuestion} className="me-1" />{s}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {m.role === "user" && <span className="icon-bubble" style={{ width: 28, height: 28, fontSize: 12, background: "#e2e8f0", color: "#475569" }}><FontAwesomeIcon icon={faUser} /></span>}
          </div>
        ))}
        {typing && (
          <div className="d-flex align-items-center gap-2 text-muted small">
            <span className="icon-bubble" style={{ width: 28, height: 28, fontSize: 12 }}><FontAwesomeIcon icon={faRobot} /></span>
            <em>AI가 답변을 작성 중…</em>
          </div>
        )}
      </div>

      <form className="p-3 border-top d-flex gap-2" onSubmit={(e) => { e.preventDefault(); send(input); }}>
        <input
          className="form-control"
          placeholder="질문을 입력하세요…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="btn btn-brand px-3"><FontAwesomeIcon icon={faPaperPlane} /></button>
      </form>
    </div>
  );
};
