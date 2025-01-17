import { NextResponse } from 'next/server'
import { createConnection } from '@/lib/db.js'
import { log } from 'console'
import exp from 'constants'

export async function DELETE(req,{params}) {
  let connection
  try {
    const id =params.id
    console.log(id)
    if (!id || isNaN(id) || id <= 0) {
        console.error("Invalid course ID:", id); // Log invalid ID for debugging
        return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
      }
    connection = await createConnection()
    await connection.execute('DELETE FROM course WHERE course_id = ?', [id])
    return NextResponse.json({ message: 'Course deleted successfully' })
  } catch (error) {
    console.error('Error deleting course:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET(req, { params }) {
  const { id: courseId } = params; // Extract the course ID from the route params

  try {
    const db = await createConnection();

    // SQL query to fetch the course details
    const courseQuery = `
      SELECT *
      FROM course
      WHERE course_id = ?
    `;

    // SQL query to fetch the subjects associated with the course
    const subjectsQuery = `
      SELECT *
      FROM subject
      WHERE course_id = ?
    `;

    // SQL query to fetch the electives associated with the course
    const electivesQuery = `
      SELECT *
      FROM electives
      WHERE course_id = ?
    `;

    // Execute queries
    const [courseResults] = await db.execute(courseQuery, [courseId]);
    const [subjectsResults] = await db.execute(subjectsQuery, [courseId]);
    const [electivesResults] = await db.execute(electivesQuery, [courseId]);

    if (courseResults.length === 0) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const course = courseResults[0];

    return NextResponse.json({
      course,
      subjects: subjectsResults,
      electives: electivesResults,
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
