"use client";

import { useEffect, useState } from "react";
import { Bell, CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import PageHeader from "@/components/page-header";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  dismissNotification,
} from "@/services/dashboard-service";
import { useAuthStore } from "@/stores/auth-store";

type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "success" | "warning" | "info";
  read: boolean;
};

const typeStyles = {
  success: "bg-green-500/10 text-green-400 border-green-500/20",
  warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  info: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
};

const typeIcons = {
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    async function load() {
      try {
        const data = await getNotifications();
        setNotifications(data);
      } catch (err) {
        console.error("Failed to load notifications:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleMarkRead = async (id: string) => {
    await markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleMarkAllRead = async () => {
    if (!user) return;
    await markAllNotificationsRead(user.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDismiss = async (id: string) => {
    await dismissNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle="System alerts, AI recommendations, and farm updates."
      />

      <div className="mt-10">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-slate-400">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
              : "All notifications read"}
          </p>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className="space-y-4">
          {notifications.map((notification) => {
            const Icon = typeIcons[notification.type];

            return (
              <div
                key={notification.id}
                className={`relative rounded-3xl border p-6 transition ${
                  notification.read
                    ? "border-white/5 bg-slate-900/30"
                    : "border-white/10 bg-slate-900/60"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${typeStyles[notification.type]}`}
                  >
                    <Icon size={22} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3
                          className={`text-lg font-semibold ${
                            notification.read
                              ? "text-slate-300"
                              : "text-white"
                          }`}
                        >
                          {notification.title}
                        </h3>

                        <p className="mt-2 leading-7 text-slate-400">
                          {notification.message}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-sm text-slate-500">
                          {notification.time}
                        </span>

                        {!notification.read && (
                          <button
                            onClick={() =>
                              handleMarkRead(notification.id)
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 transition hover:bg-white/10"
                            aria-label="Mark as read"
                          >
                            <CheckCircle2
                              size={16}
                              className="text-slate-400"
                            />
                          </button>
                        )}

                        <button
                          onClick={() =>
                            handleDismiss(notification.id)
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 transition hover:bg-white/10"
                          aria-label="Dismiss notification"
                        >
                          <X
                            size={16}
                            className="text-slate-400"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {!loading && notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <Bell
              size={48}
              className="text-slate-600"
            />
            <h3 className="mt-6 text-xl font-semibold text-slate-300">
              No notifications
            </h3>
            <p className="mt-2 text-slate-500">
              You&apos;re all caught up.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
