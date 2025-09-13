-- 快速修复：移除约束，让系统正常工作

-- 删除约束
ALTER TABLE ai_images_creator_history 
DROP CONSTRAINT IF EXISTS valid_images_array;

-- 检查表结构
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'ai_images_creator_history' 
AND table_schema = 'public';
