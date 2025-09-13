-- 创建图片生成历史表
CREATE TABLE ai_images_creator_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  images JSONB NOT NULL, -- 存储4张图片的URL数组
  task_id TEXT, -- 通义千问的任务ID，用于追踪
  credits_used INTEGER NOT NULL DEFAULT 1, -- 本次生成消耗的点数
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 添加约束：允许空数组（pending状态）或4个元素的数组（completed状态）
  CONSTRAINT valid_images_array CHECK (
    jsonb_array_length(images) = 0 OR jsonb_array_length(images) = 4
  )
);

-- 创建索引
CREATE INDEX idx_ai_images_creator_history_user_id ON ai_images_creator_history(user_id);
CREATE INDEX idx_ai_images_creator_history_created_at ON ai_images_creator_history(created_at DESC);
CREATE INDEX idx_ai_images_creator_history_task_id ON ai_images_creator_history(task_id);

-- 启用行级安全策略
ALTER TABLE ai_images_creator_history ENABLE ROW LEVEL SECURITY;

-- 创建安全策略：用户只能查看自己的生成历史
CREATE POLICY "Users can view own history" ON ai_images_creator_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own history" ON ai_images_creator_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 创建函数：生成图片时自动扣除点数
CREATE OR REPLACE FUNCTION deduct_credits_for_generation(
  p_user_id UUID,
  p_credits_to_deduct INTEGER DEFAULT 1
)
RETURNS BOOLEAN AS $$
DECLARE
  current_credits INTEGER;
BEGIN
  -- 获取当前点数
  SELECT credits INTO current_credits 
  FROM ai_images_creator_credits 
  WHERE user_id = p_user_id;
  
  -- 检查点数是否足够
  IF current_credits IS NULL OR current_credits < p_credits_to_deduct THEN
    RETURN FALSE;
  END IF;
  
  -- 扣除点数
  UPDATE ai_images_creator_credits 
  SET credits = credits - p_credits_to_deduct,
      updated_at = NOW()
  WHERE user_id = p_user_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建函数：充值点数
CREATE OR REPLACE FUNCTION add_credits_to_user(
  p_user_id UUID,
  p_credits_to_add INTEGER
)
RETURNS BOOLEAN AS $$
BEGIN
  -- 如果用户没有点数记录，先创建
  INSERT INTO ai_images_creator_credits (user_id, credits)
  VALUES (p_user_id, p_credits_to_add)
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    credits = ai_images_creator_credits.credits + p_credits_to_add,
    updated_at = NOW();
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;