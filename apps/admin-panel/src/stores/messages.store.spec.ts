import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useMessagesStore } from './messages.store';
import axios from 'axios';

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('MessagesStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset store state manually if needed, but since it's a hook we just use it
    useMessagesStore.setState({
      messages: [],
      notificationMessages: [],
      isLoading: false,
      unreadCount: 0,
      error: null,
    });
  });

  const mockMessage = {
    id: '1',
    content: 'Hola',
    senderId: 'user-1',
    receiverId: 'admin-1',
    isRead: false,
    createdAt: new Date().toISOString(),
    sender: { id: 'user-1', email: 'user@test.com' },
    receiver: { id: 'admin-1', email: 'admin@test.com' },
  };

  it('should add a message correctly', () => {
    const { addMessage } = useMessagesStore.getState();
    addMessage(mockMessage);
    
    const state = useMessagesStore.getState();
    expect(state.messages).toHaveLength(1);
    expect(state.messages[0].id).toBe('1');
  });

  it('should not add duplicate messages', () => {
    const { addMessage } = useMessagesStore.getState();
    addMessage(mockMessage);
    addMessage(mockMessage); // Duplicate
    
    const state = useMessagesStore.getState();
    expect(state.messages).toHaveLength(1);
  });

  it('should handle notifications correctly', () => {
    const { addMessage } = useMessagesStore.getState();
    addMessage(mockMessage, true); // isNotification = true
    
    let state = useMessagesStore.getState();
    expect(state.notificationMessages).toHaveLength(1);
    expect(state.unreadCount).toBe(1);

    const { clearUnread } = useMessagesStore.getState();
    clearUnread();
    
    state = useMessagesStore.getState();
    expect(state.unreadCount).toBe(0);
    expect(state.notificationMessages).toHaveLength(0);
  });

  it('should fetch all messages from API', async () => {
    mockedAxios.get.mockResolvedValue({ data: [mockMessage] });
    
    const { fetchAllMessages } = useMessagesStore.getState();
    await fetchAllMessages();
    
    const state = useMessagesStore.getState();
    expect(state.isLoading).toBe(false);
    expect(state.messages).toHaveLength(1);
    expect(mockedAxios.get).toHaveBeenCalled();
  });

  it('should remove notifications by sender', () => {
    const { addMessage, removeNotificationsBySender } = useMessagesStore.getState();
    addMessage(mockMessage, true);
    
    removeNotificationsBySender('user-1');
    
    const state = useMessagesStore.getState();
    expect(state.notificationMessages).toHaveLength(0);
    expect(state.unreadCount).toBe(0);
  });
});
