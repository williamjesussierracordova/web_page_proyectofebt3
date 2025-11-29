"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Menu, DollarSign, Bell, Plus, Trash2, Edit, Save } from "lucide-react"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  available: boolean
  preparationTime: number
}

interface RestaurantSettings {
  name: string
  phone: string
  address: string
  openingHours: {
    [key: string]: { open: string; close: string; isOpen: boolean }
  }
  notifications: {
    newOrders: boolean
    orderReady: boolean
    lowStock: boolean
    dailyReport: boolean
  }
  deliverySettings: {
    enabled: boolean
    radius: number
    minOrder: number
    deliveryFee: number
  }
}

const initialMenu: MenuItem[] = [
  {
    id: "1",
    name: "Pizza Margherita",
    description: "Tomate, mozzarella, albahaca fresca",
    price: 12.5,
    category: "Pizzas",
    available: true,
    preparationTime: 15,
  },
  {
    id: "2",
    name: "Hamburguesa Completa",
    description: "Carne, lechuga, tomate, cebolla, queso",
    price: 8.9,
    category: "Hamburguesas",
    available: true,
    preparationTime: 12,
  },
  {
    id: "3",
    name: "Ensalada César",
    description: "Lechuga, pollo, parmesano, croutons",
    price: 7.5,
    category: "Ensaladas",
    available: false,
    preparationTime: 8,
  },
]

const initialSettings: RestaurantSettings = {
  name: "RestaurantePro",
  phone: "+34 912 345 678",
  address: "Calle Principal 123, Madrid",
  openingHours: {
    monday: { open: "09:00", close: "23:00", isOpen: true },
    tuesday: { open: "09:00", close: "23:00", isOpen: true },
    wednesday: { open: "09:00", close: "23:00", isOpen: true },
    thursday: { open: "09:00", close: "23:00", isOpen: true },
    friday: { open: "09:00", close: "24:00", isOpen: true },
    saturday: { open: "10:00", close: "24:00", isOpen: true },
    sunday: { open: "10:00", close: "22:00", isOpen: false },
  },
  notifications: {
    newOrders: true,
    orderReady: true,
    lowStock: false,
    dailyReport: true,
  },
  deliverySettings: {
    enabled: true,
    radius: 5,
    minOrder: 15,
    deliveryFee: 2.5,
  },
}

