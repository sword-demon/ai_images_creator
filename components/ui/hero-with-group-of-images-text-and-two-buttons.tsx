"use client";

import { MoveRight, PhoneCall, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

function Hero() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
      setIsLoading(false);
    };

    checkAuthStatus();

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session?.user);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full py-20 lg:py-40">
        <div className="container mx-auto">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-8 items-center md:grid-cols-2">
          <div className="flex gap-4 flex-col">
            <div>
              <Badge variant="outline">
                {isLoggedIn ? "欢迎回来！" : "我们上线了！"}
              </Badge>
            </div>
            <div className="flex gap-4 flex-col">
              <h1 className="text-5xl md:text-7xl max-w-lg tracking-tighter text-left font-regular">
                AI智能图像生成器
              </h1>
              <p className="text-xl leading-relaxed tracking-tight text-muted-foreground max-w-md text-left">
                {isLoggedIn
                  ? "您已登录，可以开始创作您的AI图像作品了！"
                  : "告别复杂的图像设计工具，只需输入你的想法，我们的 AI 就能为你生成专业级的图像。无论是商业设计、艺术创作还是个人项目，让创意瞬间变为现实。"}
              </p>
            </div>
            <div className="flex flex-row gap-4">
              {isLoggedIn ? (
                <Link href="/protected">
                  <Button size="lg" className="gap-4">
                    开始创作 <Sparkles className="w-4 h-4" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/support">
                    <Button size="lg" className="gap-4" variant="outline">
                      联系我们 <PhoneCall className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/auth/sign-in">
                    <Button size="lg" className="gap-4">
                      立即开始 <MoveRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-muted rounded-md aspect-square overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop&crop=center"
                alt="AI 生成的商业设计图像"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-muted rounded-md row-span-2 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=800&fit=crop&crop=center"
                alt="AI 生成的艺术创作图像"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-muted rounded-md aspect-square overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center"
                alt="AI 生成的创意设计图像"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
