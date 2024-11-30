import { NextResponse } from "next/server";

export async function POST(request: Request) {

    try{
        const body = await request.json();
        const { email, password} = body;

        if (!email || !password){
            return NextResponse.json(
                {message: "Fill in all required Fields"},
                { status: 400}
            );
        }

        const user = { email };

        return NextResponse.json(
            { message: "Logged in successfully!!", user},
            { status: 200 }
        );


    }catch( error){
        console.error('Error occurred while processing request:', error); 
        return NextResponse.json(
        { message: 'An error occurred while processing the request.', error: String(error) },
        { status: 500 }
        );
    }
    
}