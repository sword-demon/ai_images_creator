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

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // 将英文错误消息转换为中文
  const getChineseErrorMessage = (error: any): string => {
    const message = error?.message || error?.toString() || "";

    if (message.includes("User already registered")) {
      return "该邮箱已被注册，请使用其他邮箱或直接登录";
    }
    if (message.includes("Invalid email")) {
      return "邮箱格式不正确，请检查后重试";
    }
    if (message.includes("Password should be at least")) {
      return "密码长度至少需要6位字符";
    }
    if (message.includes("Password is too weak")) {
      return "密码强度不够，请使用更复杂的密码";
    }
    if (message.includes("Email rate limit exceeded")) {
      return "注册请求过于频繁，请稍后再试";
    }
    if (message.includes("Network")) {
      return "网络连接失败，请检查网络后重试";
    }

    // 默认返回原始错误信息，但添加中文前缀
    return `注册失败：${message}`;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      const errorMessage = "两次输入的密码不一致";
      setError(errorMessage);
      toast.error("注册失败", {
        description: errorMessage,
        duration: 5000,
      });
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/protected`,
        },
      });

      if (error) {
        const chineseMessage = getChineseErrorMessage(error);
        setError(chineseMessage);
        toast.error("注册失败", {
          description: chineseMessage,
          duration: 5000,
        });
        return;
      }

      // 注册成功
      toast.success("注册成功", {
        description: "请检查您的邮箱并点击验证链接",
        duration: 3000,
      });

      // 延迟跳转，让用户看到成功提示
      setTimeout(() => {
        router.push("/auth/sign-up-success");
      }, 1000);
    } catch (error: unknown) {
      const chineseMessage = getChineseErrorMessage(error);
      setError(chineseMessage);
      toast.error("注册失败", {
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
          <CardTitle className="text-3xl font-bold">创建账户</CardTitle>
          <CardDescription className="text-lg">
            注册新账户，开启您的 AI 图像创作之旅
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
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
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="请输入密码（至少6位）"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="repeat-password">确认密码</Label>
                </div>
                <Input
                  id="repeat-password"
                  type="password"
                  placeholder="请再次输入密码"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "创建账户中..." : "创建账户"}
              </Button>
            </div>
            <div className="mt-6 text-center text-sm">
              已有账户？{" "}
              <Link
                href="/auth/sign-in"
                className="underline underline-offset-4 hover:text-primary"
              >
                立即登录
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
