import { create } from 'zustand';
import api from '../api';

interface AuthState {
  token: string | null;
  user: any | null;
  profile: any | null;
  projects: any[];
  skills: any[];
  themes: any[];
  certificates: any[];
  internships: any[];
  messages: any[];
  notifications: any[];
  analytics: {
    totalViews: number;
    stats: {
      countries: Record<string, number>;
      devices: Record<string, number>;
      projectClicks: Record<string, number>;
    };
    logs: any[];
  };
  loading: boolean;
  error: string;
  success: string;

  // Setters
  setError: (msg: string) => void;
  setSuccess: (msg: string) => void;
  clearNotifications: () => void;

  // Auth Operations
  login: (token: string, user: any) => void;
  logout: () => void;
  setUser: (user: any) => void;

  // Data Fetchers
  fetchEverything: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  fetchProjects: () => Promise<void>;
  fetchSkills: () => Promise<void>;
  fetchThemes: () => Promise<void>;
  fetchAnalytics: () => Promise<void>;
  fetchCertificates: () => Promise<void>;
  fetchInternships: () => Promise<void>;
  fetchMessages: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  addNotification: (notif: any) => void;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

export const useStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem('portfolio_token'),
  user: null,
  profile: null,
  projects: [],
  skills: [],
  themes: [],
  certificates: [],
  internships: [],
  messages: [],
  notifications: [],
  analytics: {
    totalViews: 0,
    stats: { countries: {}, devices: {}, projectClicks: {} },
    logs: [],
  },
  loading: false,
  error: '',
  success: '',

  setError: (msg: string) => {
    set({ error: msg });
    setTimeout(() => set({ error: '' }), 5000);
  },

  setSuccess: (msg: string) => {
    set({ success: msg });
    setTimeout(() => set({ success: '' }), 5000);
  },

  clearNotifications: () => set({ error: '', success: '' }),

  login: (token: string, user: any) => {
    localStorage.setItem('portfolio_token', token);
    set({ token, user, error: '', success: 'Authenticated successfully!' });
  },

  logout: () => {
    localStorage.removeItem('portfolio_token');
    set({
      token: null,
      user: null,
      profile: null,
      projects: [],
      skills: [],
      themes: [],
      certificates: [],
      internships: [],
      messages: [],
      notifications: [],
      analytics: {
        totalViews: 0,
        stats: { countries: {}, devices: {}, projectClicks: {} },
        logs: [],
      },
      success: 'Logged out successfully.',
    });
  },

  setUser: (user: any) => set({ user }),

  fetchProfile: async () => {
    try {
      const res = await api.get('/auth/me');
      const user = res.data.data.user;
      set({ user, profile: user.profile });
    } catch (err: any) {
      console.error('fetchProfile error', err);
      if (err.response?.status === 401) {
        get().logout();
      }
    }
  },

  fetchProjects: async () => {
    try {
      const res = await api.get('/projects');
      set({ projects: res.data.data.projects });
    } catch (err) {
      console.error('fetchProjects error', err);
    }
  },

  fetchSkills: async () => {
    try {
      const res = await api.get('/skills');
      set({ skills: res.data.data.skills });
    } catch (err) {
      console.error('fetchSkills error', err);
    }
  },

  fetchThemes: async () => {
    try {
      const res = await api.get('/themes');
      set({ themes: res.data.data.themes });
    } catch (err) {
      console.error('fetchThemes error', err);
    }
  },

  fetchAnalytics: async () => {
    try {
      const res = await api.get('/analytics/my-stats');
      set({ analytics: res.data.data });
    } catch (err) {
      console.error('fetchAnalytics error', err);
    }
  },

  fetchCertificates: async () => {
    try {
      const res = await api.get('/certificates');
      set({ certificates: res.data.data });
    } catch (err) {
      console.error('fetchCertificates error', err);
    }
  },

  fetchInternships: async () => {
    try {
      const res = await api.get('/internships');
      set({ internships: res.data.data });
    } catch (err) {
      console.error('fetchInternships error', err);
    }
  },

  fetchMessages: async () => {
    try {
      const res = await api.get('/messages');
      set({ messages: res.data.data });
    } catch (err) {
      console.error('fetchMessages error', err);
    }
  },

  fetchNotifications: async () => {
    try {
      const res = await api.get('/notifications');
      set({ notifications: res.data.data });
    } catch (err) {
      console.error('fetchNotifications error', err);
    }
  },

  addNotification: (notif: any) => {
    set((state) => {
      // Avoid duplicate live notifications by ID
      const exists = state.notifications.some((n) => n.id === notif.id);
      if (exists) return {};
      return { notifications: [notif, ...state.notifications] };
    });
  },

  markNotificationRead: async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
      }));
    } catch (err) {
      console.error('markNotificationRead error', err);
    }
  },

  markAllNotificationsRead: async () => {
    try {
      await api.patch('/notifications/mark-all');
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      }));
    } catch (err) {
      console.error('markAllNotificationsRead error', err);
    }
  },

  deleteNotification: async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`);
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    } catch (err) {
      console.error('deleteNotification error', err);
    }
  },

  fetchEverything: async () => {
    if (!get().token) return;
    set({ loading: true });
    try {
      await Promise.all([
        get().fetchProfile(),
        get().fetchProjects(),
        get().fetchSkills(),
        get().fetchThemes(),
        get().fetchAnalytics(),
        get().fetchCertificates(),
        get().fetchInternships(),
        get().fetchMessages(),
        get().fetchNotifications(),
      ]);
    } catch (err: any) {
      get().setError(err.response?.data?.message || 'Synchronization failed.');
    } finally {
      set({ loading: false });
    }
  },
}));
