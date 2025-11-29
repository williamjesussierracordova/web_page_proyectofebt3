/**
 * Script de verificación de configuración MongoDB
 * Ejecuta este script para verificar que todo esté correctamente configurado
 * 
 * Uso: node scripts/verificar-mongodb.js
 */

const { MongoClient } = require('mongodb')
const path = require('path')
const fs = require('fs')

console.log('🔍 Iniciando verificación de configuración MongoDB...\n')

// 1. Verificar archivo .env.local
console.log('📝 Paso 1: Verificando archivo .env.local')
const envPath = path.join(process.cwd(), '.env.local')

if (!fs.existsSync(envPath)) {
  console.error('❌ ERROR: No se encontró el archivo .env.local')
  console.log('   Crea el archivo .env.local en la raíz del proyecto con:')
  console.log('   MONGODB_URI=mongodb://localhost:27017')
  console.log('   MONGODB_DB_NAME=restaurante_db\n')
  process.exit(1)
}

console.log('✅ Archivo .env.local encontrado\n')

// 2. Cargar variables de entorno
require('dotenv').config({ path: envPath })

console.log('📝 Paso 2: Verificando variables de entorno')

const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'restaurante_db'

if (!MONGODB_URI) {
  console.error('❌ ERROR: MONGODB_URI no está definida en .env.local')
  process.exit(1)
}

console.log('✅ MONGODB_URI:', MONGODB_URI)
console.log('✅ MONGODB_DB_NAME:', MONGODB_DB_NAME)

// Detectar tipo de conexión
const isLocal = MONGODB_URI.includes('localhost') || MONGODB_URI.includes('127.0.0.1')
console.log('📍 Tipo de conexión:', isLocal ? 'LOCAL' : 'REMOTA (Atlas)\n')

// 3. Intentar conectar
console.log('📝 Paso 3: Intentando conectar a MongoDB...')

const client = new MongoClient(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
})

async function verificarConexion() {
  try {
    // Conectar
    await client.connect()
    console.log('✅ Conexión exitosa\n')

    // Verificar base de datos
    console.log('📝 Paso 4: Verificando base de datos')
    const db = client.db(MONGODB_DB_NAME)
    
    // Hacer ping
    await db.command({ ping: 1 })
    console.log('✅ Base de datos accesible\n')

    // Listar colecciones
    console.log('📝 Paso 5: Listando colecciones')
    const collections = await db.listCollections().toArray()
    
    if (collections.length === 0) {
      console.log('⚠️  No hay colecciones creadas aún')
      console.log('   Las colecciones se crearán automáticamente al insertar datos\n')
    } else {
      console.log(`✅ ${collections.length} colección(es) encontrada(s):`)
      collections.forEach(col => {
        console.log(`   - ${col.name}`)
      })
      console.log()
    }

    // Estadísticas
    console.log('📝 Paso 6: Obteniendo estadísticas')
    try {
      const stats = await db.stats()
      console.log('✅ Estadísticas de la base de datos:')
      console.log(`   - Nombre: ${db.databaseName}`)
      console.log(`   - Colecciones: ${stats.collections || 0}`)
      console.log(`   - Documentos: ${stats.objects || 0}`)
      console.log(`   - Tamaño de datos: ${((stats.dataSize || 0) / 1024 / 1024).toFixed(2)} MB`)
      console.log(`   - Índices: ${stats.indexes || 0}\n`)
    } catch (err) {
      console.log('⚠️  No se pudieron obtener estadísticas (normal si la DB está vacía)\n')
    }

    // Verificar permisos
    console.log('📝 Paso 7: Verificando permisos')
    try {
      // Intentar crear una colección temporal
      const testCol = db.collection('_test_connection')
      await testCol.insertOne({ test: true, timestamp: new Date() })
      await testCol.deleteOne({ test: true })
      console.log('✅ Permisos de lectura/escritura confirmados\n')
    } catch (err) {
      console.error('❌ Error de permisos:', err.message)
      console.log('   Verifica que tu usuario tenga permisos de lectura/escritura\n')
    }

    // Resumen final
    console.log('=' .repeat(60))
    console.log('🎉 ¡VERIFICACIÓN COMPLETA!')
    console.log('=' .repeat(60))
    console.log('✅ MongoDB está correctamente configurado')
    console.log('✅ La aplicación puede conectarse sin problemas')
    console.log('\n📌 Próximos pasos:')
    console.log('   1. Inicia tu aplicación: npm run dev')
    console.log('   2. Ve a: http://localhost:3000')
    console.log('   3. Haz clic en la pestaña "MongoDB"')
    console.log('   4. Usa los endpoints para crear datos de prueba\n')

  } catch (error) {
    console.error('\n❌ ERROR DE CONEXIÓN')
    console.error('=' .repeat(60))
    console.error('Mensaje:', error.message)
    console.error('\n💡 Posibles soluciones:\n')

    if (error.message.includes('ECONNREFUSED')) {
      console.error('1. MongoDB no está corriendo. Inicia MongoDB:')
      console.error('   Windows:    Start-Service -Name MongoDB')
      console.error('   macOS:      brew services start mongodb-community@7.0')
      console.error('   Linux:      sudo systemctl start mongod')
      console.error('   Docker:     docker start mongodb-restaurante\n')
    } else if (error.message.includes('authentication')) {
      console.error('1. Problema de autenticación. Verifica usuario y contraseña en MONGODB_URI')
      console.error('2. Si es MongoDB local sin auth, usa: mongodb://localhost:27017\n')
    } else if (error.message.includes('timeout')) {
      console.error('1. MongoDB está demorando mucho en responder')
      console.error('2. Verifica que el servicio esté corriendo')
      console.error('3. Si es Atlas, verifica tu conexión a internet y la whitelist de IPs\n')
    } else {
      console.error('1. Verifica que MONGODB_URI sea correcta en .env.local')
      console.error('2. Para MongoDB local: mongodb://localhost:27017')
      console.error('3. Para Atlas: mongodb+srv://user:pass@cluster.mongodb.net/\n')
    }

    console.error('📚 Consulta la guía completa: MONGODB_LOCAL_SETUP.md\n')
    process.exit(1)

  } finally {
    await client.close()
  }
}

verificarConexion()
