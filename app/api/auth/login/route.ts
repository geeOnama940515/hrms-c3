import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/server/auth';

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Login API: Request received');
    
    const body = await request.json();
    console.log('📦 Login API: Request body:', { email: body.email, passwordLength: body.password?.length });
    
    const { email, password } = body;

    if (!email || !password) {
      console.log('❌ Login API: Missing email or password');
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    console.log('🔍 Login API: Calling authenticate function...');
    const user = await authenticate(email, password);
    console.log('🔍 Login API: Authenticate result:', user ? 'User found' : 'No user found');

    if (user) {
      console.log('✅ Login API: Authentication successful, returning user');
      return NextResponse.json({ user }, { status: 200 });
    } else {
      console.log('❌ Login API: Invalid credentials');
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('❌ Login API: Error occurred:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}