import React, { useEffect, useRef, useState } from "react";

type Role = "user" | "assistant" | "system";
type Msg = { role: Role; content: string };

const OPENAI_API_KEY = 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; // ⚠️ demo only

const MODEL = "gpt-4o-mini"; // light + cheap, change if you like

export default function Chat() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Zoul online. How can I help?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // autoscroll
  useEffect(() => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      // SIMPLE (non-streaming) request — reliable and easy
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: next.map(m => ({ role: m.role, content: m.content })),
          temperature: 0.8,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`OpenAI error ${res.status}: ${errText}`);
      }

      const data = await res.json();
      const reply: string =
        data?.choices?.[0]?.message?.content?.trim?.() ??
        "…(no response received)";

      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content:
            "I hit an error talking to OpenAI:\n" +
            (err?.message || String(err)),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="zf-chat-wrap" style={wrapStyle}>
      {/* message list */}
      <div id="chatBox" ref={boxRef} style={boxStyle}>
        {messages.map((m, i) => (
          <div className={`msg ${m.role}`} key={i} style={msgStyle}>
            <div
              className="avatar"
              style={{
                ...avatarStyle,
                background:
                  m.role === "user"
                    ? "linear-gradient(135deg,#2d8cff,#1a4bff)"
                    : "linear-gradient(135deg,#8a5cff,#2b2b5a)",
              }}
            />
            <div
              className="bubble"
              style={{
                ...bubbleStyle,
                background: m.role === "assistant" ? "#0f1524" : "#111727",
              }}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="msg assistant" style={msgStyle}>
            <div className="avatar" style={{ ...avatarStyle, background: "linear-gradient(135deg,#8a5cff,#2b2b5a)" }} />
            <div className="bubble" style={{ ...bubbleStyle, background: "#0f1524", opacity: 0.85 }}>
              <TypingDots />
            </div>
          </div>
        )}
      </div>

      {/* composer */}
      <form onSubmit={sendMessage} className="composer" style={composerStyle}>
        <input
          id="userInput"
          type="text"
          placeholder="Message ZoulForge…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          style={inputStyle}
        />
        <button id="sendBtn" type="submit" disabled={loading} style={buttonStyle}>
          {loading ? "…" : "Send"}
        </button>
      </form>
    </div>
  );
}

/* ---------- tiny typing dots ---------- */
function TypingDots() {
  return (
    <span style={{ display: "inline-flex", gap: 6 }}>
      <Dot delay="0ms" />
      <Dot delay="120ms" />
      <Dot delay="240ms" />
    </span>
  );
}
function Dot({ delay }: { delay: string }) {
  return (
    <span
      style={{
        width: 6,
        height: 6,
        borderRadius: 3,
        display: "inline-block",
        background: "#8a5cff",
        opacity: 0.9,
        animation: `zf-bounce 1s ${delay} infinite ease-in-out`,
      }}
    />
  );
}

/* ---------- inline styles (kept minimal; match your theme) ---------- */
const wrapStyle: React.CSSProperties = { display: "grid", gridTemplateRows: "1fr auto", height: "100%", gap: 12 };
const boxStyle: React.CSSProperties = {
  border: "1px solid #1a1f28",
  background: "#0e1119",
  borderRadius: 18,
  padding: 12,
  height: 420,
  overflow: "auto",
};
const msgStyle: React.CSSProperties = { display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" };
const avatarStyle: React.CSSProperties = { width: 28, height: 28, borderRadius: 8 };
const bubbleStyle: React.CSSProperties = {
  border: "1px solid #1a1f28",
  padding: "10px 12px",
  borderRadius: 14,
  flex: 1,
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
};
const composerStyle: React.CSSProperties = {
  display: "flex",
  gap: 10,
  padding: 10,
  border: "1px solid #1a1f28",
  background: "#0f1320",
  borderRadius: 18,
  alignItems: "center",
};
const inputStyle: React.CSSProperties = {
  flex: 1,
  border: "none",
  outline: "none",
  background: "transparent",
  color: "#ebeff6",
  fontSize: 16,
};
const buttonStyle: React.CSSProperties = {
  background: "linear-gradient(180deg,#8a5cff,#5e39ff)",
  color: "#fff",
  border: "1px solid #5536ff",
  borderRadius: 12,
  padding: "8px 12px",
  cursor: "pointer",
};
