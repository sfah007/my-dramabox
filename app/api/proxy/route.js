import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // عدم تخزين البيانات لتكون حديثة دائماً

const TARGET = 'https://dramabox-ku.vercel.app/api';

// دالة لتوليد IP وهمي لتجنب الحظر (429)
const randomIP = () => `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;

export async function POST(req) {
  try {
    const body = await req.json();
    const fakeIP = randomIP();

    // هيدرز قوية جداً للمحاكاة (كأنك تتصفح من الموقع الأصلي)
    const headers = {
      'authority': 'dramabox-ku.vercel.app',
      'accept': 'application/json, text/plain, */*',
      'content-type': 'application/json',
      'origin': 'https://dramabox-ku.vercel.app',
      'referer': 'https://dramabox-ku.vercel.app/',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'x-forwarded-for': fakeIP, // خداع السيرفر بـ IP وهمي
      'x-real-ip': fakeIP
    };

    // الاتصال المباشر بالموقع الأصلي
    const response = await fetch(`${TARGET}/${body.endpoint}`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body.payload),
      cache: 'no-store'
    });

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Direct connection failed' }, { status: 500 });
  }
}

