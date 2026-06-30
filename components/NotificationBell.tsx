"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";

declare global {
  interface Window {
    OneSignalDeferred: any[];
  }
}

export default function NotificationBell() {
  const [subscribed, setSubscribed] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      "serviceWorker" in navigator
    ) {
      setSupported(true);
      if (Notification.permission === "granted") {
        setSubscribed(true);
      }
    }
  }, []);

  const handleClick = () => {
    if (!supported || subscribed) return;

    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async (OneSignal: any) => {
      try {
        await OneSignal.User.PushSubscription.optIn();
        setTimeout(() => {
          if (OneSignal.User.PushSubscription.optedIn) setSubscribed(true);
        }, 500);
      } catch (e) {
        console.error("[OneSignal]", e);
      }
    });
  };

  if (!supported) return null;

  return (
    <button
      onClick={handleClick}
      title={subscribed ? "Notificações ativas" : "Ativar notificações de novos artigos"}
      aria-label={subscribed ? "Notificações ativas" : "Ativar notificações"}
      className={`p-2 rounded-full transition-colors ${
        subscribed
          ? "text-[#CC0000] cursor-default"
          : "text-[#A0A0A0] hover:text-[#F5F5F5]"
      }`}
    >
      <Bell
        className="w-[22px] h-[22px]"
        fill={subscribed ? "#CC0000" : "none"}
      />
    </button>
  );
}
