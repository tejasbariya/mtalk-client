import { create } from 'zustand';

export const useNotifications = create(set => ({
    notifications: [],
    unreadCount: 0,
    setNotifications: (notifs) => set({ notifications: notifs }),
    setUnreadCount: (count) => set({ unreadCount: count }),
    getUnreadCount: () => {
        const { notifications } = useNotifications.getState();
        return notifications.filter(n => !n.read).length;
    },
    markAllAsRead: () => set(state => {
        const updated = state.notifications.map(n => ({ ...n, read: true }));
        set({ notifications: updated });
    }),
}));