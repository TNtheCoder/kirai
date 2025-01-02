// app/api/trees/write.ts (Protected Route)
'use server'

import { ref, set } from 'firebase/database';
import { db } from '@/lib/firebase';
import { currentUser } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { treeId, data } = await request.json();
  const dbRef = ref(db, `trees/${treeId}`);
  await set(dbRef, data);

  return new Response('Tree data saved successfully', { status: 200 });
}
