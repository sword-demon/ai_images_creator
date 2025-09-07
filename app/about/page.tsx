export default function About() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6">关于我们</h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
              这是一个基于 Next.js 和 Supabase 构建的 AI 图像生成器项目。
              我们致力于为用户提供简单易用的图像生成服务。
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
