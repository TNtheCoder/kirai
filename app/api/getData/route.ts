import { NextResponse, NextRequest } from 'next/server'; // Import NextRequest
import { ref, get } from 'firebase/database';
import { db } from '@/lib/firebase';

export async function GET(req: NextRequest) { // Specify the type of 'req'
  console.log('Starting GET request for data...'); // Add logging to trace the execution

  try {
    const dbRef = ref(db, 'trees');
    const snapshot = await get(dbRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log('Data retrieved from Firebase:', data); // Log the data fetched

      // Example of checking if user is authenticated based on a request header or token
      const userId = req.headers.get('user-id'); // You can get user info from headers if passed

      if (!userId) {
        // Filter out sensitive data for unauthenticated users
        const publicData = filterPublicData(data);
        return NextResponse.json(publicData);
      }

      return NextResponse.json(data); // Return full data for authenticated users
    } else {
      console.log('No data found in Firebase.');
      return NextResponse.json({ message: 'No data found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error during GET request:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

// Example function to filter sensitive data
function filterPublicData(data: any) {
  // Implement logic to exclude sensitive information for public users
  return data;
}
