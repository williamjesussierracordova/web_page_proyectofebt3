# 🍕 Sistema de Gestión de Restaurante con MongoDB

Sistema completo de gestión para restaurantes con Next.js 14, MongoDB y TypeScript. Incluye gestión de pedidos, productos, clientes, notificaciones automáticas y reportes de ventas.

---

## ✨ Características

✅ **Gestión Completa de Restaurante**
- Administración de productos y categorías
- Gestión de pedidos en tiempo real
- Control de horarios de atención
- Registro de clientes

✅ **Sistema de Notificaciones**
- Notificaciones automáticas cuando un pedido está listo
- Soporte para email y SMS
- Tracking de notificaciones enviadas

✅ **Reportes y Análisis**
- Ventas por período (día, semana, mes, año)
- Productos más vendidos
- Análisis por método de pago
- Identificación de horas pico

✅ **APIs REST Completas**
- 8 colecciones MongoDB implementadas
- Endpoints RESTful documentados
- TypeScript types para type-safety
- Servicios cliente listos para usar

---

## 🚀 Inicio Rápido

### 1. Clonar e Instalar

```bash
# Las dependencias ya están instaladas
npm install
```

### 2. Configurar MongoDB

Crea un archivo `.env.local` en la raíz:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/restaurante_db?retryWrites=true&w=majority
MONGODB_DB_NAME=restaurante_db
```

👉 **[Guía completa de configuración](./QUICKSTART.md)**

### 3. Iniciar el Servidor

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### 4. Ver el Panel MongoDB

- Ve a la pestaña **"MongoDB"** en la aplicación
- Aquí verás productos, pedidos y reportes en tiempo real

---

## 📁 Estructura del Proyecto

```
├── app/
│   ├── api/                    # API Routes de Next.js
│   │   ├── bots/              # CRUD para bots de Telegram
│   │   ├── restaurantes/      # CRUD para restaurantes
│   │   ├── categorias/        # CRUD para categorías
│   │   ├── horarios/          # CRUD para horarios
│   │   ├── productos/         # CRUD para productos
│   │   ├── clientes/          # CRUD para clientes
│   │   ├── pedidos/           # CRUD para pedidos
│   │   ├── ventas/            # CRUD para ventas
│   │   ├── notificaciones/    # Sistema de notificaciones
│   │   └── reportes/
│   │       └── ventas/        # Reportes de ventas
│   ├── page.tsx               # Página principal
│   └── ...
│
├── components/
│   ├── mongodb-dashboard.tsx  # Panel de gestión MongoDB
│   ├── orders-dashboard.tsx   # Dashboard de pedidos
│   ├── sales-dashboard.tsx    # Dashboard de ventas
│   └── ...
│
├── lib/
│   ├── mongodb.ts             # Configuración de conexión MongoDB
│   ├── types/
│   │   └── mongodb.ts         # TypeScript types para MongoDB
│   └── services/
│       └── mongodb-services.ts # Servicios cliente para APIs
│
├── scripts/
│   └── inicializar-datos.ts   # Script para crear datos de prueba
│
├── .env.local                 # Variables de entorno (crear)
├── .env.local.example         # Plantilla de variables
├── QUICKSTART.md              # Guía rápida de inicio
├── MONGODB_SETUP.md           # Documentación completa
└── README.md                  # Este archivo
```

---

## 📚 Documentación

### Guías Disponibles

1. **[QUICKSTART.md](./QUICKSTART.md)** - Inicio rápido en 5 minutos
2. **[MONGODB_SETUP.md](./MONGODB_SETUP.md)** - Documentación completa de APIs
3. **Scripts** - Script de inicialización de datos en `scripts/`

### Endpoints Principales

| Endpoint | Métodos | Descripción |
|----------|---------|-------------|
| `/api/bots` | GET, POST | Gestión de bots |
| `/api/restaurantes` | GET, POST | Gestión de restaurantes |
| `/api/categorias` | GET, POST | Gestión de categorías |
| `/api/horarios` | GET, POST | Gestión de horarios |
| `/api/productos` | GET, POST, PATCH | Gestión de productos |
| `/api/clientes` | GET, POST | Gestión de clientes |
| `/api/pedidos` | GET, POST, PATCH | Gestión de pedidos |
| `/api/ventas` | GET, POST | Registro de ventas |
| `/api/notificaciones` | GET, POST | Sistema de notificaciones |
| `/api/reportes/ventas` | GET | Reportes de ventas |

---

## 🎯 Colecciones MongoDB

### 1. **bots**
Bots de Telegram asignados a restaurantes

### 2. **restaurantes**
Información de los establecimientos

### 3. **categorias**
Categorías del menú (Pizzas, Hamburguesas, etc.)

### 4. **horarios**
Horarios de atención por día

### 5. **productos**
Productos del menú con precios y tiempos de preparación

### 6. **clientes**
Datos de clientes registrados

### 7. **pedidos**
Pedidos con estados y sistema de notificaciones

### 8. **ventas**
Registro de ventas completadas para reportes

---

## 💡 Ejemplos de Uso

### Usar los Servicios en un Componente

```typescript
'use client'

