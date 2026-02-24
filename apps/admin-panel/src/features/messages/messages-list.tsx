import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useMessagesStore } from '../../stores/messages.store';
import { useAuthStore } from '../../stores/auth.store';
import { getSocket } from '../../lib/socket';
import { Search, RefreshCw, MessageSquare, ChevronRight, UserCircle, ShieldCheck, Trash2, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { useParams, useNavigate } from 'react-router-dom';

export const MessagesList: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const navigate = useNavigate();
  const {
    messages,
    fetchAllMessages,
    addMessage,
    sendMessage,
    deleteUserMessages,
    clearUnread,
    removeNotificationsBySender,
    isLoading
  } = useMessagesStore();
  const { user: currentUser } = useAuthStore();

  // State for selections - Initialized from URL param if exists
  const [selectedUserId, setSelectedUserId] = useState<string | null>(userId || null);
  const [userSearch, setUserSearch] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const scrollRef = useRef<HTMLDivElement>(null);

  // Sync state if URL param changes
  useEffect(() => {
    if (userId) {
      setSelectedUserId(userId);
    }
  }, [userId]);

  // Update URL when selection changes
  const handleSelectUser = (id: string) => {
    setSelectedUserId(id);
    navigate(`/mensajes/${id}`);
  };

  // Initial Fetch
  useEffect(() => {
    fetchAllMessages();
    clearUnread();
  }, [fetchAllMessages, clearUnread]);

  // Clear notifications for selected user
  useEffect(() => {
    if (selectedUserId) {
      removeNotificationsBySender(selectedUserId);
    }
  }, [selectedUserId, removeNotificationsBySender]);

  // Real-time Socket Connection
  useEffect(() => {
    if (!currentUser?.id) return;
    const socket = getSocket(currentUser.id);
    if (socket) {
      socket.on('admin_new_message', (payload: any) => {
        addMessage(payload);

        // Si el mensaje es del usuario que estamos viendo actualmente,
        // lo quitamos de la lista de notificaciones automáticamente
        if (payload.senderId === selectedUserId) {
          removeNotificationsBySender(payload.senderId);
        }
      });
      return () => { socket.off('admin_new_message'); };
    }
  }, [currentUser?.id, addMessage, selectedUserId, removeNotificationsBySender]);

  // Auto-scroll chat log
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, selectedUserId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUserId || !currentUser?.id) return;

    try {
      // Send message to the selected CLIENT (selectedUserId) as the current ADMIN
      await sendMessage(currentUser.id, selectedUserId, newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // 1. Unique users list
  const allUsersInvolved = useMemo(() => {
    const userMap = new Map<string, any>();
    messages.forEach(msg => {
      // Only add users if they have a valid profile/email structure to avoid crashes
      if (msg.sender?.id) userMap.set(msg.senderId, msg.sender);
      if (msg.receiver?.id) userMap.set(msg.receiverId, msg.receiver);
    });

    return Array.from(userMap.values())
      .filter(u =>
        u.id !== currentUser?.id && // Exclude myself (Admin) from the directory
        (u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
          u.profile?.displayName?.toLowerCase().includes(userSearch.toLowerCase()))
      )
      .sort((a, b) => (a.profile?.displayName || a.email).localeCompare(b.profile?.displayName || b.email));
  }, [messages, userSearch, currentUser?.id]);

  // 2. Chat Timeline for selected user (ALL history involving them)
  const activeChatMessages = useMemo(() => {
    if (!selectedUserId) return [];

    // Get ALL messages where selectedUser is involved (Sender or Receiver)
    return messages
      .filter(m => m.senderId === selectedUserId || m.receiverId === selectedUserId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [messages, selectedUserId]);

  const selectedUser = allUsersInvolved.find(u => u.id === selectedUserId);

  if (isLoading && messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-muted-foreground animate-pulse">
        <RefreshCw className="w-12 h-12 mb-4 animate-spin text-primary opacity-20" />
        <p className="font-medium">Sincronizando red de mensajes...</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(90vh-100px)] gap-6 overflow-hidden">

      {/* Panel 1: Directorio de Usuarios */}
      <div className="w-80 flex flex-col gap-4 bg-card backdrop-blur-2xl border border-white/5 rounded-[2.5rem] overflow-hidden animate-in fade-in slide-in-from-left-5 duration-500 shadow-2xl">
        <div className="p-6 border-b border-slate-800 bg-background/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-base tracking-tight text-slate-200 flex items-center gap-2">
              <UserCircle className="w-5 h-5 text-indigo-500" />
              Directorio
            </h3>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2.5 py-0.5 rounded-full font-bold border border-indigo-500/20">
              {allUsersInvolved.length}
            </span>
          </div>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-500 transition-colors bg-transparent" />
            <input
              type="text"
              placeholder="Buscar chat..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 h-10 bg-card border border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600 text-slate-300"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
          {allUsersInvolved.map(u => (
            <button
              key={u.id}
              onClick={() => handleSelectUser(u.id)}
              className={cn(
                "w-full flex items-center gap-3 p-3.5 rounded-2xl text-left transition-all group border relative overflow-hidden",
                selectedUserId === u.id
                  ? "bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-900/20"
                  : "bg-transparent border-transparent hover:bg-slate-800/50 hover:border-slate-700"
              )}
            >
              <Avatar className={cn("h-11 w-11 border-2 transition-colors shrink-0", selectedUserId === u.id ? "border-white/20" : "border-slate-700")}>
                <AvatarImage src={u.profile?.avatarUrl} />
                <AvatarFallback className={cn("text-xs font-bold", selectedUserId === u.id ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400")}>
                  {(u.profile?.displayName || u.email).substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 z-10">
                <div className="flex items-center justify-between mb-0.5">
                  <p className={cn("text-sm font-bold truncate", selectedUserId === u.id ? "text-white" : "text-slate-200")}>
                    {u.profile?.displayName || 'Usuario'}
                  </p>

                  {/* Delete / Hide Action */}
                  <div className="flex items-center gap-1">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        // eslint-disable-next-line no-restricted-globals
                        if (confirm('¿Ocultar este chat del directorio?')) {
                          deleteUserMessages(u.id);
                          if (selectedUserId === u.id) {
                            setSelectedUserId(null);
                          }
                        }
                      }}
                      className={cn(
                        "p-1.5 rounded-lg transition-all cursor-pointer opacity-0 group-hover:opacity-100",
                        selectedUserId === u.id ? "text-indigo-200 hover:bg-white/20 hover:text-white" : "text-slate-500 hover:bg-slate-700 hover:text-red-400"
                      )}
                      title="Ocultar chat"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </div>
                    {selectedUserId === u.id && <ChevronRight className="w-4 h-4 text-white/50" />}
                  </div>
                </div>
                <p className={cn("text-[11px] truncate font-medium", selectedUserId === u.id ? "text-indigo-200" : "text-slate-500")}>{u.email}</p>
              </div>

              {/* Active Indicator Background */}
              {selectedUserId === u.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Panel 2: Chat Log (Expanded) */}
      <div className="flex-1 flex flex-col rounded-[2.5rem] bg-card border border-slate-800 shadow-2xl overflow-hidden relative">
        {!selectedUserId ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-card/50 space-y-6">
            <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center animate-pulse">
              <MessageSquare className="w-10 h-10 text-slate-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-300">Selecciona un Chat</h3>
              <p className="text-sm text-slate-500 max-w-[280px] mx-auto">
                Elige un usuario del directorio para ver <span className="text-indigo-400">todo el historial</span> de mensajes y responder.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="h-[88px] border-b border bg-background/50 px-8 flex items-center justify-between shadow-sm z-10 backdrop-blur-md">
              <div className="flex items-center gap-5">
                <Avatar className="h-12 w-12 border-2 border-indigo-500/20 ring-4 ring-indigo-500/10">
                  <AvatarImage src={selectedUser?.profile?.avatarUrl} />
                  <AvatarFallback className="bg-indigo-600 text-white text-sm font-bold">{selectedUser?.email.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-3 text-slate-200 tracking-tight">
                    {selectedUser?.profile?.displayName || 'Usuario'}
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" title="En línea" />
                  </h2>
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-2">
                    <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-400 border border-slate-700">{selectedUser?.email}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={fetchAllMessages}
                className="p-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-white group border border-transparent hover:border-slate-700"
                title="Actualizar historial"
              >
                <RefreshCw className={cn("w-5 h-5 group-hover:rotate-180 transition-transform duration-700", isLoading && "animate-spin")} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 bg-card/30 relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

              <div
                ref={scrollRef}
                className="absolute inset-0 overflow-y-auto p-8 space-y-8 custom-scrollbar"
              >
                {activeChatMessages.map((msg, idx) => {
                  const isMe = msg.senderId === currentUser?.id;
                  const isThirdParty = !isMe && msg.senderId !== selectedUserId;
                  const prevMsg = activeChatMessages[idx - 1];
                  const showAvatar = !prevMsg || prevMsg.senderId !== msg.senderId;

                  return (
                    <div key={msg.id} className={cn("flex w-full gap-4 group", isMe ? "justify-end" : "justify-start")}>

                      {/* Avatar Left (for others) */}
                      {!isMe && showAvatar ? (
                        <Avatar className="h-9 w-9 mt-1 ring-2 ring-slate-800 shrink-0 shadow-lg">
                          <AvatarImage src={msg.sender?.profile?.avatarUrl} />
                          <AvatarFallback className={cn("text-[10px] font-bold text-white", isThirdParty ? "bg-emerald-600" : "bg-indigo-500")}>
                            {(msg.sender?.profile?.displayName || msg.sender?.email || '?').substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      ) : !isMe ? <div className="w-9 shrink-0" /> : null}

                      <div className={cn("flex flex-col max-w-[70%]", isMe ? "items-end" : "items-start")}>
                        {showAvatar && !isMe && (
                          <span className="text-[10px] text-slate-500 mb-1.5 ml-1 px-1 font-bold uppercase tracking-wider flex items-center gap-1">
                            {isThirdParty && <ShieldCheck className="w-3 h-3 text-emerald-500" />}
                            {msg.sender?.profile?.displayName || 'Usuario'}
                          </span>
                        )}

                        <div
                          className={cn(
                            "relative px-6 py-3.5 text-sm shadow-md transition-all",
                            isMe
                              ? "bg-background text-white/80 rounded-2xl rounded-tr-sm shadow-background/10 hover:shadow-background/20"
                              : cn("rounded-2xl rounded-tl-sm border shadow-xl", isThirdParty ? "bg-primary/80 border-primary/50" : "bg-card border-slate-700/50")
                          )}
                        >
                          <p className="whitespace-pre-wrap break-words leading-relaxed font-medium">{msg.content}</p>
                        </div>
                        <span className={cn(
                          "text-[10px] block mt-1.5 font-bold opacity-40 px-1",
                          isMe ? "text-right text-white" : "text-left text-slate-400"
                        )}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-5 bg-background border-t border-slate-800/50 backdrop-blur-xl">
              <form onSubmit={handleSendMessage} className="flex gap-4 items-end max-w-5xl mx-auto w-full">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Escribir mensaje a ${selectedUser?.profile?.displayName || 'cliente'}...`}
                  className="bg-card/50 border-slate-700/50 text-slate-200 placeholder:text-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl py-6 pl-6 text-base shadow-inner transition-all hover:bg-card/80"
                />
                <Button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="h-[52px] w-[52px] rounded-2xl bg-primary hover:bg-primary/80 text-primary-foreground shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center p-0"
                >
                  <Send className="w-5 h-5 ml-0.5" />
                </Button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Utility function
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
