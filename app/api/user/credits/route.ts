import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// 获取用户点数
export async function GET(request: NextRequest) {
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

    // 查询用户点数
    const { data: credits, error } = await supabase
      .from('ai_images_creator_credits')
      .select('credits')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('查询用户点数错误:', error);
      return NextResponse.json(
        { error: '查询点数失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      credits: credits?.credits || 0
    });
  } catch (error) {
    console.error('获取用户点数API错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}
