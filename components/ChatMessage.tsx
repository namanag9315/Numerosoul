"use client"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { NumberCards } from "./NumberCards"

interface Props {
  content: string
  source?: string
  computedNumbers?: {
    lifePath?: number
    expression?: number
    soulUrge?: number
    personality?: number
    personalYear?: number
    psychicNumber?: number
    missingNumbers?: number[]
  } | null
  isUser?: boolean
}

const BADGES: Record<string, { label: string; bg: string; color: string }> = {
  "groq":               { label: "🤖 Groq AI",    bg:"#DBEAFE", color:"#1E40AF" },
  "local-guide-engine": { label: "⚡ Local Guide", bg:"#D1FAE5", color:"#065F46" },
  "local-fallback":     { label: "🔄 Fallback",   bg:"#FEF3C7", color:"#92400E" },
  "error":              { label: "⚠️ Error",       bg:"#FEE2E2", color:"#991B1B" },
}

export function ChatMessage({ 
  content, source, computedNumbers, isUser 
}: Props) {
  
  // USER bubble
  if (isUser) {
    return (
      <div style={{
        alignSelf: "flex-end",
        background: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)",
        color: "white",
        borderRadius: "16px 4px 16px 16px",
        padding: "12px 18px",
        maxWidth: "70%",
        fontSize: "14px",
        lineHeight: "1.6",
        boxShadow: "0 2px 8px rgba(109,40,217,0.25)"
      }}>
        {content}
      </div>
    )
  }

  // BOT bubble
  const badge = source ? BADGES[source] : null

  return (
    <div style={{ alignSelf: "flex-start", maxWidth: "90%", width: "100%" }}>
      
      {/* Number cards above the message */}
      {computedNumbers && (
        <NumberCards numbers={computedNumbers} />
      )}

      {/* Main message card */}
      <div style={{
        background: "white",
        border: "1px solid #EDE9FE",
        borderLeft: "4px solid #7C3AED",
        borderRadius: "4px 16px 16px 16px",
        padding: "20px 24px",
        boxShadow: "0 4px 16px rgba(109,40,217,0.08)",
      }}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // H2 — main title
            h2: ({ children }) => (
              <h2 style={{
                fontSize: "20px", fontWeight: 800,
                color: "#4C1D95",
                borderBottom: "2px solid #EDE9FE",
                paddingBottom: "10px",
                marginBottom: "20px", marginTop: 0,
                letterSpacing: "-0.02em"
              }}>{children}</h2>
            ),
            
            // H3 — section headers
            h3: ({ children }) => (
              <h3 style={{
                fontSize: "11px", fontWeight: 700,
                color: "#7C3AED",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginTop: "20px", marginBottom: "10px",
                display: "flex", alignItems: "center",
                gap: "6px"
              }}>{children}</h3>
            ),
            
            // Blockquote — Core Insight
            blockquote: ({ children }) => (
              <blockquote style={{
                background: "linear-gradient(135deg, #F5F3FF, #EDE9FE)",
                borderLeft: "4px solid #7C3AED",
                borderRadius: "0 12px 12px 0",
                padding: "14px 18px",
                margin: "12px 0",
                fontStyle: "italic",
                color: "#4C1D95",
                fontSize: "15px",
                lineHeight: "1.7",
                fontWeight: 500
              }}>{children}</blockquote>
            ),
            
            // Table
            table: ({ children }) => (
              <div style={{ overflowX:"auto", margin:"12px 0",
                            borderRadius:"10px", overflow:"hidden",
                            border:"1px solid #EDE9FE" }}>
                <table style={{ width:"100%",
                  borderCollapse:"collapse",
                  fontSize:"13px" }}>
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead style={{
                background:"linear-gradient(135deg, #7C3AED, #6D28D9)"
              }}>{children}</thead>
            ),
            th: ({ children }) => (
              <th style={{
                color:"white", padding:"10px 14px",
                textAlign:"left", fontWeight:700,
                fontSize:"11px", textTransform:"uppercase",
                letterSpacing:"0.05em"
              }}>{children}</th>
            ),
            tr: ({ children, ...props }) => (
              <tr style={{
                borderBottom:"1px solid #F5F3FF",
              }} {...props}>{children}</tr>
            ),
            td: ({ children }) => (
              <td style={{
                padding:"10px 14px", color:"#374151",
                fontSize:"13px", verticalAlign:"top"
              }}>{children}</td>
            ),
            
            // List items — the KEY fix for paragraphs
            li: ({ children }) => (
              <li style={{
                marginBottom:"10px", listStyle:"none",
                display:"grid",
                gridTemplateColumns:"16px 1fr",
                gap:"10px",
                alignItems:"start",
                padding: "8px 12px",
                background: "#FAFAFA",
                borderRadius: "8px",
                border: "1px solid #F3F4F6"
              }}>
                <span style={{
                  color:"#7C3AED", fontWeight:800,
                  fontSize:"14px", marginTop:"1px",
                  lineHeight:1
                }}>◆</span>
                <span style={{
                  color:"#374151", fontSize:"14px",
                  lineHeight:"1.65"
                }}>{children}</span>
              </li>
            ),
            ul: ({ children }) => (
              <ul style={{
                padding:0, margin:"8px 0",
                listStyle:"none",
                display:"flex", flexDirection:"column", gap:"6px"
              }}>{children}</ul>
            ),
            ol: ({ children }) => (
              <ol style={{
                padding:0, margin:"8px 0",
                listStyle:"none",
                display:"flex", flexDirection:"column", gap:"6px",
                counterReset:"item"
              }}>{children}</ol>
            ),
            
            // Bold — purple labels
            strong: ({ children }) => (
              <strong style={{
                color:"#6D28D9", fontWeight:700
              }}>{children}</strong>
            ),
            
            // Divider
            hr: () => (
              <hr style={{
                border:"none",
                height:"1px",
                background:"linear-gradient(90deg, #7C3AED22, #7C3AED66, #7C3AED22)",
                margin:"18px 0"
              }} />
            ),
            
            // Paragraphs — should be rare with good prompting
            p: ({ children }) => (
              <p style={{
                lineHeight:"1.7", color:"#374151",
                fontSize:"14px", margin:"6px 0"
              }}>{children}</p>
            ),
            
            // Italic — source badge text
            em: ({ children }) => (
              <em style={{
                color:"#9CA3AF", fontSize:"12px"
              }}>{children}</em>
            ),
            
            // Inline code — numbers highlighted
            code: ({ children }) => (
              <code style={{
                background:"#EDE9FE", color:"#7C3AED",
                padding:"2px 6px", borderRadius:"4px",
                fontSize:"13px", fontWeight:600,
                fontFamily:"monospace"
              }}>{children}</code>
            ),
          }}
        >
          {content}
        </ReactMarkdown>

        {/* Source badge */}
        {badge && (
          <div style={{
            marginTop:"16px",
            paddingTop:"12px",
            borderTop:"1px solid #F3F4F6",
            display:"flex", alignItems:"center",
            justifyContent:"space-between"
          }}>
            <span style={{
              fontSize:"11px", padding:"4px 12px",
              borderRadius:"99px", fontWeight:700,
              background:badge.bg, color:badge.color,
              letterSpacing:"0.03em"
            }}>
              {badge.label}
            </span>
            <span style={{
              fontSize:"11px", color:"#D1D5DB"
            }}>
              {new Date().toLocaleTimeString([], {
                hour:"2-digit", minute:"2-digit"
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
