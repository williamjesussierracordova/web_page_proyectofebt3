import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { COLLECTIONS, Horario } from '@/lib/types/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()
    const { searchParams } = new URL(request.url)
    const id_restaurant = searchParams.get('id_restaurant')
    
    const filter = id_restaurant ? { id_restaurant: new ObjectId(id_restaurant) } : {}
    const horarios = await db.collection<Horario>(COLLECTIONS.HORARIOS).find(filter).toArray()
    
    return NextResponse.json({ success: true, data: horarios })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al obtener horarios' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const db = await getDatabase()
    
    const newHorario: Horario = {
      id_restaurant: new ObjectId(body.id_restaurant),
      dia: body.dia,
      hora_inicio: body.hora_inicio,
      hora_fin: body.hora_fin,
      disponibilidad: body.disponibilidad,
    }
    
    const result = await db.collection<Horario>(COLLECTIONS.HORARIOS).insertOne(newHorario)
    return NextResponse.json({ success: true, data: { _id: result.insertedId, ...newHorario } })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al crear horario' }, { status: 500 })
  }
}
