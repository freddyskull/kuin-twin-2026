import { Button, cn, useToast, FormInput } from "ui-components"
import { Link, useRouter } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useAuthStore } from "../../stores/auth.store"

const loginSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { toast } = useToast()
  const router = useRouter()
  const login = useAuthStore((state) => state.login)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema as any),
  })

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data)
      toast({
        title: "Bienvenido",
        description: "Has iniciado sesión correctamente"
      })
      router.navigate({ to: "/" })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error al iniciar sesión",
        description: error.response?.data?.message || "Credenciales incorrectas",
      })
    }
  }

  return (
    <form
      className={cn("flex relative flex-col gap-6", className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <div className="flex flex-col gap-6 ">
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-xl font-bold uppercase">Inicia sesión</h1>
        </div>
        <div className="grid gap-2">
          <FormInput
            id="email"
            label="Correo electrónico"
            type="email"
            placeholder="m@example.com"
            registration={register("email")}
            error={errors.email?.message}
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <FormInput
              id="password"
              label="Contraseña"
              type="password"
              registration={register("password")}
              error={errors.password?.message}
              className="w-full"
            />
          </div>
          <div className="flex justify-end">
            <Link
              to="/"
              className="text-sm underline-offset-4 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>
        <div className="grid gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>
        </div>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            O continuar con
          </span>
        </div>
        <div className="grid gap-2">
          <Button variant="outline" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
              <path
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                fill="currentColor"
              />
            </svg>
            Entrar con GitHub
          </Button>
          <div className="text-center text-sm text-balance">
            ¿No tienes una cuenta?{" "}
            <Link to="/register" className="underline underline-offset-4">
              Regístrate
            </Link>
          </div>
        </div>
      </div>
    </form>
  )
}
