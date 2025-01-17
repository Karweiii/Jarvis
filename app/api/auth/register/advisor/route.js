import { NextResponse } from 'next/server';
import { createConnection } from '@/lib/db';
import { hash } from 'bcrypt';

export async function POST(request) {
    let connection;
    try {
        // Get connection from pool
        connection = await createConnection();
        
        // Parse request body
        const { 
            email, 
            password, 
            username, 
            dateOfBirth, 
        } = await request.json();
        console.log("dateof birth",dateOfBirth);
        // Start transaction
        await connection.beginTransaction();

        // Check for existing user
        const [existingUsers] = await connection.execute(
            'SELECT user_id FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            await connection.rollback();
            return NextResponse.json(
                { error: 'User already exists' }, 
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await hash(password, 10);
        console.log("hashedPassword",hashedPassword);
        console.log("dateOfBirth",dateOfBirth);
        console.log("username",username);
        console.log("email",email);
        // Insert user
        const [userResult] = await connection.execute(
            'INSERT INTO users (username, email, password, dob, role) VALUES (?, ?, ?, ?, ?)',
            [username, email, hashedPassword, dateOfBirth, "advisor"]
        );

        // Insert student details
        await connection.execute(
            'INSERT INTO advisors (	user_id , office, experience) VALUES (?, ?, ?)',
            [userResult.insertId, null, null]
        );

        // Commit transaction
        await connection.commit();

        return NextResponse.json(
            { message: 'User registered successfully' },
            { status: 201 }
        );

    } catch (error) {
        // Rollback on error
        if (connection) {
            await connection.rollback();
        }

        console.error('Registration error:', error);
        console.error('Error details:', JSON.stringify(error));
        // Handle specific database errors
        if (error.code === 'ER_LOCK_WAIT_TIMEOUT') {
            return NextResponse.json(
                { error: 'Database is busy, please try again' },
                { status: 503 }
            );
        }

        if (error.code === 'ER_DUP_ENTRY') {
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: 'Registration failed. Please try again later.' },
            { status: 500 }
        );

    } 
}