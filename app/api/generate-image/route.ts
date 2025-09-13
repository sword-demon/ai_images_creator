import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

// 创建图片生成任务
export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: '提示词不能为空' },
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
    
    // 检查并扣除用户点数
    const { data: deductResult, error: deductError } = await adminClient.rpc(
      'deduct_credits_for_generation',
      {
        p_user_id: user.id,
        p_credits_to_deduct: 1
      }
    );

    if (deductError) {
      console.error('扣除点数错误:', deductError);
      return NextResponse.json(
        { error: '扣除点数失败' },
        { status: 500 }
      );
    }

    if (!deductResult) {
      return NextResponse.json(
        { error: '点数不足，请先充值' },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_QWEN_API_KEY;
    if (!apiKey) {
      // 如果API配置错误，需要退还点数
      await adminClient.rpc('add_credits_to_user', {
        p_user_id: user.id,
        p_credits_to_add: 1
      });
      
      return NextResponse.json(
        { error: 'API密钥未配置' },
        { status: 500 }
      );
    }

    let taskId: string;
    
    try {
      // 调用阿里云API创建任务
      const response = await fetch(
        'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis',
        {
          method: 'POST',
          headers: {
            'X-DashScope-Async': 'enable',
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'wan2.2-t2i-plus',
            input: {
              prompt: prompt,
            },
            parameters: {
              size: '1024*1024',
              n: 4, // 生成4张图片
            },
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('阿里云API错误:', errorText);
        
        // 退还点数
        await adminClient.rpc('add_credits_to_user', {
          p_user_id: user.id,
          p_credits_to_add: 1
        });
        
        return NextResponse.json(
          { error: `创建任务失败: ${response.statusText}` },
          { status: response.status }
        );
      }

      const data = await response.json();
      taskId = data.output.task_id;

      // 创建历史记录（pending状态）
      const { error: historyError } = await adminClient
        .from('ai_images_creator_history')
        .insert({
          user_id: user.id,
          prompt: prompt,
          task_id: taskId,
          images: JSON.stringify([]), // 空数组，任务完成后再更新
          status: 'pending',
          credits_used: 1
        });

      if (historyError) {
        console.error('创建历史记录错误:', historyError);
        // 不影响主流程，只记录错误
      }

      return NextResponse.json(data);
    } catch (error) {
      console.error('生成图片API错误:', error);
      
      // 发生错误时退还点数
      await adminClient.rpc('add_credits_to_user', {
        p_user_id: user.id,
        p_credits_to_add: 1
      });
      
      return NextResponse.json(
        { error: '服务器内部错误' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('生成图片API错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}
