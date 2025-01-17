import { NextResponse } from 'next/server'
import { createConnection } from "@/lib/db.js";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const date = searchParams.get('date')
    const time = searchParams.get('time')
    const db=await createConnection();
    const sql=`
    SELECT advisors.*,
    users.username,
    users.email,
    users.dob
    from advisors left JOIN users ON advisors.user_id=users.user_id
    `
    const [advisors]=await db.execute(sql);

    if(advisors.length===0){
        return NextResponse.json({error:"No available advisors"}, {status:404});
    }

    return NextResponse.json(advisors)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

