// api/chat.ts — Vercel Edge Function
export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { messages, ai } = await req.json();

    // Choose a lightweight model; change if you have access to others
    const model = "gpt-4o-mini"; // or "gpt-4o-mini-2024-07-18"

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: `You are Zoul, the core AI of ZoulForge. Current sub-AI: ${ai || "zoul"}. Be concise, helpful, and futuristic.` },
          ...messages
        ],
        temperature: 0.6
      })
    });

    if (!r.ok) {
      const errText = await r.text();
      return new Response(errText, { status: r.status });
    }

    const data = await r.json();
    const text = data.choices?.[0]?.message?.content ?? "(no response)";
    return new Response(JSON.stringify({ text }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e:any) {
    return new Response(JSON.stringify({ error: e?.message || "Unknown error" }), { status: 500 });
  }
}
