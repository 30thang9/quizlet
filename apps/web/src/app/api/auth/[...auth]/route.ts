import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/v1';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ auth: string[] }> }
) {
  try {
    const { auth } = await params;
    const action = auth[0];
    const body = await request.json();
    
    const response = await fetch(`${API_URL}/auth/${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    
    if (action === 'login' || action === 'register') {
      const cookies = response.headers.get('Set-Cookie');
      const nextResponse = NextResponse.json(data);
      if (cookies) {
        nextResponse.headers.set('Set-Cookie', cookies);
      }
      return nextResponse;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in auth route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ auth: string[] }> }
) {
  try {
    const { auth } = await params;
    const action = auth[0];
    
    if (action === 'session') {
      const response = await fetch(`${API_URL}/auth/session`, {
        headers: {
          ...(request.headers.get('Cookie') && {
            Cookie: request.headers.get('Cookie')!,
          }),
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        return NextResponse.json({ user: null }, { status: 200 });
      }

      const data = await response.json();
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  } catch (error) {
    console.error('Error checking session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