import { useEffect, useState } from 'react'
import { productosService, pedidosService } from '@/lib/services/mongodb-services'

export function MiComponente() {
  const [productos, setProductos] = useState([])
  
  useEffect(() => {
    async function cargarProductos() {
      const data = await productosService.getAll()
      setProductos(data)
    }
    cargarProductos()
  }, [])
  
  async function crearPedido() {
    const pedido = await pedidosService.create({
      id_restaurant: 'RESTAURANT_ID',
      id_cliente: 'CLIENTE_ID',
      productos: [...],
      total_pedido: 25.00,
      metodo_pago: 'tarjeta',
      info_notificacion: { ... }
    })
  }
  
  return <div>{/* Tu UI */}</div>
}
```

### Llamar a la API Directamente

```typescript
// Obtener productos
const response = await fetch('/api/productos')
const { data } = await response.json()

// Crear un pedido
const response = await fetch('/api/pedidos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ... })
})
```

---

## 🔔 Sistema de Notificaciones

El sistema de notificaciones funciona automáticamente:

1. Cuando un pedido cambia a `"listo_para_entrega"`:
   - Se actualiza `fecha_listo`
   - El campo `notificado` permanece en `false`

2. Consultar pedidos listos para notificar:
   ```typescript
   GET /api/notificaciones
   ```

3. Enviar notificación (tu lógica personalizada)

4. Marcar como notificado:
   ```typescript
   POST /api/notificaciones
   Body: { id_pedido: "PED-123" }
   ```

---

## 📊 Reportes

### Obtener Reporte de Ventas

```typescript
import { reportesService } from '@/lib/services/mongodb-services'

// Reporte de hoy
const reporteHoy = await reportesService.getReporteHoy()

// Reporte semanal
const reporteSemanal = await reportesService.getReporteSemanal()

// Reporte mensual
const reporteMensual = await reportesService.getReporteMensual()

// Reporte personalizado
const reporte = await reportesService.getReporteVentas({
  fecha_inicio: new Date('2025-11-01'),
  fecha_fin: new Date('2025-11-30'),
  tipo: 'mensual'
})
```

### Datos del Reporte

```typescript
{
  resumen: {
    total_ventas: number
    total_impuestos: number
    total_descuentos: number
    cantidad_ventas: number
  },
  productos_top: [...],
  metodos_pago: [...],
  ventas_por_hora: [...]
}
```

---

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **Base de Datos**: MongoDB Atlas
- **Driver**: mongodb ^7.0.0
- **Lenguaje**: TypeScript
- **UI**: Shadcn/ui + Tailwind CSS
- **Iconos**: Lucide React

---

## 🔧 Desarrollo

### Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Iniciar en producción
npm start

# Linting
npm run lint
```

---

## 📝 Configuración Adicional

### Crear Índices en MongoDB

Para mejor rendimiento, crea estos índices en MongoDB Compass o la terminal de MongoDB:

```javascript
// Pedidos
db.pedidos.createIndex({ "estado_pedido": 1, "notificado": 1 })
db.pedidos.createIndex({ "id_cliente": 1 })
db.pedidos.createIndex({ "created_at": -1 })

// Ventas
db.ventas.createIndex({ "fecha_venta": -1 })
db.ventas.createIndex({ "id_cliente": 1 })

// Productos
db.productos.createIndex({ "id_restaurant": 1, "disponible": 1 })
db.productos.createIndex({ "categoria": 1 })

// Horarios
db.horarios.createIndex({ "id_restaurant": 1, "dia": 1 })
```

---

## 🐛 Solución de Problemas

### MongoDB no conecta

1. Verifica que `.env.local` existe y tiene la URI correcta
2. Confirma que tu IP está en la whitelist de MongoDB Atlas
3. Verifica usuario y contraseña en la connection string
4. Reinicia el servidor de desarrollo

### Error: Cannot find module

```bash
npm install
```

### Los cambios no se reflejan

1. Reinicia el servidor (`Ctrl+C` y luego `npm run dev`)
2. Limpia el caché: `rm -rf .next`

---

## 🚀 Próximos Pasos

1. [ ] Configurar MongoDB Atlas
2. [ ] Crear archivo `.env.local`
3. [ ] Probar la pestaña "MongoDB" en la aplicación
4. [ ] Crear datos de prueba usando los endpoints
5. [ ] Explorar los reportes
6. [ ] Implementar lógica de notificaciones
7. [ ] Agregar autenticación
8. [ ] Desplegar en producción

---

## 📖 Recursos

- [Documentación de MongoDB](https://docs.mongodb.com/)
- [Next.js Docs](https://nextjs.org/docs)
- [MongoDB University](https://university.mongodb.com/) (Cursos gratis)
- [Shadcn/ui](https://ui.shadcn.com/)

---

## 📄 Licencia

Este proyecto es de código abierto para propósitos educativos.

---

## 🤝 Soporte

Para dudas o problemas:
1. Revisa [QUICKSTART.md](./QUICKSTART.md)
2. Consulta [MONGODB_SETUP.md](./MONGODB_SETUP.md)
3. Verifica la consola del navegador para errores

---

**¡Listo para gestionar tu restaurante! 🍕🚀**
