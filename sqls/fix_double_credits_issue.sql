-- 修复双重分配点数的问题

-- 1. 重新创建 add_credits_to_user 函数，避免在用户已有记录时重复创建
CREATE OR REPLACE FUNCTION add_credits_to_user(
  p_user_id UUID,
  p_credits_to_add INTEGER
)
RETURNS BOOLEAN AS $$
BEGIN
  -- 只更新现有记录，不创建新记录
  UPDATE ai_images_creator_credits 
  SET credits = credits + p_credits_to_add,
      updated_at = NOW()
  WHERE user_id = p_user_id;
  
  -- 如果没有找到记录，则创建一个（但这应该很少发生，因为触发器会创建）
  IF NOT FOUND THEN
    INSERT INTO ai_images_creator_credits (user_id, credits)
    VALUES (p_user_id, p_credits_to_add);
  END IF;
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in add_credits_to_user for user %: %', p_user_id, SQLERRM;
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. 创建一个新的函数专门用于初始化新用户（只在没有记录时创建）
CREATE OR REPLACE FUNCTION init_user_credits(
  p_user_id UUID,
  p_initial_credits INTEGER DEFAULT 5
)
RETURNS BOOLEAN AS $$
BEGIN
  -- 只在没有记录时插入，如果已存在则不做任何操作
  INSERT INTO ai_images_creator_credits (user_id, credits)
  VALUES (p_user_id, p_initial_credits)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in init_user_credits for user %: %', p_user_id, SQLERRM;
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. 赋予权限
GRANT EXECUTE ON FUNCTION add_credits_to_user(UUID, INTEGER) TO service_role;
GRANT EXECUTE ON FUNCTION init_user_credits(UUID, INTEGER) TO service_role;
