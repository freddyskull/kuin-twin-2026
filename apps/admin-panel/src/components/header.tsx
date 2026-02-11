import { useNavigate, Link } from 'react-router-dom';
import { Home, LayoutDashboard, Users, Settings, Menu, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Button } from 'ui-components';
import { useAuthStore } from '../stores/auth.store';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: Home },
    { to: '/login', label: 'Login', icon: Home },
    { to: '/users', label: 'Usuarios', icon: Users },
    { to: '/settings', label: 'Configuración', icon: Settings },
    { to: '/register', label: 'Register', icon: Home },
  ];

  const logoutButton = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4">
        {/* Mobile Menu Button */}
        <button
          className="mr-2 md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <LayoutDashboard className="h-6 w-6" />
            <span className="font-bold hidden sm:inline-block">
              Kuin Admin
            </span>
          </Link>
          <nav className="hidden md:flex flex-row gap-4">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.to}
                className="flex text-sm font-medium transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button variant="ghost" size="sm" className="w-auto px-4" onClick={logoutButton}>
            <LogOut className="h-4 w-4 mr-2" />
            <span>Cerrar sesión</span>
          </Button>
        </div>

      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t p-4 space-y-4 bg-background">
          <nav className="flex flex-col space-y-4">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-2"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
