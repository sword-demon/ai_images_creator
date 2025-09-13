import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

// 用户充值点数
export async function POST(request: NextRequest) {
  try {
    const { credits } = await request.json();
    
    if (!credits || credits <= 0) {
      return NextResponse.json(
        { error: '充值点数必须大于0' },
        { status: 400 }
      );
    }

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
    
    // 调用充值函数
    const { data: result, error } = await adminClient.rpc(
      'add_credits_to_user',
      {
        p_user_id: user.id,
        p_credits_to_add: credits
      }
    );

    if (error) {
      console.error('充值点数错误:', error);
      return NextResponse.json(
        { error: '充值失败' },
        { status: 500 }
      );
    }

    // 获取充值后的点数
    const { data: creditsData } = await adminClient
      .from('ai_images_creator_credits')
      .select('credits')
      .eq('user_id', user.id)
      .single();

    return NextResponse.json({
      success: true,
      credits: creditsData?.credits || 0,
      message: `成功充值 ${credits} 点数`
    });
  } catch (error) {
    console.error('充值API错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}
