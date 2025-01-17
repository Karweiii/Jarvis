import { createConnection } from "@/lib/db.js";
import { sub } from "date-fns";
import { NextResponse } from "next/server";

export async function GET(){
    try{
        const db= await createConnection();
        const sql=`
        SELECT subject.*,course.name
        FROM subject 
        left JOIN course ON subject.course_id=course.course_id
        `
        const [subject]= await db.execute(sql);
        return NextResponse.json({subject:subject});
    }catch(error){
        console.log(error);
        return NextResponse.json({error: error.message});
    }
}

export async function PUT(req) {
    try {
        // Parse the request body
        const { subjectId, year,subjects } = await req.json();
        console.log(subjectId, year, subjects);
        // Validate required fields
        if (!subjectId || !year || !subjects) {
            return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
        }

        // Create a database connection
        const db = await createConnection();

        // SQL query to update the subject
        const sql = `
        UPDATE subject
        SET year = ?, subjects = ?
        WHERE subject_id = ?
        `;

        // Execute the query
        const [result] = await db.execute(sql, [ year, subjects, subjectId]);

        // Check if any rows were affected
        if (result.affectedRows === 0) {
            return NextResponse.json({ error: "Subject not found or no changes made." }, { status: 404 });
        }

        // Return success response
        return NextResponse.json({ message: "Subject updated successfully." });
    } catch (error) {
        console.error("Error updating subject:", error);
        return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        // Parse the request body
        const { courseId, year, subjects } = await req.json();
        console.log(courseId, year, subjects);
        
        // Validate required fields
        if (!courseId || !year || !subjects) {
            return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
        }

        // Create a database connection
        const db = await createConnection();

        // SQL query to insert a new subject
        const sql = `
            INSERT INTO subject (course_id, year, subjects)
            VALUES (?, ?, ?)
        `;

        // Execute the query
        const [result] = await db.execute(sql, [courseId, year, subjects]);

        // Check if the subject was inserted
        if (result.affectedRows === 0) {
            return NextResponse.json({ error: "Failed to create subject." }, { status: 500 });
        }

        // Return success response with the new subject's ID
        return NextResponse.json({ message: "Subject created successfully.", subjectId: result.insertId });
    } catch (error) {
        console.error("Error creating subject:", error);
        return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        // Parse the request body
        const { subjectId } = await req.json();
        console.log(subjectId);
        
        // Validate the required field
        if (!subjectId) {
            return NextResponse.json({ error: "Missing subjectId." }, { status: 400 });
        }

        // Create a database connection
        const db = await createConnection();

        // SQL query to delete the subject
        const sql = `
            DELETE FROM subject
            WHERE subject_id = ?
        `;

        // Execute the query
        const [result] = await db.execute(sql, [subjectId]);

        // Check if any rows were affected
        if (result.affectedRows === 0) {
            return NextResponse.json({ error: "Subject not found or already deleted." }, { status: 404 });
        }

        // Return success response
        return NextResponse.json({ message: "Subject deleted successfully." });
    } catch (error) {
        console.error("Error deleting subject:", error);
        return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
    }
}