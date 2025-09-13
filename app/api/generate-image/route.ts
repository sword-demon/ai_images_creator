import { NextRequest, NextResponse } from 'next/server';

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

    const apiKey = process.env.NEXT_PUBLIC_QWEN_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API密钥未配置' },
        { status: 500 }
      );
    }

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
      return NextResponse.json(
        { error: `创建任务失败: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('生成图片API错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}
