-- 修复用户注册触发器问题

-- 1. 先删除现有的触发器和函数
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user_credits();

-- 2. 重新创建触发器函数，添加错误处理
CREATE OR REPLACE FUNCTION public.handle_new_user_credits()
RETURNS TRIGGER AS $$
BEGIN
  -- 使用 INSERT ... ON CONFLICT 避免重复插入
  INSERT INTO public.ai_images_creator_credits (user_id, credits)
  VALUES (NEW.id, 5)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- 记录错误但不阻止用户注册
    RAISE LOG 'Error creating credits for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. 重新创建触发器
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_credits();

-- 4. 确保函数有正确的权限
GRANT EXECUTE ON FUNCTION public.handle_new_user_credits() TO service_role;

-- 5. 检查表是否存在，如果不存在则创建
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ai_images_creator_credits') THEN
    -- 如果表不存在，创建它
    CREATE TABLE public.ai_images_creator_credits (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      credits INTEGER NOT NULL DEFAULT 0 CHECK (credits >= 0),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      
      -- 确保每个用户只有一条记录
      UNIQUE(user_id)
    );

    -- 创建索引
    CREATE INDEX idx_ai_images_creator_credits_user_id ON public.ai_images_creator_credits(user_id);

    -- 启用行级安全策略
    ALTER TABLE public.ai_images_creator_credits ENABLE ROW LEVEL SECURITY;

    -- 创建安全策略
    CREATE POLICY "Users can view own credits" ON public.ai_images_creator_credits
      FOR SELECT USING (auth.uid() = user_id);

    CREATE POLICY "Users can update own credits" ON public.ai_images_creator_credits
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END
$$;
