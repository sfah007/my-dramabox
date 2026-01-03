import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
const FAST_API = 'https://dramabox.sansekai.my.id';

export async function POST(req) {
  try {
    const body = await req.json();
    // نوجه الطلب للـ API السريع
    const res = await fetch(`${FAST_API}/api/${body.endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body.payload),
      cache: 'no-store'
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
