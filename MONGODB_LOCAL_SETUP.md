# 🏠 Guía de Configuración MongoDB Local

Esta guía te ayudará a configurar MongoDB localmente en tu computadora para el proyecto de gestión de restaurante.

---

## 📋 Tabla de Contenidos

1. [Instalación de MongoDB](#instalación-de-mongodb)
2. [Configuración del Proyecto](#configuración-del-proyecto)
3. [Verificar la Conexión](#verificar-la-conexión)
4. [Comandos Útiles](#comandos-útiles)
5. [Solución de Problemas](#solución-de-problemas)

---

## 🔧 Instalación de MongoDB

### Windows

#### Opción 1: Instalador MSI (Recomendado)

1. **Descargar MongoDB Community Server**
   - Ve a: https://www.mongodb.com/try/download/community
   - Selecciona:
     - Version: Latest (7.0 o superior)
     - Platform: Windows
     - Package: MSI
   - Haz clic en "Download"

2. **Instalar MongoDB**
   - Ejecuta el archivo `.msi` descargado
   - Selecciona "Complete" installation
   - **Importante**: Marca la opción "Install MongoDB as a Service"
   - Marca también "Install MongoDB Compass" (GUI opcional pero útil)

3. **Verificar Instalación**
   ```powershell
   mongod --version
   ```
   
   Si aparece la versión, ¡MongoDB está instalado! ✅

#### Opción 2: Chocolatey (Si tienes Chocolatey instalado)

```powershell
choco install mongodb
```

#### Opción 3: Docker (Más rápido para desarrollo)

```powershell
# Descargar e iniciar MongoDB en Docker
docker run -d -p 27017:27017 --name mongodb-restaurante mongo:latest

# Verificar que está corriendo
docker ps
```

---

### macOS

#### Opción 1: Homebrew (Recomendado)

```bash
# Instalar MongoDB Community Edition
brew tap mongodb/brew
brew install mongodb-community@7.0

# Iniciar MongoDB como servicio
brew services start mongodb-community@7.0
```

#### Opción 2: Docker

```bash
docker run -d -p 27017:27017 --name mongodb-restaurante mongo:latest
```

---

### Linux (Ubuntu/Debian)

```bash
# Importar la clave pública de MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Crear el archivo de lista de fuentes
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Actualizar e instalar
sudo apt-get update
sudo apt-get install -y mongodb-org

# Iniciar MongoDB
sudo systemctl start mongod

# Habilitar para que inicie automáticamente
sudo systemctl enable mongod
```

---

## ⚙️ Configuración del Proyecto

### 1. Crear archivo `.env.local`

En la raíz de tu proyecto, crea el archivo `.env.local`:

```env
# MongoDB Local (sin autenticación)
MONGODB_URI=mongodb://localhost:27017

# Nombre de la base de datos
MONGODB_DB_NAME=restaurante_db
```

### 2. Verificar que MongoDB esté corriendo

**Windows:**
```powershell
# Verificar servicio
Get-Service -Name MongoDB

# Iniciar servicio si está detenido
Start-Service -Name MongoDB
```

**macOS/Linux:**
```bash
# Verificar status
brew services list  # macOS
sudo systemctl status mongod  # Linux

# Iniciar si está detenido
brew services start mongodb-community@7.0  # macOS
sudo systemctl start mongod  # Linux
```

**Docker:**
```bash
# Ver contenedores corriendo
docker ps

# Iniciar si está detenido
docker start mongodb-restaurante
```

### 3. Iniciar tu aplicación

```bash
npm run dev
```

Deberías ver en la consola:
```
✅ MongoDB conectado exitosamente
📍 Tipo de conexión: LOCAL
📦 Base de datos: restaurante_db
```

---

## ✅ Verificar la Conexión

### Método 1: Desde la aplicación

1. Abre http://localhost:3000
2. Ve a la pestaña "MongoDB"
3. Si ves el dashboard sin errores, ¡la conexión funciona! ✅

### Método 2: Usando MongoDB Compass

1. Abre MongoDB Compass (se instala con MongoDB)
2. Usa la conexión: `mongodb://localhost:27017`
3. Deberías ver tu base de datos `restaurante_db`

### Método 3: Desde la terminal de MongoDB

```bash
# Conectar a MongoDB
mongosh

# Listar bases de datos
show dbs

# Usar tu base de datos
use restaurante_db

# Listar colecciones
show collections
```

---

## 🛠️ Comandos Útiles

### Gestión del Servicio MongoDB

**Windows:**
```powershell
# Ver status
Get-Service -Name MongoDB

# Iniciar
Start-Service -Name MongoDB

# Detener
Stop-Service -Name MongoDB

# Reiniciar
Restart-Service -Name MongoDB
```

**macOS:**
```bash
# Ver status
brew services list

# Iniciar
brew services start mongodb-community@7.0

# Detener
brew services stop mongodb-community@7.0

# Reiniciar
brew services restart mongodb-community@7.0
```

**Linux:**
```bash
# Ver status
sudo systemctl status mongod

# Iniciar
sudo systemctl start mongod

# Detener
sudo systemctl stop mongod

# Reiniciar
sudo systemctl restart mongod
```

**Docker:**
```bash
# Ver status
docker ps -a

# Iniciar
docker start mongodb-restaurante

# Detener
docker stop mongodb-restaurante

# Reiniciar
docker restart mongodb-restaurante

# Ver logs
docker logs mongodb-restaurante
```

### Comandos de MongoDB Shell (mongosh)

```bash
# Conectar
mongosh

# Seleccionar base de datos
use restaurante_db

# Listar colecciones
show collections

# Ver documentos en una colección
db.productos.find().pretty()

# Contar documentos
db.productos.countDocuments()

# Eliminar una colección
db.productos.drop()

# Eliminar toda la base de datos (¡cuidado!)
db.dropDatabase()

# Salir
exit
```

---

## 🐛 Solución de Problemas

### Error: "MongoServerError: connect ECONNREFUSED"

**Causa:** MongoDB no está corriendo.

**Solución:**
```bash
# Windows
Start-Service -Name MongoDB

# macOS
brew services start mongodb-community@7.0

# Linux
sudo systemctl start mongod

# Docker
docker start mongodb-restaurante
```

---

### Error: "Por favor agrega tu MONGODB_URI en el archivo .env.local"

**Causa:** No existe el archivo `.env.local` o no tiene la variable.

**Solución:**
1. Crea el archivo `.env.local` en la raíz del proyecto
2. Agrega:
   ```env
   MONGODB_URI=mongodb://localhost:27017
   MONGODB_DB_NAME=restaurante_db
   ```
3. Reinicia el servidor: `Ctrl+C` y luego `npm run dev`

---

### Error: "Failed to connect to localhost:27017"

**Causa:** MongoDB no está instalado o no está corriendo en el puerto 27017.

**Solución:**
1. Verifica que MongoDB esté instalado: `mongod --version`
2. Verifica que esté corriendo (ver comandos de gestión arriba)
3. Verifica el puerto:
   ```bash
   # Windows
   netstat -an | findstr "27017"
   
   # macOS/Linux
   netstat -an | grep 27017
   ```

---

### Error: Puerto 27017 ya está en uso

**Causa:** Otra instancia de MongoDB está corriendo.

**Solución:**
```bash
# Windows
Get-Process -Name mongod
Stop-Process -Name mongod -Force

# macOS/Linux
sudo pkill mongod

# Luego reinicia MongoDB
```

---

### MongoDB se cierra inesperadamente

**Causa:** Puede haber archivos de bloqueo corruptos.

**Solución:**

**Windows:**
```powershell
# Eliminar archivo de bloqueo
Remove-Item "C:\data\db\mongod.lock" -Force

# Reiniciar
Start-Service -Name MongoDB
```

**macOS/Linux:**
```bash
# Eliminar archivo de bloqueo
sudo rm /usr/local/var/mongodb/mongod.lock  # macOS
sudo rm /var/lib/mongodb/mongod.lock        # Linux

# Reiniciar
brew services restart mongodb-community@7.0  # macOS
sudo systemctl restart mongod                # Linux
```

---

### La aplicación no se conecta después de crear .env.local

**Causa:** Next.js necesita reiniciarse para leer las nuevas variables de entorno.

**Solución:**
1. Detén el servidor: `Ctrl+C`
2. Inícialo de nuevo: `npm run dev`
3. Limpia la caché si persiste: `rm -rf .next` y luego `npm run dev`

---

## 📊 Crear Datos de Prueba

Una vez que MongoDB esté conectado, puedes crear datos de prueba:

### Opción 1: Usar los endpoints

Consulta `MONGODB_SETUP.md` para ver ejemplos de cómo crear:
- Bots
- Restaurantes
- Productos
- Pedidos
- etc.

### Opción 2: Usar MongoDB Compass

1. Abre MongoDB Compass
2. Conecta a `mongodb://localhost:27017`
3. Crea la base de datos `restaurante_db`
4. Crea las colecciones manualmente
5. Inserta documentos con la GUI

### Opción 3: Importar JSON

Si tienes datos en JSON:

```bash
# Importar productos
mongoimport --db restaurante_db --collection productos --file productos.json --jsonArray

# Importar pedidos
mongoimport --db restaurante_db --collection pedidos --file pedidos.json --jsonArray
```

---

## 🔐 Configurar Autenticación (Opcional)

Si quieres agregar seguridad a tu MongoDB local:

```bash
# Conectar a MongoDB
mongosh

# Crear usuario administrador
use admin
db.createUser({
  user: "admin",
  pwd: "tu_password_segura",
  roles: ["root"]
})

# Salir
exit
```

Luego actualiza tu `.env.local`:

```env
MONGODB_URI=mongodb://admin:tu_password_segura@localhost:27017
MONGODB_DB_NAME=restaurante_db
```

---

## 🎯 Ventajas de MongoDB Local vs Atlas

### MongoDB Local ✅
- ✅ Gratis sin límites
- ✅ No necesita internet
- ✅ Más rápido en desarrollo
- ✅ Sin restricciones de IP
- ✅ Control total de los datos

### MongoDB Atlas (Cloud) ☁️
- ✅ No requiere instalación local
- ✅ Accesible desde cualquier lugar
- ✅ Backups automáticos
- ✅ Escalable fácilmente
- ❌ Límite de 512MB en plan gratuito

---

## 📁 Ubicación de los Datos

### Windows
```
C:\data\db\
```

### macOS
```
/usr/local/var/mongodb/
```

### Linux
```
/var/lib/mongodb/
```

### Docker
```bash
# Ver volumen de datos
docker inspect mongodb-restaurante
```

---

## 🔄 Backup y Restore

### Hacer Backup

```bash
# Backup completo
mongodump --db restaurante_db --out ./backup

# Backup de una colección específica
mongodump --db restaurante_db --collection productos --out ./backup
```

### Restaurar Backup

```bash
# Restaurar base de datos completa
mongorestore --db restaurante_db ./backup/restaurante_db

# Restaurar una colección
mongorestore --db restaurante_db --collection productos ./backup/restaurante_db/productos.bson
```

---

## 🚀 Siguiente Paso

Una vez que MongoDB local esté configurado y conectado:

1. ✅ Verifica la conexión en http://localhost:3000 (pestaña MongoDB)
2. ✅ Crea datos de prueba usando los endpoints
3. ✅ Explora MongoDB Compass para ver tus datos visualmente
4. ✅ Consulta `MONGODB_SETUP.md` para usar las APIs

---

## 📞 Recursos Adicionales

- [Documentación oficial MongoDB](https://docs.mongodb.com/manual/installation/)
- [MongoDB Compass Download](https://www.mongodb.com/try/download/compass)
- [MongoDB University](https://university.mongodb.com/) - Cursos gratis
- [MongoDB Shell (mongosh)](https://www.mongodb.com/docs/mongodb-shell/)

---

**¡Tu MongoDB local está listo para desarrollo! 🎉**
