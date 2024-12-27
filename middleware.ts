import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userCookie = request.cookies.get('user'); 

  try {
    console.log('User Cookie:', userCookie);  // Debugging the cookie

    const parsedUser = userCookie?.value ? JSON.parse(userCookie.value) : null;
    console.log('Parsed User:', parsedUser);

    if (!parsedUser || !parsedUser.fullName) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
        console.error('Error parsing user cookie:', error.message);
      } else {
        console.error('Unknown error occurred:', error);
      }
      return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next(); 
}

export const config = {
  matcher: ['/dashboard/:path*'], 
};
