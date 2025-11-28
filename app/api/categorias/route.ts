import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { COLLECTIONS, Categoria } from '@/lib/types/mongodb'

export async function GET() {
  try {
    const db = await getDatabase()
    const categorias = await db.collection<Categoria>(COLLECTIONS.CATEGORIAS).find({}).toArray()
    return NextResponse.json({ success: true, data: categorias })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al obtener categorías' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const db = await getDatabase()
    
    const newCategoria: Categoria = {
      nombre: body.nombre,
      descripcion: body.descripcion,
    }
    
    const result = await db.collection<Categoria>(COLLECTIONS.CATEGORIAS).insertOne(newCategoria)
    return NextResponse.json({ success: true, data: { _id: result.insertedId, ...newCategoria } })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al crear categoría' }, { status: 500 })
  }
}
