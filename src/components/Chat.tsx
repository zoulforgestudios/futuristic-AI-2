import { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { OrbitingAIs } from './OrbitingAIs';

export function Chat() 
  const { messages, addMessage, aiModes, settings, isListening, setIsListening } = useApp();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const [currentAI, setCurrentAI] = useState("zoul");


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

      // -------------------------
// REAL ZOUL API CALL
// -------------------------
async function askZoulForge(userMessage: string, aiMode: string = "zoul") {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          { role: "user", content: userMessage }
        ],
        ai: aiMode
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return "⚠️ Zoul Error: " + errorText;
    }

    const data = await response.json();
    return data.text || "…";
  } catch (error: any) {
    return "⚠️ Network error: " + error.message;
  }
}


// -------------------------
// SEND MESSAGE HANDLER
// -------------------------
const handleSend = async () => {
  if (!inputValue.trim()) return;

  const newMessage = {
    role: "user" as const,
    content: inputValue.trim()
  };

  // Add user's message
  setMessages((prev) => [...prev, newMessage]);

  // clear input
  setInputValue("");

  // ✅ Get Zoul’s response
  const reply = await askZoulForge(newMessage.content, currentAI);


  // Add AI's reply
  setMessages((prev) => [
    ...prev,
    {
      role: "assistant" as const,
      content: reply
    }
  ]);
};


      addMessage({
        type: 'ai',
        content: response,
        aiMode: activeAIs[0]?.name || 'Zoul',
      });
      setIsTyping(false);
    }, 1500);
  };