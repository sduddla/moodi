import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { message, previousMessages = [] } = await req.json();

    const conversationHistory = previousMessages.map(
      (msg: { role: 'user' | 'assistant'; text: string }) => ({
        role: msg.role,
        content: msg.text,
      })
    );

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
            content: `당신은 '무디(Moodi)'라는 이름의 무조건 공감해드립니다 봇입니다. 사용자가 무슨 말을 해도 무조건 공감하세요. 진지하거나 무겁지 않게, 재치있고 유머러스하게 받아들여서 유쾌하게 공감해주세요. 티키타카가 자연스럽게 이어지도록 대화를 이어가고, 친구와 카카오톡하듯이 자연스럽고 편안하게 대답하세요. 절대 이모지를 사용하지 말고, 오직 텍스트로만 답변하세요. 짧고 간결하게 답변하세요.`,
          },
          ...conversationHistory,
          { role: 'user', content: message },
        ],
        temperature: 0.7,
        max_tokens: 300,
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
