import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// 获取用户图片生成历史记录
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

    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // 查询用户历史记录
    const { data: history, error } = await supabase
      .from('ai_images_creator_history')
      .select(`
        id,
        prompt,
        images,
        status,
        credits_used,
        created_at
      `)
      .eq('user_id', user.id)
      .eq('status', 'completed') // 只返回已完成的记录
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('查询历史记录错误:', error);
      return NextResponse.json(
        { error: '查询历史记录失败' },
        { status: 500 }
      );
    }

    // 处理图片数据，将JSON字符串解析为数组，并过滤掉空字符串
    const processedHistory = history?.map(record => {
      let images = typeof record.images === 'string' 
        ? JSON.parse(record.images) 
        : record.images;
      
      // 过滤掉空字符串，只保留有效的图片URL
      if (Array.isArray(images)) {
        images = images.filter(url => url && url.trim() !== '');
      }
      
      return {
        ...record,
        images
      };
    }) || [];

    // 获取总数（用于分页）
    const { count } = await supabase
      .from('ai_images_creator_history')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'completed');

    return NextResponse.json({
      history: processedHistory,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('获取历史记录API错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}
