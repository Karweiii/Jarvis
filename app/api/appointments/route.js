import { NextResponse } from 'next/server'
import { createConnection } from '@/lib/db.js'
import jwt from "jsonwebtoken"

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

export async function GET(req) {
  try {
    const userId=getUserIdFromToken(req);
    if(!userId){
        return NextResponse.json({error:"Unauthorized"}, {status:401});
    }
    const db= await createConnection();
    const sql = `
  SELECT 
    appointment.*,
    studentUsers.user_id AS studentUserID,
    advisorUsers.user_id AS advisorUserID,
    studentUsers.username AS studentName,
    advisorUsers.username AS advisorName,
    DATE_FORMAT(appointment.time, '%H:%i') AS formattedTime
  FROM 
    appointment
  JOIN 
    advisors
  ON 
    appointment.advisorID = advisors.advisor_id
  JOIN 
    \`users\` AS advisorUsers
  ON 
    advisors.user_id = advisorUsers.user_id
  JOIN 
    students
  ON 
    appointment.studentID = students.student_id
  JOIN 
    \`users\` AS studentUsers
  ON 
    students.user_id = studentUsers.user_id
  WHERE 
    students.user_id = ? OR advisors.user_id = ?;
`;
    const [appointments]=await db.execute(sql,[userId,userId]);

    if(appointments.length===0){
        return NextResponse.json({error:"Appointment not found"}, {status:404});
    }
    
    return NextResponse.json(appointments)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await createConnection();

    // Use userID to get studentID
    const sql1 = `SELECT student_id FROM students WHERE user_id = ?`;
    const [studentIDRows] = await db.execute(sql1, [userId]);

    if (studentIDRows.length === 0) {
      return NextResponse.json({ error: "StudentID not found" }, { status: 404 });
    }

    // Correctly extract student_id from the result row
    const studentID = studentIDRows[0].student_id;

    // Parse the request body for appointment details
    const { date, time, advisor } = await req.json();

    // SQL query to insert the new appointment
    const sql = `
      INSERT INTO appointment (studentID, date, time, advisorID, status) 
      VALUES (?, ?, ?, ?, 'Pending') 
    `;
    const [result] = await db.execute(sql, [studentID, date, time, advisor]);

    return NextResponse.json({ message: "Appointment created", id: result.insertId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(req) {
    try{
        const {status,appointmentId} = await req.json();
        const db= await createConnection();
        const sql=`
        UPDATE appointment SET status=? WHERE appointmentID=?
        `
        await db.execute(sql,[status,appointmentId]);
        return NextResponse.json({message:"Appointment updated"}, {status:200});
    }catch(error){
        console.error('Appointment update error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}