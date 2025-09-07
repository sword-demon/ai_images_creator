import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HelpCircle,
  MessageCircle,
  Mail,
  BookOpen,
  Clock,
  CheckCircle,
} from "lucide-react";

export default function Support() {
  return (
    <main className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* 页面标题区域 */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            技术支持
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            需要帮助？
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            我们为您提供全方位的技术支持，确保您能够顺利使用我们的 AI
            图像生成服务。 无论遇到什么问题，我们都会及时为您解决。
          </p>
        </div>

        {/* 支持选项卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>常见问题</CardTitle>
              <CardDescription>
                查看我们的常见问题解答，快速找到解决方案
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                查看 FAQ
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>在线客服</CardTitle>
              <CardDescription>实时在线客服，即时解答您的问题</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                开始对话
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>邮件支持</CardTitle>
              <CardDescription>
                发送邮件给我们，我们会在 24 小时内回复
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                发送邮件
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 常见问题区域 */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-center">常见问题</CardTitle>
            <CardDescription className="text-center">
              以下是用户最常遇到的问题和解答
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold mb-2">
                  如何开始使用 AI 图像生成？
                </h3>
                <p className="text-muted-foreground">
                  注册账号后，在输入框中描述您想要的图像，点击生成按钮即可。建议使用详细、具体的描述来获得更好的效果。
                </p>
              </div>

              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold mb-2">生成的图像质量如何？</h3>
                <p className="text-muted-foreground">
                  我们使用先进的 AI
                  模型，能够生成高分辨率、高质量的图像。图像质量取决于您的描述详细程度和创意需求。
                </p>
              </div>

              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold mb-2">支持哪些图像格式？</h3>
                <p className="text-muted-foreground">
                  我们支持 PNG、JPG
                  等主流图像格式，您可以根据需要选择合适的格式下载。
                </p>
              </div>

              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold mb-2">生成图像需要多长时间？</h3>
                <p className="text-muted-foreground">
                  通常生成一张图像需要 10-30
                  秒，具体时间取决于图像复杂度和服务器负载情况。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 联系信息 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">联系我们</CardTitle>
            <CardDescription className="text-center">
              多种联系方式，总有一种适合您
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">服务时间</h3>
                <p className="text-muted-foreground">周一至周五 9:00-18:00</p>
              </div>

              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">响应时间</h3>
                <p className="text-muted-foreground">24 小时内回复</p>
              </div>

              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <HelpCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">支持语言</h3>
                <p className="text-muted-foreground">中文、英文</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
