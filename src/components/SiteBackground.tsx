"use client";

import { useTheme } from "@/components/providers/theme-provider";
import { useEffect, useState } from "react";

export function SiteBackground() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isRetro = mounted && theme === "anime-retro";

  return (
    <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden bg-background">
      {/* Top Left Vibrant Purple Glow */}
      <div className={`absolute -top-32 -left-32 h-[550px] w-[550px] rounded-full blur-[130px] transition-all duration-700 ${
        isRetro 
          ? "bg-gradient-to-br from-purple-700/50 via-purple-900/40 to-fuchsia-600/30"
          : "bg-gradient-to-br from-violet-600/25 to-fuchsia-600/20 dark:from-violet-500/30 dark:to-fuchsia-600/25"
      }`} />
      
      {/* Middle Right Sky Glow */}
      <div className={`absolute top-1/3 -right-32 h-[500px] w-[500px] rounded-full blur-[130px] transition-all duration-700 ${
        isRetro
          ? "bg-gradient-to-bl from-purple-600/40 via-indigo-900/35 to-pink-500/25"
          : "bg-gradient-to-bl from-cyan-500/25 to-blue-600/20 dark:from-cyan-400/30 dark:to-blue-600/25"
      }`} />
      
      {/* RETRO ANIME MOON & CITY SILHOUETTE (MATCHING ANIME.PNG) */}
      {isRetro && (
        <>
          {/* Glowing Retro Moon */}
          <div className="absolute top-[80px] left-[65%] h-36 w-36 rounded-full bg-gradient-to-b from-fuchsia-400 via-purple-500 to-indigo-900 opacity-70 blur-[2px] shadow-[0_0_50px_rgba(216,180,254,0.6)] hidden lg:block" />

          {/* Retro Pixel Stars */}
          <div className="absolute inset-0 bg-[radial-gradient(#d8b4fe_1px,transparent_1px)] [background-size:32px_32px] opacity-40" />

          {/* Cityscape Pixel Skyline Silhouette Overlay */}
          <div className="absolute top-[280px] left-0 right-0 h-48 opacity-25 hidden sm:block">
            <svg width="100%" height="100%" viewBox="0 0 1200 200" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 200V150H40V120H70V150H110V90H160V150H200V70H250V150H290V130H340V150H380V100H430V150H480V60H540V150H580V110H630V150H680V80H730V150H780V120H830V150H880V50H940V150H990V110H1040V150H1100V80H1150V150H1200V200H0Z" fill="#a855f7" />
            </svg>
          </div>
        </>
      )}

      {/* Grid Pattern overlay */}
      <div className={`absolute inset-0 transition-opacity duration-700 ${
        isRetro
          ? "bg-[linear-gradient(to_right,#a855f718_1px,transparent_1px),linear-gradient(to_bottom,#a855f718_1px,transparent_1px)] bg-[size:40px_40px]"
          : "bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]"
      }`} />
    </div>
  );
}
