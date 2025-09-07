"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Coins, Sparkles, X } from "lucide-react";

export default function ProtectedPage() {
  const [prompt, setPrompt] = useState("");
  const [points, setPoints] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  // 模拟生成的图片数据
  const mockImages = [
    "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=400&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center",
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    // 模拟生成过程
    setTimeout(() => {
      setGeneratedImages((prev) => [...prev, ...mockImages.slice(0, 1)]);
      setPoints((prev) => Math.max(0, prev - 1));
      setIsGenerating(false);
    }, 2000);
  };

  const handleRecharge = () => {
    setPoints(5);
  };

  const handleClearPrompt = () => {
    setPrompt("");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 顶部输入区域 */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 relative">
            <Plus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="输入您的创意描述..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="pl-10 pr-10 h-12 text-lg"
              onKeyPress={(e) => e.key === "Enter" && handleGenerate()}
            />
            {prompt && (
              <button
                onClick={handleClearPrompt}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 bg-muted px-4 h-12 rounded-lg">
            <Coins className="w-4 h-4 text-yellow-500" />
            <span className="font-medium">{points}</span>
          </div>

          <Button onClick={handleRecharge} variant="outline" className="h-12">
            充值
          </Button>
        </div>

        {/* 图片展示区域 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {generatedImages.length > 0 ? (
            generatedImages.map((image, index) => (
              <Card
                key={index}
                className="overflow-hidden group hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-0">
                  <div className="relative aspect-square">
                    <img
                      src={image}
                      alt={`生成的图片 ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                      1.00
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Button size="sm" variant="secondary">
                        下载
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            // 占位卡片
            <Card className="col-span-full md:col-span-2 lg:col-span-4">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  开始创作您的第一张图片
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  在上方输入框中描述您想要生成的图片，我们的 AI
                  将为您创造出独特的艺术作品
                </p>
                <Button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  className="gap-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      开始生成
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 生成按钮（当有图片时显示） */}
        {generatedImages.length > 0 && (
          <div className="mt-8 text-center">
            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating || points === 0}
              size="lg"
              className="gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  生成中...
                </>
              ) : points === 0 ? (
                "点数不足，请充值"
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  生成新图片
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
