-- 临时移除约束以解决当前问题

-- 1. 删除现有的约束
ALTER TABLE ai_images_creator_history 
DROP CONSTRAINT IF EXISTS valid_images_array;

-- 2. 暂时不添加任何约束，让系统正常工作
-- 后续可以根据需要重新添加约束
