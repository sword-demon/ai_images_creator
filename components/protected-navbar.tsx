"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";
import { Home, User, Coins } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export function ProtectedNavbar() {
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initUser = async () => {
      const supabase = createClient();

      // 获取当前用户
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      // 获取用户点数
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

    initUser();

    // 监听认证状态变化
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        // 重新获取点数
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
        setUser(null);
        setCredits(0);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-4">
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* 左侧：首页链接 */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold hover:text-primary transition-colors"
            >
              <Home className="w-5 h-5" />
              AI图片生成器
            </Link>
          </div>

          {/* 右侧：用户信息和操作 */}
          <div className="flex items-center gap-4">
            {/* 点数显示 */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-lg">
              <Coins className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-700">
                {credits} 点数
              </span>
            </div>

            {/* 用户信息 */}
            {user && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
                <User className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">
                  {user.email?.split("@")[0] || "用户"}
                </span>
              </div>
            )}

            {/* 退出登录按钮 */}
            <LogoutButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
