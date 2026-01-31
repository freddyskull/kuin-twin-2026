import { Button } from "ui-components";
import { ModeToggle } from "@/components/mode-toggle";

export default function App() {
  return (
    <div className="min-h-screen bg-background p-8 transition-colors duration-300">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Header */}
        <div className="flex flex-col items-center justify-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">Admin Panel</h1>
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
              Diferentes estilos para distintos contextos
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
              Tres tamaños disponibles para diferentes necesidades
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button size="sm">Pequeño</Button>
            <Button size="default">Normal</Button>
            <Button size="lg">Grande</Button>
          </div>
        </section>

        {/* States Section */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold">Estados</h2>
            <p className="text-sm text-muted-foreground">
              Botones en diferentes estados
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button>Normal</Button>
            <Button disabled>Deshabilitado</Button>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold">Casos de Uso</h2>
            <p className="text-sm text-muted-foreground">
              Ejemplos de uso común en admin panel
            </p>
          </div>
          <div className="grid gap-4">
            {/* Actions Row */}
            <div className="flex gap-2 items-center">
              <Button>Guardar Cambios</Button>
              <Button variant="outline">Cancelar</Button>
              <Button variant="destructive">Eliminar</Button>
            </div>

            {/* Secondary Actions */}
            <div className="flex gap-2 items-center">
              <Button variant="secondary" size="sm">
                Exportar
              </Button>
              <Button variant="secondary" size="sm">
                Importar
              </Button>
              <Button variant="ghost" size="sm">
                Más opciones
              </Button>
            </div>

            {/* Link Actions */}
            <div className="flex gap-4 items-center">
              <Button variant="link" className="p-0 h-auto">
                Ver detalles
              </Button>
              <Button variant="link" className="p-0 h-auto">
                Editar
              </Button>
              <Button variant="link" className="p-0 h-auto text-destructive">
                Eliminar
              </Button>
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
            y son compartidos con web-store
          </p>
        </div>
      </div>
    </div>
  );
}
