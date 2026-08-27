"use client";

export function SiteBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden bg-background">
      {/* Top Left Vibrant Purple/Violet Glow */}
      <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-violet-600/25 to-fuchsia-600/20 blur-[130px] dark:from-violet-500/30 dark:to-fuchsia-600/25" />
      
      {/* Middle Right Vibrant Sky/Cyan Glow */}
      <div className="absolute top-1/3 -right-32 h-[450px] w-[450px] rounded-full bg-gradient-to-bl from-cyan-500/25 to-blue-600/20 blur-[130px] dark:from-cyan-400/30 dark:to-blue-600/25" />
      
      {/* Bottom Left Vibrant Pink/Emerald Accent */}
      <div className="absolute -bottom-32 left-1/4 h-[420px] w-[420px] rounded-full bg-gradient-to-tr from-pink-500/20 via-purple-500/15 to-emerald-500/15 blur-[140px] dark:from-pink-500/25 dark:via-purple-600/20 dark:to-emerald-400/20" />
      
      {/* Subtle Grid Pattern overlay for depth */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]" />
    </div>
  );
}
