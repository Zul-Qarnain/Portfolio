"use client";

export function SiteBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden bg-background">
      <div className="absolute -top-24 -left-24 h-[420px] w-[420px] rounded-full bg-violet-500/10 blur-[120px] dark:bg-violet-500/20" />
      <div className="absolute top-1/3 -right-24 h-[380px] w-[380px] rounded-full bg-sky-500/10 blur-[120px] dark:bg-sky-500/20" />
      <div className="absolute -bottom-24 left-1/3 h-[320px] w-[320px] rounded-full bg-fuchsia-500/10 blur-[120px] dark:bg-fuchsia-500/15" />
    </div>
  );
}
