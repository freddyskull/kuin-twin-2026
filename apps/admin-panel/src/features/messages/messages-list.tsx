import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useMessagesStore } from '../../stores/messages.store';
import { useAuthStore } from '../../stores/auth.store';
import { getSocket } from '../../lib/socket';
import { Search, RefreshCw, MessageSquare, ChevronRight, UserCircle, ShieldCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';

import { Send } from 'lucide-react';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';

export const MessagesList: React.FC = () => {
  const { messages, fetchAllMessages, addMessage, sendMessage, isLoading } = useMessagesStore();
  const { user: currentUser } = useAuthStore();

  // State for selections
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedOtherId, setSelectedOtherId] = useState<string | null>(null);
  const [userSearch, setUserSearch] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const scrollRef = useRef<HTMLDivElement>(null);

  // Initial Fetch
  useEffect(() => {
    fetchAllMessages();
  }, [fetchAllMessages]);

  // Real-time Socket Connection
  useEffect(() => {
    if (!currentUser?.id) return;
    const socket = getSocket(currentUser.id);
    if (socket) {
      socket.on('admin_new_message', (payload: any) => {
        addMessage(payload);
      });
      return () => { socket.off('admin_new_message'); };
    }
  }, [currentUser?.id, addMessage]);

  // Auto-scroll chat log
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, selectedUserId, selectedOtherId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUserId || !currentUser?.id) return;

    try {
      // Send message to the selected CLIENT (selectedUserId) as the current ADMIN
      await sendMessage(currentUser.id, selectedUserId, newMessage);
      setNewMessage('');

      // Switch view to the conversation between Admin and Client to show the new message
      setSelectedOtherId(currentUser.id);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // 1. Unique users list
  const allUsersInvolved = useMemo(() => {
    const userMap = new Map<string, any>();
    messages.forEach(msg => {
      if (msg.sender) userMap.set(msg.senderId, msg.sender);
      if (msg.receiver) userMap.set(msg.receiverId, msg.receiver);
    });

    return Array.from(userMap.values())
      .filter(u =>
        u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.profile?.displayName?.toLowerCase().includes(userSearch.toLowerCase())
      )
      .sort((a, b) => (a.profile?.displayName || a.email).localeCompare(b.profile?.displayName || b.email));
  }, [messages, userSearch]);

  // 2. Conversations for selected user
  const userConversations = useMemo(() => {
    if (!selectedUserId) return [];

    const convMap = new Map<string, any>();
    const userMsgs = messages.filter(m => m.senderId === selectedUserId || m.receiverId === selectedUserId);

    userMsgs.forEach(msg => {
      const otherId = msg.senderId === selectedUserId ? msg.receiverId : msg.senderId;
      const otherUser = msg.senderId === selectedUserId ? msg.receiver : msg.sender;

      if (!convMap.has(otherId)) {
        convMap.set(otherId, {
          user: otherUser,
          lastMessage: msg,
          count: 1
        });
      } else {
        const existing = convMap.get(otherId);
        existing.count += 1;
        if (new Date(msg.createdAt) > new Date(existing.lastMessage.createdAt)) {
          existing.lastMessage = msg;
        }
      }
    });

    return Array.from(convMap.values()).sort((a, b) =>
      new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
    );
  }, [messages, selectedUserId]);

  // 3. Messages for selected chat
  const chatMessages = useMemo(() => {
    if (!selectedUserId || !selectedOtherId) return [];
    return messages.filter(m =>
      (m.senderId === selectedUserId && m.receiverId === selectedOtherId) ||
      (m.senderId === selectedOtherId && m.receiverId === selectedUserId)
    ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [messages, selectedUserId, selectedOtherId]);

  const selectedUser = allUsersInvolved.find(u => u.id === selectedUserId);
  const selectedOther = userConversations.find(c => c.user.id === selectedOtherId)?.user;

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
      <div className="w-80 flex flex-col gap-4  bg-accent backdrop-blur-2xl border border-white/5 rounded-[2.5rem] overflow-hidden animate-in fade-in slide-in-from-left-5 duration-500">
        <div className="p-6 border-b border-slate-800 bg-[#1e293b]/50">
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 h-10 bg-[#020617] border border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600 text-slate-300"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
          {allUsersInvolved.map(u => (
            <button
              key={u.id}
              onClick={() => { setSelectedUserId(u.id); setSelectedOtherId(null); }}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all group border",
                selectedUserId === u.id
                  ? "bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-900/20"
                  : "bg-transparent border-transparent hover:bg-slate-800/50 hover:border-slate-700"
              )}
            >
              <Avatar className={cn("h-10 w-10 border-2 transition-colors", selectedUserId === u.id ? "border-white/20" : "border-slate-700")}>
                <AvatarFallback className={cn("text-xs font-bold", selectedUserId === u.id ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400")}>
                  {(u.profile?.displayName || u.email).substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className={cn("text-sm font-semibold truncate", selectedUserId === u.id ? "text-white" : "text-slate-300")}>
                    {u.profile?.displayName || 'Usuario'}
                  </p>
                  {selectedUserId === u.id && <ChevronRight className="w-4 h-4 text-white/50" />}
                </div>
                <p className={cn("text-[11px] truncate", selectedUserId === u.id ? "text-indigo-200" : "text-slate-500")}>{u.email}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Panel 2: Conversaciones */}
      <div className={cn(
        "w-80 flex flex-col gap-4 rounded-3xl bg-[#0f172a] border border-slate-800 shadow-2xl overflow-hidden transition-all duration-500",
        !selectedUserId ? "opacity-30 grayscale pointer-events-none" : "opacity-100"
      )}>
        <div className="p-6 border-b border-slate-800 bg-[#1e293b]/50 h-[88px] flex flex-col justify-center">
          <h3 className="font-bold text-base tracking-tight text-slate-200 flex items-center gap-2 mb-1">
            <MessageSquare className="w-5 h-5 text-emerald-500" />
            Conversaciones
          </h3>
          <p className="text-xs text-slate-500">
            {selectedUserId
              ? `Chats de ${selectedUser?.profile?.displayName?.split(' ')[0] || 'Cliente'}`
              : 'Selecciona un cliente'}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
          {userConversations.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-sm bg-slate-800/20 rounded-2xl m-3 border border-dashed border-slate-800">
              Sin actividad reciente.
            </div>
          ) : (
            userConversations.map(conv => (
              <button
                key={conv.user.id}
                onClick={() => setSelectedOtherId(conv.user.id)}
                className={cn(
                  "w-full flex flex-col p-4 rounded-2xl text-left border transition-all relative overflow-hidden group",
                  selectedOtherId === conv.user.id
                    ? "bg-slate-800 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/20"
                    : "bg-[#020617] hover:bg-slate-800 border-slate-800"
                )}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-8 w-8 ring-2 ring-[#0f172a]">
                    <AvatarFallback className="text-[10px] bg-slate-700 text-slate-300 font-bold">
                      {conv.user.email.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate text-slate-200">{conv.user.profile?.displayName || conv.user.email}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="pl-11 relative">
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-medium">
                    {conv.lastMessage.content}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Panel 3: Chat Log */}
      <div className="flex-1 flex flex-col rounded-3xl bg-[#0f172a] border border-slate-800 shadow-2xl overflow-hidden relative">
        {!selectedOtherId ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-[#020617]/50 space-y-6">
            <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center animate-pulse">
              <ShieldCheck className="w-12 h-12 text-slate-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-300">Panel de Auditoría</h3>
              <p className="text-sm text-slate-500 max-w-[280px] mx-auto">
                Selecciona una conversación para visualizar el intercambio y <span className="text-emerald-400">responder en tiempo real</span>.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="h-[88px] border-b border-slate-800 bg-[#1e293b]/50 px-8 flex items-center justify-between shadow-sm z-10">
              <div className="flex items-center gap-5">
                <div className="flex items-center -space-x-4">
                  <Avatar className="h-10 w-10 border-2 border-[#0f172a] ring-2 ring-slate-700">
                    <AvatarImage src={selectedUser?.profile?.avatarUrl} />
                    <AvatarFallback className="bg-indigo-500 text-white text-xs font-bold">{selectedUser?.email.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <Avatar className="h-10 w-10 border-2 border-[#0f172a] ring-2 ring-slate-700">
                    <AvatarImage src={selectedOther?.profile?.avatarUrl} />
                    <AvatarFallback className="bg-emerald-500 text-white text-xs font-bold">{selectedOther?.email.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <h2 className="text-lg font-bold flex items-center gap-3 text-slate-200">
                    Auditoría & Respuesta
                    <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" title="Conexión en vivo" />
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    {selectedUser?.profile?.displayName} <span className="text-slate-600 mx-1">↔</span> {selectedOther?.profile?.displayName}
                  </p>
                </div>
              </div>

              <button
                onClick={fetchAllMessages}
                className="p-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-white group"
                title="Forzar actualización"
              >
                <RefreshCw className={cn("w-5 h-5 group-hover:rotate-180 transition-transform duration-500", isLoading && "animate-spin")} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 bg-[#020617] relative">
              <div
                ref={scrollRef}
                className="absolute inset-0 overflow-y-auto p-8 space-y-6 custom-scrollbar"
              >
                {chatMessages.map((msg, idx) => {
                  const isMainUser = msg.senderId === selectedUserId;
                  const prevMsg = chatMessages[idx - 1];
                  const showAvatar = !prevMsg || prevMsg.senderId !== msg.senderId;
                  const isAdminMessage = msg.senderId === currentUser?.id;

                  return (
                    <div key={msg.id} className={cn("flex w-full gap-4", isMainUser ? "justify-start" : "justify-end")}>
                      {isMainUser && showAvatar ? (
                        <Avatar className="h-8 w-8 mt-1 ring-2 ring-slate-800 shrink-0">
                          <AvatarFallback className="bg-indigo-500 text-white text-[10px] font-bold">{selectedUser?.email.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      ) : isMainUser ? <div className="w-8 shrink-0" /> : null}

                      <div className={cn("flex flex-col max-w-[65%]", isMainUser ? "items-start" : "items-end")}>
                        {showAvatar && (
                          <span className="text-[10px] text-slate-500 mb-1.5 ml-1 px-1 font-bold uppercase tracking-wider">
                            {isAdminMessage ? 'Soporte (Tú)' : (isMainUser ? selectedUser?.profile?.displayName : selectedOther?.profile?.displayName)}
                          </span>
                        )}
                        <div
                          className={cn(
                            "relative px-5 py-3 text-sm shadow-md transition-all",
                            isMainUser
                              ? "bg-[#1e293b] text-slate-200 rounded-r-3xl rounded-bl-3xl rounded-tl-sm border border-slate-700/50"
                              : "bg-indigo-600 text-white rounded-l-3xl rounded-br-3xl rounded-tr-sm border border-indigo-500 shadow-indigo-900/20"
                          )}
                        >
                          <p className="whitespace-pre-wrap break-words leading-relaxed font-medium">{msg.content}</p>
                          <span className={cn(
                            "text-[10px] block text-right mt-1.5 font-bold opacity-60",
                            isMainUser ? "text-slate-500" : "text-indigo-200"
                          )}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>

                      {!isMainUser && showAvatar ? (
                        <Avatar className="h-8 w-8 mt-1 ring-2 ring-slate-800 shrink-0">
                          <AvatarFallback className="bg-emerald-500 text-white text-[10px] font-bold">{selectedOther?.email.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      ) : !isMainUser ? <div className="w-8 shrink-0" /> : null}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#1e293b]/50 border-t border-slate-800">
              <form onSubmit={handleSendMessage} className="flex gap-3 items-end">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Responder a ${selectedUser?.profile?.displayName || 'cliente'}...`}
                  className="bg-[#020617] border-slate-700 text-slate-200 placeholder:text-slate-600 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-xl py-6"
                />
                <Button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="h-[52px] px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20 transition-all font-bold"
                >
                  <Send className="w-5 h-5" />
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
