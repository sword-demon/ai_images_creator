"use client";

import React, { useEffect, useState } from "react";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { Home, User, HelpCircle, LogIn, Coins } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export function FloatingNavDemo() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
      setUser(user);

      // 如果用户已登录，获取点数
      if (user) {
        try {
          const response = await fetch("/api/user/credits");
          if (response.ok) {
            const data = await response.json();
            setCredits(data.credits);
          }
        } catch (error) {
          console.error("获取点数失败:", error);
        }
      }

      setIsLoading(false);
    };

    checkAuthStatus();

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setIsLoggedIn(!!session?.user);
      setUser(session?.user || null);

      // 如果用户登录，获取点数
      if (session?.user) {
        try {
          const response = await fetch("/api/user/credits");
          if (response.ok) {
            const data = await response.json();
            setCredits(data.credits);
          }
        } catch (error) {
          console.error("获取点数失败:", error);
        }
      } else {
        setCredits(0);
      }

      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 基础导航项目
  const baseNavItems = [
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

  // 根据登录状态添加不同的导航项目
  const navItems = isLoggedIn
    ? [
        ...baseNavItems,
        {
          name: "创作",
          link: "/protected",
          icon: <User className="h-4 w-4 text-neutral-500 dark:text-white" />,
        },
      ]
    : baseNavItems;

  // 右侧按钮
  const rightButton = isLoggedIn ? (
    <div className="flex items-center gap-2">
      {/* 点数显示 */}
      <div className="flex items-center gap-1 px-2 py-1 bg-yellow-50 border border-yellow-200 rounded-full">
        <Coins className="w-3 h-3 text-yellow-600" />
        <span className="text-xs font-medium text-yellow-700">{credits}</span>
      </div>

      {/* 用户信息 */}
      <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded-full">
        <User className="w-3 h-3 text-blue-600" />
        <span className="text-xs font-medium text-blue-700">
          {user?.email?.split("@")[0] || "用户"}
        </span>
      </div>
    </div>
  ) : (
    <Link href="/auth/sign-in">
      <button className="border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
        <span>登录</span>
        <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent h-px" />
      </button>
    </Link>
  );

  return (
    <div className="relative w-full">
      {/* 悬浮导航栏组件 */}
      <FloatingNav navItems={navItems} rightButton={rightButton} />
    </div>
  );
}
