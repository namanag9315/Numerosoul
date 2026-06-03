"use client";

import React, { useState, useRef, useEffect } from "react";
import { User, Calendar } from "lucide-react";
import { ChatMessage } from "@/components/ChatMessage";

interface Booking {
  id: string;
  booking_date: string;
  time_slot: string;
  mode: string;
  status: string;
  amount_paid: number;
  focus_areas: string | null;
  additional_dobs: string | null;
  created_at: string;
  clients: {
    id: string;
    name: string;
    email: string;
    phone: string;
    date_of_birth: string | null;
    notes: string | null;
  } | null;
  services: {
    id: string;
    name: string;
    slug: string;
    duration_minutes: number;
  } | null;
}

interface AdminChatbotProps {
  bookings?: Booking[];
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  source?: string;
  computedNumbers?: Record<string, unknown> | null;
}

export function AdminChatbot({ }: AdminChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [stagedMessage, setStagedMessage] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientDOB, setClientDOB] = useState("");
  
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const handle = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.name) setClientName(detail.name);
      if (detail?.dob) setClientDOB(detail.dob);
    };
    window.addEventListener("autofill-client", handle);
    return () => window.removeEventListener("autofill-client", handle);
  }, []);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now().toString(), role: "user" as const, content: text };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          clientName,
          clientDOB
        })
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        id: (Date.now()+1).toString(),
        role: "assistant",
        content: data.answer,
        source: data.source,
        computedNumbers: data.computedNumbers
      }]);
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now()+1).toString(),
        role: "assistant",
        content: "## ⚠️ Connection Error\n\nCould not reach the server. Please try again.",
        source: "error"
      }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (stagedMessage) {
      sendMessage(stagedMessage);
      setStagedMessage("");
    }
  }, [stagedMessage]);

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      <div className="p-4 border-b border-slate-200 bg-white flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
            <User size={12} /> Client Name
          </label>
          <input 
            type="text" 
            placeholder="e.g. Naman Agrawal" 
            value={clientName} 
            onChange={e => setClientName(e.target.value)}
            className="w-full text-sm p-2 border border-slate-200 rounded-lg outline-none focus:border-violet-400"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
            <Calendar size={12} /> Date of Birth (DD-MM-YYYY)
          </label>
          <input 
            type="text" 
            placeholder="e.g. 03-03-1997" 
            value={clientDOB} 
            onChange={e => setClientDOB(e.target.value)}
            className="w-full text-sm p-2 border border-slate-200 rounded-lg outline-none focus:border-violet-400"
          />
        </div>
      </div>

      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        padding: "24px",
        overflowY: "auto",
        flex: 1,
        background: "#FAFAFA"
      }}>
        {messages.length === 0 ? (
          <div style={{
            display:"flex", flexDirection:"column",
            alignItems:"center", justifyContent:"center",
            height:"100%", gap:"16px", textAlign:"center",
            padding:"40px"
          }}>
            <div style={{ fontSize:"64px", lineHeight:1 }}>🔮</div>
            <div>
              <h3 style={{
                color:"#7C3AED", fontSize:"22px",
                fontWeight:800, margin:"0 0 8px",
                letterSpacing:"-0.02em"
              }}>
                Ready to Read
              </h3>
              <p style={{
                color:"#6B7280", fontSize:"14px",
                maxWidth:"280px", margin:"0 auto",
                lineHeight:"1.6"
              }}>
                Enter client details above and ask anything 
                about their numerology journey.
              </p>
            </div>
            <div style={{
              display:"flex", flexWrap:"wrap", gap:"8px",
              justifyContent:"center", maxWidth:"400px"
            }}>
              {[
                "📅 How will 2027 be for this client?",
                "🔢 Remedies for missing numbers",
                "💑 Compatibility analysis",
                "✏️ Suggest a corrected name spelling",
                "🎨 Best colors and gemstones"
              ].map(chip => (
                <button
                  key={chip}
                  onClick={() => setStagedMessage(chip)}
                  style={{
                    border:"1.5px solid #EDE9FE",
                    borderRadius:"99px",
                    padding:"8px 16px",
                    fontSize:"12px", fontWeight:500,
                    color:"#7C3AED", background:"white",
                    cursor:"pointer",
                    transition:"all 0.2s",
                    boxShadow:"0 1px 4px rgba(109,40,217,0.08)"
                  }}
                  onMouseEnter={e => {
                    (e.target as HTMLButtonElement).style.background = "#F5F3FF"
                    ;(e.target as HTMLButtonElement).style.borderColor = "#7C3AED"
                  }}
                  onMouseLeave={e => {
                    (e.target as HTMLButtonElement).style.background = "white"
                    ;(e.target as HTMLButtonElement).style.borderColor = "#EDE9FE"
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {messages.map(msg => (
              <div key={msg.id} style={{ alignSelf: msg.role === "user" ? "flex-end" : "flex-start", maxWidth: msg.role === "user" ? "75%" : "100%" }} className="w-full">
                {msg.role === "user" ? (
                  <div style={{
                    background: "#7C3AED", color: "white", padding: "12px 18px",
                    borderRadius: "16px 16px 0 16px", fontSize: "14px",
                    boxShadow: "0 2px 8px rgba(124, 58, 237, 0.2)"
                  }}>
                    {msg.content}
                  </div>
                ) : (
                  <ChatMessage content={msg.content} source={msg.source} computedNumbers={msg.computedNumbers} />
                )}
              </div>
            ))}
            
            {loading && (
              <div style={{
                display:"flex", flexDirection:"column", gap:"8px",
                padding:"20px 24px", maxWidth:"88%",
                background:"white", borderRadius:"4px 16px 16px 16px",
                borderLeft:"4px solid #EDE9FE",
                border:"1px solid #EDE9FE"
              }}>
                <style>{`
                  @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                  }
                  .shimmer {
                    background: linear-gradient(90deg, 
                      #F5F3FF 25%, #EDE9FE 50%, #F5F3FF 75%);
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                  }
                `}</style>
                {[75, 92, 60].map((w, i) => (
                  <div key={i} className="shimmer" style={{
                    height:"12px", borderRadius:"6px",
                    width:`${w}%`
                  }} />
                ))}
                <p style={{
                  fontSize:"11px", color:"#A78BFA",
                  fontStyle:"italic", margin:"4px 0 0"
                }}>
                  ✨ Consulting the numerology guide...
                </p>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <form onSubmit={(e) => {
        e.preventDefault();
        if (inputRef.current?.value) {
          sendMessage(inputRef.current.value);
          inputRef.current.value = "";
        }
      }}>
        <div style={{
          padding: "16px 24px",
          borderTop: "1px solid #EDE9FE",
          background: "white",
          display: "flex",
          gap: "10px",
          alignItems: "center"
        }}>
          <input
            ref={inputRef}
            style={{
              flex: 1,
              border: "2px solid #EDE9FE",
              borderRadius: "12px",
              padding: "12px 16px",
              fontSize: "14px",
              outline: "none",
              color: "#374151",
              transition: "border-color 0.2s"
            }}
            onFocus={e => e.target.style.borderColor = "#7C3AED"}
            onBlur={e => e.target.style.borderColor = "#EDE9FE"}
            placeholder="Ask about personal year, name, compatibility..."
          />
          <button 
            type="submit"
            disabled={loading}
            style={{
              background: "linear-gradient(135deg, #7C3AED, #5B21B6)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              padding: "12px 20px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
              boxShadow: "0 2px 8px rgba(109,40,217,0.3)",
              opacity: loading ? 0.5 : 1
            }}>
            Send ✨
          </button>
        </div>
      </form>
    </div>
  );
}
