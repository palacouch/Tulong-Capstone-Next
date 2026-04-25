"use client";

import { useEffect, useState } from "react";

type Props = {
  visible: boolean;
  message: string;
  location?: { latitude: number; longitude: number };
  timestamp: any;
  onDismiss: () => void;
};

export default function SOSModal({
  visible,
  message,
  location,
  timestamp,
  onDismiss,
}: Props) {
  const [render, setRender] = useState(visible);

  // Handle Entrance & Web Vibration
  useEffect(() => {
    if (visible) {
      setRender(true);
      // Trigger browser vibration if supported by the user's device
      if (typeof window !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate([0, 500, 200, 500, 200, 500]);
      }
    } else {
      // Optional: stop vibration when dismissed early
      if (typeof window !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate(0); 
      }
      // Brief delay to allow CSS fade-out (optional, keeping it simple here)
      setRender(false);
    }
  }, [visible]);

  if (!render) return null;

  const formatTime = (ts: any) => {
    if (!ts) return "";
    // Handle both Firebase Timestamps and standard Dates
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleTimeString("en-PH", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    // Overlay backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-6 backdrop-blur-sm transition-opacity">
      
      {/* Modal Card */}
      <div className="w-full max-w-sm flex flex-col items-center gap-3 rounded-3xl border border-red-400/30 bg-[#13131f] p-7 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Pulsing SOS icon */}
        <div className="mb-1 flex h-20 w-20 items-center justify-center rounded-full bg-red-400/15 animate-pulse">
          <span className="text-4xl">🚨</span>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black tracking-widest text-red-400">
          SOS ALERT
        </h2>
        <p className="text-center text-sm text-white/50">
          The wearer needs immediate help!
        </p>

        {/* Divider */}
        <div className="my-1 h-[1px] w-full bg-white/10" />

        {/* Info Rows */}
        <div className="flex w-full items-center justify-between py-1">
          <span className="text-[13px] font-medium text-white/40">Message</span>
          <span className="flex-1 text-right text-[13px] font-medium text-white">
            {message}
          </span>
        </div>

        {location && (
          <div className="flex w-full items-center justify-between py-1">
            <span className="text-[13px] font-medium text-white/40">Location</span>
            <span className="flex-1 text-right text-[13px] font-medium text-white">
              {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
            </span>
          </div>
        )}

        {timestamp && (
          <div className="flex w-full items-center justify-between py-1">
            <span className="text-[13px] font-medium text-white/40">Time</span>
            <span className="flex-1 text-right text-[13px] font-medium text-white">
              {formatTime(timestamp)}
            </span>
          </div>
        )}

        {/* Dismiss Button */}
        <button
          onClick={onDismiss}
          className="mt-2 w-full rounded-xl bg-red-400 py-3.5 text-base font-bold tracking-wide text-white shadow-[0_6px_12px_rgba(248,113,113,0.35)] transition-all hover:bg-red-500 hover:shadow-[0_8px_16px_rgba(248,113,113,0.45)] active:scale-95"
        >
          Okay
        </button>
      </div>
    </div>
  );
}