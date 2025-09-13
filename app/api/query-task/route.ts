import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

// 查询任务结果
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');
    
    if (!taskId) {
      return NextResponse.json(
        { error: '任务ID不能为空' },
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

    const apiKey = process.env.NEXT_PUBLIC_QWEN_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API密钥未配置' },
        { status: 500 }
      );
    }

    // 调用阿里云API查询任务
    const response = await fetch(
      `https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('阿里云API错误:', errorText);
      return NextResponse.json(
        { error: `查询任务失败: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // 如果任务完成，更新历史记录
    if (data.output.task_status === 'SUCCEEDED' && data.output.results) {
      const adminClient = createAdminClient();
      const imageUrls = data.output.results.map((result: any) => result.url);
      
      // 更新历史记录
      const { error: updateError } = await adminClient
        .from('ai_images_creator_history')
        .update({
          images: JSON.stringify(imageUrls),
          status: 'completed'
        })
        .eq('task_id', taskId)
        .eq('user_id', user.id);

      if (updateError) {
        console.error('更新历史记录错误:', updateError);
        // 不影响主流程，只记录错误
      }
    } else if (data.output.task_status === 'FAILED') {
      // 如果任务失败，退还点数并更新历史记录
      const adminClient = createAdminClient();
      
      // 退还点数
      await adminClient.rpc('add_credits_to_user', {
        p_user_id: user.id,
        p_credits_to_add: 1
      });
      
      // 更新历史记录状态
      const { error: updateError } = await adminClient
        .from('ai_images_creator_history')
        .update({
          status: 'failed'
        })
        .eq('task_id', taskId)
        .eq('user_id', user.id);

      if (updateError) {
        console.error('更新历史记录错误:', updateError);
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('查询任务API错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}
