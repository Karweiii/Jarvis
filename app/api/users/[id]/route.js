import { NextResponse } from 'next/server'
import { createConnection } from '@/lib/db'

export async function DELETE(req,{params}) {
  let connection
  try {
    const id = params.id
    connection = await createConnection()
    await connection.execute('DELETE FROM users WHERE user_id = ?', [id])
    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

