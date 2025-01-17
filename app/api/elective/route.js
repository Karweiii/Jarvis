import { createConnection } from "@/lib/db.js";
import { sub } from "date-fns";
import { NextResponse } from "next/server";

export async function GET(){
    try{
        const db= await createConnection();
        const sql=`
        SELECT electives.*,course.name
        FROM electives 
        left JOIN course ON electives.course_id=course.course_id
        `
        const [electives]= await db.execute(sql);
        return NextResponse.json({electives:electives});
    }catch(error){
        console.log(error);
        return NextResponse.json({error: error.message});
    }
}

export async function PUT(req) {
    try {
        // Parse the request body
        const { electiveId, year,electives } = await req.json();
        console.log(electiveId, year, electives);
        // Validate required fields
        if (!electiveId || !year || !electives) {
            return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
        }

        // Create a database connection
        const db = await createConnection();

        // SQL query to update the subject
        const sql = `
        UPDATE electives
        SET year = ?, electives = ?
        WHERE elective_id = ?
        `;

        // Execute the query
        const [result] = await db.execute(sql, [ year, electives, electiveId]);

        // Check if any rows were affected
        if (result.affectedRows === 0) {
            return NextResponse.json({ error: "electives not found or no changes made." }, { status: 404 });
        }

        // Return success response
        return NextResponse.json({ message: "electives updated successfully." });
    } catch (error) {
        console.error("Error updating subject:", error);
        return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        // Parse the request body
        const { courseId, year, electives } = await req.json();
        console.log(courseId, year, electives);
        
        // Validate required fields
        if (!courseId || !year || !electives) {
            return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
        }

        // Create a database connection
        const db = await createConnection();

        // SQL query to insert a new subject
        const sql = `
            INSERT INTO electives (course_id, year, electives)
            VALUES (?, ?, ?)
        `;

        // Execute the query
        const [result] = await db.execute(sql, [courseId, year, electives]);

        // Check if the subject was inserted
        if (result.affectedRows === 0) {
            return NextResponse.json({ error: "Failed to create electives." }, { status: 500 });
        }

        // Return success response with the new subject's ID
        return NextResponse.json({ message: "electives created successfully.", electiveId: result.insertId });
    } catch (error) {
        console.error("Error creating subject:", error);
        return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {

        const { electiveId } = await req.json();


        if (!electiveId) {
            return NextResponse.json({ error: "Missing subjectId." }, { status: 400 });
        }


        const db = await createConnection();

        const sql = `
            DELETE FROM electives
            WHERE elective_id = ?
        `;

        // Execute the query
        const [result] = await db.execute(sql, [electiveId]);

        // Check if any rows were affected
        if (result.affectedRows === 0) {
            return NextResponse.json({ error: "Elective not found or already deleted." }, { status: 404 });
        }

        // Return success response
        return NextResponse.json({ message: "Elective deleted successfully." });
    } catch (error) {
        console.error("Error deleting subject:", error);
        return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
    }
}