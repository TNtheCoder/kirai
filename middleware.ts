import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/register(.*)',
  '/update(.*)',
  '/generate-qr-code(.*)',
  '/home(.*)',
  '/api/write(.*)',
]);

const isPublicRoute = createRouteMatcher(['/trees', '/']); // Include the root route as public

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  console.log('Requested URL:', req.url);
  console.log('User ID:', userId);

  const protectedMatch = isProtectedRoute(req);
  const publicMatch = isPublicRoute(req);

  console.log('Matching protected route:', protectedMatch);
  console.log('Matching public route:', publicMatch);

  const { nextUrl } = req;
  const baseUrl = `${nextUrl.protocol}//${nextUrl.host}`;

  console.log('Base URL:', baseUrl);

  // Redirect authenticated users away from public routes (e.g., /trees or root)
  if (userId && publicMatch) {
    console.log("Authenticated user tried to access a public route. Redirecting to /home...");
    nextUrl.pathname = '/home';
    return NextResponse.redirect(nextUrl);
  }

  // Redirect unauthenticated users away from protected routes
  if (!userId && protectedMatch) {
    console.log("Unauthenticated user tried to access a protected route. Redirecting to /trees...");
    nextUrl.pathname = '/trees';
    return NextResponse.redirect(nextUrl);
  }

  console.log("No redirection needed for this request.");
  return NextResponse.next();
});

export const config = {
  matcher: ['/register(.*)', '/update(.*)', '/generate-qr-code(.*)', '/home(.*)', '/api/write(.*)', '/trees', '/', '/((?!.*\\..*|_next).*)'],
};
