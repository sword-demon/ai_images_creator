"use client";

import React from "react";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { Home, User, HelpCircle } from "lucide-react";

export function FloatingNavDemo() {
  // 定义导航项目：首页、关于、支持、登录按钮
  const navItems = [
    {
      name: "首页",
      link: "/",
      icon: <Home className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "关于",
      link: "/about",
      icon: <User className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "支持",
      link: "/support",
      icon: <HelpCircle className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
  ];

  return (
    <div className="relative w-full">
      {/* 悬浮导航栏组件 */}
      <FloatingNav navItems={navItems} />
    </div>
  );
}
