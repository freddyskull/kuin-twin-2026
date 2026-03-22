import { render, screen, fireEvent, waitFor } from '../../test/utils';
import { MessagesList } from './messages-list';
import { vi, describe, it, expect } from 'vitest';
import { http, delay, HttpResponse } from 'msw';
import { server } from '../../mocks/server';

const API_URL = 'http://localhost:3001/api';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock lucide-react
vi.mock('lucide-react', () => ({
  Search: () => <span>Search</span>,
  RefreshCw: () => <span>Refresh</span>,
  MessageSquare: () => <span>Message</span>,
  ChevronRight: () => <span>Right</span>,
  UserCircle: () => <span>User</span>,
  ShieldCheck: () => <span>Shield</span>,
  Trash2: () => <span>Trash</span>,
  Send: () => <span>Send</span>,
  Clock: () => <span>Clock</span>,
  Command: () => <span>Command</span>,
}));

// Mock UI components
vi.mock('@components/ui/avatar', () => ({
  Avatar: ({ children, className }: any) => <div className={className}>{children}</div>,
  AvatarImage: ({ src }: any) => <img src={src} alt="avatar" />,
  AvatarFallback: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('@components/ui/button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

vi.mock('@components/ui/input', () => ({
  Input: (props: any) => <input {...props} />,
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({}),
  };
});

describe('MessagesList', () => {
  it('renders directory and empty chat state', async () => {
    render(<MessagesList />);

    // Esperar a que los datos se carguen y MSW responda
    expect(await screen.findByText('Juan Perez')).toBeInTheDocument();
    expect(screen.getByText('Centro de Control')).toBeInTheDocument();
  });

  it('navigates when a user is selected', async () => {
    render(<MessagesList />);

    const userButton = await screen.findByText('Juan Perez');
    fireEvent.click(userButton.closest('button')!);

    expect(mockNavigate).toHaveBeenCalledWith('/mensajes/user-1');
  });

  it('shows loading state correctly', async () => {
    // Forzamos un delay infinito para esta prueba específica para ver el loading
    server.use(
      http.get(`${API_URL}/chat/admin/all-messages`, async () => {
        await delay('infinite');
        return HttpResponse.json([]);
      })
    );

    render(<MessagesList />);
    expect(screen.getByText(/Estableciendo conexión segura/i)).toBeInTheDocument();
  });
});
