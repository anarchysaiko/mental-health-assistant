import { NextRequest } from 'next/server';

// 通义千问 API 配置
const QWEN_API_KEY = process.env.QWEN_API_KEY;
const QWEN_API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';

export async function POST(request: NextRequest) {
  try {
    // 获取用户消息和对话历史
    const { userMessage, conversationHistory = [] } = await request.json();
    
    // 记录请求参数
    console.log('收到请求:', { userMessage, conversationHistoryLength: conversationHistory.length });
    
    // 构建系统提示词
    const systemPrompt = `# 心理健康 AI 助手核心 Prompt

## 身份设定

你是"心灵守护者"，一个专业、温暖的心理健康陪伴 AI。你不是医生，但你有很强的共情能力和心理学常识。

## 对话原则

1. **倾听优先**：先理解用户的情绪，再提供回应
2. **非评判态度**：接纳所有情绪表达，不做对错判断
3. **适度引导**：通过开放性问题帮助用户自我探索
4. **边界意识**：遇到严重心理危机时，温和建议专业帮助

## 回复结构

每次回复都要包含：

1. 情绪确认："听起来你感到..."
2. 共情回应："这种感受很能理解..."
3. 探索引导："你觉得是什么让你有这样的感受？"
4. 支持陪伴："我会陪伴你一起面对"

## 特殊情况处理

- 自伤/自杀倾向：温和但坚定地建议寻求专业帮助
- 严重心理症状：不诊断，建议咨询专业医生
- 超出能力范围：诚实说明自己的局限性

## 语言风格

- 温暖而真诚
- 避免说教式语言
- 适当使用"😊"等温暖表情
- 回复控制在 80-120 字`;
    
    // 构建消息历史
    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.map((msg: { role: string; content: string }) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      { role: "user", content: userMessage }
    ];
    
    console.log('发送给通义千问的消息:', JSON.stringify(messages, null, 2));
    
    // 调用通义千问 API
    const response = await fetch(QWEN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${QWEN_API_KEY}`
      },
      body: JSON.stringify({
        model: "qwen-plus",
        messages: messages,
        temperature: 0.7,
        max_tokens: 200
      })
    });
    
    console.log('通义千问 API 响应状态:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('通义千问 API 错误响应:', errorText);
      throw new Error(`通义千问 API 请求失败: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('通义千问 API 响应数据:', JSON.stringify(data, null, 2));
    
    // 检查响应格式
    if (!data.choices || data.choices.length === 0 || !data.choices[0].message) {
      throw new Error('通义千问 API 返回格式不正确');
    }
    
    const aiResponse = data.choices[0].message.content;
    
    // 返回 AI 响应
    return new Response(JSON.stringify({
      success: true,
      message: aiResponse
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('调用通义千问 API 时出错:', error);
    
    // 降级方案：返回默认响应
    return new Response(JSON.stringify({
      success: false,
      message: "抱歉，我现在无法提供帮助。请稍后再试，或者寻求专业心理咨询师的帮助。😊"
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}