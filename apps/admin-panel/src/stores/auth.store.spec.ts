/**
 * @vitest-environment jsdom
 */
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock api-client
vi.mock('api-client', () => ({
  api: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

import { useAuthStore } from './auth.store';
import { api } from 'api-client';

describe('AuthStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    useAuthStore.setState({
      user: null,
      profile: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  });

  it('should initialize correctly', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
  });

  it('should handle login successfully', async () => {
    const mockResponse = {
      data: {
        access_token: 'fake-token',
        user: { id: '1', email: 'test@test.com' }
      }
    };
    (api.post as any).mockResolvedValue(mockResponse);

    await useAuthStore.getState().login({ email: 'test@test.com', password: 'password' });

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.token).toBe('fake-token');
    expect(localStorage.getItem('token')).toBe('fake-token');
  });

  it('should handle logout', () => {
    useAuthStore.setState({
      token: 'some-token',
      isAuthenticated: true,
    });
    localStorage.setItem('token', 'some-token');

    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.token).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });
});
