-- 最终修复方案：完全移除约束

-- 1. 删除所有可能的约束
ALTER TABLE ai_images_creator_history 
DROP CONSTRAINT IF EXISTS valid_images_array;

-- 2. 检查是否还有其他约束
SELECT conname, contype, consrc 
FROM pg_constraint 
WHERE conrelid = 'ai_images_creator_history'::regclass;

-- 3. 如果表不存在，创建一个没有约束的版本
CREATE TABLE IF NOT EXISTS ai_images_creator_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  images JSONB NOT NULL, -- 存储图片URL数组，无约束
  task_id TEXT, -- 通义千问的任务ID，用于追踪
  credits_used INTEGER NOT NULL DEFAULT 1, -- 本次生成消耗的点数
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
DROP POLICY IF EXISTS "Service role can manage all history" ON ai_images_creator_history;

-- 7. 重新创建策略
CREATE POLICY "Users can view own history" ON ai_images_creator_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own history" ON ai_images_creator_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 8. 允许service_role绕过RLS
CREATE POLICY "Service role can manage all history" ON ai_images_creator_history
  FOR ALL USING (current_setting('role') = 'service_role');
