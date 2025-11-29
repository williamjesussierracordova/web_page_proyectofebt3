import { MongoClient, Db, MongoClientOptions } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Por favor agrega tu MONGODB_URI en el archivo .env.local')
}

const uri = process.env.MONGODB_URI

// Detectar si es una conexión local o remota
const isLocalConnection = uri.includes('localhost') || uri.includes('127.0.0.1')

// Opciones de conexión optimizadas para local y remoto
const options: MongoClientOptions = {
  // Opciones comunes
  maxPoolSize: 10,
  minPoolSize: 2,
  
  // Para conexiones locales, timeouts más cortos
  serverSelectionTimeoutMS: isLocalConnection ? 5000 : 30000,
  connectTimeoutMS: isLocalConnection ? 5000 : 30000,
  socketTimeoutMS: isLocalConnection ? 10000 : 45000,
  
  // Retry automático de escrituras
  retryWrites: true,
  retryReads: true,
  
  // Para conexiones locales sin autenticación TLS
  ...(isLocalConnection && {
    directConnection: true,
  }),
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (process.env.NODE_ENV === 'development') {
  // En desarrollo, usar una variable global para que no se creen múltiples conexiones
  // durante hot reloads en Next.js
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect().then((client) => {
      console.log('✅ MongoDB conectado exitosamente')
      console.log(`📍 Tipo de conexión: ${isLocalConnection ? 'LOCAL' : 'REMOTA (Atlas)'}`)
      console.log(`📦 Base de datos: ${process.env.MONGODB_DB_NAME || 'restaurante_db'}`)
      return client
    }).catch((error) => {
      console.error('❌ Error al conectar a MongoDB:', error.message)
      throw error
    })
  }
  clientPromise = global._mongoClientPromise
} else {
  // En producción, crear una nueva conexión
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

// Función helper para obtener la base de datos
export async function getDatabase(): Promise<Db> {
  try {
    const client = await clientPromise
    return client.db(process.env.MONGODB_DB_NAME || 'restaurante_db')
  } catch (error) {
    console.error('❌ Error al obtener la base de datos:', error)
    throw error
  }
}

// Función helper para verificar la conexión
export async function testConnection(): Promise<boolean> {
  try {
    const db = await getDatabase()
    await db.command({ ping: 1 })
    console.log('✅ Conexión a MongoDB verificada')
    return true
  } catch (error) {
    console.error('❌ Error al verificar conexión:', error)
    return false
  }
}

// Función helper para cerrar la conexión (útil para testing)
export async function closeConnection(): Promise<void> {
  try {
    const client = await clientPromise
    await client.close()
    console.log('🔌 Conexión a MongoDB cerrada')
  } catch (error) {
    console.error('❌ Error al cerrar conexión:', error)
  }
}

export default clientPromise
