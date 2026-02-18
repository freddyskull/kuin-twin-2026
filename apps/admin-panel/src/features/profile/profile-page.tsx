
import { ProfileForm } from "./components/profile-form";
import { Link } from "react-router-dom";

export function ProfilePage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Mi Perfil</h2>
        <div className="flex items-center space-x-2">
          {/* Posible botón de acción o toggle para ver perfil público */}
          <Link
            to="/servicios"
            className="text-sm text-muted-foreground hover:underline"
          >
            Volver
          </Link>
        </div>
      </div>
      <p className="text-muted-foreground">
        Administra la información de tu perfil, ubicación y redes sociales.
      </p>

      <div className="mx-auto max-w-4xl py-6">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <ProfileForm />
        </div>
      </div>
    </div>
  );
}
