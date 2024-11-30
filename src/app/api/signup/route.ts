import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password } = body;

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { message: 'All fields are required.' },
        { status: 400 }
      );
    }

    const user = { firstName, lastName, email };

    return NextResponse.json(
      { message: 'User registered successfully!', user },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error occurred while processing request:', error); 
    return NextResponse.json(
      { message: 'An error occurred while processing the request.', error: String(error) },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      Allow: 'POST, OPTIONS',
    },
  });
}
