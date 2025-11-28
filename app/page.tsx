"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Settings, TrendingUp, ChefHat, Bell } from "lucide-react"
import { OrdersDashboard } from "@/components/orders-dashboard"
import { SalesDashboard } from "@/components/sales-dashboard"
import { ConfigurationPanel } from "@/components/configuration-panel"

export default function RestaurantManagement() {
  const [activeTab, setActiveTab] = useState("orders")

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <ChefHat className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">RestaurantePro</h1>
                <p className="text-sm text-muted-foreground">Sistema de Gestión de Pedidos</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notificaciones
              </Button>
              <Badge variant="secondary" className="bg-accent text-accent-foreground">
                En línea
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[600px] mx-auto">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Órdenes Entrantes
            </TabsTrigger>
            <TabsTrigger value="sales" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Ventas del Día
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configuración
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-6">
            <OrdersDashboard />
          </TabsContent>

          <TabsContent value="sales" className="space-y-6">
            <SalesDashboard />
          </TabsContent>

          <TabsContent value="config" className="space-y-6">
            <ConfigurationPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
