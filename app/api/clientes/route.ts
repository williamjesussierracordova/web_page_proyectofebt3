import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { COLLECTIONS, Cliente } from '@/lib/types/mongodb'

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()
    const { searchParams } = new URL(request.url)
    const tg_id = searchParams.get('tg_id')
    
    const filter = tg_id ? { tg_id } : {}
    const clientes = await db.collection<Cliente>(COLLECTIONS.CLIENTES).find(filter).toArray()
    
    return NextResponse.json({ success: true, data: clientes })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al obtener clientes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const db = await getDatabase()
    
    const newCliente: Cliente = {
      tg_id: body.tg_id,
      nombre: body.nombre,
      apellido: body.apellido,
      email: body.email,
      telefono: body.telefono,
      direccion: body.direccion,
      created_at: new Date(),
    }
    
    const result = await db.collection<Cliente>(COLLECTIONS.CLIENTES).insertOne(newCliente)
    return NextResponse.json({ success: true, data: { _id: result.insertedId, ...newCliente } })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al crear cliente' }, { status: 500 })
  }
}
