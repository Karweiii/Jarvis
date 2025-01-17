import { createConnection } from "@/lib/db.js";
import { NextResponse } from "next/server";

export async function GET(){
    try{
        const db= await createConnection();
        const sql=`
        SELECT * 
        FROM course 
        `
        const [course]= await db.execute(sql);
        return NextResponse.json({course:course});
    }catch(error){
        console.log(error);
        return NextResponse.json({error: error.message});
    }
}

export async function PUT(req){
    try{
        const {courseId, name, description, intake, duration, study_mode, level, category, fees, career_prospects, qualifications}=await req.json();
        const db= await createConnection();
        
        const sql=`
         UPDATE course
            SET name = ?, description = ?, intake = ?, duration = ?, study_mode = ?, level = ?, category = ?, fees = ?, career_prospects = ?, qualifications = ?
            WHERE course_id = ?
        `
        await db.execute(sql,[name, description, intake, duration, study_mode, level, category, fees, career_prospects, qualifications, courseId]);
        return NextResponse.json({message: 'Course updated successfully'});
    }catch(error){
        console.log(error);
        return NextResponse.json({error: error.message});
    }
}


export async function POST(req) {
    try {
      // Destructure the data sent in the request body
      const {
        name,
        description,
        intake,
        duration,
        study_mode,
        level,
        category,
        fees,
        career_prospects,
        qualifications,
      } = await req.json();
  
      // Establish a connection to the database
      const db = await createConnection();
  
      // SQL query to insert a new course into the course table
      const sql = `
        INSERT INTO course (name, description, intake, duration, study_mode, level, category, fees, career_prospects, qualifications)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
  
      // Execute the query with the values received in the request body
      const [result] = await db.execute(sql, [
        name,
        description,
        intake,
        duration,
        study_mode,
        level,
        category,
        fees,
        career_prospects,
        qualifications,
      ]);
  
      // Return a success response with the message
      return NextResponse.json({ message: "Course added successfully", courseId: result.insertId });
    } catch (error) {
      console.log("Error adding course:", error);
      // Return an error response if there was an issue
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

