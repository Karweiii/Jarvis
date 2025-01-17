import { NextResponse } from "next/server";
import {cookies} from 'next/headers';
import {createConnection} from '@/lib/db.js';
import {compare, hash} from 'bcrypt';
import {jwtVerify} from 'jose';
import { use } from "react";

export async function POST(req){
    let connection;
    try{
        connection = await createConnection();

        const{email,oldPassword, newPassword}= await req.json();

        const [users]= await connection.execute(
            `SELECT user_id, password FROM users WHERE email=?`,[email]
        );

        if(users.length===0){
            return NextResponse.json({error: 'user not found'},{status:401});
        }
        console.log(users)
        console.log(oldPassword)
        const user=users[0];   
        const isPasswordValid = await compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Old password is wrong' },
                { status: 401 }
            );
        }

        const hashednewPassword= await hash(newPassword,10);
        await connection.execute(
            `UPDATE users SET password=? WHERE user_id=?`,[hashednewPassword, user.user_id]
        );

        return NextResponse.json({message: 'Password changed successfully'},{status:200});

    }catch(error){
        console.error('Change password error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}