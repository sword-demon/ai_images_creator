export default function Support() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6">技术支持</h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto mb-8">
              如果您在使用过程中遇到任何问题，我们很乐意为您提供帮助。
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">常见问题</h3>
                <p className="text-neutral-600 dark:text-neutral-300">
                  查看我们的常见问题解答，快速找到解决方案。
                </p>
              </div>

              <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">联系客服</h3>
                <p className="text-neutral-600 dark:text-neutral-300">
                  如果问题仍未解决，请联系我们的客服团队。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
