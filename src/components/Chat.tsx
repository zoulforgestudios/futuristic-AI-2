import { useState } from "react";

export default function Chat() {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ CHANGE THIS: Insert your real token below (TEMP ONLY)
  const OPENAI_KEY = "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";

  async function askZoulForge(prompt: string) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini", // stable, cheap, fast
          messages: [
            { role: "system", content: "You are Zoul, the core AI of ZoulForge." },
            { role: "user", content: prompt }
          ]
        })
      });

      const data = await res.json();
      return data.choices?.[0]?.message?.content ?? "…";
    } catch (err: any) {
      return "⚠️ Connection error: " + err.message;
    }
  }

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMsg = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMsg]);

    setInput("");
    setLoading(true);

    const reply = await askZoulForge(userMsg.content);

    const aiMsg = { role: "assistant" as const, content: reply };
    setMessages((prev) => [...prev, aiMsg]);

    setLoading(false);
  }

  return (
    <div style={styles.container}>
      <div style={styles.messages}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              ...styles.bubble,
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              background: m.role === "user" ? "#6d5dfc" : "#222",
              color: "white"
            }}
          >
            {m.content}
          </div>
        ))}
        {loading && (
          <div style={{ ...styles.bubble, alignSelf: "flex-start", opacity: 0.6 }}>
            Zoul is typing…
          </div>
        )}
      </div>

      <div style={styles.inputRow}>
        <input
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Message ZoulForge…"
        />
        <button style={styles.btn} onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles: any = {
  container: {
    height: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    background: "#0a0a0a"
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  bubble: {
    maxWidth: "70%",
    padding: "10px 14px",
    borderRadius: "12px",
    fontSize: "15px",
    lineHeight: "20px",
    background: "#222"
  },
  inputRow: {
    display: "flex",
    padding: "10px",
    gap: "8px",
    background: "#111"
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    background: "#222",
    color: "white",
    border: "none",
    outline: "none"
  },
  btn: {
    padding: "10px 16px",
    borderRadius: "8px",
    background: "#6d5dfc",
    color: "white",
    border: "none",
    cursor: "pointer"
  }
};
