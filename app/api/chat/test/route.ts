import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is not configured', apiKeySet: false },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 간단한 테스트 요청
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent('Hello');
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      success: true,
      apiKeySet: true,
      apiKeyPrefix: apiKey.substring(0, 10) + '...',
      testResponse: text.substring(0, 100),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        apiKeySet: !!process.env.GEMINI_API_KEY,
        error: error.message,
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}

