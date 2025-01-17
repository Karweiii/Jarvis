import {createConnection} from "@/lib/db.js";
import {NextResponse} from "next/server";


export async function GET(req,{params}){
    let db;
    try{
        const id=parseInt(params?.id,10);
        if (!id || isNaN(id) || id <= 0) {
            console.error("Invalid user ID:", params?.id); // Log invalid ID for debugging
            return NextResponse.json({ error: "Invalid course id" }, { status: 400 });
          }


        db= await createConnection();

        const sql=`
        SELECT 
          u.username, 
          u.email, 
          u.dob, 
          s.preferredField,
          s.educationBg,
          a.office, 
          a.experience 
        FROM users u
        LEFT JOIN students s ON u.user_id = s.user_id AND u.role = 'student'
        LEFT JOIN advisors a ON u.user_id = a.user_id AND u.role = 'advisor'
        WHERE u.user_id = ?
        `

        const [rows]= await db.execute(sql,[id]);

        if(rows.length===0){
            return NextResponse.json({error:"User not found"}, {status:404});
        }

        const userinfo =rows[0];
        return NextResponse.json(userinfo);
    }catch(error){
        console.error('Profile fetch error:', error);
        return NextResponse.json({ error: 'Get Internal server error' }, { status: 500 });
    }
}