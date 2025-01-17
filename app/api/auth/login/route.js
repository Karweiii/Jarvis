import { NextResponse } from 'next/server';
import { createConnection } from '@/lib/db';
import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken'; // Use for JWT token generation (optional)

const SECRET_KEY = process.env.JWT_SECRET; // Replace with your environment variable or secure key

export async function POST(request) {
    let connection;
    try{
        connection= await createConnection();

        const {email,password}= await request.json();

        const [users]= await connection.execute(
            `SELECT user_id, password, role FROM users WHERE email=?`,[email]
        )

        if(users.length===0){
            return NextResponse.json({error: 'Invalid email or password'},{status:401});
        }

        const user = users[0];
        
        // Verify password
        const isPasswordValid = await compare(password, user.password);
        console.log(isPasswordValid)
        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }
        
        const token=jwt.sign({userId: user.user_id, role: user.role},process.env.JWT_SECRET,{expiresIn:'1h'});

        const response = NextResponse.json({ message: 'Logged in successfully', role:user.role,token }, { status: 200 });
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600, // 1 hour
            path: '/',
          });
          

        return response;
    }catch(error){
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}