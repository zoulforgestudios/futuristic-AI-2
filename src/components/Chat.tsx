import { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { OrbitingAIs } from './OrbitingAIs';

export function Chat() {
  const { messages, addMessage, aiModes, settings, isListening, setIsListening } = useApp();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const activeAIs = aiModes.filter(ai => ai.active);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Voice Recognition Setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = settings.continuousListening;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join('');

        // Check for wake word
        if (settings.wakeWord && transcript.toLowerCase().includes('zoul')) {
          setIsListening(true);
          setInput(transcript);
        } else if (isListening) {
          setInput(transcript);
        }
      };

      recognitionRef.current.onend = () => {
        if (settings.continuousListening && isListening) {
          recognitionRef.current?.start();
        }
      };
    }

    return () => {
      recognitionRef.current?.stop();
    };
  }, [settings, isListening, setIsListening]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    addMessage({
      type: 'user',
      content: input,
    });

    const userInput = input.toLowerCase();
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let response = '';
      const activeAINames = activeAIs.map(ai => ai.name).join(', ');



    <div id="chatBox"></div>

     <!-- send input + button -->
     <input id="userInput" type="text" placeholder="Message ZoulForge…">
     <button id="sendBtn">Send</button>

    <script>
  const chatBox   = document.getElementById("chatBox");
  const userInput = document.getElementById("userInput");
  const sendBtn   = document.getElementById("sendBtn");

  // Keep messages in memory (so the model has history)
  const thread = []; // {role:'user'|'assistant', content:'...'}

  // Pick your current AI mode (you can change from your AI selector UI)
  let currentAIMode = "zoul";

  function addBubble(role, text){
    const wrap = document.createElement("div");
    wrap.className = "msg " + (role === "user" ? "user" : "assistant");
    wrap.innerHTML = `<div class="avatar"></div><div class="bubble"></div>`;
    wrap.querySelector(".bubble").textContent = text;
    chatBox.appendChild(wrap);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  async function sendMessage(){
    const text = userInput.value.trim();
    if (!text) return;
    userInput.value = "";
    addBubble("user", text);
    thread.push({ role: "user", content: text });

    // call your serverless endpoint
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: thread, aiMode: currentAIMode })
      });
      const data = await res.json();
      if (data?.reply) {
        addBubble("assistant", data.reply);
        thread.push({ role: "assistant", content: data.reply });
      } else {
        addBubble("assistant", "Hmm, I couldn’t get a reply.");
      }
    } catch (e) {
      console.error(e);
      addBubble("assistant", "Network error. Try again.");
    }
  }

  sendBtn?.addEventListener("click", sendMessage);
  userInput?.addEventListener("keydown", (e)=>{ if (e.key === "Enter") sendMessage(); });

  // Example: change AI mode from your UI (button or selector)
  window.setAIMode = (id) => { currentAIMode = id || "zoul"; };
</script>


      addMessage({
        type: 'ai',
        content: response,
        aiMode: activeAIs[0]?.name || 'Zoul',
      });
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col bg-[var(--bg)]">
      {/* AI Orb Visualization */}
      <div className="relative h-80 border-b border-[var(--stroke)] bg-[var(--panel)]">
        <OrbitingAIs />
        {isListening && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-[var(--accent)] text-white rounded-full shadow-[0_0_30px_rgba(138,92,255,0.5)] animate-pulse">
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4" />
              <span>Zoul is listening...</span>
            </div>
          </div>
        )}
      </div>

      {/* Active AI Modes Display */}
      {activeAIs.length > 0 && (
        <div className="px-4 py-3 bg-[var(--panel)] border-b border-[var(--stroke)]">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-[var(--muted)]">Active:</span>
            {activeAIs.map(ai => (
              <div
                key={ai.id}
                className="px-3 py-1 rounded-full text-sm text-white"
                style={{ backgroundColor: ai.color }}
              >
                {ai.icon} {ai.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-auto p-4 md:p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-[var(--muted)] mb-4">
              Start a conversation with {activeAIs[0]?.name || 'Zoul'}
            </div>
            <div className="text-sm text-[var(--muted)]">
              Try saying "Zoul" to activate voice mode
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] md:max-w-[60%] px-4 py-3 rounded-2xl ${
                message.type === 'user'
                  ? 'bg-[var(--accent)] text-white'
                  : message.type === 'system'
                  ? 'bg-[var(--elevated)] text-[var(--text)] border border-[var(--accent)]'
                  : 'bg-[var(--panel)] text-[var(--text)] border border-[var(--stroke)]'
              }`}
            >
              {message.aiMode && (
                <div className="text-xs opacity-70 mb-1">{message.aiMode}</div>
              )}
              <div>{message.content}</div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="px-4 py-3 bg-[var(--panel)] border border-[var(--stroke)] rounded-2xl">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-[var(--accent)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-[var(--accent)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-[var(--accent)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 border-t border-[var(--stroke)] bg-[var(--panel)]">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <button
              onClick={toggleListening}
              className={`p-3 rounded-xl transition-all ${
                isListening
                  ? 'bg-[var(--accent)] text-white shadow-[0_0_20px_rgba(138,92,255,0.5)]'
                  : 'bg-[var(--elevated)] text-[var(--muted)] hover:bg-[var(--accent)] hover:text-white'
              }`}
            >
              {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isListening ? 'Listening...' : 'Type a message...'}
              className="flex-1 px-4 py-3 bg-[var(--elevated)] text-[var(--text)] border border-[var(--stroke)] rounded-xl focus:outline-none focus:border-[var(--accent)] placeholder-[var(--muted)]"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="p-3 bg-[var(--accent)] hover:bg-[var(--glow)] disabled:bg-[var(--elevated)] disabled:text-[var(--muted)] text-white rounded-xl transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
