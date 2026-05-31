"use client";

import { useParams } from "next/navigation";
import { JitsiMeeting } from "@jitsi/react-sdk";

export default function SessionPage() {
  const params = useParams();
  const roomId = Array.isArray(params.roomId) ? params.roomId[0] : params.roomId;

  if (!roomId) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#FFFDF9]">
        <p className="text-slate-500 font-medium">Invalid session link.</p>
      </div>
    );
  }

  // Ensure room name is URL safe and alphanumeric-ish for Jitsi
  const roomName = `NumeroSoul-Session-${roomId.replace(/[^a-zA-Z0-9-]/g, "")}`;

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
          onApiReady={() => {
            // Can attach event listeners to externalApi if needed
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
