import { FloatingNavDemo } from "@/components/floating-nav-demo";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* 营销页面专用悬浮导航栏 */}
      <FloatingNavDemo />
      {/* 给页面内容添加顶部间距，避免被导航栏遮挡 */}
      <div className="pt-20">{children}</div>
    </>
  );
}
