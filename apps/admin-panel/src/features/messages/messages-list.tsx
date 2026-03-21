import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useMessagesStore } from '../../stores/messages.store';
import { useAuthStore } from '../../stores/auth.store';
import { getSocket } from '../../lib/socket';
import { Search, RefreshCw, MessageSquare, ChevronRight, UserCircle, ShieldCheck, Trash2, Send, Clock, Command } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

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

  const [selectedUserId, setSelectedUserId] = useState<string | null>(userId || null);
  const [userSearch, setUserSearch] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (userId) setSelectedUserId(userId);
  }, [userId]);

  const handleSelectUser = (id: string) => {
    setSelectedUserId(id);
    navigate(`/mensajes/${id}`);
  };

  useEffect(() => {
    fetchAllMessages();
    clearUnread();
  }, [fetchAllMessages, clearUnread]);

  useEffect(() => {
    if (selectedUserId) removeNotificationsBySender(selectedUserId);
  }, [selectedUserId, removeNotificationsBySender]);

  useEffect(() => {
    if (!currentUser?.id) return;
    const socket = getSocket(currentUser.id);
    if (socket) {
      socket.on('admin_new_message', (payload: any) => {
        addMessage(payload);
        if (payload.senderId === selectedUserId) {
          removeNotificationsBySender(payload.senderId);
        }
      });
      return () => { socket.off('admin_new_message'); };
    }
  }, [currentUser?.id, addMessage, selectedUserId, removeNotificationsBySender]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, selectedUserId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUserId || !currentUser?.id) return;

    try {
      await sendMessage(currentUser.id, selectedUserId, newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const allUsersInvolved = useMemo(() => {
    const userMap = new Map<string, any>();
    messages.forEach(msg => {
      if (msg.sender?.id) userMap.set(msg.senderId, msg.sender);
      if (msg.receiver?.id) userMap.set(msg.receiverId, msg.receiver);
    });

    return Array.from(userMap.values())
      .filter(u =>
        u.id !== currentUser?.id &&
        (u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
          u.profile?.displayName?.toLowerCase().includes(userSearch.toLowerCase()))
      )
      .sort((a, b) => (a.profile?.displayName || a.email).localeCompare(b.profile?.displayName || b.email));
  }, [messages, userSearch, currentUser?.id]);

  const activeChatMessages = useMemo(() => {
    if (!selectedUserId) return [];
    return messages
      .filter(m => m.senderId === selectedUserId || m.receiverId === selectedUserId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [messages, selectedUserId]);

  const selectedUser = allUsersInvolved.find(u => u.id === selectedUserId);

  if (isLoading && messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-250px)] text-muted-foreground">
        <div className="relative">
          <RefreshCw className="w-16 h-16 mb-6 animate-spin text-primary opacity-40" />
          <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse" />
        </div>
        <p className="font-black uppercase tracking-[0.3em] text-xs opacity-50">Estableciendo conexión segura...</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-180px)] gap-6 p-1 overflow-hidden font-sans">
      
      {/* DIRECTORY PANEL */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-80 flex flex-col bg-[#05060f]/60 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]"
      >
        {/* Directory Header */}
        <div className="p-8 pb-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <Command className="w-3.5 h-3.5 text-primary" />
                Nodos
              </h3>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black text-primary">{allUsersInvolved.length}</span>
            </div>
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-primary transition-all duration-300" />
            <input
              type="text"
              placeholder="FILTRAR CANAL..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#0a0b1e]/40 border border-white/5 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all placeholder:text-slate-700 text-slate-300 uppercase tracking-wider"
            />
          </div>
        </div>

        {/* Directory List */}
        <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-2 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {allUsersInvolved.map((u, index) => (
              <motion.button
                key={u.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSelectUser(u.id)}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-[1.5rem] text-left transition-all duration-300 group relative",
                  selectedUserId === u.id
                    ? "bg-primary/10 border border-primary/20 shadow-[0_0_40px_-12px_rgba(var(--primary),0.3)]"
                    : "hover:bg-white/[0.03] border border-transparent hover:border-white/5"
                )}
              >
                <div className="relative shrink-0">
                  <Avatar className={cn(
                    "h-12 w-12 border-2 transition-all duration-500", 
                    selectedUserId === u.id ? "border-primary ring-4 ring-primary/10 scale-105" : "border-slate-800"
                  )}>
                    <AvatarImage src={u.profile?.avatarUrl} />
                    <AvatarFallback className={cn("text-xs font-black uppercase", selectedUserId === u.id ? "bg-primary text-primary-foreground" : "bg-slate-900 text-slate-500")}>
                      {(u.profile?.displayName || u.email).substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#05060f] shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p className={cn("text-sm font-black truncate tracking-tight uppercase", selectedUserId === u.id ? "text-primary" : "text-slate-200")}>
                      {u.profile?.displayName || 'Usuario'}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('¿Terminar sesión de chat con este nodo?')) {
                          deleteUserMessages(u.id);
                          if (selectedUserId === u.id) setSelectedUserId(null);
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-600 hover:text-red-500 hover:bg-red-500/10 transition-all transition-opacity duration-300"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[10px] truncate font-bold text-slate-500 tracking-wider font-mono lowercase opacity-60">
                    {u.email}
                  </p>
                </div>

                {selectedUserId === u.id && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute left-0 w-1 h-8 bg-primary rounded-r-full" 
                  />
                )}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* CHAT LOG PANEL */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex-1 flex flex-col bg-[#05060f]/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden relative"
      >
        {!selectedUserId ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 space-y-8">
            <div className="relative">
              <div className="w-32 h-32 bg-primary/5 rounded-full flex items-center justify-center border border-primary/10 animate-pulse">
                <MessageSquare className="w-12 h-12 text-primary opacity-40" />
              </div>
              <div className="absolute inset-0 border-2 border-primary/20 rounded-full animate-[ping_3s_infinite]" />
            </div>
            <div className="max-w-sm space-y-3">
              <h3 className="text-2xl font-black text-slate-200 uppercase tracking-[0.2em]">Centro de Control</h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-loose opacity-60">
                Selecciona una frecuencia en el directorio para iniciar la transmisión de datos sincronizada.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="h-24 border-b border-white/5 bg-background/30 px-10 flex items-center justify-between backdrop-blur-3xl z-20">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-14 w-14 border-2 border-primary/20 ring-8 ring-primary/5">
                    <AvatarImage src={selectedUser?.profile?.avatarUrl} />
                    <AvatarFallback className="bg-primary/20 text-primary text-base font-black">
                      {selectedUser?.email.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-[3px] border-[#0a0b1e]" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-100 uppercase tracking-tighter flex items-center gap-3">
                    {selectedUser?.profile?.displayName || 'Usuario'}
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[9px] font-black tracking-[0.2em] border border-emerald-500/20">LIVE</span>
                  </h2>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-bold text-slate-500 tracking-widest font-mono lowercase">{selectedUser?.email}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                    <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest">Protocolo: E2EE</span>
                  </div>
                </div>
              </div>

              <button
                onClick={fetchAllMessages}
                className="p-4 bg-white/5 hover:bg-primary hover:text-primary-foreground rounded-2xl transition-all duration-500 group border border-white/5 hover:border-primary/50 hover:shadow-[0_0_30px_-5px_rgba(var(--primary),0.4)]"
                title="Sincronizar historial"
              >
                <RefreshCw className={cn("w-5 h-5 group-hover:rotate-180 transition-transform duration-1000", isLoading && "animate-spin")} />
              </button>
            </div>

            {/* Messages Content */}
            <div className="flex-1 relative bg-[#05060f]/20">
              {/* Grid Overlay */}
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
              
              <div
                ref={scrollRef}
                className="absolute inset-0 overflow-y-auto p-10 space-y-10 custom-scrollbar"
              >
                <AnimatePresence>
                  {activeChatMessages.map((msg, idx) => {
                    const isMe = msg.senderId === currentUser?.id;
                    const isThirdParty = !isMe && msg.senderId !== selectedUserId;
                    const prevMsg = activeChatMessages[idx - 1];
                    const showAvatar = !prevMsg || prevMsg.senderId !== msg.senderId;

                    return (
                      <motion.div 
                        key={msg.id}
                        initial={{ opacity: 0, x: isMe ? 20 : -20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        className={cn("flex w-full gap-5 group", isMe ? "justify-end" : "justify-start")}
                      >
                        {!isMe && (
                          <div className="w-10 flex-shrink-0 flex items-start justify-center">
                            {showAvatar ? (
                              <Avatar className="h-10 w-10 ring-2 ring-white/5 shadow-2xl">
                                <AvatarImage src={msg.sender?.profile?.avatarUrl} />
                                <AvatarFallback className={cn("text-[10px] font-black text-white", isThirdParty ? "bg-indigo-600" : "bg-slate-800 text-slate-400")}>
                                  {(msg.sender?.profile?.displayName || msg.sender?.email || '?').substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            ) : null}
                          </div>
                        )}

                        <div className={cn("flex flex-col max-w-[65%]", isMe ? "items-end" : "items-start")}>
                          {showAvatar && !isMe && (
                            <span className="text-[9px] text-slate-500 mb-2 ml-1 font-black uppercase tracking-[0.2em] flex items-center gap-2">
                              {isThirdParty && <ShieldCheck className="w-3 h-3 text-emerald-500" />}
                              {msg.sender?.profile?.displayName || 'Usuario'}
                            </span>
                          )}

                          <div
                            className={cn(
                              "relative px-7 py-4 text-sm leading-relaxed transition-all duration-300",
                              isMe
                                ? "bg-white/[0.03] text-white/90 rounded-[1.5rem] rounded-tr-none border border-white/10 shadow-xl hover:bg-white/[0.05] hover:border-primary/30"
                                : cn("rounded-[1.5rem] rounded-tl-none border shadow-2xl", 
                                     isThirdParty 
                                      ? "bg-indigo-500/20 text-indigo-100 border-indigo-500/30" 
                                      : "bg-[#0a0b1e]/60 border-white/5 hover:border-primary/20")
                            )}
                          >
                            <p className="whitespace-pre-wrap break-words font-medium">{msg.content}</p>
                            
                            {/* Accent Glow for Me */}
                            {isMe && (
                              <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full blur-[2px] opacity-50" />
                            )}
                          </div>
                          
                          <div className={cn(
                            "flex items-center gap-2 mt-2 px-2 opacity-40",
                            isMe ? "flex-row-reverse" : "flex-row"
                          )}>
                            <Clock className="w-2.5 h-2.5" />
                            <span className="text-[9px] font-black tracking-widest font-mono">
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            {/* Input Station */}
            <div className="p-8 bg-[#05060f]/80 border-t border-white/5 backdrop-blur-3xl">
              <form onSubmit={handleSendMessage} className="flex gap-5 items-center max-w-5xl mx-auto w-full">
                <div className="relative flex-1 group">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onFocus={() => selectedUserId && removeNotificationsBySender(selectedUserId)}
                    placeholder={`TRANSMITIR MENSAJE A ${selectedUser?.profile?.displayName || 'COMPRADOR'}...`}
                    className="bg-white/5 border-white/5 text-slate-200 placeholder:text-slate-700 focus:border-primary/40 focus:ring-8 focus:ring-primary/5 rounded-[1.5rem] py-7 pl-8 text-sm font-bold uppercase tracking-wider shadow-inner transition-all hover:bg-white/[0.08]"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/5 opacity-40 group-focus-within:opacity-100 transition-opacity">
                    <span className="text-[9px] font-black text-slate-400">ENTER PARA ENVIAR</span>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="h-14 w-14 rounded-2xl bg-primary hover:bg-primary/80 text-primary-foreground shadow-[0_0_40px_-10px_rgba(var(--primary),0.5)] hover:scale-110 active:scale-95 transition-all flex items-center justify-center p-0 group"
                >
                  <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
              </form>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

// Simplified CN utility for local use
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
