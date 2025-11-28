import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { COLLECTIONS, Restaurante } from '@/lib/types/mongodb'

export async function GET() {
  try {
    const db = await getDatabase()
    const restaurantes = await db.collection<Restaurante>(COLLECTIONS.RESTAURANTES).find({}).toArray()
    return NextResponse.json({ success: true, data: restaurantes })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al obtener restaurantes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const db = await getDatabase()
    
    const newRestaurante: Restaurante = {
      username_bot: body.username_bot,
      nombre: body.nombre,
      telefono: body.telefono,
      direccion: {
        calle: body.direccion?.calle || null,
        ciudad: body.direccion?.ciudad || null,
        distrito: body.direccion?.distrito || null,
      },
    }
    
    const result = await db.collection<Restaurante>(COLLECTIONS.RESTAURANTES).insertOne(newRestaurante)
    return NextResponse.json({ success: true, data: { _id: result.insertedId, ...newRestaurante } })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al crear restaurante' }, { status: 500 })
  }
}
