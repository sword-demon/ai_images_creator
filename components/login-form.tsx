"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // 将英文错误消息转换为中文
  const getChineseErrorMessage = (error: any): string => {
    const message = error?.message || error?.toString() || "";

    if (message.includes("Invalid login credentials")) {
      return "邮箱或密码错误，请检查后重试";
    }
    if (message.includes("Email not confirmed")) {
      return "请先验证您的邮箱地址";
    }
    if (message.includes("Too many requests")) {
      return "登录尝试次数过多，请稍后再试";
    }
    if (message.includes("User not found")) {
      return "用户不存在，请检查邮箱地址";
    }
    if (message.includes("Invalid email")) {
      return "邮箱格式不正确";
    }
    if (message.includes("Password should be at least")) {
      return "密码长度不符合要求";
    }
    if (message.includes("Network")) {
      return "网络连接失败，请检查网络后重试";
    }

    // 默认返回原始错误信息，但添加中文前缀
    return `登录失败：${message}`;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        const chineseMessage = getChineseErrorMessage(error);
        setError(chineseMessage);
        toast.error("登录失败", {
          description: chineseMessage,
          duration: 5000,
        });
        return;
      }

      // 登录成功
      toast.success("登录成功", {
        description: "欢迎回来！正在跳转...",
        duration: 2000,
      });

      // 延迟跳转，让用户看到成功提示
      setTimeout(() => {
        router.push("/protected");
      }, 1000);
    } catch (error: unknown) {
      const chineseMessage = getChineseErrorMessage(error);
      setError(chineseMessage);
      toast.error("登录失败", {
        description: chineseMessage,
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">欢迎回来</CardTitle>
          <CardDescription className="text-lg">
            登录您的账户，开始创作精彩图像
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">邮箱地址</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="请输入您的邮箱地址"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">密码</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    忘记密码？
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="请输入您的密码"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "登录中..." : "登录"}
              </Button>
            </div>
            <div className="mt-6 text-center text-sm">
              还没有账户？{" "}
              <Link
                href="/auth/sign-up"
                className="underline underline-offset-4 hover:text-primary"
              >
                立即注册
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
