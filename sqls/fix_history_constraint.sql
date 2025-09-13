-- 修复历史记录表的约束问题

-- 1. 删除现有的约束
ALTER TABLE ai_images_creator_history 
DROP CONSTRAINT IF EXISTS valid_images_array;

-- 2. 添加新的约束，允许空数组或4个元素的数组
ALTER TABLE ai_images_creator_history 
ADD CONSTRAINT valid_images_array CHECK (
  jsonb_array_length(images) = 0 OR jsonb_array_length(images) = 4
);

-- 3. 如果表不存在，创建完整的表结构
CREATE TABLE IF NOT EXISTS ai_images_creator_history (
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

-- 4. 创建索引（如果不存在）
CREATE INDEX IF NOT EXISTS idx_ai_images_creator_history_user_id ON ai_images_creator_history(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_images_creator_history_created_at ON ai_images_creator_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_images_creator_history_task_id ON ai_images_creator_history(task_id);

-- 5. 启用行级安全策略
ALTER TABLE ai_images_creator_history ENABLE ROW LEVEL SECURITY;

-- 6. 删除可能存在的冲突策略
DROP POLICY IF EXISTS "Users can view own history" ON ai_images_creator_history;
DROP POLICY IF EXISTS "Users can insert own history" ON ai_images_creator_history;

-- 7. 重新创建策略
CREATE POLICY "Users can view own history" ON ai_images_creator_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own history" ON ai_images_creator_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 8. 允许service_role绕过RLS
CREATE POLICY "Service role can manage all history" ON ai_images_creator_history
  FOR ALL USING (current_setting('role') = 'service_role');
