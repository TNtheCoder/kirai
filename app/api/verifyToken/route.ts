import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/firebase-admin';

export async function POST(req: Request) {
  const { token } = await req.json();

  if (!token) {
    return NextResponse.json({ message: 'Token is required' }, { status: 400 });
  }

  try {
    const firebaseCustomToken = await verifyToken(token);
    return NextResponse.json({ firebaseCustomToken }, { status: 200 });
  } catch (error) {
    console.error('Error in token verification route:', error);
    return NextResponse.json({ message: 'Token verification failed' }, { status: 500 });
  }
}
