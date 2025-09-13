<h1 align="center">AI 智能图像生成器</h1>

<p align="center">
 基于 Next.js 和通义千问的智能图像生成平台
</p>

<p align="center">
  <a href="#features"><strong>功能特性</strong></a> ·
  <a href="#tech-stack"><strong>技术栈</strong></a> ·
  <a href="#installation"><strong>安装部署</strong></a> ·
  <a href="#usage"><strong>使用说明</strong></a> ·
  <a href="#api-config"><strong>API配置</strong></a>
</p>
<br/>

## 功能特性

### 🎨 AI 图像生成

- **智能提示词生成**：支持中英文提示词输入，AI 智能理解并生成高质量图像
- **批量生成**：一次生成 4 张不同风格的图像，提供更多选择
- **高分辨率输出**：支持 1024x1024 高分辨率图像生成
- **实时预览**：生成过程中显示骨架屏加载效果

### 🖼️ 图像管理

- **图片预览**：点击图片即可打开大图预览弹框
- **轮播浏览**：支持左右切换浏览多张图片
- **缩略图导航**：底部缩略图快速跳转到指定图片
- **一键下载**：支持单张图片下载功能

### 🔐 用户系统

- **用户认证**：基于 Supabase 的完整用户认证系统
- **登录注册**：支持邮箱注册和密码登录
- **密码重置**：忘记密码时支持邮箱重置
- **路由保护**：自动保护需要登录的页面

### 🎯 用户体验

- **响应式设计**：完美适配桌面端和移动端
- **现代化界面**：基于 shadcn/ui 的美观界面设计
- **中文界面**：完全中文化的用户界面
- **浮动导航**：未登录用户可见的浮动导航栏

## 技术栈

### 前端技术

- **[Next.js 15](https://nextjs.org/)** - React 全栈框架，使用 App Router
- **[React 19](https://react.dev/)** - 用户界面库
- **[TypeScript](https://www.typescriptlang.org/)** - 类型安全的 JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - 实用优先的 CSS 框架
- **[shadcn/ui](https://ui.shadcn.com/)** - 现代化组件库
- **[Framer Motion](https://www.framer.com/motion/)** - 动画库

### 后端服务

- **[Supabase](https://supabase.com/)** - 用户认证和数据库服务
- **[通义千问](https://dashscope.aliyuncs.com/)** - 阿里云 AI 图像生成服务
- **[Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)** - 服务端 API 代理

### 开发工具

- **[pnpm](https://pnpm.io/)** - 快速、节省磁盘空间的包管理器
- **[ESLint](https://eslint.org/)** - 代码质量检查
- **[Lucide React](https://lucide.dev/)** - 图标库

## 安装部署

### 环境要求

- Node.js 18+
- pnpm (推荐) 或 npm/yarn

### 本地开发

1. **克隆项目**

   ```bash
   git clone <your-repo-url>
   cd ai_images_creator
   ```

2. **安装依赖**

   ```bash
   pnpm install
   ```

3. **配置环境变量**

   创建 `.env.local` 文件并配置以下变量：

   ```env
   # Supabase 配置
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # 通义千问 API 配置
   NEXT_PUBLIC_QWEN_API_KEY=your_qwen_api_key
   ```

4. **启动开发服务器**

   ```bash
   pnpm dev
   ```

   访问 [http://localhost:3000](http://localhost:3000) 查看应用

### 生产部署

#### Vercel 部署

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 配置环境变量
4. 自动部署完成

#### 其他平台

项目支持部署到任何支持 Next.js 的平台，如 Netlify、Railway 等。

## 使用说明

### 基本使用流程

1. **注册登录**

   - 访问首页，点击"立即开始"按钮
   - 注册新账户或使用已有账户登录

2. **生成图像**

   - 在输入框中描述您想要生成的图像
   - 点击"生成新图片"按钮
   - 等待 AI 处理完成（通常需要 10-30 秒）

3. **查看和下载**
   - 点击任意图片进行大图预览
   - 使用轮播功能浏览多张图片
   - 点击下载按钮保存图片到本地

### 提示词建议

- **描述要具体**：包含主体、风格、颜色、构图等细节
- **支持中英文**：可以使用中文或英文描述
- **长度适中**：建议 10-100 个字符，过长会被自动截断

示例提示词：

- "一只可爱的橘猫坐在窗台上，阳光洒在它身上，写实风格"
- "未来主义城市夜景，霓虹灯闪烁，赛博朋克风格"
- "简约的现代客厅设计，北欧风格，温暖色调"

## API 配置

### Supabase 配置

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 创建新项目
3. 在 Settings > API 中获取：
   - Project URL
   - anon/public key

### 通义千问 API 配置

1. 访问 [阿里云百炼平台](https://dashscope.aliyuncs.com/)
2. 注册并创建 API Key
3. 将 API Key 配置到环境变量中

### 环境变量说明

| 变量名                          | 说明              | 获取方式           |
| ------------------------------- | ----------------- | ------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase 项目 URL | Supabase Dashboard |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | Supabase Dashboard |
| `NEXT_PUBLIC_QWEN_API_KEY`      | 通义千问 API 密钥 | 阿里云百炼平台     |

## 项目结构

```
ai_images_creator/
├── app/                    # Next.js App Router
│   ├── (marketing)/       # 营销页面组
│   ├── auth/              # 认证相关页面
│   ├── protected/         # 需要登录的页面
│   └── api/               # API 路由
├── components/            # React 组件
│   ├── ui/               # shadcn/ui 组件
│   └── ...               # 业务组件
├── lib/                  # 工具库
└── docs/                 # 文档
```

## 贡献指南

欢迎提交 Issue 和 Pull Request 来改进项目！

## 许可证

MIT License
