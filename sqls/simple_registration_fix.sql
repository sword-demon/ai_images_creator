-- 简化的用户注册修复方案

-- 1. 删除现有触发器（如果存在）
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user_credits();
DROP FUNCTION IF EXISTS public.handle_new_user_credits();

-- 2. 创建一个非常简单的触发器函数
CREATE OR REPLACE FUNCTION public.handle_new_user_credits()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- 简单插入，忽略任何错误
  BEGIN
    INSERT INTO public.ai_images_creator_credits (user_id, credits)
    VALUES (NEW.id, 5);
  EXCEPTION WHEN OTHERS THEN
    -- 忽略所有错误，不阻止用户注册
    NULL;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. 重新创建触发器
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user_credits();

-- 4. 赋予必要权限
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON public.ai_images_creator_credits TO service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user_credits() TO service_role;

-- 5. 如果表不存在，创建基础版本
CREATE TABLE IF NOT EXISTS public.ai_images_creator_credits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  credits INTEGER NOT NULL DEFAULT 0 CHECK (credits >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 确保RLS策略存在
ALTER TABLE public.ai_images_creator_credits ENABLE ROW LEVEL SECURITY;

-- 删除可能存在的冲突策略
DROP POLICY IF EXISTS "Users can view own credits" ON public.ai_images_creator_credits;
DROP POLICY IF EXISTS "Users can update own credits" ON public.ai_images_creator_credits;

-- 重新创建策略
CREATE POLICY "Users can view own credits" ON public.ai_images_creator_credits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own credits" ON public.ai_images_creator_credits
  FOR UPDATE USING (auth.uid() = user_id);

-- 允许service_role绕过RLS
CREATE POLICY "Service role can manage all credits" ON public.ai_images_creator_credits
  FOR ALL USING (current_setting('role') = 'service_role');
