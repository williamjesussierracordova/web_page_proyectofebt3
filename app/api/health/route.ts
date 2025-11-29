import { NextResponse } from 'next/server'
import { testConnection, getDatabase } from '@/lib/mongodb'

/**
 * Endpoint para verificar el estado de la conexión a MongoDB
 * GET /api/health
 */
export async function GET() {
  try {
    // Probar conexión
    const isConnected = await testConnection()
    
    if (!isConnected) {
      return NextResponse.json(
        {
          success: false,
          status: 'disconnected',
          message: 'No se pudo conectar a MongoDB',
        },
        { status: 503 }
      )
    }
    
    // Obtener información de la base de datos
    const db = await getDatabase()
    const collections = await db.listCollections().toArray()
    const stats = await db.stats()
    
    return NextResponse.json({
      success: true,
      status: 'connected',
      message: 'Conexión a MongoDB exitosa',
      info: {
        database: db.databaseName,
        collections: collections.map(c => c.name),
        totalCollections: collections.length,
        dataSize: `${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`,
        storageSize: `${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`,
        indexes: stats.indexes,
        objects: stats.objects,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        status: 'error',
        message: 'Error al verificar conexión',
        error: error.message,
      },
      { status: 500 }
    )
  }
}
