"use client";

import { useParams } from "next/navigation";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export default function SessionPage() {
  const params = useParams();
  const roomId = Array.isArray(params.roomId) ? params.roomId[0] : params.roomId;
  const [isCompleted, setIsCompleted] = useState(false);

  if (!roomId) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#FFFDF9]">
        <p className="text-slate-500 font-medium">Invalid session link.</p>
      </div>
    );
  }

  // Ensure room name is URL safe and alphanumeric-ish for Jitsi
  const roomName = `NumeroSoul-Session-${roomId.replace(/[^a-zA-Z0-9-]/g, "")}`;

  if (isCompleted) {
    return (
      <div className="flex flex-col h-screen w-full bg-[#FFFDF9] overflow-hidden items-center justify-center">
        <div className="flex flex-col items-center text-center p-8 max-w-md bg-white rounded-3xl border border-[#E8A020]/20 shadow-[0_24px_60px_rgba(30,10,60,0.05)]">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#16A34A]/10 text-[#16A34A] mb-6">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="font-display text-3xl font-bold text-[#1E0A3C] mb-4">Session Completed</h1>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Thank you for joining your NumeroSoul consultation. Your video session has successfully concluded.
          </p>
          <a
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-[#1E0A3C] to-[#0D0820] px-8 text-sm font-medium text-white shadow-[0_14px_30px_rgba(30,10,60,0.18)] transition-all duration-300 hover:shadow-[0_16px_34px_rgba(30,10,60,0.24)] hover:scale-[1.02]"
          >
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-[#FFFDF9] overflow-hidden">
      {/* We reuse the Navbar but keep it simple, or hide it if we want full immersion. 
          Actually, let's keep a minimal header so they don't navigate away accidentally during a call. */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#E8A020]/20 bg-[#FFFDF9] px-6">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1E0A3C] text-sm font-black text-[#FDF9F1]">
            N
          </span>
          <div>
            <h1 className="font-display text-lg font-bold text-[#1E0A3C] leading-none">
              NumeroSoul
            </h1>
            <span className="text-[10px] font-medium tracking-widest text-[#E8A020]/70 uppercase">
              Live Consultation
            </span>
          </div>
        </div>
      </header>

      <div className="flex-1 w-full h-full relative">
        <JitsiMeeting
          domain="meet.jit.si"
          roomName={roomName}
          configOverwrite={{
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            prejoinPageEnabled: true,
            disableDeepLinking: true,
          }}
          interfaceConfigOverwrite={{
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
            SHOW_CHROME_EXTENSION_BANNER: false,
          }}
          userInfo={{
            displayName: "Client",
            email: "",
          }}
          onApiReady={(externalApi) => {
            // Listen for when the user leaves the call
            externalApi.addListener("readyToClose", () => {
              setIsCompleted(true);
            });
            externalApi.addListener("videoConferenceLeft", () => {
              setIsCompleted(true);
            });
          }}
          getIFrameRef={(iframeRef) => {
            iframeRef.style.height = "100%";
            iframeRef.style.width = "100%";
            iframeRef.style.border = "none";
          }}
        />
      </div>
    </div>
  );
}
