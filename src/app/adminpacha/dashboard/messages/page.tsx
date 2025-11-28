"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { format } from 'date-fns';
import { Mail, CheckCircle, Clock, AlertCircle, Trash2, Search, Inbox, Archive } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Checkbox } from "@/components/ui/checkbox";

interface ContactMessage {
  id: string;
  user_name: string;
  user_email: string;
  message_content: string;
  client_ip: string;
  created_at: string;
  status: 'unread' | 'read';
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const supabase = createClient();

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_contact_messages');

      if (error) {
        console.error("RPC failed, trying direct select...", error);
        const { data: directData, error: directError } = await supabase
          .from('contact_messages')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (directError) throw directError;
        setMessages(directData || []);
      } else {
        setMessages(data || []);
      }
    } catch (err: unknown) {
      console.error('Error fetching messages:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load messages';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase.rpc('mark_message_read', { p_id: id });

      if (error) {
        const { error: updateError } = await supabase
          .from('contact_messages')
          .update({ status: 'read' })
          .eq('id', id);
        if (updateError) throw updateError;
      }

      // Update local state
      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, status: 'read' } : msg
      ));
    } catch (err) {
      console.error('Error updating message:', err);
      alert('Failed to mark message as read');
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      const { error } = await supabase.rpc('delete_contact_message', { p_id: id });

      if (error) {
        const { error: deleteError } = await supabase
          .from('contact_messages')
          .delete()
          .eq('id', id);
        if (deleteError) throw deleteError;
      }

      setMessages(messages.filter(msg => msg.id !== id));
      setSelectedIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } catch (err) {
      console.error('Error deleting message:', err);
      alert('Failed to delete message');
    }
  };

  const deleteSelectedMessages = async () => {
    if (selectedIds.size === 0) return;
    
    try {
      const idsToDelete = Array.from(selectedIds);
      const { error } = await supabase.rpc('delete_contact_messages_bulk', { p_ids: idsToDelete });

      if (error) {
        console.error("Bulk delete RPC failed, trying loop...", error);
        // Fallback loop
        for (const id of idsToDelete) {
           await supabase.from('contact_messages').delete().eq('id', id);
        }
      }

      setMessages(messages.filter(msg => !selectedIds.has(msg.id)));
      setSelectedIds(new Set());
    } catch (err) {
      console.error('Error deleting messages:', err);
      alert('Failed to delete selected messages');
    }
  };

  const toggleSelectAll = (items: ContactMessage[]) => {
    if (selectedIds.size === items.length && items.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map(msg => msg.id)));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = 
      msg.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.user_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.message_content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const unreadMessages = filteredMessages.filter(msg => msg.status === 'unread');
  const readMessages = filteredMessages.filter(msg => msg.status === 'read');

  const MessageList = ({ items, showMarkRead }: { items: ContactMessage[], showMarkRead: boolean }) => {
    if (items.length === 0) {
      return (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Inbox className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No messages found</h3>
          <p className="text-muted-foreground">Try adjusting your search or check other tabs.</p>
        </div>
      );
    }

    const allSelected = items.length > 0 && items.every(msg => selectedIds.has(msg.id));

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-card border border-border p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <Checkbox 
              checked={allSelected}
              onCheckedChange={() => toggleSelectAll(items)}
            />
            <span className="text-sm text-muted-foreground">
              {selectedIds.size} selected
            </span>
          </div>
          {selectedIds.size > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete Selected ({selectedIds.size})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete {selectedIds.size} Messages?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the selected messages.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={deleteSelectedMessages} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        <div className="grid gap-6">
          {items.map((msg) => (
            <div 
              key={msg.id} 
              className={`bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-all ${selectedIds.has(msg.id) ? 'border-primary ring-1 ring-primary bg-primary/5' : 'border-border'}`}
            >
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                <div className="flex items-start gap-4">
                  <Checkbox 
                    checked={selectedIds.has(msg.id)}
                    onCheckedChange={() => toggleSelect(msg.id)}
                    className="mt-1"
                  />
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-xl font-bold text-secondary-foreground shrink-0">
                    {msg.user_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{msg.user_name}</h3>
                    <a href={`mailto:${msg.user_email}`} className="text-primary hover:underline text-sm">
                      {msg.user_email}
                    </a>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span className="bg-secondary/10 px-2 py-0.5 rounded">IP: {msg.client_ip}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {format(new Date(msg.created_at), 'PPpp')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-start md:self-center">
                  {showMarkRead && (
                    <Button
                      onClick={() => markAsRead(msg.id)}
                      variant="default"
                      size="sm"
                      className="gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark Read
                    </Button>
                  )}
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Message?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the message from {msg.user_name}.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteMessage(msg.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              
              <div className="bg-secondary/5 p-4 rounded-lg border border-border/50 ml-8 md:ml-16">
                <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                  {msg.message_content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Inbox</h1>
            <p className="text-muted-foreground">
              Manage your contact messages
            </p>
          </div>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search messages..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <Tabs defaultValue="unread" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="unread" className="gap-2">
            <Inbox className="w-4 h-4" />
            Unread ({unreadMessages.length})
          </TabsTrigger>
          <TabsTrigger value="read" className="gap-2">
            <Archive className="w-4 h-4" />
            Read ({readMessages.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="unread">
          <MessageList items={unreadMessages} showMarkRead={true} />
        </TabsContent>
        
        <TabsContent value="read">
          <MessageList items={readMessages} showMarkRead={false} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
