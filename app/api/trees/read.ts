// app/api/trees/read.ts (Public Route)
'use server'

import { NextResponse } from 'next/server';
import { ref, get } from 'firebase/database';
import { db } from '@/lib/firebase';

export async function GET() {
  const dbRef = ref(db, 'trees/');
  const snapshot = await get(dbRef);
  if (snapshot.exists()) {
    return NextResponse.json(snapshot.val());
  }
  return NextResponse.json({ error: 'No data available' }, { status: 404 });
}
