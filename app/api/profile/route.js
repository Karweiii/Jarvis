import { createConnection } from "@/lib/db.js";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import next from "next";

const verifyToken=(token)=>{
    try{
        return jwt.verify(token,process.env.JWT_SECRET);
    }catch(error){
        return null;
    }
}

const getUserIdFromToken=(req)=>{
    const token = req.cookies.get('token')?.value;
    if(!token) return null;
    const decoded= verifyToken(token);
    return decoded? decoded.userId : null
}

export async function GET(req){
    try{
        const userId = getUserIdFromToken(req);
        if(!userId){
            return NextResponse.json({error:"Unauthorized"}, {status:401});
        }

        const db = await createConnection();
        const sql= `
        SELECT * FROM users WHERE user_id=?
        `;
        const [users]= await db.execute(sql,[userId]);

        if(users.length===0){
            return NextResponse.json({error:"User not found"}, {status:404});
        }

        const user=users[0];
        let roleData=null

        if(user.role==='student'){
            const studentQuery= await db.query(
                `SELECT * FROM students WHERE user_id=?`,[userId]
            );
            roleData=studentQuery[0];
        }else if(user.role==='advisor'){
            const advisorQuery= await db.query(
                `SELECT * FROM advisors WHERE user_id=?`,[userId]
            );
            roleData=advisorQuery[0];
        }
        return NextResponse.json({user:user,roleData:roleData},{status:200});
    }catch(error){
        console.error('Profile fetch error:', error);
        return NextResponse.json({ error: 'Get Internal server error' }, { status: 500 });
    }
}

export async function PUT(req){
    try{
        const userId= getUserIdFromToken(req);
        if(!userId){
            return NextResponse.json({error:"Unauthorized"}, {status:401});
        }

        const { username, email, dob, roleData, role } = await req.json();

        const db= await createConnection();

        const sql=`
        UPDATE users SET username=?, email=?, dob=? WHERE user_id=?
        `;
        await db.execute(sql,[username,email,dob,userId]);

        if(role==='student' && roleData){
            const studentSql=`
            UPDATE students SET preferredField=?, educationBg=? WHERE user_id=?
            `;
            await db.execute(studentSql,[roleData.preferredField,roleData.educationBg,userId]);
        }else if(role==='advisor' && roleData){
            const advisorSql=`
            UPDATE advisors SET office=?, experience=? WHERE user_id=?
            `;
            await db.execute(advisorSql,[roleData.office,roleData.experience,userId]);
        }

        return NextResponse.json({message:"Profile updated"}, {status:200});
    }catch(error){
        console.error('Profile update error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}