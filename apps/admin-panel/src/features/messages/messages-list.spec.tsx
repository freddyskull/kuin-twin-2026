import { render, screen, fireEvent } from '@testing-library/react';
import { MessagesList } from './messages-list';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useMessagesStore } from '../../stores/messages.store';
import { useAuthStore } from '../../stores/auth.store';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock stores
vi.mock('../../stores/messages.store', () => ({
  useMessagesStore: vi.fn(),
}));

vi.mock('../../stores/auth.store', () => ({
  useAuthStore: vi.fn(),
}));

// Mock socket
vi.mock('../../lib/socket', () => ({
  getSocket: vi.fn(() => ({
    on: vi.fn(),
    off: vi.fn(),
  })),
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
  const mockMessages = [
    {
      id: '1',
      content: 'Hola Admin',
      senderId: 'user-1',
      receiverId: 'admin-1',
      createdAt: new Date().toISOString(),
      sender: { id: 'user-1', email: 'user@test.com', profile: { displayName: 'Juan Perez' } },
      receiver: { id: 'admin-1', email: 'admin@test.com' },
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthStore as any).mockReturnValue({
      user: { id: 'admin-1', email: 'admin@test.com' },
    });
    (useMessagesStore as any).mockReturnValue({
      messages: mockMessages,
      fetchAllMessages: vi.fn(),
      addMessage: vi.fn(),
      sendMessage: vi.fn(),
      deleteUserMessages: vi.fn(),
      clearUnread: vi.fn(),
      removeNotificationsBySender: vi.fn(),
      isLoading: false,
    });
  });

  it('renders directory and empty chat state', () => {
    render(
      <MemoryRouter>
        <MessagesList />
      </MemoryRouter>
    );

    expect(screen.getByText('Directorio')).toBeInTheDocument();
    expect(screen.getByText('Juan Perez')).toBeInTheDocument();
    expect(screen.getByText('Selecciona un Chat')).toBeInTheDocument();
  });

  it('navigates when a user is selected', () => {
    render(
      <MemoryRouter>
        <MessagesList />
      </MemoryRouter>
    );

    const userButton = screen.getByText('Juan Perez').closest('button');
    fireEvent.click(userButton!);

    expect(mockNavigate).toHaveBeenCalledWith('/mensajes/user-1');
  });

  it('shows loading state correctly', () => {
    (useMessagesStore as any).mockReturnValue({
      messages: [],
      fetchAllMessages: vi.fn(),
      clearUnread: vi.fn(),
      removeNotificationsBySender: vi.fn(),
      isLoading: true,
    });

    render(
      <MemoryRouter>
        <MessagesList />
      </MemoryRouter>
    );

    expect(screen.getByText(/Sincronizando red de mensajes/i)).toBeInTheDocument();
  });
});
