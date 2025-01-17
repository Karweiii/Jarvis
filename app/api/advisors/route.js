import { NextResponse } from 'next/server'
import { createConnection } from "@/lib/db.js";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const date = searchParams.get('date')
    const time = searchParams.get('time')
    const db=await createConnection();
    const sql=`
    SELECT   u.username,a.advisor_id
        FROM advisors a
        JOIN users u ON a.user_id = u.user_id
        LEFT JOIN appointment ap ON a.advisor_id = ap.advisorID
        AND ap.date = ? 
        AND ap.time = ?
        WHERE ap.date IS NULL OR ap.advisorID IS NULL
    `
    const [advisors]=await db.execute(sql,[date,time]);

    if(advisors.length===0){
        return NextResponse.json({error:"No available advisors"}, {status:404});
    }

    return NextResponse.json(advisors)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

