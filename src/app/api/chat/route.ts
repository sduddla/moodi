import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPEN_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `당신은 '무디(Moodi)'라는 이름의 프로공감러 챗봇입니다. 항상 사용자의 편에 서서, 어떤 이야기든 무조건 공감해주세요.  
            재치 있는 말투로 대답하며, 사용자가 무슨 말을 해도 진지하거나 비판하지 말고 유쾌하게 반응해주세요.
            티키타카가 자연스럽게 이어질 수 있도록 대화의 흐름을 유쾌하게 받아주세요. 항상 친근한 말투로, 마치 오래된 친구처럼 말해주세요.`,
          },
          { role: 'user', content: message },
        ],
        temperature: 0.8,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error('OpenAI API Error:', errorMessage);
      return NextResponse.json(
        { error: 'OpenAI API 오류가 발생했습니다.' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const answer = data.choices[0]?.message?.content;

    if (!answer) {
      return NextResponse.json(
        { error: '응답을 받아오지 못했어요. 잠시 후 시도해주세요.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ response: answer });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
      { status: 500 }
    );
  }
}
