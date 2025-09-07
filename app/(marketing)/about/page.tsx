import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Zap } from "lucide-react";

export default function About() {
  return (
    <main className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* 页面标题区域 */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            关于我们
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            AI 智能图像生成器
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            我们致力于让每个人都能轻松创造专业级的图像内容，通过先进的 AI 技术，
            将您的创意想法转化为令人惊叹的视觉作品。
          </p>
        </div>

        {/* 特色卡片区域 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>用户友好</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                简单直观的界面设计，让任何人都能快速上手，无需专业技能即可创作出专业级图像。
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>精准生成</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                基于先进的 AI
                模型，能够准确理解您的需求，生成高质量、符合预期的图像内容。
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>快速高效</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                强大的云端处理能力，让您在几秒钟内就能获得满意的图像结果，大大提升创作效率。
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* 技术栈区域 */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-center">技术栈</CardTitle>
            <CardDescription className="text-center">
              我们使用最先进的技术构建这个平台
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold">Next.js</h3>
                <p className="text-sm text-muted-foreground">React 框架</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold">Supabase</h3>
                <p className="text-sm text-muted-foreground">后端服务</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold">AI 模型</h3>
                <p className="text-sm text-muted-foreground">图像生成</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold">TypeScript</h3>
                <p className="text-sm text-muted-foreground">类型安全</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
