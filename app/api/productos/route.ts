import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { COLLECTIONS, Producto } from '@/lib/types/mongodb'
import { ObjectId, Decimal128 } from 'mongodb'

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()
    const { searchParams } = new URL(request.url)
    const id_restaurant = searchParams.get('id_restaurant')
    const categoria = searchParams.get('categoria')
    
    let filter: any = {}
    if (id_restaurant) filter.id_restaurant = new ObjectId(id_restaurant)
    if (categoria) filter.categoria = categoria
    
    const productos = await db.collection<Producto>(COLLECTIONS.PRODUCTOS).find(filter).toArray()
    
    return NextResponse.json({ success: true, data: productos })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al obtener productos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const db = await getDatabase()
    
    const newProducto: any = {
      id_restaurant: new ObjectId(body.id_restaurant),
      nombre: body.nombre,
      precio: Decimal128.fromString(body.precio.toString()),
      categoria: body.categoria,
      descripcion: body.descripcion,
      prep_time_min: body.prep_time_min,
      disponible: body.disponible !== undefined ? body.disponible : true,
    }
    
    const result = await db.collection(COLLECTIONS.PRODUCTOS).insertOne(newProducto)
    return NextResponse.json({ success: true, data: { _id: result.insertedId, ...newProducto } })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al crear producto' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const db = await getDatabase()
    
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'ID de producto requerido' }, { status: 400 })
    }
    
    const updateData: any = {}
    if (body.nombre !== undefined) updateData.nombre = body.nombre
    if (body.precio !== undefined) updateData.precio = Decimal128.fromString(body.precio.toString())
    if (body.categoria !== undefined) updateData.categoria = body.categoria
    if (body.descripcion !== undefined) updateData.descripcion = body.descripcion
    if (body.prep_time_min !== undefined) updateData.prep_time_min = body.prep_time_min
    if (body.disponible !== undefined) updateData.disponible = body.disponible
    
    const result = await db.collection(COLLECTIONS.PRODUCTOS).updateOne(
      { _id: new ObjectId(body.id) },
      { $set: updateData }
    )
    
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al actualizar producto' }, { status: 500 })
  }
}