export function ConfigurationPanel() {
  const [menu, setMenu] = useState<MenuItem[]>(initialMenu)
  const [settings, setSettings] = useState<RestaurantSettings>(initialSettings)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({})

  const dayNames = {
    monday: "Lunes",
    tuesday: "Martes",
    wednesday: "Miércoles",
    thursday: "Jueves",
    friday: "Viernes",
    saturday: "Sábado",
    sunday: "Domingo",
  }

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setMenu(menu.map((item) => (item.id === id ? { ...item, ...updates } : item)))
  }

  const addMenuItem = () => {
    if (newItem.name && newItem.price) {
      const item: MenuItem = {
        id: Date.now().toString(),
        name: newItem.name,
        description: newItem.description || "",
        price: newItem.price,
        category: newItem.category || "General",
        available: true,
        preparationTime: newItem.preparationTime || 10,
      }
      setMenu([...menu, item])
      setNewItem({})
    }
  }

  const deleteMenuItem = (id: string) => {
    setMenu(menu.filter((item) => item.id !== id))
  }

  const updateSettings = (path: string, value: any) => {
    const keys = path.split(".")
    const newSettings = { ...settings }
    let current: any = newSettings

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]]
    }
    current[keys[keys.length - 1]] = value

    setSettings(newSettings)
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="hours">Horarios</TabsTrigger>
          <TabsTrigger value="menu">Menú</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Información del Restaurante
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="restaurant-name">Nombre del Restaurante</Label>
                  <Input
                    id="restaurant-name"
                    value={settings.name}
                    onChange={(e) => updateSettings("name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="restaurant-phone">Teléfono</Label>
                  <Input
                    id="restaurant-phone"
                    value={settings.phone}
                    onChange={(e) => updateSettings("phone", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="restaurant-address">Dirección</Label>
                <Textarea
                  id="restaurant-address"
                  value={settings.address}
                  onChange={(e) => updateSettings("address", e.target.value)}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuración de Delivery</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Servicio de Delivery</Label>
                  <p className="text-sm text-muted-foreground">Habilitar entregas a domicilio</p>
                </div>
                <Switch
                  checked={settings.deliverySettings.enabled}
                  onCheckedChange={(checked) => updateSettings("deliverySettings.enabled", checked)}
                />
              </div>

              {settings.deliverySettings.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                  <div>
                    <Label htmlFor="delivery-radius">Radio de Entrega (km)</Label>
                    <Input
                      id="delivery-radius"
                      type="number"
                      value={settings.deliverySettings.radius}
                      onChange={(e) => updateSettings("deliverySettings.radius", Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="min-order">Pedido Mínimo (S/.)</Label>
                    <Input
                      id="min-order"
                      type="number"
                      step="0.1"
                      value={settings.deliverySettings.minOrder}
                      onChange={(e) => updateSettings("deliverySettings.minOrder", Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="delivery-fee">Coste de Envío (S/.)</Label>
                    <Input
                      id="delivery-fee"
                      type="number"
                      step="0.1"
                      value={settings.deliverySettings.deliveryFee}
                      onChange={(e) => updateSettings("deliverySettings.deliveryFee", Number(e.target.value))}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Opening Hours */}
        <TabsContent value="hours" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Horarios de Atención
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(settings.openingHours).map(([day, hours]) => (
                <div key={day} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="w-20">
                    <Label className="font-medium">{dayNames[day as keyof typeof dayNames]}</Label>
                  </div>
                  <Switch
                    checked={hours.isOpen}
                    onCheckedChange={(checked) => updateSettings(`openingHours.${day}.isOpen`, checked)}
                  />
                  {hours.isOpen ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        type="time"
                        value={hours.open}
                        onChange={(e) => updateSettings(`openingHours.${day}.open`, e.target.value)}
                        className="w-32"
                      />
                      <span className="text-muted-foreground">a</span>
                      <Input
                        type="time"
                        value={hours.close}
                        onChange={(e) => updateSettings(`openingHours.${day}.close`, e.target.value)}
                        className="w-32"
                      />
                    </div>
                  ) : (
                    <div className="flex-1">
                      <Badge variant="secondary">Cerrado</Badge>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Menu Management */}
        <TabsContent value="menu" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Menu className="h-5 w-5 text-primary" />
                Gestión del Menú
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add new item form */}
              <div className="p-4 border rounded-lg bg-muted/50">
                <h4 className="font-medium mb-3">Agregar Nuevo Producto</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <Input
                    placeholder="Nombre del producto"
                    value={newItem.name || ""}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  />
                  <Input
                    placeholder="Precio (S/.)"
                    type="number"
                    step="0.1"
                    value={newItem.price || ""}
                    onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                  />
                  <Select
                    value={newItem.category || ""}
                    onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pizzas">Pizzas</SelectItem>
                      <SelectItem value="Hamburguesas">Hamburguesas</SelectItem>
                      <SelectItem value="Ensaladas">Ensaladas</SelectItem>
                      <SelectItem value="Bebidas">Bebidas</SelectItem>
                      <SelectItem value="Postres">Postres</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={addMenuItem} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Agregar
                  </Button>
                </div>
                <div className="mt-3">
                  <Textarea
                    placeholder="Descripción del producto"
                    value={newItem.description || ""}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    rows={2}
                  />
                </div>
              </div>

              {/* Menu items list */}
              <div className="space-y-3">
                {menu.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      {editingItem === item.id ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <Input
                            value={item.name}
                            onChange={(e) => updateMenuItem(item.id, { name: e.target.value })}
                          />
                          <Input
                            type="number"
                            step="0.1"
                            value={item.price}
                            onChange={(e) => updateMenuItem(item.id, { price: Number(e.target.value) })}
                          />
                          <Input
                            type="number"
                            value={item.preparationTime}
                            onChange={(e) => updateMenuItem(item.id, { preparationTime: Number(e.target.value) })}
                            placeholder="Tiempo (min)"
                          />
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{item.name}</h4>
                            <Badge variant="outline">{item.category}</Badge>
                            <Badge variant={item.available ? "default" : "secondary"}>
                              {item.available ? "Disponible" : "No disponible"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                          <div className="flex items-center gap-4 mt-1 text-sm">
                            <span className="font-medium text-primary">S/.{item.price.toFixed(2)}</span>
                            <span className="text-muted-foreground">{item.preparationTime} min</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={item.available}
                        onCheckedChange={(checked) => updateMenuItem(item.id, { available: checked })}
                      />
                      {editingItem === item.id ? (
                        <Button size="sm" onClick={() => setEditingItem(null)}>
                          <Save className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => setEditingItem(item.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => deleteMenuItem(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Configuración de Notificaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="font-medium">Nuevos Pedidos</Label>
                    <p className="text-sm text-muted-foreground">Recibir notificación cuando llegue un nuevo pedido</p>
                  </div>
                  <Switch
                    checked={settings.notifications.newOrders}
                    onCheckedChange={(checked) => updateSettings("notifications.newOrders", checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="font-medium">Pedidos Listos</Label>
                    <p className="text-sm text-muted-foreground">Notificar cuando un pedido esté listo para entregar</p>
                  </div>
                  <Switch
                    checked={settings.notifications.orderReady}
                    onCheckedChange={(checked) => updateSettings("notifications.orderReady", checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="font-medium">Stock Bajo</Label>
                    <p className="text-sm text-muted-foreground">Alertas cuando los ingredientes estén agotándose</p>
                  </div>
                  <Switch
                    checked={settings.notifications.lowStock}
                    onCheckedChange={(checked) => updateSettings("notifications.lowStock", checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="font-medium">Reporte Diario</Label>
                    <p className="text-sm text-muted-foreground">Recibir resumen de ventas al final del día</p>
                  </div>
                  <Switch
                    checked={settings.notifications.dailyReport}
                    onCheckedChange={(checked) => updateSettings("notifications.dailyReport", checked)}
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button className="w-full">Guardar Configuración</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
