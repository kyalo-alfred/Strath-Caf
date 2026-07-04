import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Notification } from '../../types';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Bell, Trash2, CheckCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const data = await api.getNotifications();
        setNotifications(data);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifs();
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(current => 
      current.map(n => n.id === id ? { ...n, is_read: true } : n)
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(current => current.filter(n => n.id !== id));
  };

  const markAllRead = () => {
    setNotifications(current => current.map(n => ({ ...n, is_read: true })));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Notifications</h1>
        {notifications.some(n => !n.is_read) && (
          <Button variant="ghost" size="sm" onClick={markAllRead}>
            <CheckCircle className="w-4 h-4 mr-2" /> Mark all as read
          </Button>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
           {[1,2,3].map(i => <div key={i} className="h-20 bg-muted animate-pulse rounded-xl"></div>)}
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
          <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">You have no notifications.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map(notif => (
            <Card key={notif.id} className={cn("transition-colors overflow-hidden", !notif.is_read ? "bg-primary/5 border-primary/20" : "")}>
              <CardContent className="p-4 flex gap-4">
                <div className="shrink-0 mt-1">
                  <div className={cn("w-2 h-2 rounded-full", !notif.is_read ? "bg-primary" : "bg-transparent")}></div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{notif.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
                  <p className="text-xs text-muted-foreground/60 mt-2">
                    {new Date(notif.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  {!notif.is_read && (
                    <Button variant="ghost" size="icon" onClick={() => markAsRead(notif.id)} title="Mark as read">
                      <CheckCircle className="w-4 h-4 text-primary" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => deleteNotification(notif.id)} title="Delete" className="text-muted-foreground hover:text-danger">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
