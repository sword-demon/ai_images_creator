import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

// 初始化用户数据（首次登录时调用）
export async function POST(request: NextRequest) {
  try {
    // 获取用户信息
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: '用户未认证' },
        { status: 401 }
      );
    }

    const adminClient = createAdminClient();
    
    // 使用专门的初始化函数，避免重复分配点数
    const { error: initError } = await adminClient.rpc(
      'init_user_credits',
      {
        p_user_id: user.id,
        p_initial_credits: 5
      }
    );

    if (initError) {
      console.error('初始化用户点数错误:', initError);
      // 不返回错误，继续执行，可能触发器已经创建了记录
    }

    // 获取最新的点数
    const { data: credits } = await adminClient
      .from('ai_images_creator_credits')
      .select('credits')
      .eq('user_id', user.id)
      .single();

    return NextResponse.json({
      success: true,
      credits: credits?.credits || 0,
      message: '用户数据初始化成功'
    });
  } catch (error) {
    console.error('用户初始化API错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}
