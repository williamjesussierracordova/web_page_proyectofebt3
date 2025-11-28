import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { COLLECTIONS, Bot } from '@/lib/types/mongodb'

export async function GET() {
  try {
    const db = await getDatabase()
    const bots = await db.collection<Bot>(COLLECTIONS.BOTS).find({}).toArray()
    return NextResponse.json({ success: true, data: bots })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al obtener bots' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const db = await getDatabase()
    
    const newBot: Bot = {
      username: body.username,
      created_at: new Date(),
    }
    
    const result = await db.collection<Bot>(COLLECTIONS.BOTS).insertOne(newBot)
    return NextResponse.json({ success: true, data: { _id: result.insertedId, ...newBot } })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al crear bot' }, { status: 500 })
  }
}
