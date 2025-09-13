"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Coins,
  Sparkles,
  X,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";

// 定义接口类型
interface TaskResponse {
  output: {
    task_status: string;
    task_id: string;
  };
  request_id: string;
}

interface TaskResult {
  request_id: string;
  output: {
    task_id: string;
    task_status: string;
    results: Array<{
      orig_prompt: string;
      actual_prompt?: string;
      url: string;
    }>;
  };
  usage: {
    image_count: number;
  };
}

export default function ProtectedPage() {
  const [prompt, setPrompt] = useState("");
  const [points, setPoints] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [currentTaskId, setCurrentTaskId] = useState<string>("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 创建图片生成任务
  const createImageTask = async (promptText: string): Promise<string> => {
    const response = await fetch("/api/generate-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: promptText,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `创建任务失败: ${response.statusText}`
      );
    }

    const data: TaskResponse = await response.json();
    return data.output.task_id;
  };

  // 查询任务结果
  const queryTaskResult = async (taskId: string): Promise<TaskResult> => {
    const response = await fetch(`/api/query-task?taskId=${taskId}`, {
      method: "GET",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `查询任务失败: ${response.statusText}`
      );
    }

    return await response.json();
  };

  // 轮询任务状态
  const pollTaskStatus = async (taskId: string): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          const result = await queryTaskResult(taskId);
          const { task_status, results } = result.output;

          if (task_status === "SUCCEEDED") {
            const imageUrls = results.map((item) => item.url);
            resolve(imageUrls);
          } else if (task_status === "FAILED") {
            reject(new Error("图片生成失败"));
          } else if (task_status === "PENDING" || task_status === "RUNNING") {
            // 继续轮询
            setTimeout(poll, 2000);
          } else {
            reject(new Error(`未知任务状态: ${task_status}`));
          }
        } catch (error) {
          reject(error);
        }
      };

      poll();
    });
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError("");
    setCurrentTaskId("");

    try {
      // 创建任务
      const taskId = await createImageTask(prompt);
      setCurrentTaskId(taskId);

      // 轮询结果
      const imageUrls = await pollTaskStatus(taskId);
      setGeneratedImages((prev) => [...prev, ...imageUrls]);
      setPoints((prev) => Math.max(0, prev - 1));
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成图片时发生未知错误");
    } finally {
      setIsGenerating(false);
      setCurrentTaskId("");
    }
  };

  const handleRecharge = () => {
    setPoints(5);
  };

  const handleClearPrompt = () => {
    setPrompt("");
  };

  // 打开图片预览
  const handleImagePreview = (index: number) => {
    setCurrentImageIndex(index);
    setPreviewOpen(true);
  };

  // 轮播图导航
  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? generatedImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === generatedImages.length - 1 ? 0 : prev + 1
    );
  };

  // 下载图片
  const handleDownloadImage = async (imageUrl: string, index: number) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `generated-image-${index + 1}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("下载图片失败:", error);
    }
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

        {/* 错误提示 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {/* 图片展示区域 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 骨架屏加载效果 */}
          {isGenerating && (
            <>
              {Array.from({ length: 4 }).map((_, index) => (
                <Card key={`skeleton-${index}`} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative aspect-square">
                      <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                          <p className="text-sm text-gray-500">生成中...</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}

          {/* 已生成的图片 */}
          {generatedImages.length > 0 &&
            !isGenerating &&
            generatedImages.map((image, index) => (
              <Card
                key={index}
                className="overflow-hidden group hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleImagePreview(index)}
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
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadImage(image, index);
                        }}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        下载
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

          {/* 占位卡片（无图片且未生成时） */}
          {generatedImages.length === 0 && !isGenerating && (
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
        {generatedImages.length > 0 && !isGenerating && (
          <div className="mt-8 text-center">
            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating || points === 0}
              size="lg"
              className="gap-2"
            >
              {points === 0 ? (
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

        {/* 任务状态显示 */}
        {isGenerating && currentTaskId && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              <span>正在生成图片，请稍候...</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              任务ID: {currentTaskId}
            </p>
          </div>
        )}

        {/* 图片预览弹框 */}
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] p-0">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="text-center">
                图片预览 ({currentImageIndex + 1} / {generatedImages.length})
              </DialogTitle>
            </DialogHeader>

            <div className="relative p-6">
              {/* 主图片显示区域 */}
              <div className="relative aspect-square max-h-[60vh] bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={generatedImages[currentImageIndex]}
                  alt={`预览图片 ${currentImageIndex + 1}`}
                  className="w-full h-full object-contain"
                />

                {/* 导航按钮 */}
                {generatedImages.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                      onClick={handlePreviousImage}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                      onClick={handleNextImage}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>

              {/* 缩略图导航 */}
              {generatedImages.length > 1 && (
                <div className="mt-4 flex gap-2 justify-center overflow-x-auto">
                  {generatedImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        index === currentImageIndex
                          ? "border-primary"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`缩略图 ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* 操作按钮 */}
              <div className="mt-6 flex justify-center gap-4">
                <Button
                  onClick={() =>
                    handleDownloadImage(
                      generatedImages[currentImageIndex],
                      currentImageIndex
                    )
                  }
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  下载图片
                </Button>
                <Button variant="outline" onClick={() => setPreviewOpen(false)}>
                  关闭
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
