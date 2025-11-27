"use client";

import React, { useState } from 'react';
import { skillsData } from '@/lib/data';
import { cn } from '@/lib/utils';
import { 
  Code2, 
  Database, 
  Layout, 
  Server, 
  Brain, 
  Terminal,
  ChevronDown,
  Cpu,
  Flame,
  Smile,
  Sigma,
  PieChart,
  Table,
  TrendingUp,
  Braces,
  FileText,
  Coffee,
  Settings2,
  Atom,
  Triangle,
  Palette,
  BoxSelect,
  DatabaseZap,
  Layers
} from 'lucide-react';

// Map string icon names to components
const iconMap: { [key: string]: React.ElementType } = {
  Flame, Smile, Sigma, PieChart, Table, TrendingUp, Braces, Code2, FileText, Coffee, Settings2, Atom, Triangle, Layout, Palette, BoxSelect, Server, Database, DatabaseZap, Layers, Brain, Terminal, Cpu
};

export function SkillsTree() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [isRootExpanded, setIsRootExpanded] = useState(false);

  // Group skills
  const groupedSkills = skillsData.reduce<{ [key: string]: typeof skillsData }>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const categories = Object.keys(groupedSkills);

  return (
    <div className="flex flex-col items-center w-full py-10">
      {/* Root Node */}
      <button 
        onClick={() => setIsRootExpanded(!isRootExpanded)}
        className={cn(
          "z-10 flex items-center gap-2 px-8 py-4 rounded-full text-xl font-bold transition-all duration-300 border-2",
          isRootExpanded 
            ? "bg-primary text-primary-foreground border-primary shadow-[0_0_20px_rgba(var(--primary),0.5)]" 
            : "bg-card text-card-foreground border-primary/50 hover:border-primary hover:shadow-lg"
        )}
      >
        <Layers className="w-6 h-6" />
        Skills
        <ChevronDown className={cn("w-5 h-5 transition-transform duration-300", isRootExpanded ? "rotate-180" : "")} />
      </button>

      {/* Connecting Line from Root */}
      <div className={cn(
        "w-0.5 bg-border transition-all duration-500 ease-in-out",
        isRootExpanded ? "h-12 opacity-100" : "h-0 opacity-0"
      )} />

      {/* Categories Level */}
      <div className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8 transition-all duration-500 ease-in-out w-full max-w-6xl px-4",
        isRootExpanded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none absolute"
      )}>
        {isRootExpanded && categories.map((category) => (
          <div key={category} className="flex flex-col items-center">
            {/* Category Node */}
            <button
              onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
              className={cn(
                "relative z-10 w-full max-w-[250px] flex items-center justify-between px-6 py-3 rounded-xl border-2 transition-all duration-300",
                expandedCategory === category
                  ? "bg-secondary text-secondary-foreground border-secondary shadow-md"
                  : "bg-card text-card-foreground border-border hover:border-primary/50"
              )}
            >
              <span className="font-semibold">{category}</span>
              <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", expandedCategory === category ? "rotate-180" : "")} />
            </button>

            {/* Connecting Line to Skills */}
            <div className={cn(
              "w-0.5 bg-border transition-all duration-300 ease-in-out",
              expandedCategory === category ? "h-8 opacity-100" : "h-0 opacity-0"
            )} />

            {/* Skills Level (Children of Category) */}
            <div className={cn(
              "flex flex-col gap-4 w-full transition-all duration-500 ease-in-out",
              expandedCategory === category 
                ? "opacity-100 translate-y-0 max-h-[1000px]" 
                : "opacity-0 -translate-y-4 max-h-0 overflow-hidden"
            )}>
              {groupedSkills[category].map((skill) => {
                const Icon = iconMap[skill.icon] || Code2;
                return (
                  <div 
                    key={skill.name}
                    className="bg-card/50 backdrop-blur-sm border border-border p-4 rounded-lg flex items-center gap-4 hover:bg-card transition-colors"
                  >
                    <div className={cn("p-2 rounded-md bg-background", skill.iconClasses)}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-sm">{skill.name}</span>
                      </div>
                      <div className="h-4 w-full bg-secondary/30 rounded-full overflow-hidden relative">
                        <div 
                          className={cn("h-full rounded-full transition-all duration-1000 flex items-center justify-end px-2", skill.color)}
                          style={{ width: `${skill.percentage}%` }}
                        >
                          <span className="text-[10px] font-bold text-white drop-shadow-md">{skill.percentage}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}