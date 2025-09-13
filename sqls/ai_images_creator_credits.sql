-- 创建用户点数表
CREATE TABLE ai_images_creator_credits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credits INTEGER NOT NULL DEFAULT 0 CHECK (credits >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 确保每个用户只有一条记录
  UNIQUE(user_id)
);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ai_images_creator_credits_updated_at 
  BEFORE UPDATE ON ai_images_creator_credits 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 创建索引
CREATE INDEX idx_ai_images_creator_credits_user_id ON ai_images_creator_credits(user_id);

-- 启用行级安全策略
ALTER TABLE ai_images_creator_credits ENABLE ROW LEVEL SECURITY;

-- 创建安全策略：用户只能查看和修改自己的点数
CREATE POLICY "Users can view own credits" ON ai_images_creator_credits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own credits" ON ai_images_creator_credits
  FOR UPDATE USING (auth.uid() = user_id);

-- 创建新用户注册时自动分配5个点数的函数
CREATE OR REPLACE FUNCTION handle_new_user_credits()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO ai_images_creator_credits (user_id, credits)
  VALUES (NEW.id, 5);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建触发器：新用户注册时自动分配点数
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_credits();