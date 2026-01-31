import { Button } from "ui-components";
import { ModeToggle } from "../../components/mode-toggle";

export default function TestPage() {
  return (
    <div className="min-h-screen bg-background p-8 transition-colors duration-300">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Header */}
        <div className="flex flex-col items-center justify-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">Web Store</h1>
            <p className="mt-2 text-muted-foreground">
              Demostración de componentes Shadcn UI compartidos
            </p>
          </div>
          <ModeToggle />
        </div>

        {/* Variants Section */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold">Variantes de Botones</h2>
            <p className="text-sm text-muted-foreground">
              Todos los estilos disponibles
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
        </section>

        {/* Sizes Section */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold">Tamaños</h2>
            <p className="text-sm text-muted-foreground">
              Tamaños para diferentes contextos de uso
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button size="sm">Pequeño</Button>
            <Button size="default">Normal</Button>
            <Button size="lg">Grande</Button>
          </div>
        </section>

        {/* E-commerce Use Cases */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold">Casos de Uso E-commerce</h2>
            <p className="text-sm text-muted-foreground">
              Ejemplos típicos en una tienda online
            </p>
          </div>
          <div className="grid gap-6">
            {/* Product Card Example */}
            <div className="rounded-lg border bg-card p-6 max-w-sm">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">Producto Ejemplo</h3>
                  <p className="text-2xl font-bold mt-1">$99.99</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Descripción del producto con características principales
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1">Agregar al Carrito</Button>
                  <Button variant="outline" size="icon" className="shrink-0">
                    ♥
                  </Button>
                </div>
              </div>
            </div>

            {/* Checkout Actions */}
            <div className="space-y-2">
              <h3 className="font-medium">Acciones de Checkout</h3>
              <div className="flex gap-2">
                <Button size="lg" className="flex-1">
                  Proceder al Pago
                </Button>
                <Button variant="outline" size="lg">
                  Continuar Comprando
                </Button>
              </div>
            </div>

            {/* Filter/Sort Actions */}
            <div className="space-y-2">
              <h3 className="font-medium">Filtros y Orden</h3>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" size="sm">
                  Más Vendidos
                </Button>
                <Button variant="secondary" size="sm">
                  Nuevos
                </Button>
                <Button variant="secondary" size="sm">
                  Ofertas
                </Button>
                <Button variant="outline" size="sm">
                  Limpiar Filtros
                </Button>
              </div>
            </div>

            {/* Account Actions */}
            <div className="space-y-2">
              <h3 className="font-medium">Acciones de Cuenta</h3>
              <div className="flex gap-2">
                <Button variant="ghost">Mi Cuenta</Button>
                <Button variant="ghost">Pedidos</Button>
                <Button variant="ghost">Favoritos</Button>
                <Button variant="link">Cerrar Sesión</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Info Footer */}
        <div className="rounded-lg border bg-card p-6 text-center">
          <p className="text-sm text-muted-foreground">
            ✨ Estos componentes provienen de{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
              libs/ui-components
            </code>{" "}
            y son compartidos con admin-panel
          </p>
        </div>
      </div>
    </div>
  );
}
